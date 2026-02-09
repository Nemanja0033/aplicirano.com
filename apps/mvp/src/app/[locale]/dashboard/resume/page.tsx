"use client";

import Loader from "@/src/components/Loader";
import GlobalLoader from "@/src/components/gloabal-loader";
import { NotAuthScreen } from "@/src/components/NotAuthScreen";
import { useResumes } from "@/src/features/resumes/hooks/useResumes";
import { ResumeHeader } from "@/src/features/resumes/components/ResumeHeader";
import { ProfileSelector } from "@/src/features/resumes/components/ProfileSelector";
import { AddResumeModal } from "@/src/features/resumes/components/AddResumeModal";
import { ResumeList } from "@/src/features/resumes/components/ResumeList";
import { DeleteResumeConfirmModal } from "@/src/features/resumes/components/DeleteResumeConfirmModal";

export default function ResumesPage() {
  const {
    token,
    currentUser,
    resumes,
    isLoading,
    selectedProfile,
    setSelectedProfile,
    isAddResumeModalOpen,
    setIsAddResumeModalOpen,
    isDeleting,
    confirmOpen,
    setConfirmOpen,
    selectedResumeToDelete,
    form,
    onSubmit,
    confirmDeleteResume,
    onConfirmDeleteResume,
  } = useResumes();

  if (isLoading) {
    return <Loader type="NORMAL" />;
  }

  if (!token) {
    return <NotAuthScreen />;
  }

  return (
    <>
      <main className="w-full h-screen flex justify-center items-start overflow-auto">
        {isDeleting && <GlobalLoader />}
        <div className="md:w-6xl p-3 w-full grid place-items-center gap-5">
          <div className="w-full">
            <ResumeHeader />

            <div className="mt-5 dark:bg-gradient-to-b from-[#100c28] to-[#010216] dark:border-[#151046] dark:border-2 bg-white p-5 rounded-lg shadow-md">
              <ProfileSelector
                currentUser={currentUser}
                selectedProfile={selectedProfile}
                onSelectProfile={setSelectedProfile}
              />

              <AddResumeModal
                open={isAddResumeModalOpen}
                onOpenChange={setIsAddResumeModalOpen}
                currentUser={currentUser}
                form={form}
                onSubmit={onSubmit}
              />

              <ResumeList
                resumes={resumes}
                onDelete={confirmDeleteResume}
              />
            </div>
          </div>
        </div>

        <DeleteResumeConfirmModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          selectedResume={selectedResumeToDelete}
          isDeleting={isDeleting}
          onConfirm={onConfirmDeleteResume}
        />
      </main>
    </>
  );
}
