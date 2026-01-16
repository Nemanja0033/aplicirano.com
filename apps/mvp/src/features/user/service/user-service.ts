import axios from "axios";

export async function fetchCurrentUserData(token: string) {
  try {
    return await axios.get("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((data) => data.data);
  } catch (err) {
    console.error(err);
    throw new Error("Error while fetching user data");
  }
}
