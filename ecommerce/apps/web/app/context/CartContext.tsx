"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// --------------------
// 📦 Types
// --------------------
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
  prescriptionImage?: string;
};

type CartContextType = {
  cart: CartItem[];
  totalItems: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addPrescription: (id: string, image: string) => void;
  clearCart: () => void;
};

// --------------------
// 🧠 Context
// --------------------
const CartContext = createContext<CartContextType | undefined>(undefined);

// --------------------
// 🌐 Provider
// --------------------
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Total quantity of items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add item or increase quantity
  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove item completely
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  // Update quantity
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

  // Attach prescription
  const addPrescription = (id: string, image: string) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, prescriptionImage: image } : i
      )
    );
  };

  // Clear cart
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
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
