export async function fetchStats(token: string | null, startDate: string, endDate: string) {
    const res = await fetch(`http://localhost:3000/stats?start=${startDate}&end=${endDate}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  }
  