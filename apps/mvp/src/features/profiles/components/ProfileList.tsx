import { useTranslations } from "next-intl";
import { Profile } from "../types";
import { ProfileItem } from "./ProfileItem";

interface ProfileListProps {
  profiles: Profile[] | undefined;
  onDelete: (profile: { id: string; name: string }) => void;
  isDeleting: boolean;
}

export const ProfileList = ({
  profiles,
  onDelete,
  isDeleting,
}: ProfileListProps) => {
  const t = useTranslations("ProfilePage");

  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 md:gap-15 gap-3 w-full">
      {profiles && profiles.length > 0 ? (
        profiles.map((p) => (
          <ProfileItem
            key={p.id}
            profile={p}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        ))
      ) : (
        <div className="p-4 rounded-md bg-white dark:bg-background">
          {t("no_profiles")}
        </div>
      )}
    </div>
  );
};
