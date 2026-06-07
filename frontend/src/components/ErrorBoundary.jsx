import React from 'react';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(_error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in React component tree:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div style={{
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#fdfbfb',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '500px',
            background: 'white',
            padding: '40px',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: '#fff0f0', 
              color: '#e74c3c', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <h1 style={{ fontSize: '24px', color: '#2c3e50', marginBottom: '10px', fontWeight: '900' }}>Rất tiếc, đã có lỗi xảy ra!</h1>
            <p style={{ color: '#7f8c8d', marginBottom: '30px', lineHeight: '1.6' }}>
              Ứng dụng vừa gặp phải một sự cố không mong muốn. Đừng lo lắng, dữ liệu của bạn vẫn an toàn. Vui lòng tải lại trang hoặc quay về trang chủ.
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()} 
                style={{
                  padding: '12px 24px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Tải lại trang
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 24px',
                  background: '#f8f9fa',
                  color: '#2c3e50',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1
                }}
              >
                Về trang chủ
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'left', overflow: 'auto', maxHeight: '150px' }}>
                <p style={{ color: '#e74c3c', fontWeight: 'bold', margin: '0 0 10px 0', fontSize: '12px' }}>{this.state.error.toString()}</p>
                <pre style={{ fontSize: '11px', color: '#555', margin: 0 }}>{this.state.errorInfo?.componentStack}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
