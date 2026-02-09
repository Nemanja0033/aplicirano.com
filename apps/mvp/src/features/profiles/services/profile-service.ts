import { Profile } from "../types";

export async function fetchProfilesApi(token: string | null) {
  if (!token) throw new Error("No token");
  const res = await fetch("/api/profiles", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || "Failed to fetch profiles");
  }
  return res.json();
}

export async function createProfileApi(
  token: string | null,
  payload: { name: string }
) {
  if (!token) throw new Error("No token");
  const res = await fetch("/api/profiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(
      json?.error || (await res.text()) || "Failed to create profile"
    );
  }
  const json = await res.json();
  if (json?.profile) return json.profile as Profile;
  if (json && typeof json === "object" && json.id) return json as Profile;
  return json as Profile;
}

export async function deleteProfileApi(
  token: string | null,
  payload: { profileId: string }
) {
  if (!token) throw new Error("No token");
  const res = await fetch("/api/profiles", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to delete profile");
  }
  return res.json();
}
