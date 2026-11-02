const http = require('http');

http.createServer((req, res) => {
    // 🧪 EXPERIMENTE ICI :
    // Essaie d'ajouter ou de retirer des en-têtes pour voir ta note changer sur HeaderShield !
    
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        // 'Strict-Transport-Security': 'max-age=31536000',
        // 'X-Frame-Options': 'DENY',
        // 'X-Content-Type-Options': 'nosniff'
    });
    res.end('Bonjour, ceci est un site de test local !');
}).listen(4000, () => {
    console.log('🧪 Site de test local démarré sur http://localhost:4000');
});