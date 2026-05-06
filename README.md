# Movie Dashboard

Dashboard web gratuit pour explorer les films via TMDb : catégories, années, acteurs, recommandations, fiches films, réalisateur et casting.

## Lancer en local

```bash
npm install
npm run dev
```

Créer un fichier `.env.local` à la racine :

```bash
VITE_TMDB_API_KEY=ta_cle_api_tmdb
```

## Déployer sur Vercel

1. Envoyer le dossier sur GitHub.
2. Importer le repo dans Vercel.
3. Ajouter la variable d'environnement :

```bash
VITE_TMDB_API_KEY=ta_cle_api_tmdb
```

4. Cliquer sur Deploy.

## Ajouter sur iPhone

1. Ouvrir l'URL Vercel dans Safari.
2. Cliquer sur Partager.
3. Choisir “Ajouter à l’écran d’accueil”.
