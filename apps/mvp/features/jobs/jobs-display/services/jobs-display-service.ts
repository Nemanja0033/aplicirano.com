export async function fetchJobs(token: string | null){
    try{
        const res = await fetch('/api/jobs', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data
    }
    catch(err){
        console.error(err);
        throw new Error("Error while fetching jobs");
    }
}