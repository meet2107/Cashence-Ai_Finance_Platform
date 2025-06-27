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
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>${data?.stats.totalIncome}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>${data?.stats.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  ${data?.stats.totalIncome - data?.stats.totalExpenses}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={{ ...styles.text, ...styles.rowText }}>
                        <span>{category}</span>
                        <span>${amount.toFixed(2)}</span>
                      </Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Cashence Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Cashence. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
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
    background: "linear-gradient(135deg, #e0f2ff, #ede9fe)",
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
    color: "#4f46e5",
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "24px",
  },
  text: {
    color: "#1e293b",
    fontSize: "16px",
    marginBottom: "16px",
  },
  statsContainer: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f1f5f9", 
    borderRadius: "8px",
  },
  stat: {
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(99, 102, 241, 0.1)", 
  },
  textLabel: {
    color: "#475569",
    fontSize: "14px",
    marginBottom: "4px",
  },
  statValue: {
    color: "#3b82f6",
    fontSize: "20px",
    fontWeight: "600",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  rowText: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
};
