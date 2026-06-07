const CheckoutTip = ({ tip, setTip }) => {
  const tipOptions = [2000, 5000, 10000, 20000];

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black text-gray-800 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
          Tip cho tài xế
        </h3>
        <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">Tùy chọn</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {tipOptions.map((val) => (
          <button 
            key={val} 
            onClick={() => setTip(tip === val ? 0 : val)}
            className={`px-5 py-3 rounded-2xl font-black text-sm transition-all border-2 ${tip === val ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'}`}
          >
            +{val/1000}k
          </button>
        ))}
        <div className="relative flex-1 min-w-[120px]">
           <input 
             type="number" 
             placeholder="Số khác..." 
             className="w-full px-4 py-3 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-orange-500 transition-all shadow-inner"
             value={tipOptions.includes(tip) || tip === 0 ? '' : tip}
             onChange={(e) => setTip(Number(e.target.value))}
           />
           <span className="absolute right-4 top-3 text-gray-300 font-bold text-xs uppercase">đ</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 font-bold mt-4 leading-relaxed italic">&quot;100% tiền tip sẽ được chuyển trực tiếp cho tài xế để cảm ơn sự hỗ trợ nhiệt tình.&quot;</p>
    </div>
  );
};

export default CheckoutTip;
