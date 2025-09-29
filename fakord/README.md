# Plateforme Discord-

Une plateforme de chat collaborative inspirée de Discord, développée avec Next.js, TypeScript, MongoDB et Socket.IO.

## Fonctionnalités

- **Inscription & Authentification**  
  Les utilisateurs peuvent s’inscrire avec un email, un nom d’utilisateur et un mot de passe, et choisir leur genre et date de naissance.

- **Chat en temps réel**  
  Grâce à Socket.IO, les utilisateurs peuvent rejoindre des salons et discuter en temps réel.

- **Gestion des salons**  
  Les utilisateurs peuvent créer de nouveaux salons, voir la liste des salons disponibles, et rejoindre ou quitter un salon.

- **Présence des utilisateurs**  
  Visualisez quels utilisateurs sont en ligne et dans quels salons.

- **Stockage persistant**  
  Tous les utilisateurs, salons et messages sont stockés dans MongoDB.

- **Interface moderne**  
  Développée avec React et Tailwind CSS pour une interface moderne et responsive.

## Structure du projet

```
fakord/
│
├── app/
│   ├── api/              # Routes API pour les utilisateurs et salons (endpoints REST)
│   ├── composant/        # Composants React pour le chat, login, register, room, etc.
│   ├── lib/              # Utilitaires de connexion à la base de données
│   ├── model/            # Modèles Mongoose (user, room)
│   ├── pages/            # Pages (routing Next.js)
│   └── globals.css       # Styles globaux (Tailwind CSS)
│
├── public/               # Fichiers statiques (images, audio, etc.)
├── server.js             # Serveur Node.js personnalisé avec Socket.IO
├── socket.js             # Configuration du client Socket.IO
├── index.js              # Point d’entrée pour la connexion à la base de données
├── package.json          # Dépendances et scripts du projet
├── tsconfig.json         # Configuration TypeScript
└── .env.local            # Variables d’environnement (URI MongoDB, etc.)
```

## Démarrage

### Prérequis

- Node.js (v18+ recommandé)
- Instance MongoDB (locale ou cloud)

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/<votre-utilisateur>/Plateforme_Discord-.git
   cd Plateforme_Discord-/fakord
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   # ou
   npm install
   ```

3. **Configurer les variables d’environnement**  
   Créez un fichier `.env.local` dans le dossier `fakord` :
   ```
   URI=mongodb://localhost:27017/discord-clone
   ```

4. **Lancer le serveur de développement**
   ```bash
   pnpm dev
   # ou
   npm run dev
   ```

5. **Démarrer le serveur personnalisé (pour Socket.IO)**
   ```bash
   node server.js
   ```

6. **Ouvrir l’application**  
   Rendez-vous sur [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Scripts

- `pnpm dev` / `npm run dev` — Lance Next.js en mode développement
- `node server.js` — Lance le serveur personnalisé avec Socket.IO

## Technologies utilisées

- **Next.js** — Framework React pour SSR et routes API
- **TypeScript** — Typage pour React et Node.js
- **MongoDB & Mongoose** — Base de données et ODM
- **Socket.IO** — Communication temps réel
- **Tailwind CSS** — Framework CSS utilitaire

## Dossiers importants

- `app/model/user.ts` — Schéma et modèle utilisateur
- `app/model/room.ts` — Schéma et modèle salon
- `app/api/users/route.ts` — Endpoints API utilisateur (GET, POST, PUT)
- `app/api/rooms/route.ts` — Endpoints API salon (GET, POST, PUT)
- `server.js` — Serveur personnalisé avec Socket.IO

## Remarques

- Assurez-vous que MongoDB fonctionne et est accessible à l’URI spécifiée dans `.env.local`.
- L’application utilise un serveur personnalisé (`server.js`) pour activer Socket.IO avec Next.js.
- Les fichiers statiques (images, audio) sont dans le dossier `public/`.

## Licence

Ce projet est à but éducatif.

---

**Bon chat !**