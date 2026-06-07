import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PromoPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we've shown the popup in this session
    const hasSeenPromo = sessionStorage.getItem('hasSeenPromo');
    
    if (!hasSeenPromo) {
      // Delay showing the popup slightly for a better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenPromo', 'true');
  };

  const handleBuyNow = () => {
    closePopup();
    navigate('/menu');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative bg-white rounded-2xl w-full max-w-sm sm:max-w-md mx-auto overflow-hidden shadow-2xl animate-scaleUp transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full text-gray-800 shadow-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Banner Image */}
        <div className="relative w-full aspect-[4/5] sm:aspect-square bg-orange-100 flex items-center justify-center overflow-hidden">
           <img 
              src="/images/promo_banner.png" 
              alt="Sale 50% MoRa Tea" 
              className="w-full h-full object-cover"
              onError={(e) => {
                 // Fallback if image fails to load
                 e.target.src = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80';
              }}
           />
           
           {/* Fallback Overlay (just in case the image is very plain) */}
           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20 flex flex-col justify-end text-center">
              <span className="bg-orange-500 text-white text-xs font-black uppercase tracking-wider py-1 px-3 rounded-full self-center mb-3">
                 Duy nhất hôm nay
              </span>
              <h2 className="text-white text-2xl sm:text-3xl font-black mb-2 leading-tight drop-shadow-md">
                 SALE ĐẾN 50%
                 <br />+ VOUCHER 40%
              </h2>
              <p className="text-gray-200 text-xs sm:text-sm mb-6 drop-shadow">
                 Áp dụng cho tất cả các loại trà sữa trân châu đường đen và các món mới
              </p>
              
              <button 
                 onClick={handleBuyNow}
                 className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                 MUA NGAY
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                 </svg>
              </button>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </div>
  );
};

export default PromoPopup;
