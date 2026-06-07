import { createContext, useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  // Use a unique key for each user, fallback to guest if not logged in
  const cartKey = user ? `cartItems_${user._id}` : 'cartItems_guest';

  const [cartItems, setCartItems] = useState([]);

  // Load the specific user's cart whenever the user changes (login/logout)
  useEffect(() => {
    const items = localStorage.getItem(cartKey);
    if (items) {
      setCartItems(JSON.parse(items));
    } else {
      setCartItems([]);
    }
  }, [cartKey]);

  const addToCart = (product, qty, size, sugarLevel, iceLevel, toppings, note) => {
    const cartItemId = `${product._id}-${size}-${sugarLevel}-${iceLevel}-${toppings ? [...toppings].sort().join('-') : ''}`;
    const existItem = cartItems.find((x) => x.cartItemId === cartItemId);
    let newCartItems;

    if (existItem) {
      newCartItems = cartItems.map((x) =>
        x.cartItemId === cartItemId ? { ...x, qty: x.qty + Number(qty) } : x
      );
    } else {
      newCartItems = [...cartItems, {
        cartItemId,
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: Number(qty),
        size,
        sugarLevel,
        iceLevel,
        toppings,
        note
      }];
    }

    setCartItems(newCartItems);
    localStorage.setItem(cartKey, JSON.stringify(newCartItems));
  };

  const removeFromCart = (cartItemId) => {
    const newCartItems = cartItems.filter((x) => x.cartItemId !== cartItemId);
    setCartItems(newCartItems);
    localStorage.setItem(cartKey, JSON.stringify(newCartItems));
  };

  const changeQty = (cartItemId, newQty) => {
      const newCartItems = cartItems.map((x) => 
          x.cartItemId === cartItemId ? { ...x, qty: Number(newQty) } : x
      );
      setCartItems(newCartItems);
      localStorage.setItem(cartKey, JSON.stringify(newCartItems));
  }

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  }, [cartKey]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    changeQty,
    clearCart
  }), [cartItems, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
