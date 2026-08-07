const { commitFile, getFileContent } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { categoryName, itemIndex } = JSON.parse(event.body);
        if (!categoryName || itemIndex === undefined) throw new Error('Missing data');

        const filename = 'menu_data.json';
        const fileContent = await getFileContent(filename);
        if (!fileContent) throw new Error('menu_data.json not found on GitHub');

        let menuData = JSON.parse(fileContent);
        const catIndex = menuData.categories.findIndex(c => c.name === categoryName);
        
        if (catIndex > -1) {
            menuData.categories[catIndex].items.splice(itemIndex, 1);
            await commitFile(filename, JSON.stringify(menuData, null, 2), `Delete item from ${categoryName} via Netlify Admin`);
            
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true })
            };
        } else {
            throw new Error('Category not found');
        }
    } catch (e) {
        console.error(e);
        return { statusCode: 400, body: JSON.stringify({ error: e.message || 'Invalid payload' }) };
    }
};
