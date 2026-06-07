import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import HeroSlider from '../components/HeroSlider.jsx';
import Testimonials from '../components/Testimonials.jsx';
import PromoPopup from '../components/PromoPopup.jsx';
import { useProducts } from '../hooks/useProducts.js';
import './HomePage.css';

const FEATURES = [
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>,
    title: 'Nguyên liệu tự nhiên', desc: '100% trà & topping tươi, không phẩm màu',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    title: 'Pha chế nhanh chóng', desc: 'Phục vụ trong vòng 5 phút',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="21" y2="21" /><line x1="4" x2="20" y1="14" y2="14" /><line x1="4" x2="20" y1="7" y2="7" /><polyline points="9 21 9 14 9 7 9 2 15 2 15 7 15 14 15 21" /></svg>,
    title: 'Tùy chỉnh theo ý thích', desc: 'Level đường, đá, topping tùy chọn',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" /><path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>,
    title: 'Giao hàng tận nơi', desc: 'Miễn phí trong bán kính 3km',
  },
];

const HomePage = () => {
  const { products, loading, error } = useProducts();
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);

  // Auto-scroll product carousel
  useEffect(() => {
    if (!sliderRef.current || isHovered || products.length === 0) return;
    const id = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      el.scrollBy({ left: atEnd ? -el.scrollWidth : 320, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(id);
  }, [products, isHovered]);

  const slideLeft  = () => sliderRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  const slideRight = () => sliderRef.current?.scrollBy({ left:  320, behavior: 'smooth' });

  const featured = products.filter(p => p.isMustTry === true);

  return (
    <div className="home-page">
      <PromoPopup />
      <HeroSlider />

      {/* Features Strip */}
      <section className="features-strip">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <h4 className="feature-title">{f.title}</h4>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="menu-section" id="menu">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tag">SẢN PHẨM NỔI BẬT</span>
            <h2 className="section-title">Hương vị tinh túy từ Nhà MoRa</h2>
            <p className="section-subtitle">Khám phá bộ sưu tập thức uống đặc sắc được yêu thích nhất</p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : error ? (
            <p className="error-msg text-center">⚠️ {error}</p>
          ) : (
            <div
              className="product-slider-wrapper"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button className="prod-nav prev" onClick={slideLeft}>&#10094;</button>
              <div className="product-slider-track" ref={sliderRef}>
                {featured.length > 0 ? (
                  featured.map(product => (
                    <div key={product._id} className="prod-slide-item">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <p className="no-products text-center">Không tìm thấy sản phẩm nào.</p>
                )}
              </div>
              <button className="prod-nav next" onClick={slideRight}>&#10095;</button>
            </div>
          )}
        </div>
      </section>

      {/* Story Banner */}
      <section className="story-banner">
        <div className="container story-inner">
          <div className="story-text">
            <span className="story-tag">Câu chuyện của chúng tôi</span>
            <h2 className="story-heading">Từ niềm đam mê<br />đến thương hiệu</h2>
            <p className="story-body">
              MoRa Tea được sinh ra từ tình yêu với những tách trà thơm ngát và mong muốn mang lại những khoảnh khắc thư giãn cho mỗi người Việt. Mỗi công thức đều trải qua hàng trăm lần thử nghiệm để hoàn thiện.
            </p>
            <Link to="/blog" className="btn btn-dark story-btn">Đọc câu chuyện →</Link>
          </div>
          <div className="story-visual">
            <div className="story-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80"
                alt="MoRa Tea story"
                className="story-img"
              />
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
};

export default HomePage;
