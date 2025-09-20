export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    source: string;
    score: number;
    status: "Qualified" | "Contacted" | "New";
  }