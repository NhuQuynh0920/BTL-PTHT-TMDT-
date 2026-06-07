import { useState, useEffect } from 'react';

const CheckoutTime = ({ deliveryTime, setDeliveryTime }) => {
  const [timeType, setTimeType] = useState(deliveryTime === 'immediate' ? 'immediate' : 'scheduled');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (timeType === 'immediate') {
      setDeliveryTime('immediate');
    } else {
      setDeliveryTime(selectedTime ? `Hẹn giờ: ${selectedTime.replace('T', ' ')}` : 'scheduled');
    }
  }, [timeType, selectedTime, setDeliveryTime]);

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-50 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-black text-gray-800">Thời gian giao hàng</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className={`relative flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${timeType === 'immediate' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
          <input 
            type="radio" 
            name="time" 
            className="sr-only"
            checked={timeType === 'immediate'}
            onChange={() => setTimeType('immediate')}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-bold">Giao ngay</span>
          {timeType === 'immediate' && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full text-white flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
          )}
        </label>
        
        <label className={`relative flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all border-2 ${timeType === 'scheduled' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
          <input 
            type="radio" 
            name="time" 
            className="sr-only"
            checked={timeType === 'scheduled'}
            onChange={() => setTimeType('scheduled')}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-bold">Hẹn giờ</span>
          {timeType === 'scheduled' && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full text-white flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
          )}
        </label>
      </div>

      {timeType === 'scheduled' && (
        <div className="mt-5 animate-fadeIn p-5 border-2 border-orange-100 bg-orange-50/50 rounded-2xl">
          <label className="block text-[11px] font-black uppercase tracking-widest text-orange-800 mb-3">
            Thời gian nhận hàng mong muốn
          </label>
          <div className="relative">
            <input 
              type="datetime-local" 
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-white border-2 border-orange-200 text-slate-800 text-base font-bold rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 block p-4 pl-12 outline-none transition-all cursor-pointer hover:border-orange-300 shadow-sm"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
        </div>
        <span className="text-blue-700 text-sm font-medium">
          {timeType === 'immediate' 
            ? 'Tài xế sẽ giao hàng trong khoảng 15-30 phút tới' 
            : 'Đơn hàng sẽ được chuẩn bị và giao đúng giờ bạn chọn'}
        </span>
      </div>
    </div>
  );
};

export default CheckoutTime;
