const { commitFile } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const bodySize = Buffer.byteLength(event.body, 'utf8');
        if (bodySize > 5 * 1024 * 1024) { // 5MB limit
            return { statusCode: 413, body: JSON.stringify({ error: 'Payload Too Large. Please upload smaller images.' }) };
        }

        const data = JSON.parse(event.body);
        if (!data.offers_list) {
            throw new Error('Invalid data format. Expected offers_list array.');
        }

        // Process images
        for (let i = 0; i < data.offers_list.length; i++) {
            let offer = data.offers_list[i];
            
            if (offer.image && offer.image.startsWith('data:image')) {
                // It's a new base64 upload
                const base64Data = offer.image.replace(/^data:image\/\w+;base64,/, "");
                // Generate a safe name
                const extMatch = offer.image.match(/^data:image\/(\w+);base64,/);
                let ext = extMatch ? `.${extMatch[1]}` : '.jpeg';
                // Some mime types differ from extension
                if (ext === '.jpeg') ext = '.jpg';
                
                const safeName = `offer_${Date.now()}_${i}${ext}`;
                const filePath = `Images/${safeName}`;

                // Commit the image file
                await commitFile(filePath, base64Data, `Upload special offer image ${safeName} via Netlify Admin`, true);
                
                // Update the offer object to hold the path instead of base64 string
                offer.image = filePath;
            }
        }

        // Save updated JSON
        const filename = 'offers_data.json';
        await commitFile(filename, JSON.stringify(data, null, 2), `Update ${filename} via Netlify Admin`);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: `${filename} updated successfully` })
        };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Failed to write file' }) };
    }
};
