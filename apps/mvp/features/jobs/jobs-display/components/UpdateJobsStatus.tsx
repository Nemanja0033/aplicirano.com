"use client"
import { Button } from "@/components/ui/button";
import { X, Save } from "lucide-react";
import { bulkUpdateJobStatuses } from "../server-actions/bulkUpdateJobStatus";
import { useState } from "react";

const UpdateJobsStatus = ({ setIsStatusChanged, selectedRowsWithStatus} : any) => { 
  const [loading, setIsLoading] = useState(false);
  
  const handleUpdateJobs = async () => {
    try{
      setIsLoading(true);
      console.log(selectedRowsWithStatus)
      await bulkUpdateJobStatuses(selectedRowsWithStatus);
      setIsStatusChanged(false);
    }
    catch(err){
      console.error(err)
    }
    finally{
      setIsLoading(false);
    }
  }
    
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size={"sm"}
        onClick={() => setIsStatusChanged(false)}
        variant={'outline'}
      >
        <X />
        Cancel
      </Button>
      <Button
        size={"sm"}
        type="submit"
        disabled={loading}
        onClick={handleUpdateJobs}
      >
        <Save />
        {loading ? "Saving Changes..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default UpdateJobsStatus;
