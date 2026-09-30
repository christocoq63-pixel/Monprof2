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
5. Ajouter :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : votre clé Claude (`sk-ant-...`)
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
# créer un fichier .env.local contenant :
# ANTHROPIC_API_KEY=sk-ant-...
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

Si votre appli est **publique** (URL accessible à tous), n'importe qui
peut utiliser votre clé API (et donc consommer votre crédit). Pour limiter :

- Rendez le dépôt GitHub **privé** (ça ne change rien à la sécurité, mais
  personne ne peut voir la config)
- Ajoutez une simple protection par mot de passe côté Vercel
  (Vercel Password Protection — payant)
- Ou ajoutez une clé simple à envoyer avec chaque requête (je peux vous
  ajouter ça sur demande)

---

## 📊 Coût

- **Vercel** : gratuit tant que vous restez sous le quota (largement suffisant
  pour usage personnel)
- **Anthropic** : environ **0,05 $ par conversation de 20 messages** avec
  Claude Sonnet 4. Sur 30 min de discussion par jour, comptez **~2 $ par mois**.
- Si vous voulez moins cher, changez le modèle dans `api/chat.js` :
  remplacez `claude-sonnet-4-20250514` par `claude-haiku-4-5-20251001` — environ
  10x moins cher, un peu moins bon.

---

## 🎨 Personnalisation

- **Nom** : dans `vite.config.js`, section `manifest.name` et `short_name`
- **Couleur** : dans `vite.config.js`, `theme_color` (et régénérez les icônes)
- **Modèle** : dans `api/chat.js`, changez `model`
- **Ajouter des langues/avatars/niveaux** : dans `src/App.jsx`, section
  `LANGUAGES` et `LEVELS` au début du fichier

---

## 🐛 Ça ne marche pas ?

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
