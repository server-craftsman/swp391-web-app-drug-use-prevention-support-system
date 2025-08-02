export default async function handler(req, res) {
    // Get the full URL path after /api
    const path = req.url.replace('/api', '');
    const targetUrl = `http://103.90.225.74:5000/api${path}`;

    console.log('Proxying request to:', targetUrl);

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                ...req.headers
            },
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Proxy error',
            message: error.message,
            targetUrl: targetUrl
        });
    }
} 