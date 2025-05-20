"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// as next.js do not support decimal values, we need to convert it to number
const serializeTransaction = (obj) => {
    const serialized = { ...obj };

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }

    if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
}

export async function updateDefaultAccount(accountId){
    try {
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
        });
        if(!user) throw new Error("User not found");

        const existingAccount = await db.account.findUnique({
            where: {
                id: accountId,
                userId: user.id
            },
        });
        if(!existingAccount) throw new Error("Account not found");

        // If this account should be default, set all other accounts to not default
        
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true
            },
            data: {
                isDefault: false
            }
        });

        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id 
            },
            data: {
                isDefault: true,
            },
        });

        revalidatePath("/dashboard");

        return {
            success: true,
            data: serializeTransaction(account),
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || "An error occurred",
        };
    }
}