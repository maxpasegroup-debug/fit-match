import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

type EmailShellProps = {
  preview: string;
  title: string;
  children: ReactNode;
};

export function EmailShell({ preview, title, children }: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>SIGN SILKS</Text>
          <Heading style={heading}>{title}</Heading>
          <Section>{children}</Section>
          <Hr style={hr} />
          <Text style={footer}>
            FIT & Match keeps your account secure with time-limited links.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button href={href} style={button}>
      {children}
    </Button>
  );
}

export const paragraph = {
  color: "#4a3f47",
  fontSize: "16px",
  lineHeight: "26px",
} as const;

const body = {
  backgroundColor: "#fffafd",
  fontFamily: "Arial, sans-serif",
  margin: 0,
} as const;

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eadde6",
  borderRadius: "18px",
  margin: "40px auto",
  maxWidth: "560px",
  padding: "32px",
} as const;

const brand = {
  color: "#c21874",
  fontSize: "13px",
  fontWeight: "700",
  letterSpacing: "2px",
  margin: "0 0 18px",
} as const;

const heading = {
  color: "#241820",
  fontSize: "28px",
  lineHeight: "36px",
  margin: "0 0 20px",
} as const;

const button = {
  backgroundColor: "#c21874",
  borderRadius: "999px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "700",
  padding: "14px 22px",
} as const;

const hr = {
  borderColor: "#eadde6",
  margin: "28px 0",
} as const;

const footer = {
  color: "#756871",
  fontSize: "13px",
  lineHeight: "20px",
} as const;
