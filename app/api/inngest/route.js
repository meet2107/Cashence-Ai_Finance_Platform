import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { checkBudgetAlerts, generateMonthlyReports, processRecurringTransactions, triggerRecurringTransactions } from "@/lib/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlerts, triggerRecurringTransactions, processRecurringTransactions, generateMonthlyReports
  ],
});
