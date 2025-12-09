import { useContext } from 'react';
import { CompanyContext } from './CompanyContextConfig';

export const useCompany = () => {
    const context = useContext(CompanyContext);
    if (context === undefined) {
        throw new Error('useCompany must be used within CompanyProvider');
    }
    return context;
};
