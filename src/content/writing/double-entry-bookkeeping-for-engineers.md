---
title: "Double-entry bookkeeping explained for engineers"
summary: "Accountants solved the data integrity problem four centuries ago. Their solution maps directly to a pattern you should be using in financial software."
published: "2026-02-03"
tags: ["Fintech", "Data Modeling", "SQL", "System Design"]
---

When I was building the financial tracking layer for a SaaS product, I made the mistake most engineers make: I designed a transactions table with a `amount` column and a `type` column set to `credit` or `debit`. It felt clean. It was wrong in ways that only became obvious months later, when reconciliation started producing numbers that did not add up and I could not explain why.

The problem is not a bug in the code. It is a fundamental mismatch between the data model and the nature of money. Accountants understood this in the fifteenth century. The solution is double-entry bookkeeping, and it translates directly into a data model that makes financial integrity enforceable at the schema level.

## The accounting equation

Everything in accounting rests on one equation:

```
Assets = Liabilities + Equity
```

This is not a definition — it is a constraint. At every point in time, for every business, this equation must hold. The genius of double-entry bookkeeping is that it makes violating this constraint structurally impossible.

The mechanism: every financial transaction is recorded as two entries. One entry increases an account; one entry decreases another account. The amounts are always equal. The equation stays balanced not because someone checks it, but because the recording mechanism does not allow it to become unbalanced.

## Debits and credits are directions, not values

The terminology trips up most engineers because the words carry their everyday meaning into a domain where they mean something different.

In accounting, **debit** means left side of the ledger. **Credit** means right side of the ledger. That is all they mean.

Whether a debit increases or decreases an account balance depends on the account type:

| Account type | Debit effect | Credit effect | Examples |
|---|---|---|---|
| Asset | Increases balance | Decreases balance | Cash, accounts receivable, equipment |
| Liability | Decreases balance | Increases balance | Loans, accounts payable |
| Equity | Decreases balance | Increases balance | Owner's capital, retained earnings |
| Revenue | Decreases balance | Increases balance | Sales, subscription income |
| Expense | Increases balance | Decreases balance | Rent, salaries, software costs |

A customer pays their invoice. Cash (an asset) increases — that is a debit to Cash. Accounts Receivable (also an asset) decreases because the invoice is now settled — that is a credit to Accounts Receivable. Two entries, equal amounts, accounting equation unchanged.

## The data model

My original model:

```sql
-- What I built first (wrong)
CREATE TABLE transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount      NUMERIC(19, 4) NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  account_id  UUID NOT NULL REFERENCES accounts(id),
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

The problem: nothing in this schema enforces that the books balance. I can insert a debit with no corresponding credit. I can insert two debits that reference unrelated accounts. The schema is a bag of numbers, not a ledger.

The double-entry model:

```sql
-- Journal entries — one per transaction (a payment, a refund, a charge)
CREATE TABLE journal_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ledger lines — always in pairs, always summing to zero
CREATE TABLE ledger_lines (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id),
  account_id       UUID NOT NULL REFERENCES accounts(id),
  -- Positive = debit, negative = credit.
  -- This single-column encoding is the key constraint:
  -- for a valid entry, SUM(amount) across all lines = 0
  amount           NUMERIC(19, 4) NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- The database enforces balance — not application code
CREATE OR REPLACE FUNCTION check_journal_entry_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT SUM(amount)
    FROM ledger_lines
    WHERE journal_entry_id = NEW.journal_entry_id
  ) != 0 THEN
    RAISE EXCEPTION
      'Journal entry % does not balance. Sum must equal zero.',
      NEW.journal_entry_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER enforce_double_entry
  AFTER INSERT OR UPDATE ON ledger_lines
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION check_journal_entry_balance();
```

The constraint trigger is deferred — `INITIALLY DEFERRED` means it fires at the end of the transaction, not after each row insert. This is critical: you need to insert both lines before the check runs, not be blocked on the first insert.

## Recording a transaction

A customer pays a $500 invoice. In the application layer:

```js
export async function recordPayment(db, { customerId, amount, invoiceId }) {
  await db.transaction(async (trx) => {
    // Create the journal entry header
    const [entry] = await trx("journal_entries")
      .insert({ description: `Payment from customer ${customerId}` })
      .returning("id");

    // Debit Cash — asset increases (positive amount)
    await trx("ledger_lines").insert({
      journal_entry_id: entry.id,
      account_id: ACCOUNTS.CASH,
      amount: amount,                // +500.00
    });

    // Credit Accounts Receivable — asset decreases (negative amount)
    await trx("ledger_lines").insert({
      journal_entry_id: entry.id,
      account_id: ACCOUNTS.ACCOUNTS_RECEIVABLE,
      amount: -amount,               // -500.00
    });

    // Mark invoice as paid — separate concern, same transaction
    await trx("invoices")
      .where({ id: invoiceId })
      .update({ status: "paid", paid_at: new Date() });
  });
  // Constraint trigger fires here, at commit time.
  // If SUM(amount) != 0, the transaction rolls back.
}
```

The database is the source of truth for correctness. The application layer does not check whether the books balance — the schema makes an imbalanced entry impossible to commit.

## Querying the ledger

The single-column encoding (positive = debit, negative = credit) makes queries straightforward:

```sql
-- Account balance at any point in time
SELECT
  a.name,
  SUM(ll.amount) AS balance
FROM accounts a
JOIN ledger_lines ll ON ll.account_id = a.id
WHERE a.id = $1
  AND ll.created_at <= $2  -- balance as of a specific date
GROUP BY a.name;

-- Trial balance — all accounts, must sum to zero if the books are correct
SELECT
  a.name,
  a.type,
  SUM(ll.amount) AS balance
FROM accounts a
JOIN ledger_lines ll ON ll.account_id = a.id
GROUP BY a.name, a.type
ORDER BY a.type, a.name;
-- The grand total of this query must always be zero.
-- If it is not, there is a data integrity problem.
```

The trial balance query is your integrity check. It is not something you run to find bugs — it is something you run to confirm the schema constraint is doing its job. If the trigger is in place, the trial balance total cannot be non-zero. Run it anyway. It is a six-line query that tells you definitively whether your financial data is consistent.

## Why this matters beyond accounting software

Double-entry bookkeeping is a specific solution to a general problem: how do you record state changes in a system where integrity is not optional?

The pattern generalizes. Inventory systems, ledger-based identity systems, any domain where you need to audit every change and guarantee consistency — the journal entry / ledger line model applies. The accounting equation is just one instance of the constraint that "the sum of all changes must be zero." That constraint is expressible at the schema level in any relational database, and expressing it at the schema level is always stronger than expressing it in application code.

I rebuilt the financial layer using this model. Reconciliation now runs in a single SQL query against the trial balance. In six months since the rebuild, it has returned a non-zero total exactly zero times.

That is what sound data modeling looks like.