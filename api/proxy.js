export default async function handler(req, res) {
    // Get the full URL path after /api
    const path = req.url.replace('/api', '');
    const targetUrl = `http://103.90.225.74:5000/api${path}`;

    console.log('Proxying request:', {
        method: req.method,
        url: req.url,
        targetUrl: targetUrl,
        headers: req.headers
    });

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...req.headers
            },
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
        });

        console.log('Backend response:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type'),
            url: response.url
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            res.status(response.status).json(data);
        } else {
            // Handle non-JSON responses (HTML, text, etc.)
            const text = await response.text();
            console.log('Non-JSON response (first 500 chars):', text.substring(0, 500));

            // If it's an HTML error page, return a proper error
            if (text.includes('<html>') || text.includes('<!DOCTYPE') || text.includes('Tạo survey')) {
                res.status(response.status).json({
                    error: 'Backend returned HTML instead of JSON',
                    status: response.status,
                    message: 'Server error - please try again later',
                    details: text.substring(0, 200)
                });
            } else {
                // For other text responses, try to return as is
                res.status(response.status).send(text);
            }
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Proxy error',
            message: error.message,
            targetUrl: targetUrl
        });
    }
} 