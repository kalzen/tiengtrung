import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const applyTheme = (appearance: Appearance) => {
    // Force light theme always
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = () => {
    const currentAppearance = localStorage.getItem('appearance') as Appearance;
    applyTheme(currentAppearance || 'system');
};

export function initializeTheme() {
    // Always force light theme
    applyTheme('light');
    localStorage.setItem('appearance', 'light');
    setCookie('appearance', 'light');
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = useCallback((mode: Appearance) => {
        // Always force light theme regardless of input
        setAppearance('light');
        localStorage.setItem('appearance', 'light');
        setCookie('appearance', 'light');
        applyTheme('light');
    }, []);

    useEffect(() => {
        // Always set to light theme
        updateAppearance('light');
    }, [updateAppearance]);

    return { appearance: 'light', updateAppearance } as const;
}
