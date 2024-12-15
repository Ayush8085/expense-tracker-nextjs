"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function getUserBalance(): Promise<{
    balance?: number,
    error?: string,
}> {
    const { userId } = await auth();
    if (!userId) {
        return { error: "User not found" };
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId },
        });

        const balance = transactions.reduce((sum, transactions) => sum + transactions.amount, 0);

        return { balance };
    } catch (error) {
        return { error: "Something went wrong" }
    }
}