import { useState, useEffect } from 'react';
import axios from 'axios';
import './PromotionBanner.css';

const PromotionBanner = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data } = await axios.get('/api/promotions');
        setPromotions(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPromotions();
  }, []);

  if (promotions.length === 0) return null;

  return (
    <div className="promo-banner-container">
      {promotions.map((promo) => (
        <div 
          key={promo._id} 
          className="promo-slide" 
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${promo.bannerImage})` }}
        >
          <div className="promo-content">
            <span className="promo-tag">{promo.discount}</span>
            <h2>{promo.title}</h2>
            <p>{promo.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromotionBanner;
