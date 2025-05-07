import { state } from '../core/config.js';

export const setupContactForm = () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = form.elements.name.value.trim();
        const email = form.elements.email.value.trim();
        const message = form.elements.message.value.trim();
        
        // Simple validation
        if (!name || !email || !message) {
            alert(state.currentLanguage === 'id' ? 'Harap isi semua bidang' : 'Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert(state.currentLanguage === 'id' ? 'Format email tidak valid' : 'Invalid email format');
            return;
        }
        
        // Simulate successful submission
        alert(state.currentLanguage === 'id' ? 
            'Pesan terkirim! Saya akan menghubungi Anda segera.' : 
            'Message sent! I will contact you soon.');
        
        form.reset();
    });
};