const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // API Endpoints for Custom Admin
    if (req.method === 'POST') {
        if (req.url === '/api/verify-pin') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
                try {
                    const { pin } = JSON.parse(body);
                    const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'server_config.json'), 'utf8'));
                    if (pin === config.pin) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Invalid PIN' }));
                    }
                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server error' }));
                }
            });
            return;
        }

        if (req.url === '/api/update-pin') {
            let body = '';
            req.on('data', chunk => body += chunk.toString());
            req.on('end', () => {
                try {
                    const { currentPin, newPin } = JSON.parse(body);
                    const configPath = path.join(__dirname, 'server_config.json');
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    if (currentPin === config.pin) {
                        config.pin = newPin;
                        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: false, error: 'Current PIN is incorrect' }));
                    }
                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server error' }));
                }
            });
            return;
        }

        if (req.url === '/api/save-menu' || req.url === '/api/save-gallery' || req.url === '/api/save-settings' || req.url === '/api/save-content' || req.url === '/api/save-operations') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const parsedData = JSON.parse(body);
                    let filename;
                    if (req.url === '/api/save-menu') filename = 'menu_data.json';
                    else if (req.url === '/api/save-gallery') filename = 'gallery_data.json';
                    else if (req.url === '/api/save-settings' || req.url === '/api/save-operations') filename = 'business_settings.json';
                    else if (req.url === '/api/save-content') filename = 'content_data.json';
                    
                    const filePath = path.join(__dirname, filename);
                    
                    fs.readFile(filePath, 'utf8', (readErr, data) => {
                        let existingData = {};
                        if (!readErr) {
                            try { existingData = JSON.parse(data); } catch(e) {}
                        }
                        
                        let finalData;
                        if (filename === 'business_settings.json') {
                            finalData = { ...existingData, ...parsedData };
                            if (parsedData.hours && existingData.hours) {
                                finalData.hours = { ...existingData.hours, ...parsedData.hours };
                            }
                        } else if (filename === 'content_data.json') {
                            finalData = { ...existingData, ...parsedData };
                            if (parsedData.about_us && existingData.about_us) {
                                finalData.about_us = { ...existingData.about_us, ...parsedData.about_us };
                            }
                        } else if (filename === 'menu_data.json') {
                            finalData = parsedData;
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
                        } else {
                            finalData = parsedData;
                        }
                        
                        fs.writeFile(filePath, JSON.stringify(finalData, null, 2), 'utf8', err => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Failed to write file' }));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: true, message: `${filename} updated successfully` }));
                            }
                        });
                    });
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
                }
            });
            return;
        }

        if (req.url === '/api/upload-image') {
            const contentType = req.headers['content-type'] || '';
            
            if (contentType.startsWith('multipart/form-data')) {
                const boundary = contentType.split('boundary=')[1];
                if (!boundary) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'No boundary in multipart' }));
                }
                
                let body = Buffer.alloc(0);
                req.on('data', chunk => {
                    body = Buffer.concat([body, chunk]);
                });
                req.on('end', () => {
                    try {
                        const filenameMatch = body.toString('utf8', 0, Math.min(body.length, 2048)).match(/filename="(.+?)"/);
                        if (!filenameMatch) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'No filename' }));
                        }
                        
                        const rawName = filenameMatch[1];
                        const ext = path.extname(rawName);
                        const base = path.basename(rawName, ext).replace(/[^a-zA-Z0-9.\-_]/g, '_');
                        const safeName = `${base}_${Date.now()}${ext}`;
                        
                        const headerEnd = body.indexOf(Buffer.from('\r\n\r\n')) + 4;
                        const boundaryBuffer = Buffer.from('\r\n--' + boundary);
                        const fileEnd = body.indexOf(boundaryBuffer, headerEnd);
                        
                        if (headerEnd < 4 || fileEnd === -1) {
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            return res.end(JSON.stringify({ error: 'Invalid multipart format' }));
                        }
                        
                        const fileData = body.slice(headerEnd, fileEnd);
                        const filePath = path.join(__dirname, 'Images', safeName);
                        
                        fs.writeFile(filePath, fileData, err => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Failed to write image' }));
                            } else {
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: true, filePath: `Images/${safeName}` }));
                            }
                        });
                    } catch (e) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Server error processing multipart' }));
                    }
                });
                return;
            }
            
            // Fallback for base64
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const base64Data = data.base64.replace(/^data:image\/\w+;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    // clean filename to prevent directory traversal and encode safe
                    const ext = path.extname(data.filename);
                    const base = path.basename(data.filename, ext).replace(/[^a-zA-Z0-9.\-_]/g, '_');
                    const safeName = `${base}_${Date.now()}${ext}`;
                    const filePath = path.join(__dirname, 'Images', safeName);
                    
                    fs.writeFile(filePath, buffer, err => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Failed to write image' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true, filePath: `Images/${safeName}` }));
                        }
                    });
                } catch (e) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid payload' }));
                }
            });
            return;
        }
    }

    if (req.method === 'DELETE' && req.url === '/api/delete-menu-item') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { categoryName, itemIndex } = data;
                if (!categoryName || itemIndex === undefined) throw new Error('Missing data');

                const filePath = path.join(__dirname, 'menu_data.json');
                fs.readFile(filePath, 'utf8', (err, fileData) => {
                    if (err) throw err;
                    let menuData = JSON.parse(fileData);
                    const catIndex = menuData.categories.findIndex(c => c.name === categoryName);
                    if (catIndex > -1) {
                        menuData.categories[catIndex].items.splice(itemIndex, 1);
                        fs.writeFile(filePath, JSON.stringify(menuData, null, 2), 'utf8', err => {
                            if (err) throw err;
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true }));
                        });
                    } else {
                        throw new Error('Category not found');
                    }
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message || 'Invalid payload' }));
            }
        });
        return;
    }

    if (req.method === 'DELETE' && req.url === '/api/delete-category') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { categoryName } = data;
                if (!categoryName) throw new Error('Missing category');

                const filePath = path.join(__dirname, 'menu_data.json');
                fs.readFile(filePath, 'utf8', (err, fileData) => {
                    if (err) throw err;
                    let menuData = JSON.parse(fileData);
                    const catIndex = menuData.categories.findIndex(c => c.name === categoryName);
                    if (catIndex > -1) {
                        menuData.categories.splice(catIndex, 1);
                        fs.writeFile(filePath, JSON.stringify(menuData, null, 2), 'utf8', err => {
                            if (err) throw err;
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true }));
                        });
                    } else {
                        throw new Error('Category not found');
                    }
                });
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message || 'Invalid payload' }));
            }
        });
        return;
    }

    // Static File Serving
    if (req.method === 'GET') {
        let reqUrl = req.url.split('?')[0]; // Strip query string
        try {
            reqUrl = decodeURI(reqUrl);
        } catch(e) {
            // Ignore malformed URI
        }
        let filePath = reqUrl === '/' ? '/index.html' : reqUrl;
        // prevent directory traversal
        filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
        const absolutePath = path.join(__dirname, filePath);

        // Security: Block sensitive files
        const basename = path.basename(absolutePath);
        if (basename === 'server_config.json' || basename.endsWith('.py') || basename === 'server.js') {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('403 Forbidden');
            return;
        }

        fs.stat(absolutePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }

            const extname = String(path.extname(absolutePath)).toLowerCase();
            const contentType = mimeTypes[extname] || 'application/octet-stream';

            fs.readFile(absolutePath, (err, content) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`To manage content, visit http://localhost:${PORT}/admin.html`);
});
