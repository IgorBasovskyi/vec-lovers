"use server";

import { cookies } from "next/headers";
import { ROUTE } from "@/types/general/client";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect(ROUTE.HOME);
};
