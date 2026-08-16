---
title: "The real architecture of Nigerian university CGPA calculation"
summary: "Nigerian university CGPA looks simple on the transcript. The algorithm behind it handles retakes, carry-overs, unit loads, and policy variations that most implementations get wrong."
published: "2026-01-18"
tags: ["EdTech", "Algorithms", "Data Modeling", "SQL"]
project: "gradeforge"
---

I built an academic results management system for Nigerian universities. The hardest part was not the user interface, the authentication, or the file exports — it was the CGPA calculation. Not because the mathematics is complex, but because the specification is ambiguous in ways that only become visible when you start handling edge cases.

This post is about the algorithm, the data model behind it, and the three places where naive implementations break.

## How Nigerian CGPA actually works

The foundation is the quality point. Each course has two inputs: a grade (which maps to a grade point) and a credit unit load. The quality point for a single course is:

```
Quality Points = Grade Point × Credit Units
```

The Cumulative Grade Point Average is then:

```
CGPA = Total Quality Points (all semesters) ÷ Total Credit Units Attempted
```

The standard grade scale used by most Nigerian universities:

| Score range | Grade | Grade point |
|---|---|---|
| 70 – 100 | A | 5.0 |
| 60 – 69 | B | 4.0 |
| 50 – 59 | C | 3.0 |
| 45 – 49 | D | 2.0 |
| 40 – 44 | E | 1.0 |
| 0 – 39 | F | 0.0 |

A 5.0 scale, not the 4.0 scale used in American universities. The distinction matters immediately when you build the system: any GPA comparisons, thresholds for academic standing, or scholarship criteria are all calibrated to the 5.0 ceiling.

## The data model

The calculation requires three entities:

```sql
-- Courses offered by the institution
CREATE TABLE courses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code         TEXT NOT NULL UNIQUE,   -- e.g., "CSC 301"
  title        TEXT NOT NULL,
  credit_units INTEGER NOT NULL CHECK (credit_units > 0),
  department   TEXT NOT NULL
);

-- A student's enrollment in a course for a specific semester
CREATE TABLE enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES students(id),
  course_id   UUID NOT NULL REFERENCES courses(id),
  session     TEXT NOT NULL,     -- e.g., "2023/2024"
  semester    TEXT NOT NULL CHECK (semester IN ('first', 'second')),
  -- Score captured at grade entry — preserved even after grade derivation
  -- to support re-grading without losing the original record
  score       NUMERIC(5, 2),
  grade       TEXT,              -- Derived from score, stored for query performance
  grade_point NUMERIC(3, 1),     -- Derived from grade, stored for same reason
  is_retake   BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (student_id, course_id, session, semester)
);
```

The score is stored alongside the derived grade and grade point. This is intentional: re-grading is common (script re-marking, data entry corrections), and having the original score available prevents the need to reconstruct it from the grade. The derived columns are a read performance optimization, not the source of truth.

## The CGPA calculation

A naive implementation sums every enrollment record:

```js
// Wrong — does not handle retakes correctly
function calculateCGPA(enrollments) {
  const totalQP = enrollments.reduce(
    (sum, e) => sum + e.gradePoint * e.creditUnits,
    0
  );
  const totalCU = enrollments.reduce(
    (sum, e) => sum + e.creditUnits,
    0
  );
  return totalQP / totalCU;
}
```

This is wrong because of retakes.

## The retake problem

When a student fails a course and retakes it, the question is: which attempt counts toward the CGPA?

Nigerian universities handle this in one of two ways, and getting this wrong is the most common implementation failure:

**Policy A (most federal universities):** Only the best attempt counts. Both attempts are on the transcript for historical record, but only the higher grade contributes to CGPA calculation.

**Policy B (some state universities):** The most recent attempt counts, regardless of whether it is better or worse than the previous one.

The policy is institution-specific. The system needs to support both, and the CGPA calculation must resolve which enrollment record to use before summing.

```js
function resolveCourseAttempts(enrollments, policy = "best") {
  // Group enrollments by course
  const byCourse = new Map();

  for (const enrollment of enrollments) {
    const key = enrollment.courseId;
    if (!byCourse.has(key)) {
      byCourse.set(key, []);
    }
    byCourse.get(key).push(enrollment);
  }

  // For each course, select the attempt that counts
  const resolved = [];
  for (const [, attempts] of byCourse) {
    if (attempts.length === 1) {
      resolved.push(attempts[0]);
      continue;
    }

    if (policy === "best") {
      // Sort by grade point descending, take the first
      resolved.push(
        attempts.sort((a, b) => b.gradePoint - a.gradePoint)[0]
      );
    } else if (policy === "latest") {
      // Sort by session and semester, take the most recent
      resolved.push(
        attempts.sort((a, b) => compareSemester(b, a))[0]
      );
    }
  }

  return resolved;
}

function calculateCGPA(enrollments, policy) {
  const resolved = resolveCourseAttempts(enrollments, policy);

  // Exclude courses with no grade yet (in-progress or missing result)
  const graded = resolved.filter(
    (e) => e.gradePoint !== null && e.gradePoint !== undefined
  );

  if (graded.length === 0) return null;

  const totalQP = graded.reduce(
    (sum, e) => sum + e.gradePoint * e.creditUnits,
    0
  );
  const totalCU = graded.reduce(
    (sum, e) => sum + e.creditUnits,
    0
  );

  return parseFloat((totalQP / totalCU).toFixed(2));
}
```

