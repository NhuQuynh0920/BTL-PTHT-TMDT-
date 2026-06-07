import { useState } from 'react';

const CheckoutVoucher = ({ appliedVoucher, setAppliedVoucher, onApply }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onApply(code);
      setCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Mã không hợp lệ');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedVoucher(null);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
      <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
        Mora Voucher
      </h3>

      {appliedVoucher ? (
        <div className="bg-green-50 p-5 rounded-2xl border-2 border-dashed border-green-200 flex justify-between items-center group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm text-2xl">🎟️</div>
             <div>
                <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Đã áp dụng mã</p>
                <div className="flex items-center gap-2">
                   <p className="font-black text-green-700 uppercase text-lg">{appliedVoucher.code}</p>
                   <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-black">-{new Intl.NumberFormat('vi-VN').format(appliedVoucher.discountAmount)}đ</span>
                </div>
             </div>
          </div>
          <button 
            onClick={handleRemove} 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-300 hover:text-red-400 hover:bg-red-50 transition-all shadow-sm"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Nhập mã ưu đãi..." 
              className="flex-1 px-5 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all shadow-inner uppercase placeholder:normal-case"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button 
              className={`px-8 py-4 rounded-2xl text-white font-black text-sm transition-all shadow-lg ${code ? 'bg-orange-500 shadow-orange-100 hover:bg-orange-600 active:scale-95' : 'bg-gray-200 cursor-not-allowed shadow-none'}`}
              disabled={!code || loading}
              onClick={handleApply}
            >
              {loading ? '...' : 'Áp dụng'}
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-wider ml-4 animate-shake">
               <span>⚠️</span> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutVoucher;
