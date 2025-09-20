
  export interface Opportunity {
    id: string;
    name: string;
    stage: string;
    amount: string;
    accountName: string;
  }
  
  export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    source: string;
    score: number;
    status: "Qualified" | "Contacted" | "New";
    Opportunity?: Opportunity;
  }