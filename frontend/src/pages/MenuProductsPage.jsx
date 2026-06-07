import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import './MenuProductsPage.css';

import { CATEGORY_FILTERS, CATEGORY_LABELS } from '../constants/categories.js';


const unique = (arr) => {
  const seen = new Set();
  return arr.filter(p => { if (seen.has(p.name)) return false; seen.add(p.name); return true; });
};

const MenuProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params   = new URLSearchParams(location.search);
  const cat      = params.get('category');
  const search   = params.get('search');

  useEffect(() => {
    axios.get('/api/products').then(({ data }) => {
      let list = data;
      
      if (cat) {
        const fn = CATEGORY_FILTERS[cat];
        if (fn) list = list.filter(fn);
      }
      
      if (search) {
        const lowerSearch = search.toLowerCase();
        list = list.filter(p => {
          const matchName = p.name.toLowerCase().includes(lowerSearch);
          const catLabel = (CATEGORY_LABELS[p.category] || '').toLowerCase();
          const subCatLabel = (CATEGORY_LABELS[p.subCategory] || '').toLowerCase();
          return matchName || catLabel.includes(lowerSearch) || subCatLabel.includes(lowerSearch);
        });
      }
      
      setProducts(unique(list));
      setLoading(false);
    }).catch(err => { setError(err.message); setLoading(false); });
  }, [cat, search]);

  return (
    <div className="mp-page">
      {/* Breadcrumb */}
      <div className="mp-breadcrumb">
        <button onClick={() => navigate('/menu')} className="mp-back">
          ← Quay lại Menu
        </button>
        <span className="mp-breadcrumb-sep">/</span>
        <span className="mp-breadcrumb-current">{search ? 'Tìm kiếm' : (CATEGORY_LABELS[cat] || 'Tất Cả')}</span>
      </div>

      <div className="mp-container">
        <h1 className="mp-title">{search ? `Kết quả tìm kiếm: "${search}"` : (CATEGORY_LABELS[cat] || 'Tất Cả Sản Phẩm')}</h1>
        <p className="mp-count">{products.length} sản phẩm</p>

        {loading ? (
          <div className="mp-grid skeleton-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="mp-skeleton" />)}
          </div>
        ) : error ? (
          <p className="mp-error">{error}</p>
        ) : products.length === 0 ? (
          <div className="mp-empty">
            <p>Chưa có sản phẩm nào.</p>
            <button onClick={() => navigate('/menu')} className="mp-back-btn">Xem tất cả danh mục</button>
          </div>
        ) : (
          <div className="mp-grid">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuProductsPage;
