const CheckoutOptions = ({ doorDelivery, setDoorDelivery, cutlery, setCutlery, note, setNote }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50">
      <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
        Ghi chú & Tùy chọn
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-orange-100 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">🏢</div>
            <div>
              <p className="text-sm font-black text-gray-800">Giao hàng tận cửa</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phí: Miễn phí</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={doorDelivery} onChange={(e) => setDoorDelivery(e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-orange-100 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">🍴</div>
            <div>
              <p className="text-sm font-black text-gray-800">Dụng cụ ăn uống</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bảo vệ môi trường</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={cutlery} onChange={(e) => setCutlery(e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
        </div>

        <div className="pt-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-2">Lời nhắn cho nhà hàng</p>
          <textarea 
            placeholder="Ví dụ: Ít đá, không lấy trân châu, gõ cửa khi đến..." 
            className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all min-h-[100px] shadow-inner"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutOptions;
