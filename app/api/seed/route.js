// Just a simple API route to seed the database with transactions

import { seedTransactions } from "@/actions/seed";

export async function GET() {
    const result = await seedTransactions();
    return Response.json(result);
}