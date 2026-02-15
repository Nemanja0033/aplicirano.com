import { Button } from "@/src/components/ui/button";
import { useTranslations } from "next-intl";
import { Profile } from "../types";
import { AddResumeModal } from "./AddResumeModal";

interface ProfileSelectorProps {
  currentUser: any;
  selectedProfile: string | null;
  onSelectProfile: (id: string | null) => void;
  isAddResumeModalOpen: boolean;
  setIsAddResumeModalOpen: any;
  form: any;
  onSubmit: any;
}

export const ProfileSelector = ({
  currentUser,
  selectedProfile,
  onSelectProfile,
  isAddResumeModalOpen,
  setIsAddResumeModalOpen,
  form,
  onSubmit,
}: ProfileSelectorProps) => {
  const t = useTranslations("ResumePage");

  return (
    <div className="grid gap-2 w-full py-4 border-b-1">
      <span className="text-sm text-muted-foreground">
        {t("active_profile")}
      </span>

      <div className="flex flex-wrap gap-2 items-center w-full justify-between">
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => onSelectProfile(null)}
            className={`${
              selectedProfile !== null
                ? "bg-transparent text-primary hover:text-white"
                : "bg-primary text-white"
            } border-2 border-primary`}
          >
            {t("general_profile")}
          </Button>

          {currentUser?.profiles.map((p: Profile) => (
            <Button
              key={p.id}
              onClick={() => onSelectProfile(p.id)}
              className={`${
                selectedProfile !== p.id
                  ? "bg-transparent text-primary hover:text-white"
                  : "bg-primary text-white"
              } border-2 border-primary`}
            >
              {p.name}
            </Button>
          ))}
        </div>

        <AddResumeModal
          open={isAddResumeModalOpen}
          onOpenChange={setIsAddResumeModalOpen}
          currentUser={currentUser}
          form={form}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};
