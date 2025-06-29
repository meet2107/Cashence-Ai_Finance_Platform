# 💸 Cashence – Your Smart Financial Planning Assistant

Cashence is an AI-powered personal finance platform that helps users manage expenses, generate savings insights, and visualize their financial health—all in real-time.

> Powered by Next.js, Supabase, ShadCN, Inngest, Arcjet, and Gemini AI.

---

## 🧠 Use Cases

- 📊 **Expense Categorization**: Organize spending into meaningful categories.
- 🤖 **AI Insights**: Gemini AI provides smart suggestions to reduce expenses and increase savings.
- 🔔 **Automated Events**: Scheduled budgeting tips and savings alerts via Inngest.
- 🔒 **Bot Protection**: Arcjet shields the app from malicious actors.
- 📁 **Cloud Sync**: All data is securely stored and synced via Supabase.

---

## 🏗️ System Architecture

```mermaid
graph TD
    UI[Frontend: Next.js + Tailwind + ShadCN]
    Auth[Auth: Supabase]
    DB[Database: Supabase PostgreSQL]
    Inngest[Inngest (Event-driven functions)]
    Gemini[Gemini AI (AI Recommendations)]
    Arcjet[Arcjet (Bot Protection)]

    UI --> Auth
    UI --> DB
    UI --> Inngest
    UI --> Arcjet
    Inngest --> Gemini
    Inngest --> DB
    Gemini --> Inngest
