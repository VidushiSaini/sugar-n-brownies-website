const { commitFile } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const finalData = JSON.parse(event.body);
        const filename = 'gallery_data.json';

        await commitFile(filename, JSON.stringify(finalData, null, 2), `Update ${filename} via Netlify Admin`);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: `${filename} updated successfully` })
        };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Failed to write file' }) };
    }
};
