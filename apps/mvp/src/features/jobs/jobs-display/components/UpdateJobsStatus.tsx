"use client";
import { Button } from "@/src/components/ui/button";
import { X, Save, Loader2 } from "lucide-react";
import { bulkUpdateJobStatuses } from "../server-actions/bulkUpdateJobStatus";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const UpdateJobsStatus = ({
  setIsStatusChanged,
  selectedRowsWithStatus,
}: any) => {
  const t = useTranslations("StatusButtons");
  const queryClient = useQueryClient();
  const [loading, setIsLoading] = useState(false);

  const handleUpdateJobs = async () => {
    try {
      setIsLoading(true);
      console.log(selectedRowsWithStatus);
      await bulkUpdateJobStatuses(selectedRowsWithStatus);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setIsStatusChanged(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
      className="flex w-full p-3 rounded-md bg-blue-50/10 gap-2"
    >
      <Button
        type="button"
        size={"sm"}
        onClick={() => setIsStatusChanged(false)}
        variant={"outline"}
      >
        <X />
        {t("cancel")}
      </Button>
      <Button
        size={"sm"}
        type="submit"
        disabled={loading}
        onClick={handleUpdateJobs}
      >
        <Save />
        {loading ? <Loader2 className="animate-spin" /> : t("save")}
      </Button>
    </motion.div>
  );
};

export default UpdateJobsStatus;
