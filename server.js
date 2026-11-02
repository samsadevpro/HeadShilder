const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Route API pour scanner les en-têtes d'une URL avec fetch
app.post('/api/scan', async (req, res) => {
    let targetUrl = req.body.url;
    if (!targetUrl) {
        return res.status(400).json({ error: "URL requise." });
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
    }

    try {
        // Utilisation de fetch natif (Node.js v22)
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'HeaderShield-Security-Scanner/1.0'
            },
            redirect: 'follow'
        });

        const headers = response.headers;
        
        // Extraction des en-têtes de sécurité OWASP
        const securityHeaders = {
            'strict-transport-security': {
                name: 'Strict-Transport-Security (HSTS)',
                value: headers.get('strict-transport-security'),
                description: 'Force les connexions sécurisées via HTTPS.',
                recommendation: 'Ajouter : Strict-Transport-Security: max-age=63072000; includeSubDomains; preload'
            },
            'content-security-policy': {
                name: 'Content-Security-Policy (CSP)',
                value: headers.get('content-security-policy'),
                description: 'Protège contre les attaques XSS et l\'injection de code malveillant.',
                recommendation: "Ajouter une politique restrictive, ex: default-src 'self'"
            },
            'x-frame-options': {
                name: 'X-Frame-Options',
                value: headers.get('x-frame-options'),
                description: 'Empêche l\'intégration du site dans une iframe (protection contre le Clickjacking).',
                recommendation: 'Ajouter : X-Frame-Options: DENY ou SAMEORIGIN'
            },
            'x-content-type-options': {
                name: 'X-Content-Type-Options',
                value: headers.get('x-content-type-options'),
                description: 'Empêche le navigateur de deviner (sniffer) le type MIME d\'un fichier.',
                recommendation: 'Ajouter : X-Content-Type-Options: nosniff'
            },
            'referrer-policy': {
                name: 'Referrer-Policy',
                value: headers.get('referrer-policy'),
                description: 'Contrôle les informations de référence transmises lors de la navigation.',
                recommendation: 'Ajouter : Referrer-Policy: strict-origin-when-cross-origin'
            },
            'permissions-policy': {
                name: 'Permissions-Policy',
                value: headers.get('permissions-policy'),
                description: 'Restreint l\'utilisation des API du navigateur (caméra, géolocalisation, etc.).',
                recommendation: 'Ajouter des restrictions selon vos besoins (ex: geolocation=())'
            }
        };

        let total = Object.keys(securityHeaders).length;
        let presentCount = 0;

        for (const key in securityHeaders) {
            if (securityHeaders[key].value) {
                presentCount++;
            }
        }

        const scorePercent = (presentCount / total) * 100;
        let grade = 'F';
        if (scorePercent >= 90) grade = 'A+';
        else if (scorePercent >= 75) grade = 'A';
        else if (scorePercent >= 60) grade = 'B';
        else if (scorePercent >= 40) grade = 'C';

        res.json({
            url: targetUrl,
            status: response.status,
            grade,
            scorePercent: Math.round(scorePercent),
            headers: securityHeaders
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Impossible de joindre l'hôte cible. Vérifiez l'URL ou la connexion Internet." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 HeaderShield démarré sur http://localhost:${PORT}`);
});