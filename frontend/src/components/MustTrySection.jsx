import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard.jsx';
import './MustTrySection.css';

const MustTrySection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMustTry = async () => {
      try {
        const { data } = await axios.get('/api/products');
        const mustTryProducts = data.filter(p => p.isMustTry === true).slice(0, 4);
        setProducts(mustTryProducts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchMustTry();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <div className="must-try-section mt-10 mb-10">
      <div className="section-header">
        <h2>🔥 Must Try</h2>
        <p>Những thức uống được yêu thích nhất định phải thử một lần</p>
      </div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default MustTrySection;
