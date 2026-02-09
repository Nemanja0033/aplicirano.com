export type Role = "user" | "ai";

export interface Message {
  role: Role;
  content: string;
}
