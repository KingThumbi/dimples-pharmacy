"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useContext } from "react";

// Optional: if you have CartContext
// import { CartContext } from "@/context/CartContext";

// Mock fallback context if not available
const useCart = () => {
  return {
    totalItems: 0, // fallback value
  };
};

const CartButton = () => {
  // const { totalItems } = useContext(CartContext); // use this if you have CartContext
  const { totalItems } = useCart(); // fallback

  return (
    <Link href="/cart" className="relative group">
      <ShoppingCart className="w-6 h-6 hover:text-accent transition" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
