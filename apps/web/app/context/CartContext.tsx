'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

// --------------------
// 📦 Types
// --------------------
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
  prescriptionImage?: string; // stored as base64
};

type CartContextType = {
  cart: CartItem[];
  totalItems: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addPrescription: (id: string, file: File) => void;
  clearCart: () => void;
};

// --------------------
// 🌐 Context
// --------------------
const CartContext = createContext<CartContextType | undefined>(undefined);

// --------------------
// 🧠 Provider
// --------------------
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dimples-cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dimples-cart', JSON.stringify(cart));
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity } : i
        )
      );
    }
  };

  const addPrescription = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString();
      if (!base64) return;

      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, prescriptionImage: base64 } : item
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        addPrescription,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --------------------
// ⚙️ Hook
// --------------------
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