## Carry-overs and the credit unit count

The denominator in the CGPA equation — total credit units attempted — is the second source of errors.

"Credit units attempted" does not mean credit units registered. It means credit units for courses where a grade exists. A student who registers for 18 credit units but receives results for only 15 (one course result is pending or missing) has a denominator of 15, not 18.

This distinction matters most in the graduation audit: a student with a missing result for a second-semester course in their third year may appear to have a passing CGPA when calculated against the registered units, and a failing CGPA when the outstanding result is eventually posted.

The `filter` on `gradePoint !== null` above handles this. Every enrollment without a recorded grade is excluded from both the numerator and denominator.

Carry-overs — courses a student failed in a previous year and is repeating — are treated identically to retakes. The retake resolution logic applies: only the designated attempt (best or latest) contributes to CGPA, regardless of whether the course was originally taken in year one or year three.

## Semester GPA vs cumulative GPA

Most result slips show both the semester GPA (SGPA) and the cumulative (CGPA). They are the same calculation, just over different data sets:

```js
function calculateSGPA(enrollments, session, semester, policy) {
  const semesterEnrollments = enrollments.filter(
    (e) => e.session === session && e.semester === semester
  );
  // Within a single semester, retakes are not possible — no resolution needed
  return calculateCGPA(semesterEnrollments, policy);
}

function calculateCGPA(enrollments, policy) {
  // Applies across all semesters — resolution handles retakes
  const resolved = resolveCourseAttempts(enrollments, policy);
  const graded = resolved.filter((e) => e.gradePoint !== null);
  if (graded.length === 0) return null;
  const totalQP = graded.reduce((s, e) => s + e.gradePoint * e.creditUnits, 0);
  const totalCU = graded.reduce((s, e) => s + e.creditUnits, 0);
  return parseFloat((totalQP / totalCU).toFixed(2));
}
```

The SGPA for a semester is straightforward because a student cannot retake a course within the same semester — the retake resolution step is irrelevant. For cumulative calculation, the resolution is mandatory.

## Classification thresholds

Nigerian universities map CGPA to a degree classification:

| CGPA range | Classification |
|---|---|
| 4.50 – 5.00 | First Class Honours |
| 3.50 – 4.49 | Second Class Upper |
| 2.40 – 3.49 | Second Class Lower |
| 1.50 – 2.39 | Third Class |
| 1.00 – 1.49 | Pass |
| Below 1.00 | Fail |

The thresholds vary slightly between institutions. The system stores them as configuration rather than hardcoded constants:

```js
// Stored in institution config, not in application code
const CLASSIFICATION_THRESHOLDS = [
  { min: 4.50, max: 5.00, label: "First Class Honours" },
  { min: 3.50, max: 4.49, label: "Second Class Upper" },
  { min: 2.40, max: 3.49, label: "Second Class Lower" },
  { min: 1.50, max: 2.39, label: "Third Class" },
  { min: 1.00, max: 1.49, label: "Pass" },
  { min: 0.00, max: 0.99, label: "Fail" },
];

function classify(cgpa, thresholds = CLASSIFICATION_THRESHOLDS) {
  if (cgpa === null) return null;
  const match = thresholds.find(
    (t) => cgpa >= t.min && cgpa <= t.max
  );
  return match?.label ?? null;
}
```

## The places naive implementations break

To summarize the three failure modes I encountered and that the algorithm above addresses:

**Retake handling.** Summing all enrollment records without resolving retakes double-counts credit units and misrepresents the quality point contribution. Every multi-attempt course must be resolved to a single contributing record before calculation.

**In-progress result exclusion.** Including courses with no grade in the credit unit denominator produces a CGPA that will shift when results are posted. The denominator must reflect graded courses only.

**Policy configuration.** Hardcoding best-attempt or latest-attempt retake policy means the system is wrong for every institution that uses the other policy. The retake resolution strategy must be a runtime configuration, not a constant.

The algorithm is not complex. The complexity is in knowing which cases exist — and that only becomes clear when you talk to the registrar's office rather than reading the student handbook.