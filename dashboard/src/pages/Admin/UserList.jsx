import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import './Admin.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [currentUser]);

  const deleteHandler = async (id) => {
    if (window.confirm('Xác nhận xóa thành viên này? Thao tác không thể hoàn tác.')) {
      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        await axios.delete(`/api/users/${id}`, config);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi xóa thành viên');
      }
    }
  };

  const getName = (u) => u.fullName || u.name || 'Không có tên';
  const getInitial = (u) => getName(u).charAt(0).toUpperCase();

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return getName(u).toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });

  return (
    <div className="admin-view">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
            Quản Lý Thành Viên
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Quản lý danh sách khách hàng và phân quyền hệ thống
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 14px 8px 36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              fontSize: '0.85rem', fontWeight: '500', color: '#1e293b',
              outline: 'none', width: '260px', background: '#fff',
            }}
          />
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #fef2f2', borderTopColor: '#b22830', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '64px' }}>Ảnh</th>
              <th>Thành viên</th>
              <th style={{ width: '240px' }}>Email</th>
              <th style={{ width: '130px' }}>Vai trò</th>
              <th style={{ width: '200px' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const isSelf = u._id === currentUser?._id;
              const isAdmin = u.role === 'admin';
              return (
                <tr key={u._id}>
                  {/* Avatar */}
                  <td>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: isAdmin ? '#fef2f2' : '#f1f5f9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '1.1rem',
                      color: isAdmin ? '#b22830' : '#64748b',
                      overflow: 'hidden', border: '2px solid #f1f5f9',
                    }}>
                      {u.avatar
                        ? <img src={u.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : getInitial(u)
                      }
                    </div>
                  </td>

                  {/* Info */}
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>
                      {getName(u)}
                      {isSelf && (
                        <span style={{
                          marginLeft: '8px', fontSize: '0.65rem', fontWeight: '600',
                          padding: '2px 6px', borderRadius: '4px',
                          background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe',
                          verticalAlign: 'middle',
                        }}>
                          Tài khoản này
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                      ID: #{u._id.slice(-6).toUpperCase()}
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>{u.email}</td>

                  {/* Role badge */}
                  <td>
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.72rem', fontWeight: '600',
                      padding: '3px 10px', borderRadius: '4px',
                      letterSpacing: '0.05em', whiteSpace: 'nowrap',
                      background: isAdmin ? '#fef2f2' : '#f0fdf4',
                      color: isAdmin ? '#b22830' : '#16a34a',
                      border: `1px solid ${isAdmin ? '#fecaca' : '#bbf7d0'}`,
                    }}>
                      {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    {isSelf ? (
                      <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                        Không thể chỉnh sửa
                      </span>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Link
                          to={`/admin/users/${u._id}/orders`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', borderRadius: '8px',
                            background: '#f8fafc', color: '#475569', 
                            fontWeight: '700', fontSize: '0.75rem', 
                            border: '1px solid #e2e8f0', textDecoration: 'none',
                            transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#475569'; }}
                        >
                          <Eye size={14} strokeWidth={2.5} /> Lịch sử
                        </Link>
                        
                        <button
                          onClick={() => deleteHandler(u._id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', borderRadius: '8px', border: '1px solid #fecaca', cursor: 'pointer',
                            background: '#fff', color: '#dc2626', 
                            fontWeight: '700', fontSize: '0.75rem',
                            transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                        >
                          <Trash2 size={14} strokeWidth={2.5} /> Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '0.875rem' }}>
                  Không tìm thấy thành viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
