import { useCurrentUser } from "@/src/features/user/hooks/useCurrentUser";
import { useTranslations } from "next-intl";

export default function jobsLimitBadge() {
  const { currentUserData } = useCurrentUser();
  const t = useTranslations("JobsTable");

  return (
    <>
      {!currentUserData?.isProUSer && (
        <div
          className={`opacity-50 ${currentUserData?._count.jobs! > 20 ? "bg-orange-100 text-orange-400" : ""} ${currentUserData?._count.jobs === 25 ? "bg-[#AC363626]! text-[#AC3636]!" : "bg-green-100 text-green-400"} gap-[8px] p-[10px] rounded-[8px] w-fit flex`}
        >
          <div>
            {currentUserData?._count.jobs}/{25}
          </div>
          <div>
            {t("jobs_count")}
          </div>
        </div>
      )}
    </>
  );
}
