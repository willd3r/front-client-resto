import { createContext } from 'react';

interface Company {
    id: string;
    name: string;
    logo: string | null;
    menu_logo: string | null;
    background_image: string | null;
    primary_color: string;
    secondary_color: string;
    theme_name: string;
}

export interface CompanyContextType {
    company: Company | null;
    loading: boolean;
    refreshCompany: () => Promise<void>;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);
