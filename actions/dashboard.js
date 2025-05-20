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

export async function createAccount(data){
    try {
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
        });
        if(!user) throw new Error("User not found");

        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)) throw new Error("Invalid balance amount");

        const existingAccount = await db.account.findMany({
            where: {
                userId: user.id
            },
        });
        
        const shouldBeDefault = existingAccount.length === 0? true: data.isDefault;

        // If this account should be default, set all other accounts to not default
        if(shouldBeDefault){
            await db.account.updateMany({
                where: {
                    userId: user.id,
                    isDefault: true
                },
                data: {
                    isDefault: false
                }
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        const serializedAccount = serializeTransaction(account);

        revalidatePath("/dashboard");
        return {
            success: true,
            data: serializedAccount,
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getUserAccounts() {
    try {
        const {userId} = await auth();
        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            },
        });
        if(!user) throw new Error("User not found");

        const accounts = await db.account.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc"
            },
            include: {
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });

        const serializedAccounts = accounts.map(serializeTransaction);

        return serializedAccounts;
    } catch (error) {
        throw new Error(error.message);
    }
}