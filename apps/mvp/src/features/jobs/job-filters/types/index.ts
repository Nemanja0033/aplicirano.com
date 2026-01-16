export interface Filters {
    filterType: "JOBS" | "EMAILS"
    searchTerm: string
    isDisabled: boolean;
    handleSearch: (e: any) => void;
    changeStatus: (status: string) => void
}