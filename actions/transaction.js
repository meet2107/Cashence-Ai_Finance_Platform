"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeAmount = (obj) => ({
    ...obj,
    amount: obj.amount.toNumber(),
});

export async function createTransaction(data){
    try{
        const {userId} = await auth();
        if(!userId){
            throw new Error("User not authenticated");
        }

        // Arcjet to add rate limiting 

        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });

        if(!user){
            throw new Error("User not found");
        }

        const account = db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id,
            },
        });

        if(!account){
            throw new Error("Account not found");
        }

        const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

        // this is a prisma transaction
        const transaction = await db.$transaction(async(tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    ...data,
                    userId: user.id,
                    nextRecurringDate: data.isRecurring && data.recurringInterval 
                                       ? calculateNextRecurringDate(data.date, data.recurringInterval) 
                                       : null,
                },
            });

            await tx.account.update({
                where: { id: account.id },
                data: { balance: newBalance },
            });

            return newTransaction;
        })

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.account.id}`);

        return { success: true, data: serializeAmount(transaction) };
    }
    catch(error){
        throw new Error(error.message);
    }
}

function calculateNextRecurringDate(date, interval) {
    const nextDate = new Date(date);
    switch (interval) {
        case "DAILY":
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case "WEEKLY":
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case "MONTHLY":
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case "YEARLY":
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            throw new Error("Invalid recurring interval");
    }
    return nextDate;
}