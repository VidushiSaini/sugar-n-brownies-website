const crypto = require('crypto');
const { commitFile, getFileContent } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { currentPin, newPin } = JSON.parse(event.body);

        // Fetch current settings to verify old PIN first
        const filename = 'business_settings.json';
        const settingsContent = await getFileContent(filename);
        let settings = {};
        if (settingsContent) {
            settings = JSON.parse(settingsContent);
        }

        let isAuthorized = false;

        if (settings.auth && settings.auth.pinHash && settings.auth.pinSalt) {
            // Verify against hashed PIN
            const hashBuffer = crypto.scryptSync(currentPin, settings.auth.pinSalt, 64);
            isAuthorized = crypto.timingSafeEqual(Buffer.from(settings.auth.pinHash, 'hex'), hashBuffer);
        } else {
            // Verify against fallback ENV PIN
            isAuthorized = (currentPin === process.env.ADMIN_PIN);
        }

        if (!isAuthorized) {
            return { statusCode: 401, body: JSON.stringify({ success: false, error: 'Current PIN is incorrect' }) };
        }

        // Generate a new secure salt and hash for the new PIN
        const newSalt = crypto.randomBytes(16).toString('hex');
        const newHash = crypto.scryptSync(newPin, newSalt, 64).toString('hex');

        // Update settings
        settings.auth = {
            pinHash: newHash,
            pinSalt: newSalt
        };

        // Commit to GitHub
        await commitFile(filename, JSON.stringify(settings, null, 2), 'Update Admin PIN via Dashboard');

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'PIN updated successfully' })
        };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Server error processing PIN update' }) };
    }
};
