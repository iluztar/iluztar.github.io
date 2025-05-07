import { elements } from '../core/config.js';

export const updateThemeIcons = (theme) => {
    if (theme === 'dark') {
        elements.themeIconLight?.classList.add('hidden');
        elements.themeIconDark?.classList.remove('hidden');
        elements.mobileThemeIconLight?.classList.add('hidden');
        elements.mobileThemeIconDark?.classList.remove('hidden');
    } else {
        elements.themeIconLight?.classList.remove('hidden');
        elements.themeIconDark?.classList.add('hidden');
        elements.mobileThemeIconLight?.classList.remove('hidden');
        elements.mobileThemeIconDark?.classList.add('hidden');
    }
};

export const setupThemeSwitcher = () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);
    
    const switchTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    };
    
    [elements.themeIconLight, elements.themeIconDark, 
     elements.mobileThemeIconLight, elements.mobileThemeIconDark].forEach(icon => {
        if (icon) icon.addEventListener('click', switchTheme);
    });
};