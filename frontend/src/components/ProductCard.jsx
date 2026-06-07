import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';
import './ProductCard.css';

const CATEGORY_MAP = {
  'TraSua': 'Trà Sữa',
  'TraTraiCay': 'Trà Trái Cây',
  'CaPhe': 'Cà Phê',
  'Khac': 'Khác'
};

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    const size = 'S';
    
    const sugarLevel = product.sugarLevels?.includes('100%') ? '100%' : (product.sugarLevels?.[0] || '100%');
    const iceLevel = product.iceLevels?.includes('Bình thường') ? 'Bình thường' : (product.iceLevels?.[0] || 'Bình thường');
    
    const basePrice = product.price || (product.sizes && product.sizes.length > 0 ? product.sizes[0].price : 0);
    let unitPrice = basePrice;
    if (size === 'M') unitPrice += 5000;
    if (size === 'L') unitPrice += 10000;

    addToCart({ ...product, price: unitPrice }, 1, size, sugarLevel, iceLevel, [], '');
  };

  const displayPrice = product.price || (product.sizes && product.sizes.length > 0 ? product.sizes[0].price : 0);
  const priceVND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(displayPrice);

  return (
    <article className="product-card">
      {/* Image */}
      <Link to={`/product/${product._id}`} className={`product-img-link ${!product.isAvailable ? 'unavailable' : ''}`}>
        <div className="product-img-wrap">
          <img src={product.image} alt={product.name} className="product-img" />
          {!product.isAvailable && (
            <div className="product-unavailable-overlay">
              <span>HẾT MÓN</span>
            </div>
          )}
        </div>
        <span className="product-badge-cat">{CATEGORY_MAP[product.category] || product.category}</span>
      </Link>

      {/* Body */}
      <div className="product-body">
        <Link to={`/product/${product._id}`} className="product-name">
          {product.name}
        </Link>

        {product.description && (
          <p className="product-desc-short">{product.description}</p>
        )}

        <div className="product-footer">
          <span className="product-price">{priceVND}</span>
          <button 
            className="btn-add-cart" 
            onClick={handleAddToCart} 
            aria-label="Thêm vào giỏ"
            disabled={!product.isAvailable}
            style={{ 
              opacity: !product.isAvailable ? 0.5 : 1,
              cursor: !product.isAvailable ? 'not-allowed' : 'pointer'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {product.isAvailable ? 'Thêm vào giỏ' : 'Hết món'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
