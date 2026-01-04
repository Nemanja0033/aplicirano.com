"use server"
import { db } from "@/lib/db";

export async function bulkUpdateJobStatuses(rowsWithStatus: { id: string, status: "INTERVIEW" | "APPLIED" | "REJECTED"}[]) {
  for (const row of rowsWithStatus) {
    const { id, status } = row
    await db.job.update({
      where: { id},
      data: { status },
    });
  }
}
