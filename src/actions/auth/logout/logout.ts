"use server";

import { deleteSession } from "@/utils/auth/server";

export const logoutAction = async () => {
  await deleteSession();
};
