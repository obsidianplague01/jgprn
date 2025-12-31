// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const addToCart = (item) => {
    if (!item) return;

    const sanitizedItem = {
      ...item,
      id: crypto.randomUUID(),
      tickets: Math.max(1, Math.min(20, item.tickets ?? 1)),
      ticketPrice: Math.max(0, item.ticketPrice || 0),
      firstName: String(item.firstName || '').trim(),
      lastName: String(item.lastName || '').trim(),
      email: String(item.email || '').trim(),
      phone: String(item.phone || '').trim(),
      location: String(item.location || '').trim(),
      whatsapp: String(item.whatsapp || '').trim(),
    };

    sanitizedItem.totalPrice = sanitizedItem.ticketPrice * sanitizedItem.tickets;

    setCartItems(prev => [...prev, sanitizedItem]);
  };

  const removeFromCart = (itemId) => {
    if (!itemId) return;
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (!itemId || newQuantity < 1 || newQuantity > 20) return;

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              tickets: newQuantity,
              totalPrice: item.ticketPrice * newQuantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.tickets || 0), 0);
  const grandTotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  if (!isInitialized) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};