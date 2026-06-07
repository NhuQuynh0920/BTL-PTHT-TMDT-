import { useState, useEffect } from 'react';
import { getProducts } from '../services/productService.js';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (isMounted) {
          // Remove duplicates based on name, as requested previously
          const seen = new Set();
          const unique = data.filter(p => {
            if (seen.has(p.name)) return false;
            seen.add(p.name);
            return true;
          });
          setProducts(unique);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Lỗi tải danh sách sản phẩm');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
};
