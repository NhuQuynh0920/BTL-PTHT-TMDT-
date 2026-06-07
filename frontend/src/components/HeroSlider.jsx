import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    eyebrow: 'Thức uống thượng hạng',
    title: <>Chạm đến hương vị<br /><em>trà sữa thuần khiết</em></>,
    desc: 'Mỗi ly MoRa Tea là hành trình từ những nguyên liệu chọn lọc đến bàn tay pha chế tỉ mỉ — mang đến trải nghiệm khó quên.',
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1920&q=80',
    btn1: 'Khám phá menu', link1: '#menu',
    btn2: 'Chuyện trà sữa →', link2: '/blog',
  },
  {
    id: 2,
    eyebrow: 'Trái cây nhiệt đới',
    title: <>Bùng nổ sảng khoái<br /><em>mát lạnh ngày hè</em></>,
    desc: 'Thưởng thức những ly trà hoa quả tươi ngon 100%, được ép lạnh giữ nguyên vitamin giúp bạn nạp đầy năng lượng.',
    img: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1920&q=80',
    btn1: 'Thử ngay', link1: '/menu/products?category=TraTraiCay',
    btn2: 'Xem chi tiết →', link2: '/menu/products?category=TraTraiCay',
  },
  {
    id: 3,
    eyebrow: 'Đậm đà hương vị Việt',
    title: <>Cà phê nguyên bản<br /><em>đánh thức giác quan</em></>,
    desc: 'Tuyển chọn từ những hạt cà phê Robusta ngon nhất Tây Nguyên, rang xay mộc mang đến hương vị đậm đà khó phai.',
    img: 'https://images.unsplash.com/photo-1461023058943-0708e5aff4ad?w=1920&q=80',
    btn1: 'Đặt Cà Phê', link1: '/menu?category=CaPhe',
    btn2: 'Về chúng tôi →', link2: '/blog',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));
  const next = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));

  return (
    <section className="hero">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`hero-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="hero-overlay" />
          <div className="container hero-content-wrapper">
            <div className="hero-content">
              <p className="hero-eyebrow">{slide.eyebrow}</p>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-desc">{slide.desc}</p>
              <div className="hero-cta">
                <a href={slide.link1} className="btn btn-primary hero-btn-main">{slide.btn1}</a>
                <Link to={slide.link2} className="btn btn-outline-light hero-btn-sec">{slide.btn2}</Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="slider-nav prev" onClick={prev}>&#10094;</button>
      <button className="slider-nav next" onClick={next}>&#10095;</button>
      <div className="slider-indicators">
        {slides.map((_, i) => (
          <button key={i} className={`indicator-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
      <div className="hero-scroll"><div className="hero-scroll-dot" /></div>
    </section>
  );
};

export default HeroSlider;
