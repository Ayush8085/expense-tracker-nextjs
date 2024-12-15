"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface TransactionData {
    text: string;
    amount: number;
}

interface TransactionResult {
    data?: TransactionData;
    error?: string;
}

export default async function addTransaction(formData: FormData): Promise<TransactionResult> {
    const textValue = formData.get("text");
    const amountValue = formData.get("amount");

    if (!textValue || textValue == "" || !amountValue) {
        return { error: "Please enter a text and amount" };
    }

    const text: string = textValue.toString();
    const amount: number = parseFloat(amountValue.toString());

    //get logged in user
    const { userId } = await auth();

    if (!userId) {
        return { error: "User not found" };
    }

    try {
        const transactionData: TransactionData = await prisma.transaction.create({
            data: {
                text,
                amount,
                userId
            }
        });

        revalidatePath("/");

        return {
            data: transactionData,
        }
    } catch (error) {
        return { error: "Failed to add transaction" };
    }


}