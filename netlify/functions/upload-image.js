const { commitFile } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const data = JSON.parse(event.body);
        if (!data.filename || !data.base64) {
            throw new Error('Missing filename or base64 data');
        }

        const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, "");
        
        // Clean filename
        const path = require('path');
        const ext = path.extname(data.filename);
        const base = path.basename(data.filename, ext).replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const safeName = `${base}_${Date.now()}${ext}`;
        const filePath = `Images/${safeName}`;

        await commitFile(filePath, base64Data, `Upload image ${safeName} via Netlify Admin`, true);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, filePath: filePath })
        };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Failed to process image' }) };
    }
};
