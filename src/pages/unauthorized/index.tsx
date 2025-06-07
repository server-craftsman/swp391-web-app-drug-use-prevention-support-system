import { Row, Col, Typography, Button } from 'antd'

const UnauthorizedPage = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col span={8} style={{ textAlign: 'center' }}>
        <Typography.Title level={1} style={{ color: '#1890ff' }}>
          401 Unauthorized
        </Typography.Title>
        <Typography.Paragraph>
          You don't have permission to access this page.
        </Typography.Paragraph>
        <Button type="primary" size="large" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Col>
    </Row>
  )
}
export default UnauthorizedPage;