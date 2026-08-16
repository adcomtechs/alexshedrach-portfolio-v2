// features/about/ValuesInPractice.jsx
// RSC — no client directive required.
//
// grid variant — SectionBackground per DEC-045.
// default Container (896px). Per DEC-044.
// Card grid — two columns desktop, one column mobile. Per DEC-048.
// Card variant="flat" — no border, surface-2 background, sits cleanly
// over the grid SectionBackground without competing visual layers.

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { SectionBackground } from "@/components/ui/SectionBackground";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Cards/Card";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { aboutData } from "./about-data";

export function ValuesInPractice() {
  const items = aboutData.valuesInPractice;

  return (
    <Section spacing="sm" id="values-in-practice" className="relative">
      
      <SectionBackground variant="grid" />

      <Container size="wide">
        <SectionHeader
          label="Values in practice"
          title="Behaviors, not principles"
          as="h2"
          size="default"
          description="Concrete patterns observable in how work is approached and decisions are made — not aspirational statements."
        />

        {/* Card grid — 2-col desktop, 1-col mobile. Per DEC-048. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(({ title, detail }) => (
            <Card key={title} variant="flat">
              <CardHeader>
                <Heading as="h3" size="4">
                  {title}
                </Heading>
              </CardHeader>
              <CardContent>
                <Text size="sm" color="muted" className="leading-relaxed">
                  {detail}
                </Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
