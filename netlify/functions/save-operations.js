const { commitFile, getFileContent } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const parsedData = JSON.parse(event.body);
        const filename = 'business_settings.json';
        
        let existingData = {};
        const existingContent = await getFileContent(filename);
        if (existingContent) {
            try { existingData = JSON.parse(existingContent); } catch(e) {}
        }
        
        let finalData = { ...existingData, ...parsedData };
        if (parsedData.hours && existingData.hours) {
            finalData.hours = { ...existingData.hours, ...parsedData.hours };
        }

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
