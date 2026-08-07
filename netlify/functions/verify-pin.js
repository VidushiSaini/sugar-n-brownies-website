const crypto = require('crypto');
const { getFileContent } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { pin } = JSON.parse(event.body);

        // Fetch business_settings.json
        const settingsContent = await getFileContent('business_settings.json');
        let settings = {};
        if (settingsContent) {
            settings = JSON.parse(settingsContent);
        }

        // Check if a hashed PIN exists in the settings
        if (settings.auth && settings.auth.pinHash && settings.auth.pinSalt) {
            // Verify against hashed PIN
            const hashBuffer = crypto.scryptSync(pin, settings.auth.pinSalt, 64);
            const isMatch = crypto.timingSafeEqual(Buffer.from(settings.auth.pinHash, 'hex'), hashBuffer);
            
            if (isMatch) {
                return { statusCode: 200, body: JSON.stringify({ success: true }) };
            } else {
                return { statusCode: 401, body: JSON.stringify({ success: false, error: 'Invalid PIN' }) };
            }
        } else {
            // Fallback to Netlify Environment Variable if no custom PIN is set yet
            const adminPin = process.env.ADMIN_PIN;
            if (!adminPin) {
                return { statusCode: 500, body: JSON.stringify({ success: false, error: 'ADMIN_PIN environment variable is missing and no custom PIN is set.' }) };
            }

            if (pin === adminPin) {
                return { statusCode: 200, body: JSON.stringify({ success: true }) };
            } else {
                return { statusCode: 401, body: JSON.stringify({ success: false, error: 'Invalid PIN' }) };
            }
        }
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: JSON.stringify({ error: 'Server error parsing request' }) };
    }
};
