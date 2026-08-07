const { commitFile } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        let finalData = JSON.parse(event.body);

        if (finalData.categories && Array.isArray(finalData.categories)) {
            finalData.categories.forEach(category => {
                if (category.items && Array.isArray(category.items)) {
                    category.items.forEach(item => {
                        if (!item.image || item.image.trim() === '') {
                            item.image = 'Images/Logo 3.jpg';
                        }
                    });
                }
            });
        }

        await commitFile('menu_data.json', JSON.stringify(finalData, null, 2), 'Update menu_data.json via Netlify Admin');

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: `menu_data.json updated successfully` })
        };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Failed to write file' }) };
    }
};
