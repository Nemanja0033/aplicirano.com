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
    <div className="grid gap-2">
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
        <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800/40">
          {t("no_profiles")}
        </div>
      )}
    </div>
  );
};
