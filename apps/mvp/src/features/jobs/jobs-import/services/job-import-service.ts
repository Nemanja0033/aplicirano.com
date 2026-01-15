import axios from "axios";

export async function postSingleJob(data: any, token: string | null, profileId: string){
    try{
        await axios.post('/api/jobs/single', { data, profileId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }
    catch(err){
        throw new Error("Error while posting job");
    }
}

export async function updateSingleJob(data: any, jobId: string, token: string | null){
    try{
        await axios.patch('/api/jobs/single', { data, jobId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }
    catch(err){
        throw new Error("Error while update job");
    }
}