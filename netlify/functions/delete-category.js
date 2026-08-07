const { commitFile, getFileContent } = require('./utils/github');

exports.handler = async (event) => {
    if (event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { categoryName } = JSON.parse(event.body);
        if (!categoryName) throw new Error('Missing category');

        const filename = 'menu_data.json';
        const fileContent = await getFileContent(filename);
        if (!fileContent) throw new Error('menu_data.json not found on GitHub');

        let menuData = JSON.parse(fileContent);
        const catIndex = menuData.categories.findIndex(c => c.name === categoryName);
        
        if (catIndex > -1) {
            menuData.categories.splice(catIndex, 1);
            await commitFile(filename, JSON.stringify(menuData, null, 2), `Delete category ${categoryName} via Netlify Admin`);
            
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
