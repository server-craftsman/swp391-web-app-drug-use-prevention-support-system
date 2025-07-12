import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
            padding: 24
        }}>
            <div style={{ fontSize: 120, fontWeight: 900, color: '#20558A', letterSpacing: 8, lineHeight: 1 }}>
                404
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#22223b', marginTop: 16 }}>
                Không tìm thấy trang
            </div>
            <div style={{ fontSize: 18, color: '#6c757d', marginTop: 8, marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
                Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.<br />Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
            </div>
            <Button type="primary" size="large" style={{ background: '#20558A', borderRadius: 8 }} onClick={() => navigate('/')}>Về trang chủ</Button>
        </div>
    );
};

export default NotFoundPage;