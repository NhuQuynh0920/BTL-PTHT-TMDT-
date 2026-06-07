import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Clock, Timer, Phone, Mail, MapPin, Save, Settings, Loader2 } from 'lucide-react';
import './Admin.css';

const SiteSettings = () => {
  const [settings, setSettings] = useState({
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    openingHours: '',
    estimatedWaitTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSettings({
          contactPhone: data.contactPhone || '',
          contactEmail: data.contactEmail || '',
          contactAddress: data.contactAddress || '',
          openingHours: data.openingHours || '',
          estimatedWaitTime: data.estimatedWaitTime || ''
        });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('/api/settings', settings);
      alert('Cập nhật cấu hình website thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi cập nhật cấu hình website');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-view max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-[#b22830] shadow-sm">
          <Settings className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cài Đặt Website</h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Quản lý giờ mở cửa, thời gian giao hàng và thông tin liên hệ chính thức của MoRa Tea.
          </p>
        </div>
      </div>

      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm animate-pulse">
              <div className="h-6 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
              {[1, 2, i === 2 ? 3 : 1].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded-md w-1/4"></div>
                  <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={submitHandler} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Operations Section */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="border-b border-slate-100 pb-4 mb-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#b22830] rounded-full"></span>
                  Thông Tin Hoạt Động
                </h3>
                <p className="text-xs text-slate-400 mt-1">Cấu hình thời gian vận hành và phục vụ của cửa hàng.</p>
              </div>

              {/* Opening Hours */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Giờ mở cửa</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="openingHours"
                    value={settings.openingHours}
                    onChange={handleChange}
                    placeholder="Ví dụ: 07:00 - 22:00"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#b22830] transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Estimated Wait Time */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian chờ ước tính</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Timer className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="estimatedWaitTime"
                    value={settings.estimatedWaitTime}
                    onChange={handleChange}
                    placeholder="Ví dụ: 15-20 phút"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#b22830] transition-all duration-200 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="border-b border-slate-100 pb-4 mb-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#b3a072] rounded-full"></span>
                  Thông Tin Liên Hệ
                </h3>
                <p className="text-xs text-slate-400 mt-1">Cập nhật các cổng thông tin liên hệ chính thức cho khách hàng.</p>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    placeholder="Ví dụ: 1900 6936"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#b22830] transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Email liên hệ</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    placeholder="Ví dụ: hi@moratea.vn"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#b22830] transition-all duration-200 font-medium"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Địa chỉ chi nhánh</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="contactAddress"
                    value={settings.contactAddress}
                    onChange={handleChange}
                    placeholder="Địa chỉ cửa hàng..."
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#b22830] transition-all duration-200 font-medium"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Form Actions / Submit */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#b22830] hover:bg-[#8e1f26] px-10 py-4 text-sm font-bold text-white shadow-lg shadow-red-100 hover:shadow-red-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#b22830] focus:ring-offset-2 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed disabled:active:scale-100 min-w-[200px]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Lưu Cấu Hình</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SiteSettings;
