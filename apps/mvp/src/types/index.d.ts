// types.ts

export interface Job {
    id: string;
    title: string;
    appliedAt: string; // DateTime iz baze se vraća kao string
    status: "APPLIED" | "REJECTED" | "INTERVIEW";
    userId: string;
    profileId?: string;
    resumeId?: string;
    position?: string;
    jobUrl?: string;
    salary?: number;
    location?: string;
    notes?: string;
  }
  
  export interface Resume {
    id: string;
    title: string;
    resumeUrl: string;
    fileSize: string;
    userId: string;
    profileId?: string;
    createdAt: string;
    jobs: Job[];
  }
  
  export interface Profile {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    resumes: Resume[];
    jobs: Job[];
  }
  
  export interface User {
    id: string;
    firebaseUid: string;
    email: string;
    username: string;
    avatarUrl?: string;
    apiCredits: number;
    jobsLimit: number;
    profileLimit: number;
    resumeLimit: number;
    isProUSer: boolean;
    jobs: Job[];
    profiles: Profile[];
    resumes: Resume[];
  }
  