import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CheckoutRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const { data } = await axios.get('/api/products');
        // Random 4 products
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 4));
      } catch (err) {
        console.error("Error loading recommendations", err);
      }
    };
    fetchRecs();
  }, []);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-white p-4 mt-2">
      <h3 className="font-semibold text-gray-800 mb-3">Khách đặt các món này cũng đặt thêm</h3>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {recommendations.map((item) => (
          <div key={item._id} className="min-w-[120px] max-w-[120px] flex-shrink-0 border rounded overflow-hidden snap-start">
            <Link to={`/product/${item._id}`}>
               <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
               <div className="p-2">
                 <h4 className="text-xs font-medium text-gray-800 line-clamp-2 min-h-[32px]">{item.name}</h4>
                 <div className="text-orange-500 font-semibold text-sm mt-1">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                 </div>
               </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutRecommendations;
