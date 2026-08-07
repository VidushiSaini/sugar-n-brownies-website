const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

async function getFileSHA(filePath) {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
    });

    if (response.ok) {
        const data = await response.json();
        return data.sha;
    } else if (response.status === 404) {
        return null; // File doesn't exist yet
    } else {
        throw new Error(`Failed to fetch file SHA: ${response.statusText}`);
    }
}

async function commitFile(filePath, content, commitMessage, isBase64 = false) {
    const sha = await getFileSHA(filePath);
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    
    // For text content, we must base64 encode it. For binary (like images), it might already be base64.
    const encodedContent = isBase64 ? content : Buffer.from(content).toString('base64');

    const body = {
        message: commitMessage,
        content: encodedContent
    };
    
    if (sha) {
        body.sha = sha;
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Failed to commit file: ${response.statusText} - ${errData}`);
    }

    return await response.json();
}

async function getFileContent(filePath) {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
    });

    if (response.ok) {
        const data = await response.json();
        return Buffer.from(data.content, 'base64').toString('utf8');
    } else if (response.status === 404) {
        return null;
    } else {
        throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }
}

module.exports = {
    getFileSHA,
    commitFile,
    getFileContent
};
