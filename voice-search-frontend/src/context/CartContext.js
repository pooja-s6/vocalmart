import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // client id for anonymous carts
  const clientIdKey = 'vocalmart_client';
  const getClientId = () => {
    try {
      let id = localStorage.getItem(clientIdKey);
      if (!id) {
        id = Math.random().toString(36).slice(2, 10);
        localStorage.setItem(clientIdKey, id);
      }
      return id;
    } catch {
      return 'guest';
    }
  };

  // load cart from server (public endpoint) or fallback to saved cart
  useEffect(() => {
    const clientId = getClientId();
    fetch(`${API_BASE}/api/cart/public/${clientId}`)
      .then(r => r.json())
      .then((json) => {
        if (json && json.success && Array.isArray(json.data)) {
          const mapped = json.data.map(i => ({
            id: i.product?.id || i.productId,
            name: i.product?.title || i.product?.name || '',
            price: i.product?.price || 0,
            category: i.product?.category || '',
            imageUrl: (i.product?.images && i.product.images[0]) || i.product?.imageUrl || '',
            quantity: i.quantity,
          }));
          setCart(mapped);
          localStorage.setItem('vocalmart_cart', JSON.stringify(mapped));
        } else {
          const savedCart = localStorage.getItem('vocalmart_cart');
          if (savedCart) setCart(JSON.parse(savedCart));
        }
      })
      .catch(() => {
        const savedCart = localStorage.getItem('vocalmart_cart');
        if (savedCart) setCart(JSON.parse(savedCart));
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('vocalmart_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    const clientId = getClientId();
    try {
      const resp = await fetch(`${API_BASE}/api/cart/public/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, productId: product.id, quantity: 1 }),
      });
      const json = await resp.json();
      if (json.success) {
        const mapped = json.data.map(i => ({
          id: i.product?.id || i.productId,
          name: i.product?.title || i.product?.name || '',
          price: i.product?.price || 0,
          category: i.product?.category || '',
          imageUrl: (i.product?.images && i.product.images[0]) || i.product?.imageUrl || '',
          quantity: i.quantity,
        }));
        setCart(mapped);
        return;
      }
    } catch (e) {
      // fall back to local update
    }
    // fallback: local update
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId) => {
    const clientId = getClientId();
    try {
      const resp = await fetch(`${API_BASE}/api/cart/public/${clientId}/${productId}`, { method: 'DELETE' });
      const json = await resp.json();
      if (json.success) {
        const mapped = json.data.map(i => ({
          id: i.product?.id || i.productId,
          name: i.product?.title || i.product?.name || '',
          price: i.product?.price || 0,
          category: i.product?.category || '',
          imageUrl: (i.product?.images && i.product.images[0]) || i.product?.imageUrl || '',
          quantity: i.quantity,
        }));
        setCart(mapped);
        return;
      }
    } catch (e) {
      // ignore
    }
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    const clientId = getClientId();
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      const resp = await fetch(`${API_BASE}/api/cart/public/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, productId, quantity }),
      });
      const json = await resp.json();
      if (json.success) {
        const mapped = json.data.map(i => ({
          id: i.product?.id || i.productId,
          name: i.product?.title || i.product?.name || '',
          price: i.product?.price || 0,
          category: i.product?.category || '',
          imageUrl: (i.product?.images && i.product.images[0]) || i.product?.imageUrl || '',
          quantity: i.quantity,
        }));
        setCart(mapped);
        return;
      }
    } catch (e) {
      // ignore
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    const clientId = getClientId();
    try {
      // delete each item on server
      const current = [...cart];
      await Promise.all(current.map(it => fetch(`${API_BASE}/api/cart/public/${clientId}/${it.id}`, { method: 'DELETE' })));
    } catch (_) {
      // ignore
    }
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
