
import { useSearchParams, Link } from 'react-router-dom';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const orderCode = searchParams.get('orderCode');
  const amount = searchParams.get('amount');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md w-full animate-fadeIn border border-gray-100 relative overflow-hidden">
        
        {status === 'success' ? (
          <>
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-2">Thanh toán thành công!</h1>
            <p className="text-sm font-medium text-gray-500 mb-8">
              Giao dịch qua VNPAY đã hoàn tất. Đơn hàng của bạn đang được pha chế!
            </p>
          </>
        ) : (
          <>
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-400 to-red-600"></div>
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-2">Thanh toán thất bại!</h1>
            <p className="text-sm font-medium text-gray-500 mb-8">
              Giao dịch của bạn đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán.
            </p>
          </>
        )}
        
        <div className="bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium text-sm">Mã đơn hàng</span>
            <span className="font-black text-gray-800 tracking-wider">{orderCode}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium text-sm">Số tiền</span>
            <span className="font-black text-blue-600 tracking-wider">
              {amount ? (parseInt(amount) / 100).toLocaleString('vi-VN') : 0}đ
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/history" className="block w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200">
            Xem lịch sử đơn hàng
          </Link>
          <Link to="/" className="block w-full bg-white border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
