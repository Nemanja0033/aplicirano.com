import { useState, useEffect } from "react";

export interface Email {
    from: string,
    id: string,
    snippet: string,
    subject: string
}

export function useFetchMails(){
    const [mails, setMails] = useState<Email[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function handleFetchJobs(){
          try{
            setIsLoading(true);
            const res = await fetch("/api/gmail");
            const data = await res.json();
            console.log("@mails", data);
            setMails(data);
          }
          catch(err){
            console.error("error while fetch", err);
            setMails([]);
          }
          finally{
            setIsLoading(false);
          }
        }
    
        handleFetchJobs();
      }, []);

    return {
        mails,
        isLoading
    }
}