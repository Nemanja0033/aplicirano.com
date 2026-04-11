import axios from "axios";

export async function handleJobPriority(jobId: string, priority: boolean){
    try{
        axios.patch(
            "/api/jobs/priority",
            {jobId, priority}
        )
    }
    catch(err){
        console.error(err);
        throw new Error("Error while updating records");
    }
}