"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/db/prisma";

// 🟩🟩🟩 backend - controller logic
export async function isUserSubscribed() {

    const { getUser } = getKindeServerSession();

    const user = await getUser();
    if (!user) return { success: false };

    const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!existingUser) return { success: false };

    return { success: true, subscribed: existingUser.plan === "premium" };
}