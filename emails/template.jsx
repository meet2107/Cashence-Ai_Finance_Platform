import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "",
  type = "budget-alert",
  data = {},
}) {
  if(type === "monthly-report"){

  }
  
  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.textLabel}>Budget Amount</Text>
                <Text style={styles.statValue}>${data?.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.textLabel}>Spent So Far</Text>
                <Text style={styles.statValue}>${data?.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.textLabel}>Remaining</Text>
                <Text style={styles.statValue}>
                  ${data?.budgetAmount - data?.totalExpenses}
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

const styles = {
  body: {
    background: "linear-gradient(135deg, #e0f2ff, #ede9fe)", // pastel blue to light purple
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    padding: "40px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
  },
  title: {
    color: "#4f46e5", // Indigo-600
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "24px",
  },
  text: {
    color: "#1e293b", // Slate-800
    fontSize: "16px",
    marginBottom: "16px",
  },
  statsContainer: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f1f5f9", // Light slate background
    borderRadius: "8px",
  },
  stat: {
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(99, 102, 241, 0.1)", // Indigo shadow
  },
  textLabel: {
    color: "#475569", // Slate-600
    fontSize: "14px",
    marginBottom: "4px",
  },
  statValue: {
    color: "#3b82f6", // Blue-500
    fontSize: "20px",
    fontWeight: "600",
  },
};
