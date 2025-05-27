const express = require('express');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const PORT = 3000;

// Serve iPod app first (more specific route)
app.use('/ipod', express.static('./ipod-app'));

// Serve static files for main site
app.use(express.static('.'));

// Handle markdown posts
app.get('/posts/:post', (req, res) => {
    const postPath = path.join(__dirname, 'posts', `${req.params.post}.md`);
    
    fs.readFile(postPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Post not found');
        }
        
        const htmlContent = marked(data);
        const template = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Blog Post</title>
                <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
                <div class="container">
                    ${htmlContent}
                    <p><a href="/">← Back to home</a></p>
                </div>
            </body>
            </html>
        `;
        
        res.send(template);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 