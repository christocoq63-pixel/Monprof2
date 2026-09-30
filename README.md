# MonProf — l'appli

Application web progressive (PWA) pour apprendre les langues en discutant
avec des interlocuteurs virtuels. Installable sur Android et iOS depuis
le navigateur, avec voix, correction et sauvegarde des conversations.

---

## 🚀 Déploiement sur Vercel — pas à pas

Compter environ **10 minutes** au total pour tout mettre en ligne.

### 1. Créer un compte Anthropic et obtenir une clé API

1. Aller sur https://console.anthropic.com
2. Créer un compte (gratuit, 5 $ de crédit offerts)
3. Section **API Keys** → **Create Key**
4. **Copier la clé** (elle commence par `sk-ant-...`)
   ⚠️ Elle ne sera affichée **qu'une seule fois**. Notez-la immédiatement.

### 2. Créer un compte GitHub (si vous n'en avez pas)

1. Aller sur https://github.com
2. Créer un compte gratuit

### 3. Créer un compte Vercel

1. Aller sur https://vercel.com
2. Cliquer sur **Sign Up** → **Continue with GitHub**
3. Autoriser Vercel à accéder à GitHub

### 4. Déposer le code sur GitHub

**Option A — via l'interface web (le plus simple) :**

1. Sur GitHub, cliquer sur le **+** en haut à droite → **New repository**
2. Nom : `monprof`
3. **Public** ou **Private** (peu importe)
4. Ne cochez **rien d'autre**
5. Cliquer **Create repository**
6. Sur la page suivante, cliquer sur **"uploading an existing file"**
7. Glisser-déposer **tout le contenu du dossier `monprof`** (pas le dossier lui-même,
   son contenu : `src/`, `public/`, `api/`, `package.json`, etc.)
8. En bas, cliquer **Commit changes**

**Option B — via git en ligne de commande** (si vous connaissez git) :

```bash
cd monprof
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/monprof.git
git branch -M main
git push -u origin main
```

### 5. Importer le projet dans Vercel

1. Sur https://vercel.com/new
2. Cliquer sur **Import** à côté du dépôt `monprof`
3. Vercel détecte automatiquement Vite — laisser tous les réglages par défaut
4. ⚠️ **AVANT de cliquer sur Deploy**, dérouler **Environment Variables**
5. Ajouter ces 4 variables :

   | Name | Value | Où la trouver |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | votre clé Claude (`sk-ant-...`) | console.anthropic.com → API Keys |
   | `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Project Settings → API |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` (ou `SUPABASE_PUBLISHABLE_KEY`) | clé publique (`anon` / publishable) | Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | clé secrète `service_role` | Supabase → Project Settings → API — ⚠️ **secrète**, ne jamais la mettre dans le code |

   L'ancien nom `VITE_SUPABASE_ANON_KEY` fonctionne aussi à la place de
   `VITE_SUPABASE_PUBLISHABLE_KEY`.

   Le projet Supabase doit contenir les tables `profiles`, `lexicon`,
   `exercise_sessions`, `user_errors` et `level_tests`, avec la sécurité
   par ligne (RLS) activée pour que chaque utilisateur ne voie que ses données.
6. Cliquer **Add** puis **Deploy**
7. Attendre ~1 minute — le message **"Congratulations!"** apparaît

### 6. Récupérer l'URL de votre appli

Vercel affiche une URL du type `https://monprof-abc123.vercel.app` — c'est
l'adresse de votre appli, accessible depuis n'importe quel appareil.

### 7. Installer l'appli sur votre Android

1. Ouvrir **Chrome** sur votre Android
2. Aller sur votre URL Vercel
3. Menu **⋮** → **Installer l'application** (ou **Ajouter à l'écran d'accueil**)
4. Confirmer — l'icône bleue **MP** apparaît sur votre écran d'accueil
5. La toucher pour ouvrir l'appli en plein écran

Le micro et le stockage fonctionneront **beaucoup mieux** en PWA installée
qu'en artefact Claude.

---

## 💡 Utiliser en local pour tester (facultatif)

Si vous voulez tester avant de déployer :

```bash
cd monprof
npm install
# créer un fichier .env.local à partir de .env.example
# et y remplir les 4 variables
npm run dev
```

Ouvrir http://localhost:5173.

⚠️ En mode `dev`, l'API serverless de Vercel n'est pas exécutée. Pour tester
l'appel API en local, utilisez `vercel dev` (installer d'abord `npm i -g vercel`).

---

## 🔒 Sécurité

- La clé API est stockée **côté serveur** (variable d'environnement Vercel)
- Elle n'est **jamais** exposée dans le navigateur ni dans le code
- Le fichier `api/chat.js` reçoit les messages du navigateur et transmet
  à Anthropic avec la clé, puis renvoie la réponse
- `api/chat.js` n'accepte que les **utilisateurs connectés** : chaque requête
  doit porter le jeton de session Supabase, vérifié par le serveur. Seuls les
  modèles utilisés par l'appli sont acceptés, et la longueur des réponses
  est plafonnée
- `api/delete-account.js` ne supprime **que le compte de la personne
  connectée** qui fait la demande

⚠️ Toute personne qui crée un compte peut utiliser l'appli, donc votre
crédit Claude. Pour limiter : désactivez les inscriptions dans Supabase
(Authentication → Sign In / Providers) une fois vos comptes créés, et fixez
une limite de dépense dans la console Anthropic.

---

## 📊 Coût

- **Vercel** : gratuit tant que vous restez sous le quota (largement suffisant
  pour usage personnel)
- **Anthropic** : l'appli utilise **Claude Haiku 4.5** (rapide et peu cher),
  avec Claude Sonnet 4 en secours si Haiku ne répond pas.

---

## 🎨 Personnalisation

- **Nom** : dans `vite.config.js`, section `manifest.name` et `short_name`
- **Couleur** : dans `vite.config.js`, `theme_color` (et régénérez les icônes)
- **Modèle** : dans `src/App.jsx` (listes de modèles) **et** dans
  `api/chat.js` (`ALLOWED_MODELS`) — un modèle absent de cette liste est refusé
- **Ajouter des langues/avatars/niveaux** : dans `src/App.jsx`, section
  `LANGUAGES` et `LEVELS` au début du fichier

---

## 🐛 Ça ne marche pas ?

- **« Les clés Supabase ne sont pas configurées »** : ajoutez
  `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sur Vercel, puis Redeploy.
- **L'IA ne répond plus (erreur 401)** : la session a expiré — déconnectez-vous
  et reconnectez-vous. Si ça persiste, vérifiez les variables Supabase sur Vercel.
- **"ANTHROPIC_API_KEY is not configured"** : vous avez oublié la variable
  d'environnement sur Vercel. Settings → Environment Variables → l'ajouter
  → Redeploy.
- **Le micro ne marche pas sur Android** : ouvrez l'appli depuis Chrome
  (pas depuis l'app Claude). Les permissions micro fonctionnent normalement
  dans une PWA installée.
- **Icône moche sur l'écran d'accueil** : c'est normal la 1re fois — retirez-la
  et réinstallez, Android prend la bonne icône.
- **Les voix sont robotiques** : dans l'appli, en haut à droite du chat,
  touchez le bouton **A♪** pour choisir une meilleure voix. Sur Android,
  installez les voix Google Neural depuis Paramètres → Synthèse vocale.
