import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { CompanyContext } from './CompanyContextConfig';
import { io } from 'socket.io-client';

interface Company {
    id: string;
    name: string;
    logo: string | null;
    menu_logo: string | null;
    background_image: string | null;
    primary_color: string;
    secondary_color: string;
    button_color?: string;
    theme_name: string;
}

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);

    const applyTheme = (companyData: Company) => {
        const root = document.documentElement;
        
        // Apply color overrides
        root.style.setProperty('--accent-purple', companyData.primary_color);
        root.style.setProperty('--accent-blue', companyData.secondary_color);
        if (companyData.button_color) {
            root.style.setProperty('--accent-green', companyData.button_color);
        }
        
        // Apply theme
        root.setAttribute('data-theme', companyData.theme_name);
    };

    const refreshCompany = useCallback(async () => {
        try {
            const response = await api.get('/company/settings');
            const companyData = response.data.company;
            setCompany(companyData);
            applyTheme(companyData);
        } catch (error) {
            console.error('Error loading company settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCompany();

        // Setup socket connection for real-time updates
        const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
        const socket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('✅ WebSocket connected');
        });

        socket.on('company:updated', (data: { company: Company }) => {
            console.log('🔄 Company updated:', data.company);
            setCompany(data.company);
            applyTheme(data.company);
        });

        socket.on('disconnect', () => {
            console.log('❌ WebSocket disconnected');
        });

        socket.on('error', (error: Error | string) => {
            console.error('❌ WebSocket error:', error);
        });

        return () => {
            socket.disconnect();
        };
    }, [refreshCompany]);

    return (
        <CompanyContext.Provider value={{ company, loading, refreshCompany }}>
            {children}
        </CompanyContext.Provider>
    );
};
