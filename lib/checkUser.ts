import { currentUser } from "@clerk/nextjs/server";

import {prisma} from "@/lib/prisma";

export const checkUser = async () => {
    const user = await currentUser();

    if(!user) {
        return null;
    }

    // check if in database already
    const loggedInUser = await prisma.user.findUnique({
        where: {
            clerkUserId: user.id,
        }
    })

    // if in database, return user
    if(loggedInUser) {
        return loggedInUser;
    }

    // if not in database, create user
    const newUser = await prisma.user.create({
        data: {
            clerkUserId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })

    return newUser;
}