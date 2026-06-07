import { useNavigate } from 'react-router-dom';
import './MenuPage.css';

const CATEGORIES = [
  {
    key: 'TraSua',
    label: 'TRÀ SỮA',
    desc: 'Hương vị ngọt ngào, béo ngậy của những ly trà sữa thơm lừng. Từ Milk Tea truyền thống đến Macchiato phủ kem béo, MoRa Tea mang đến những trải nghiệm vị giác không thể quên.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85',
    bg: '#2d1a0e',
    textColor: '#fff',
    ctaBorder: '#fff',
    align: 'left',
  },
  {
    key: 'TraTraiCay',
    label: 'TRÀ TRÁI CÂY',
    desc: 'Hương vị tự nhiên, thơm ngon của Trà Việt với phong cách hiện đại. Những ly trà trái cây tươi mát kết hợp cùng lá trà hảo hạng giúp bạn tận hưởng một cảm giác khoan khoái, tươi mới.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900&q=85',
    bg: '#e8f5e9',
    textColor: '#1b5e20',
    ctaBorder: '#1b5e20',
    align: 'right',
  },
  {
    key: 'CaPhe',
    label: 'CÀ PHÊ',
    desc: 'Sự kết hợp hoàn hảo giữa hạt cà phê Robusta & Arabica thượng hạng được trồng trên những vùng cao nguyên Việt Nam bạt ngàn. MoRa Tea tự hào mang đến những ly cà phê đậm đà và tinh tế.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=85',
    bg: '#fdf3e7',
    textColor: '#2d1a0e',
    ctaBorder: '#e05c00',
    align: 'left',
  },
  {
    key: 'Khac',
    label: 'KHÁC',
    desc: 'Sẽ càng ngon miệng hơn khi bạn kết hợp đồ uống với những chiếc bánh ngọt thơm lừng được làm từ những nguyên liệu chuẩn nhất. Hoàn hảo cho mọi buổi tụ tập.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=900&q=85',
    bg: '#fff8e1',
    textColor: '#5d3a00',
    ctaBorder: '#5d3a00',
    align: 'right',
  },
];

const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-page">
      {CATEGORIES.map((cat) => (
        <section
          key={cat.key}
          className={`menu-cat-section align-${cat.align}`}
          style={{ background: cat.bg }}
        >
          {/* Text side */}
          <div className="cat-text" style={{ color: cat.textColor }}>
            <h2 className="cat-label" style={{ color: cat.textColor }}>{cat.label}</h2>
            <p className="cat-desc">{cat.desc}</p>
            <button
              className="cat-cta"
              style={{ borderColor: cat.ctaBorder, color: cat.ctaBorder }}
              onClick={() => navigate(`/menu/products?category=${cat.key}`)}
            >
              KHÁM PHÁ THÊM
            </button>
          </div>

          {/* Image side */}
          <div className="cat-img-wrap">
            <img src={cat.image} alt={cat.label} className="cat-img" />
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuPage;
