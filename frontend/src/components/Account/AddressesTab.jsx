import { useState, useEffect } from 'react';
import axios from 'axios';

const AddressesTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    label: 'Nhà riêng',
    name: '',
    phone: '',
    address: '',
    isDefault: false
  });

  const [hanoiData, setHanoiData] = useState(null);
  const [hanoiWards, setHanoiWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  // Load Hanoi Locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await axios.get('/api/address/locations');
        const hData = data.find(p => p.matinhBNV === '01');
        if (hData) {
          setHanoiData(hData);
          const sortedWards = (hData.phuongxa || []).sort((a, b) => 
            a.tenphuongxa.localeCompare(b.tenphuongxa, 'vi')
          );
          setHanoiWards(sortedWards);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  // Combine address string
  useEffect(() => {
    const wardName = hanoiWards.find(w => w.maphuongxa == selectedWard)?.tenphuongxa || '';
    const districtName = hanoiData ? hanoiData.tentinhmoi : '';
    
    if (wardName && districtName) {
      const combined = `${addressDetail ? addressDetail.trim() + ', ' : ''}${wardName}, ${districtName}`;
      setFormData(prev => ({ ...prev, address: combined }));
    } else {
      setFormData(prev => ({ ...prev, address: addressDetail.trim() }));
    }
  }, [selectedWard, addressDetail, hanoiWards, hanoiData]);

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get('/api/users/addresses');
      setAddresses(data);
    } catch (error) {
       console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressDetailChange = (value) => {
    setAddressDetail(value);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`/api/users/addresses/${editingId}`, formData);
      } else {
        await axios.post('/api/users/addresses', formData);
      }
      fetchAddresses();
      setIsEditing(false);
      setEditingId(null);
      setFormData({ label: 'Nhà riêng', name: '', phone: '', address: '', isDefault: false });
      setSelectedWard('');
      setAddressDetail('');
    } catch (error) {
      alert('Lỗi khi lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (addr) => {
    setEditingId(addr._id);
    setFormData({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      address: addr.address,
      isDefault: addr.isDefault
    });
    setAddressDetail(addr.address);
    setSelectedWard('');
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await axios.delete(`/api/users/addresses/${id}`);
      fetchAddresses();
    } catch (error) {
      alert('Lỗi khi xóa');
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 text-center sm:text-left">
        <div>
           <h2 className="text-2xl font-black text-gray-900">Sổ địa chỉ</h2>
        </div>
        {!isEditing && (
            <button 
                onClick={() => { setEditingId(null); setIsEditing(true); }}
                className="bg-orange-600 text-white font-black px-8 py-4 rounded-[20px] hover:bg-orange-700 transition-all text-sm shadow-2xl shadow-orange-100 flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Thêm địa chỉ mới
            </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-[#f8f9fa] p-8 md:p-10 rounded-[32px] space-y-8 animate-slideDown border border-gray-100">
           <div className="mb-6">
              <h3 className="text-lg font-black text-gray-900">{editingId ? 'Cập nhật địa chỉ' : 'Địa chỉ nhận hàng mới'}</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên người nhận</label>
                 <input 
                    className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Nhập tên người nhận..." required
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                 <input 
                    className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="Nhập số điện thoại..." required
                 />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Phân loại địa chỉ</label>
              <div className="flex flex-wrap gap-3">
                {['Nhà riêng', 'Văn phòng', 'Khác'].map(l => (
                  <button 
                    key={l} type="button" 
                    onClick={() => setFormData({...formData, label: l})}
                    className={`px-8 py-3 rounded-full text-xs font-black transition-all border-2 ${formData.label === l ? 'border-orange-600 bg-orange-600 text-white shadow-lg shadow-orange-100' : 'border-gray-200 bg-white text-gray-400 hover:border-orange-200'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-6">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Địa chỉ giao hàng (Hà Nội)</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">TỈNH/THÀNH PHỐ</label>
                  <select 
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold text-gray-600 outline-none appearance-none"
                    disabled
                  >
                    <option>{hanoiData ? hanoiData.tentinhmoi : 'Đang tải...'}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 ml-1">PHƯỜNG / XÃ</label>
                  <select 
                    className="w-full bg-white border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none appearance-none"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                  >
                    <option value="">-- Chọn Phường/Xã --</option>
                    {hanoiWards.map(w => <option key={w.maphuongxa} value={w.maphuongxa}>{w.tenphuongxa}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 ml-1">SỐ NHÀ, TÊN ĐƯỜNG</label>
                 <textarea 
                   className="w-full bg-white border-2 border-transparent rounded-[24px] px-6 py-4 text-sm focus:border-orange-500/20 focus:ring-4 focus:ring-orange-100 transition-all font-bold text-gray-800 outline-none resize-none"
                   rows="2" value={addressDetail} onChange={e => handleAddressDetailChange(e.target.value)}
                   placeholder="VD: Số 123, ngõ 45, phố..." required
                 />
              </div>

              {formData.address && (
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 animate-fadeIn">
                   <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Địa chỉ hoàn chỉnh</p>
                   <p className="text-sm font-bold text-orange-700">{formData.address}</p>
                </div>
              )}
           </div>

           <div className="flex items-center pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" className="peer hidden"
                      checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                    />
                    <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-colors"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5"></div>
                  </div>
                  <span className="font-bold text-gray-600 text-sm group-hover:text-gray-900 transition-colors">Đặt làm địa chỉ mặc định</span>
              </label>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
               <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 text-gray-400 font-black hover:text-gray-900 transition-colors uppercase text-xs tracking-widest">Hủy bỏ</button>
               <button type="submit" disabled={loading} className="flex-[2] bg-orange-600 text-white font-black py-4 rounded-[20px] hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 text-sm tracking-wide">
                   {loading ? (
                      <div className="flex items-center justify-center gap-2">
                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         Đang lưu...
                      </div>
                   ) : editingId ? 'CẬP NHẬT ĐỊA CHỈ' : 'LƯU ĐỊA CHỈ NÀY'}
               </button>
           </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <div key={addr._id} className={`p-8 bg-white border-2 rounded-[32px] transition-all relative group flex flex-col justify-between ${addr.isDefault ? 'border-orange-600 shadow-xl shadow-orange-100/50' : 'border-gray-50 hover:border-orange-100'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-2">
                       <div className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-orange-100">
                          {addr.label}
                       </div>
                       {addr.isDefault && (
                         <div className="bg-green-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-green-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                            Mặc định
                         </div>
                       )}
                   </div>
                   <div className="flex gap-2">
                       <button onClick={() => startEdit(addr)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                       </button>
                       <button onClick={() => handleDelete(addr._id)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                       </button>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div>
                      <h4 className="font-black text-gray-900 text-xl mb-1">{addr.name}</h4>
                      <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C.011 18 0 5.999 0 4V3z" /></svg>
                         {addr.phone}
                      </div>
                   </div>
                   <div className="p-4 bg-[#f8f9fa] rounded-2xl border border-gray-100 min-h-[80px]">
                      <p className="text-sm font-bold text-gray-600 leading-relaxed">{addr.address}</p>
                   </div>
                </div>
            </div>
          ))}
          {addresses.length === 0 && (
             <div className="col-span-full py-24 text-center bg-white border-4 border-dashed border-gray-50 rounded-[48px] animate-pulse">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-100">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                </div>
                <p className="text-gray-300 font-black text-xl uppercase tracking-widest">Sổ địa chỉ trống</p>
                <p className="text-gray-400 font-medium mt-2">Đừng quên thêm địa chỉ để chúng tôi giao trà sữa đến bạn nhé!</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
