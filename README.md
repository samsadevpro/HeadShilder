# HeaderShield

HeaderShield est une petite application web qui vérifie la présence de six en-têtes HTTP de sécurité sur une URL. Elle fournit un score indicatif et des recommandations pour les en-têtes absents.

> Utilise l’outil uniquement sur des sites que tu possèdes ou pour lesquels tu as reçu une autorisation. Le serveur contacte l’URL soumise ; ne l’expose pas publiquement sans ajouter des protections adaptées.

## Fonctionnalités

- Analyse des en-têtes HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy et Permissions-Policy.
- Calcul d’un pourcentage de présence et attribution d’une note.
- Affichage de la valeur des en-têtes présents et d’une recommandation pour les absents.
- Interface en français, servie par Express.

## Prérequis

- Node.js 18 ou ultérieur.
- npm.

## Installation et lancement

À la racine du projet :

```bash
npm install
npm start
```

Ouvre ensuite [http://localhost:3000](http://localhost:3000) dans ton navigateur.

Le serveur écoute sur le port `3000`. Le script `npm start` lance `server.js`.

## Utilisation

1. Saisis une URL dans le formulaire. Le schéma peut être omis : l’application ajoutera alors `https://`.
2. Clique sur **Analyser**.
3. Consulte la note globale, puis le détail des six en-têtes.

L’application envoie une requête `GET` depuis le serveur vers l’adresse saisie et suit les redirections. Le navigateur communique avec l’API locale `POST /api/scan`.

### Calcul de la note

Chaque en-tête compte de façon identique. Le score est le nombre d’en-têtes présents divisé par six, exprimé en pourcentage.

| Note | Score |
|---|---:|
| A+ | 90 % ou plus |
| A | 75 % à moins de 90 % |
| B | 60 % à moins de 75 % |
| C | 40 % à moins de 60 % |
| F | moins de 40 % |

Avec six en-têtes évalués, les notes correspondent respectivement à 6, 5, 4, 3 et 0 à 2 en-têtes présents.

## Tester avec le serveur local fourni

Dans un premier terminal, démarre HeaderShield :

```bash
npm start
```

Dans un second terminal, démarre le site de test :

```bash
node test-target.js
```

Le site de test écoute sur le port `4000`. Dans HeaderShield, analyse `http://localhost:4000`. Les en-têtes de sécurité du fichier `test-target.js` sont commentés par défaut ; tu peux les décommenter pour tester l’évolution du score.

## Structure du projet

```text
.
├── public/
│   └── index.html   # Interface et code exécuté dans le navigateur
├── server.js        # Serveur Express et route POST /api/scan
├── test-target.js   # Petit serveur HTTP local de test (port 4000)
├── package.json     # Dépendances et scripts npm
└── package-lock.json
```

## Limites

- Le score vérifie uniquement la présence des en-têtes ; il ne valide pas la qualité ou la sûreté de leurs valeurs.
- Ce n’est ni un audit complet ni un test d’intrusion.
- Le serveur réalise des requêtes vers les adresses fournies. Pour un déploiement, il faut notamment restreindre les destinations autorisées, limiter les requêtes et éviter l’accès aux réseaux internes.
- Tailwind CSS est chargé depuis un CDN ; l’interface nécessite donc un accès à Internet pour charger cette feuille de style.
