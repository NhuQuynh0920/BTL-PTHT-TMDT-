import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext.jsx';
import ProductReviews from '../components/ProductReviews.jsx';
import './ProductPage.css';

const CATEGORY_MAP = {
  'TraSua': 'Trà Sữa',
  'TraTraiCay': 'Trà Trái Cây',
  'CaPhe': 'Cà Phê',
  'Khac': 'Khác'
};

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Customization states
  const [size, setSize] = useState('M');
  const [sugarLevel, setSugarLevel] = useState('100%');
  const [iceLevel, setIceLevel] = useState('Bình thường');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [note, setNote] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        
        // Setup defaults based on product data
        setSize('S'); // Default is always S (base price)
        if (data.sugarLevels && data.sugarLevels.length > 0) setSugarLevel(data.sugarLevels[data.sugarLevels.includes('100%') ? data.sugarLevels.indexOf('100%') : 0]);
        if (data.iceLevels && data.iceLevels.length > 0) setIceLevel(data.iceLevels[data.iceLevels.includes('Bình thường') ? data.iceLevels.indexOf('Bình thường') : 0]);
        
        setLoading(false);
      } catch (err) {
        setError(err.response && err.response.data.message ? err.response.data.message : err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleToppingChange = (toppingName) => {
    setSelectedToppings(prev => 
      prev.includes(toppingName) 
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    // Nếu price gốc bằng 0 (do nhập liệu cũ), lấy giá của size đầu tiên làm giá base
    const basePrice = product.price || (product.sizes && product.sizes.length > 0 ? product.sizes[0].price : 0);
    let total = basePrice;
    
    if (size === 'M') total += 5000;
    if (size === 'L') total += 10000;
    
    selectedToppings.forEach(tName => {
      const t = product.toppings.find(t => t.name === tName);
      if (t) total += t.price;
    });
    
    return total * qty;
  };

  const addToCartHandler = () => {
    const finalQty = Number(qty) || 1;
    const unitPrice = calculateTotalPrice() / finalQty;
    addToCart({ ...product, price: unitPrice }, finalQty, size, sugarLevel, iceLevel, selectedToppings, note);
    navigate('/cart');
  };

  const refreshProductAfterReview = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2 className="text-center mt-10">Đang tải...</h2>;
  if (error) return <h2 className="text-center mt-10" style={{ color: 'red' }}>{error}</h2>;
  if (!product) return <h2 className="text-center mt-10">Không tìm thấy sản phẩm</h2>;

  return (
    <div className="product-page">
      {/* Breadcrumb full-width (Đồng bộ với MenuProductsPage) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1.25rem 2rem', background: '#fff',
        borderBottom: '1px solid #ede0d4', fontSize: '0.85rem',
        color: '#9e8a78'
      }}>
        <Link 
          to={product.category ? `/menu/products?category=${product.category}` : "/menu"} 
          style={{ 
            fontWeight: '600', color: '#e05c00', textDecoration: 'none',
            transition: 'opacity 0.2s'
          }} 
          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} 
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          &larr; Quay lại danh mục
        </Link>
        <span style={{ color: '#ccc' }}>/</span>
        <span style={{ color: '#4a3c34', fontWeight: '500' }}>
          {CATEGORY_MAP[product.category] || product.category}
        </span>
      </div>
      
      {/* Container giới hạn chiều rộng để căn giữa đồng bộ với MenuProductsPage */}
      <div style={{ maxWidth: '1260px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      
      <div className="product-details-container">
        <div className="product-image-col">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info-col">
          <h2 className="product-name">{product.name}</h2>
          <div className="product-rating-large" style={{ color: '#FFD700', marginBottom: '10px', fontSize: '1.2rem' }}>
             {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
             <span style={{ fontSize: '1rem', color: '#666', marginLeft: '5px' }}>({product.numReviews} đánh giá)</span>
          </div>
          <p className="product-category">{CATEGORY_MAP[product.category] || product.category}</p>
          <p className="product-price-large">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotalPrice())}
          </p>
          {!product.isAvailable && (
            <div className="status-badge" style={{ display: 'inline-block', backgroundColor: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2', padding: '6px 15px', borderRadius: '30px', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem' }}>
              ⚠️ Tạm hết món hôm nay
            </div>
          )}
          <p className="product-description">{product.description}</p>
          
          {/* Customization Options */}
          <div className="customizations">
            <div className="custom-group">
              <h4>Chọn Size</h4>
              <div className="options-flex">
                <label className={`custom-radio ${size === 'S' ? 'active' : ''}`}>
                  <input type="radio" value="S" checked={size === 'S'} onChange={(e) => setSize(e.target.value)} />
                  S
                </label>
                {product.sizes?.filter(s => s.size !== 'S').map(sObj => (
                  <label key={sObj._id || sObj.size} className={`custom-radio ${size === sObj.size ? 'active' : ''}`}>
                    <input type="radio" value={sObj.size} checked={size === sObj.size} onChange={(e) => setSize(e.target.value)} />
                    {sObj.size} {sObj.size === 'M' ? '(+5.000đ)' : sObj.size === 'L' ? '(+10.000đ)' : ''}
                  </label>
                ))}
              </div>
            </div>

            <div className="custom-group">
              <h4>Mức Đường</h4>
              <div className="options-flex">
                {product.sugarLevels?.map(s => (
                  <label key={s} className={`custom-radio ${sugarLevel === s ? 'active' : ''}`}>
                    <input type="radio" value={s} checked={sugarLevel === s} onChange={(e) => setSugarLevel(e.target.value)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div className="custom-group">
              <h4>Mức Đá</h4>
              <div className="options-flex">
                {product.iceLevels?.map(i => (
                  <label key={i} className={`custom-radio ${iceLevel === i ? 'active' : ''}`}>
                    <input type="radio" value={i} checked={iceLevel === i} onChange={(e) => setIceLevel(e.target.value)} />
                    {i}
                  </label>
                ))}
              </div>
            </div>

            {product.toppings && product.toppings.length > 0 && (
               <div className="custom-group">
                <h4>Topping (Ăn kèm)</h4>
                <div className="options-flex">
                  {product.toppings.map(t => (
                    <label key={t.name} className={`custom-checkbox ${selectedToppings.includes(t.name) ? 'active' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedToppings.includes(t.name)} 
                        onChange={() => handleToppingChange(t.name)} 
                      />
                      {t.name} (+{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(t.price)})
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="custom-group">
              <h4>Ghi chú thêm</h4>
              <textarea 
                className="note-input"
                placeholder="Ví dụ: Lấy ít trân châu, không lấy ống hút..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <div className="add-to-cart-box">
            <div className="qty-selector" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontWeight: '600', color: '#475569' }}>Số lượng:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', height: '42px', background: '#fff' }}>
                <button 
                  onClick={() => setQty(Math.max(1, Number(qty) - 1))} 
                  disabled={!product.isAvailable || Number(qty) <= 1}
                  style={{ width: '40px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: (Number(qty) <= 1) ? '#cbd5e1' : '#64748b', cursor: (!product.isAvailable || Number(qty) <= 1) ? 'not-allowed' : 'pointer', fontSize: '1.2rem', fontWeight: 'bold', borderRight: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                >
                  −
                </button>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={qty} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, ''); // Chỉ cho phép nhập số
                    if (val === '') setQty('');
                    else setQty(Math.max(1, parseInt(val, 10) || 1));
                  }}
                  disabled={!product.isAvailable}
                  style={{ width: '60px', height: '100%', textAlign: 'center', padding: '0', border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent', fontWeight: '700', color: '#1e293b', fontSize: '1rem' }}
                />
                <button 
                  onClick={() => setQty(Number(qty) + 1)} 
                  disabled={!product.isAvailable}
                  style={{ width: '40px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b', cursor: !product.isAvailable ? 'not-allowed' : 'pointer', fontSize: '1.2rem', fontWeight: 'bold', borderLeft: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              className="btn btn-primary add-to-cart-btn"
              onClick={addToCartHandler}
              disabled={!product.isAvailable}
              style={{ 
                backgroundColor: !product.isAvailable ? '#ccc' : '',
                cursor: !product.isAvailable ? 'not-allowed' : 'pointer',
                opacity: !product.isAvailable ? 0.7 : 1
              }}
            >
              {product.isAvailable ? 'Thêm vào giỏ' : 'Tạm hết món'}
            </button>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} onReviewDataChanged={refreshProductAfterReview} />
      </div>
    </div>
  );
};

export default ProductPage;
