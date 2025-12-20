import { createContext, useContext, useState } from 'react';

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

  const addToCart = (item) => {
    setCartItems(prev => [
      ...prev,
      {
        ...item,
        id: crypto.randomUUID(), // safer than Date.now()
        tickets: item.tickets ?? 1,
        totalPrice: item.ticketPrice * (item.tickets ?? 1),
      }
    ]);
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
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

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.tickets,
    0
  );

  const grandTotal = cartItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

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
