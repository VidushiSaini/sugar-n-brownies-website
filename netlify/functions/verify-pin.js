exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { pin } = JSON.parse(event.body);
        const adminPin = process.env.ADMIN_PIN;

        if (!adminPin) {
            return { statusCode: 500, body: JSON.stringify({ success: false, error: 'ADMIN_PIN environment variable is missing in Netlify' }) };
        }

        if (pin === adminPin) {
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        } else {
            return { statusCode: 401, body: JSON.stringify({ success: false, error: 'Invalid PIN' }) };
        }
    } catch (e) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error parsing request' }) };
    }
};
