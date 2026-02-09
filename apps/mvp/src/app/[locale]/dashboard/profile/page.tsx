"use client";

import Loader from "@/src/components/Loader";
import GlobalLoader from "@/src/components/gloabal-loader";
import { NotAuthScreen } from "@/src/components/NotAuthScreen";
import { useProfiles } from "@/src/features/profiles/hooks/useProfiles";
import { ProfileHeader } from "@/src/features/profiles/components/ProfileHeader";
import { ProfileList } from "@/src/features/profiles/components/ProfileList";
import { AddProfileForm } from "@/src/features/profiles/components/AddProfileForm";
import { DeleteProfileModal } from "@/src/features/profiles/components/DeleteProfileModal";

export default function ProfilePage() {
  const {
    t,
    token,
    profiles,
    isProfilesLoading,
    name,
    setName,
    isSubmitting,
    isAddingNewProfile,
    setIsAddingNewProfile,
    currentUserData,
    canCreate,
    handleCreate,
    confirmOpen,
    setConfirmOpen,
    selectedProfileToDelete,
    confirmDelete,
    onConfirmDelete,
    isDeleting,
  } = useProfiles();

  if (isProfilesLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return <NotAuthScreen />;
  }

  return (
    <main className="w-full h-full flex justify-center items-start">
      {isDeleting && <GlobalLoader />}

      <DeleteProfileModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        selectedProfile={selectedProfileToDelete}
        onConfirm={onConfirmDelete}
        isDeleting={isDeleting}
      />

      <section className="md:w-6xl p-3 w-full grid place-items-center gap-5">
        <ProfileHeader />

        <section className="w-full rounded-lg bg-white shadow-md p-5 dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216]">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {t("used_label", { count: profiles?.length ?? 0 })}
                </span>
              </div>
            </div>

            <ProfileList
              profiles={profiles}
              onDelete={confirmDelete}
              isDeleting={isDeleting}
            />

            <AddProfileForm
              isAddingNewProfile={isAddingNewProfile}
              setIsAddingNewProfile={setIsAddingNewProfile}
              name={name}
              setName={setName}
              handleCreate={handleCreate}
              isSubmitting={isSubmitting}
              canCreate={canCreate}
              currentUserData={currentUserData}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
