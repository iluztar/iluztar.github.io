import { elements } from '../core/config.js';

export const initElements = () => {
    elements.themeIconLight = document.getElementById('theme-icon-light');
    elements.themeIconDark = document.getElementById('theme-icon-dark');
    elements.mobileThemeIconLight = document.getElementById('mobile-theme-icon-light');
    elements.mobileThemeIconDark = document.getElementById('mobile-theme-icon-dark');
    elements.burger = document.querySelector('.menu-burger');
    elements.mobileMenu = document.querySelector('.mobile-menu');
    elements.mobileMenuClose = document.querySelector('.mobile-menu-close');
    elements.cartIcon = document.querySelector('.cart-icon');
    elements.cartSidebar = document.querySelector('.cart-sidebar');
    elements.cartClose = document.querySelector('.cart-close');
    elements.cartItemsContainer = document.querySelector('.cart-items');
    elements.cartTotal = document.querySelector('.cart-total-amount');
    elements.cartCount = document.querySelector('.cart-count');
    elements.lightbox = document.getElementById('lightbox');
    elements.lightboxImg = document.querySelector('.lightbox-content img');
    elements.lightboxClose = document.querySelector('.lightbox-close');
    elements.lightboxPrev = document.querySelector('.lightbox-prev');
    elements.lightboxNext = document.querySelector('.lightbox-next');
    elements.lightboxCounter = document.querySelector('.lightbox-counter');
    elements.languageSelectors = document.querySelectorAll('.language-selector');
    elements.languageCurrents = document.querySelectorAll('.language-current');
    elements.scrollLinks = document.querySelectorAll('.scroll, .scroll-link');
    elements.controlNavItems = document.querySelectorAll('.line-nav li');
    elements.headerNavLinks = document.querySelectorAll('nav.header-nav ul li a, .mobile-menu a');
    elements.scrollDown = document.querySelector('.scroll-down');
};