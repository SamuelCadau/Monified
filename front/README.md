# Frontend — Monified (Quasar / Vue 3)

> Projet ancien — pas de mises à jour prévues, réalisé pour montée en compétence.

Cette application Quasar consomme l’API Monified afin d’afficher tableau de bord, actualités crypto et écrans d’authentification. Le code cible une exécution SPA classique (Vite) et s’appuie sur Axios + Pinia.

## Prérequis
- Node.js 18.x
- npm 9+ (ou `pnpm`/`yarn` si vous adaptez les scripts)
- Variables d’environnement `VITE_*` définies (voir ci-dessous)

## Installation & démarrage
```bash
cd front
npm install
npx quasar dev          # http://localhost:9000
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npx quasar dev` | Lancement en mode développeur (hot reload) |
| `npm run lint` | ESLint sur `.js` et `.vue` |
| `npx quasar build` | Build SPA production (dist/spa) |

## Variables d’environnement (`.env` → `.env.local`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base Axios vers l’API (`/api`) | `http://localhost:8080/api` |
| `VITE_LOG_LEVEL` (optionnel) | Niveau de verbosité du logger front | `info` |

Copier `./.env.example` vers `./.env.local` (ou `.env`) puis ajuster les valeurs selon l’environnement ciblé.

## Tests & qualité
- Lint : `npm run lint`
- Build (garantie de compilation) : `npx quasar build`

Des tests unitaires/UI ne sont pas fournis d’origine mais peuvent être ajoutés via Vitest/Jest + Vue Test Utils.

## Déploiement Docker (option SPA)
Le `docker-compose.yml` racine build déjà l’API et MySQL. Pour exposer le front sous Docker, ajouter un service basé sur `quasar build` + serveur statique (ex. `node:18-alpine` + `npx quasar build && npx http-server`). Cette étape n’est pas activée par défaut pour limiter la taille du compose.

## License & remerciements
- Licence : [MIT 2025 Samuel Cadau](../LICENSE.md)
- Frameworks : Quasar, Vue 3, Pinia, Axios. Merci aux mainteneurs open-source.
