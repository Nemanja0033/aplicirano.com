export interface UserData {
    status: "AUTH" | "NOT_AUTH";
    avatar: string | null;
    username: string | null;
    email: string | null;
}