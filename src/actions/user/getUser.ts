"use server";

import prisma from "@/utils/prisma";
import { verifySession } from "@/utils/auth/server";
import { createServerError } from "@/utils/general/server";
import { redirect } from "next/navigation";
import { IServerError } from "@/types/general/server";
import { IUser } from "@/types/user/general";

export const getUser = async (): Promise<IUser | IServerError> => {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(session.userId) },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return createServerError("User not found");
    }

    return user;
  } catch (error) {
    console.error("Internal server error:", error);
    return createServerError();
  }
};
