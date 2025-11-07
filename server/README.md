# Backend — Monified (Node/Express + Sequelize)

> Projet ancien — pas de mises à jour prévues, réalisé pour montée en compétence.

L’API expose les fonctionnalités d’authentification (JWT + Passport Google/Microsoft), d’agrégation crypto (Sequelize/MySQL) et les endpoints consommés par l’interface Quasar.

## Prérequis
- Node.js 18.x
- MySQL 8 (local ou via `docker compose`)
- Fichier `.env` dérivé de `server/.env.example`

## Installation & exécution
```bash
cd server
npm install
npm run dev          # nodemon (http://localhost:8080)
```

Scripts additionnels :

| Commande | Description |
|----------|-------------|
| `npm run start` | Démarrage sans hot reload |
| `npm test` | Jest + Supertest (SQLite in-memory) |

## Variables d’environnement principales

Voir `server/.env.example` (copié automatiquement depuis la racine). Résumé :

| Catégorie | Variables clés |
|-----------|----------------|
| Serveur & CORS | `PORT`, `CLIENT_ORIGIN`, `LOG_LEVEL` |
| Base de données | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_DIALECT`, `DB_STORAGE`, `DB_SYNC` |
| Sécurité | `SESSION_SECRET`, `TEMP_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN` |
| OAuth Google | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` |
| OAuth Microsoft | `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_CALLBACK_URL`, `MS_TENANT_ID` |
| Intégrations | `BINANCE_API_KEY`, `BINANCE_SECRET_KEY`, SMTP (`SMTP_*`) |

> Ne jamais commiter de valeurs réelles : utilisez les placeholders fournis.

## Tests & qualité
- `npm test` : couvre `/healthz`, middleware JWT et routes OAuth désactivées via Supertest.
- Lint/format : non configurés par défaut (se conformer à l’éditeur/CI).

## Base de données
- **Développement** : MySQL 8 (locale ou `docker compose`).  
- **Tests** : SQLite en mémoire via Sequelize (`DB_DIALECT=sqlite`, `DB_STORAGE=:memory:`).
- Le fichier `src/models/index.js` charge automatiquement les modèles et active les associations.
- `DB_SYNC` contrôle la stratégie : `safe` (par défaut), `alter`, `force`, `skip`.

## Docker
Lancer `docker compose up --build` à la racine pour obtenir MySQL + API. La variable `DB_HOST` est forcée sur `db` lorsqu’on exécute le conteneur.

## License & remerciements
- Licence : [MIT 2025 Samuel Cadau](../LICENSE.md)
- Merci aux projets open-source utilisés : Express, Sequelize, Passport, Jest/Supertest, etc.
