import { state, elements } from '../core/config.js';

export const updateCartButtons = () => {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        const itemId = button.getAttribute('data-id') || 
                      button.getAttribute('data-title').toLowerCase().replace(/\s+/g, '-');
        const isInCart = state.cart.some(item => item.id === itemId);
        
        if (isInCart) {
            button.disabled = true;
            button.textContent = state.currentLanguage === 'id' ? 'Di Keranjang' : 'In Cart';
        } else {
            const text = state.currentLanguage === 'id' ? 
                button.getAttribute('data-lang-id') : 
                button.getAttribute('data-lang-en');
            button.textContent = text || 'Add to Cart';
            button.disabled = false;
        }
    });
};

export const updateCart = () => {
    if (!elements.cartItemsContainer) return;
    
    elements.cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    state.cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="https://placeholder.pics/svg/100x100" alt="${item.title}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <button class="remove-item" data-index="${index}">✕</button>
            </div>
        `;
        
        elements.cartItemsContainer.appendChild(cartItem);
    });
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const isPlus = this.classList.contains('plus');
            
            if (isPlus) {
                state.cart[index].quantity++;
            } else {
                if (state.cart[index].quantity > 1) {
                    state.cart[index].quantity--;
                } else {
                    state.cart.splice(index, 1);
                }
            }
            
            updateCart();
            updateCartButtons();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            state.cart.splice(index, 1);
            updateCart();
            updateCartButtons();
        });
    });
    
    if (elements.cartTotal) elements.cartTotal.textContent = total.toFixed(2);
    if (elements.cartCount) {
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        elements.cartCount.textContent = totalItems;
    }
};

export const toggleCart = () => {
    elements.cartSidebar.classList.toggle('active');
    state.isModalOpen = elements.cartSidebar.classList.contains('active');
    document.body.style.overflow = state.isModalOpen ? 'hidden' : '';
};

export const setupCart = () => {
    if (!elements.cartIcon || !elements.cartSidebar) return;
    
    elements.cartIcon.addEventListener('click', toggleCart);
    elements.cartClose?.addEventListener('click', toggleCart);
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const titleId = this.getAttribute('data-title-id') || title;
            const price = parseFloat(this.getAttribute('data-price'));
            const id = this.getAttribute('data-id') || title.toLowerCase().replace(/\s+/g, '-');
            
            const itemTitle = state.currentLanguage === 'id' && titleId ? titleId : title;
            
            const existingItem = state.cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.cart.push({ 
                    id,
                    title: itemTitle, 
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            updateCartButtons();
            
            this.disabled = true;
            this.textContent = state.currentLanguage === 'id' ? 'Di Keranjang' : 'In Cart';
        });
    });
};