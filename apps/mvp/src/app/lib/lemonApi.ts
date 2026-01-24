const LEMON_API_URL = "https://api.lemonsqueezy.com/v1";

export async function lemonFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${LEMON_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}
