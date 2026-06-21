# STANE TECH SaaS Project Structure

Cette architecture complète pour le projet SaaS STANE TECH comprend un frontend Next.js, un backend Node.js Express et une intégration MongoDB.

## Structure du Projet

```text
stane-tech/
├── frontend/          # Application Next.js (App Router, Tailwind CSS, TypeScript)
├── backend/           # API Node.js Express (MongoDB integration)
└── README.md
```

## Démarrage Local

### Backend

1. Allez dans le dossier `backend` : `cd backend`
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env` basé sur `.env.example` et configurez votre `MONGO_URI`.
4. Lancez le serveur : `npm run dev`

### Frontend

1. Allez dans le dossier `frontend` : `cd frontend`
2. Installez les dépendances : `npm install`
3. Créez un fichier `.env.local` basé sur `.env.example`.
4. Lancez l'application : `npm run dev`

## Configuration de base incluse

- **Frontend** : Configuration Next.js avec TypeScript, Tailwind CSS, et un exemple d'appel API vers le backend.
- **Backend** : Configuration Express avec connexion MongoDB (Mongoose), gestion des variables d'environnement (dotenv), et support CORS.
  - **Authentification** : JWT (Register, Login, Reset Password, Update Details/Password).
  - **Produits** : CRUD complet pour les produits digitaux.
  - **Commandes** : Système de création et gestion de commandes.
  - **Paiement** : Module de paiement simulé (Money Flow + Fallback) et endpoint webhook.
  - **Sécurité** : Middlewares d'authentification et de gestion des rôles (Admin/User).
  - **Documentation** : Voir `backend/API_DOCUMENTATION.md` pour les détails des endpoints.
- **Connexion** : Configuration de base pour la communication entre le frontend et le backend.
