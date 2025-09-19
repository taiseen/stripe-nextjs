"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/db/prisma";

export async function checkAuthStatus() {

    const { getUser } = getKindeServerSession();

    const authUser = await getUser();

    if (!authUser) return { success: false };

    const isExistingUser = await prisma.user.findUnique({ where: { id: authUser.id } });

    // sign up time store/save auth user data into db 
    if (!isExistingUser) {

        const { id, email, given_name, picture } = authUser;

        const newUserInfo = {
            data: {
                id,
                email: email!,
                name: given_name,
                image: picture,
            },
        };

        console.log({ newUserInfo });

        await prisma.user.create(newUserInfo);

    }

    return { success: true };
}