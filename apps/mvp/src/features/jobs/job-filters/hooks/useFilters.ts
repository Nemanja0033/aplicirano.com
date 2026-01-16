import { useState } from "react";

export function useFilters(data: any, type: "JOBS" | "EMAIL"){
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [isStatusChanged, setIsStatusChanged] = useState(false);
    let filteredData: any = [];

    function changeStatus(status: string){
      setStatus(status);
    }

    if(type === 'JOBS'){
      filteredData = data.filter((job: any) => {
        const matchesQuery = query
            ? job.title.toLowerCase().includes(query.toLowerCase())
            : true;
        
          const matchesStatus = status
            ? job.status.toLowerCase() === status.toLowerCase()
            : true;

          return matchesQuery && matchesStatus;
      });
    }

    return{
        query,
        isStatusChanged,
        filteredData,
        setQuery,
        setIsStatusChanged,
        changeStatus
    }
}