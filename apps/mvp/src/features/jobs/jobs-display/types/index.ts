export interface Job {
    id: string
    title: string,
    appliedAt: Date | any,
    status: string,
    updatedAt: Date | any,
    userId: string,
    profileId: string | null,
    resumeId: string | null,
    position: string | null,
    jobUrl: string | null,
    salarly: number | null,
    location: string | null,
    notes: string | null,
    resume?: {
        title: string
        resumeUrl: string
    } | null
}