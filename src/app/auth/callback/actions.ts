"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/db/prisma";

export async function checkAuthStatus() {

    const { getUser } = getKindeServerSession();

    const authUser = await getUser();

    if (!authUser) return { success: false };

    const existingUser = await prisma.user.findUnique({ where: { id: authUser.id } });

    // sign up time store/save auth user data into db 
    if (!existingUser) {
        await prisma.user.create({
            data: {
                id: authUser.id,
                email: authUser.email!,
                name: authUser.given_name + " " + authUser.family_name,
                image: authUser.picture,
            },
        });
    }

    return { success: true };
}