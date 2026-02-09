export type FormValues = {
  title: string;
  cv: FileList;
};

export interface Resume {
  id: string;
  title: string;
  fileSize: string;
  resumeUrl: string;
  createdAt: string;
  resumeContent?: string;
}

export interface Profile {
  id: string;
  name: string;
}
