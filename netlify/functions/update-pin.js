exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    return { 
        statusCode: 400, 
        body: JSON.stringify({ 
            success: false, 
            error: 'PIN updates are disabled on Netlify. Please update the ADMIN_PIN in your Netlify Dashboard Environment Variables.' 
        }) 
    };
};
