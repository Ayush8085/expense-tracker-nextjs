"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deleteTransaction(transactionId: string): Promise<{
    message?: string,
    error?: string,
}> {
    const { userId } = await auth();
    if (!userId) {
        return { error: "User not found" };
    }

    try {
        await prisma.transaction.delete({
            where: {
                id: transactionId,
                userId,
            }
        });

        revalidatePath("/");

        return { message: "Transaction deleted" };
    } catch (error) {
        return { error: "Something went wrong" }
    }
}