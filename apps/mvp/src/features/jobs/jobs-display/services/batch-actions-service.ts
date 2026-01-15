import axios from "axios";

// ======================================================
// Update records status (PATCH)
// ======================================================
export async function updateRecordsStatus(
  ids: string[],
  status: "APPLIED" | "REJECTED" | "INTERVIEW" | "OFFER",
  token: string
) {
  try {
    return axios.patch(
      "/api/batch",
      { recordIds: ids, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    throw new Error("Error while updating records");
  }
}

// ======================================================
// Delete records (DELETE)
// ======================================================
export async function deleteRecords(recordsIds: string[], token: string) {
  try {
    return axios.request({
      url: "/api/batch",
      method: "DELETE",
      data: { recordsIds },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error("Error while deleting records");
  }
}
  