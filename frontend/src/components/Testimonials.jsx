const testimonials = [
  {
    name: 'Hoàng Linh',
    role: 'Content Creator',
    text: 'Trà sữa ở đây có vị nhẫn nhẹ của trà tươi, không quá ngọt gắt. Cảm nhận được sự chỉnh chu trong từng ly nước.',
    rating: 5,
  },
  {
    name: 'Minh Anh',
    role: 'Designer',
    text: 'Không gian website và cả quán đều quá đẹp. Menu đa dạng, đặc biệt là dòng trà trái cây rất thanh mát.',
    rating: 5,
  },
  {
    name: 'Quốc Bảo',
    role: 'Photographer',
    text: 'Ảnh sản phẩm sao thì nước ra y hệt vậy. Giao hàng nhanh và đóng gói rất cẩn thận, chuyên nghiệp.',
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="testimonials-section">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-tag">Khách hàng nói gì</span>
        <h2 className="section-title">Những lời &quot;ngọt ngào&quot; từ bạn</h2>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <div key={idx} className="testimonial-card">
            <div className="testi-quote">&quot;</div>
            <p className="testi-text">{t.text}</p>
            <div className="testi-stars">
              {[...Array(t.rating)].map((_, i) => <span key={i} className="star">★</span>)}
            </div>
            <div className="testi-footer">
              <h5 className="testi-name">{t.name}</h5>
              <span className="testi-role">{t.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
