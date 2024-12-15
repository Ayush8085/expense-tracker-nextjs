"use server";

import { prisma } from "@/lib/prisma";
import { Transaction } from "@/types/Transaction";
import { auth } from "@clerk/nextjs/server";

export default async function getTransactions(): Promise<{
    transactions?: Transaction[],
    error?: string,
}> {
    const { userId } = await auth();
    if (!userId) {
        return { error: "User not found" };
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            }
        });

        return { transactions };
    } catch (error) {
        return { error: "Something went wrong" }
    }
}