# PatrimBox — Documentation

Portail de documentation de **PatrimBox** (centre d’aide, en français), construit avec
[Nextra v4](https://nextra.site) sur le App Router de Next.js 16.

## Stack

- **Next.js 16** + **React 19**
- **Nextra 4** + **nextra-theme-docs 4** (App Router)
- **Pagefind** pour la recherche (indexée au `postbuild`)
- **pnpm** comme gestionnaire de paquets
- Thème clair/sombre via next-themes (intégré à Nextra), responsive

L’identité visuelle (couleur primaire `#5474B4`, logo, favicon, police Roboto) est
reprise de l’application PatrimBox.

## Démarrage

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Build de production

```bash
pnpm build        # build Next.js + génère l’index Pagefind (postbuild)
pnpm start        # sert le build de production
pnpm check-types  # vérification TypeScript
```

> La recherche n’est disponible qu’après un `pnpm build` (l’index Pagefind est
> généré dans `public/_pagefind`).

## Structure du contenu

Le contenu vit sous `app/`, chaque page étant un `page.mdx`. L’ordre et les titres
de la barre latérale sont définis par les fichiers `_meta.js`.

```
app/
├── _meta.js                  # sections de la barre latérale
├── page.mdx                  # accueil
├── premiers-pas/             # présentation, compte, connexion, sécurité
├── espace-client/            # coffres-forts, espaces, documents, premium
├── espace-professionnel/     # notaires/avocats/agents/courtiers
├── abonnement/               # plan premium, souscription, gestion
├── compte/                   # profil, sécurité, stockage
└── aide/                     # statuts, FAQ
```

Pour ajouter une page : créez `app/<section>/<slug>/page.mdx` puis référencez le
`slug` dans le `_meta.js` de la section.

## Note technique

`zod` est épinglé à `4.3.6` via `pnpm.overrides` : les versions `4.4.x` cassent la
validation des props du composant `Layout` de `nextra-theme-docs@4.6`.
