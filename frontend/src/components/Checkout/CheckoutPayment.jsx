

const CheckoutPayment = ({ selectedMethod, setSelectedMethod }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 mt-6">
      <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
        Phương thức thanh toán
      </h3>
      
      <div className="space-y-4">
        {/* COD Card */}
        <div 
          onClick={() => setSelectedMethod('COD')}
          className={`relative p-5 rounded-2xl cursor-pointer transition-all border-2 overflow-hidden group ${
            selectedMethod === 'COD' 
              ? 'border-orange-500 bg-orange-50/50 shadow-md' 
              : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selectedMethod === 'COD' ? 'bg-orange-500 text-white' : 'bg-green-100 text-green-600'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-black text-gray-800 text-base mb-1">Thanh toán khi nhận hàng</div>
              <div className="text-xs font-medium text-gray-500">Thanh toán bằng tiền mặt sau khi nhận đơn</div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedMethod === 'COD' ? 'border-orange-500 bg-orange-500' : 'border-gray-300 group-hover:border-orange-300'
            }`}>
              {selectedMethod === 'COD' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
            </div>
          </div>
          {/* Active Indicator Line */}
          {selectedMethod === 'COD' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>}
        </div>

        {/* VNPAY Card */}
        <div 
          onClick={() => setSelectedMethod('VNPAY')}
          className={`relative p-5 rounded-2xl cursor-pointer transition-all border-2 overflow-hidden group ${
            selectedMethod === 'VNPAY' 
              ? 'border-blue-500 bg-blue-50/30 shadow-md' 
              : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              selectedMethod === 'VNPAY' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
            }`}>
              {/* VNPAY Logo or Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-black text-gray-800 text-base mb-1">Thanh toán qua VNPAY</div>
              <div className="text-xs font-medium text-gray-500">Thanh toán an toàn qua cổng VNPAY</div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedMethod === 'VNPAY' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 group-hover:border-blue-300'
            }`}>
              {selectedMethod === 'VNPAY' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
            </div>
          </div>
          
          {/* Active Indicator Line */}
          {selectedMethod === 'VNPAY' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;

