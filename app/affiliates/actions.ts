"use server";

import { revalidatePath } from "next/cache";

export async function revalidateAffiliates() {
  revalidatePath("/affiliates");
}
