import { useState, useEffect } from 'react';
import axios from 'axios';

const CheckoutAddress = ({ name, phone, address, onUpdate, onShippingUpdate }) => {
  const [modalView, setModalView] = useState('NONE'); // 'NONE', 'LIST', 'FORM'
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempPhone, setTempPhone] = useState('');
  const [tempSpecific, setTempSpecific] = useState('');
  const [tempLabel, setTempLabel] = useState('Nhà Riêng');
  const [tempDefault, setTempDefault] = useState(false);

  const [hanoiData, setHanoiData] = useState(null);
  const [hanoiWards, setHanoiWards] = useState([]);
  const [selWard, setSelWard] = useState('');

  const fetchSaved = async () => {
    try {
      const { data } = await axios.get('/api/users/addresses');
      setSavedAddresses(data);
      
      if (address) {
        const match = data.find(a => a.address === address);
        if (match) setSelectedAddressId(match._id);
      } else if (data.length > 0) {
        const def = data.find(a => a.isDefault) || data[0];
        setSelectedAddressId(def._id);
        confirmSelection(def);
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    }
  };

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
    } catch (err) {
      console.error('Failed to load locations', err);
    }
  };

  useEffect(() => {
    fetchSaved();
    fetchLocations();
  }, []);

  const confirmSelection = async (addr) => {
    if (!addr) return;
    setSelectedAddressId(addr._id);
    onUpdate({ name: addr.name, phone: addr.phone, address: addr.address });
    try {
      const { data } = await axios.post('/api/address/calculate', { address: addr.address });
      if (onShippingUpdate) onShippingUpdate(data.shippingFee, data.distanceKm);
    } catch (error) {
      if (onShippingUpdate) onShippingUpdate(15000, 0);
    }
    setModalView('NONE');
  };

  const openForm = (addr = null) => {
    setError('');
    if (addr) {
      setEditingId(addr._id);
      setTempName(addr.name);
      setTempPhone(addr.phone);
      // Try to parse address string back into components (this is hard without strict format, 
      // but for UX we just put it all in specific address if we can't parse)
      setTempSpecific(addr.address);
      setSelWard('');
      setTempLabel(addr.label || 'Nhà Riêng');
      setTempDefault(addr.isDefault || false);
    } else {
      setEditingId(null);
      setTempName('');
      setTempPhone('');
      setTempSpecific('');
      setSelWard('');
      setTempLabel('Nhà Riêng');
      setTempDefault(false);
    }
    setModalView('FORM');
  };

  const handleSaveAddress = async () => {
    setError('');
    if (!tempName.trim() || !tempPhone.trim() || !tempSpecific.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    let fullAddress = tempSpecific.trim();
    if (selWard) {
      const pName = hanoiData.tentinhmoi;
      const wName = hanoiWards.find(w => w.maphuongxa == selWard)?.tenphuongxa || '';
      fullAddress = `${tempSpecific.trim()}, ${wName}, ${pName}`;
    }

    setLoading(true);
    try {
      const payload = {
        name: tempName.trim(),
        phone: tempPhone.trim(),
        address: fullAddress,
        label: tempLabel,
        isDefault: tempDefault
      };
      
      if (editingId) {
        await axios.put(`/api/users/addresses/${editingId}`, payload);
      } else {
        await axios.post('/api/users/addresses', payload);
      }
      
      await fetchSaved();
      setModalView('LIST');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Địa Chỉ Nhận Hàng
        </div>
        <button onClick={() => setModalView('LIST')} className="text-blue-600 font-medium hover:text-blue-700">
          Thay đổi
        </button>
      </div>
      
      {address ? (
        <div className="flex items-start gap-4">
          <div className="font-bold text-gray-800 whitespace-nowrap">{name} (+84) {phone.replace(/^0/, '')}</div>
          <div className="text-gray-600 flex-1">{address}</div>
          {savedAddresses.find(a => a.address === address)?.isDefault && (
            <span className="text-[10px] font-medium border border-orange-600 text-orange-600 px-2 py-0.5 rounded whitespace-nowrap">Mặc định</span>
          )}
        </div>
      ) : (
        <div className="text-gray-500 italic">Chưa chọn địa chỉ giao hàng</div>
      )}

      {/* Modal 1: List Addresses */}
      {modalView === 'LIST' && (
        <div className="fixed inset-0 z-[3000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Địa Chỉ Của Tôi</h2>
              <button onClick={() => setModalView('NONE')} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {savedAddresses.map(addr => (
                <div key={addr._id} className="flex items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
                  <div className="pt-1">
                    <input 
                      type="radio" 
                      name="addressSelect"
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500 cursor-pointer"
                      checked={selectedAddressId === addr._id}
                      onChange={() => confirmSelection(addr)}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{addr.name}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500 text-sm">(+84) {addr.phone.replace(/^0/, '')}</span>
                      </div>
                      <button onClick={() => openForm(addr)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Cập nhật</button>
                    </div>
                    <div className="text-gray-600 text-sm mt-1 mb-1">{addr.address}</div>
                    <div className="flex gap-2 mt-2">
                      {addr.isDefault && <span className="text-[10px] border border-orange-500 text-orange-500 px-1.5 py-0.5 rounded whitespace-nowrap">Mặc định</span>}
                      {addr.label === 'Văn Phòng' && <span className="text-[10px] border border-gray-400 text-gray-500 px-1.5 py-0.5 rounded whitespace-nowrap">Văn Phòng</span>}
                      {addr.label === 'Nhà Riêng' && <span className="text-[10px] border border-gray-400 text-gray-500 px-1.5 py-0.5 rounded whitespace-nowrap">Nhà Riêng</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => openForm()} className="flex items-center gap-1 bg-[#ee4d2d] text-white px-4 py-2 rounded shadow-sm hover:bg-[#d73211] transition-colors font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Thêm Địa Chỉ Mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Address Form */}
      {modalView === 'FORM' && (
        <div className="fixed inset-0 z-[3100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">{editingId ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}</h2>
              <button onClick={() => setModalView('LIST')} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              
              <div className="flex gap-4">
                <input type="text" placeholder="Họ và tên" className="flex-1 border p-2.5 rounded text-sm focus:border-gray-500 outline-none" value={tempName} onChange={e => setTempName(e.target.value)} />
                <input type="tel" placeholder="Số điện thoại" className="flex-1 border p-2.5 rounded text-sm focus:border-gray-500 outline-none" value={tempPhone} onChange={e => setTempPhone(e.target.value)} />
              </div>
              
              <div className="flex flex-col gap-3 p-3 border rounded">
                <p className="text-xs text-gray-500 font-medium mb-1">Tỉnh/Thành Phố, Phường/Xã</p>
                <select className="border p-2 rounded text-sm outline-none bg-gray-50 text-gray-600" disabled>
                  <option>{hanoiData ? hanoiData.tentinhmoi : 'Đang tải...'}</option>
                </select>
                <select className="border p-2 rounded text-sm outline-none" value={selWard} onChange={e => setSelWard(e.target.value)}>
                  <option value="">Chọn Phường/Xã</option>
                  {hanoiWards.map(w => <option key={w.maphuongxa} value={w.maphuongxa}>{w.tenphuongxa}</option>)}
                </select>
              </div>
              
              <textarea placeholder="Địa chỉ cụ thể" className="w-full border p-2.5 rounded text-sm min-h-[80px] focus:border-gray-500 outline-none" value={tempSpecific} onChange={e => setTempSpecific(e.target.value)} />
              
              <div className="flex items-center gap-2">

              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-2">Loại địa chỉ:</p>
                <div className="flex gap-3">
                  <button onClick={() => setTempLabel('Nhà Riêng')} className={`px-4 py-1.5 border rounded text-sm ${tempLabel === 'Nhà Riêng' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-gray-300 text-gray-700'}`}>Nhà Riêng</button>
                  <button onClick={() => setTempLabel('Văn Phòng')} className={`px-4 py-1.5 border rounded text-sm ${tempLabel === 'Văn Phòng' ? 'border-[#ee4d2d] text-[#ee4d2d]' : 'border-gray-300 text-gray-700'}`}>Văn Phòng</button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="isDefault" className="w-4 h-4 text-[#ee4d2d] rounded focus:ring-[#ee4d2d]" checked={tempDefault} onChange={e => setTempDefault(e.target.checked)} />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
              </div>
            </div>
            
            <div className="p-4 flex justify-end gap-3 border-t">
              <button onClick={() => setModalView('LIST')} className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded font-medium">Trở Lại</button>
              <button onClick={handleSaveAddress} disabled={loading} className="px-6 py-2 bg-[#ee4d2d] text-white rounded font-medium shadow-sm hover:bg-[#d73211] disabled:opacity-70">
                {loading ? 'Đang lưu...' : 'Hoàn thành'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutAddress;
