# 🐳 Déploiement Docker - Social to Mealie Plus

## 📋 Prérequis

- Docker et Docker Compose installés
- Clés API OpenAI et Mealie

## 🚀 Lancement rapide

### 1. Créer le fichier d'environnement

```bash
cp example.env .env
```

Puis éditer `.env` avec vos vraies valeurs :

```env
OPENAI_API_KEY=sk-your-openai-key
MEALIE_API_KEY=your-mealie-token
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### 2. Démarrer avec Docker Compose

```bash
docker-compose up -d
```

### 3. Accéder à l'application

- 🌐 **URL** : http://localhost:4000
- 👤 **Premier lancement** : Page de création du compte administrateur
- 🗂️ **Données persistées** : Volume Docker `social-to-mealie-data`

## 🔧 Configuration avancée

### Variables d'environnement

| Variable | Description | Obligatoire | Défaut |
|----------|-------------|-------------|---------|
| `DATABASE_URL` | Chemin base SQLite | ✅ | `file:/app/data/database.db` |
| `OPENAI_API_KEY` | Clé API OpenAI | ✅ | - |
| `MEALIE_API_KEY` | Token API Mealie | ✅ | - |
| `MEALIE_URL` | URL de votre Mealie | ✅ | - |
| `JWT_SECRET` | Secret pour JWT | ✅ | - |
| `USER_PROMPT` | Prompt personnalisé | ❌ | Prompt par défaut |
| `EXTRA_PROMPT` | Prompt additionnel | ❌ | - |

### Volumes

- `social-to-mealie-data:/app/data` : Persiste la base de données SQLite et les fichiers de cookies

## 🔄 Mise à jour

```bash
docker-compose pull
docker-compose up -d
```

## 🗂️ Sauvegarde

```bash
# Sauvegarder le volume
docker run --rm -v social-to-mealie-data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz -C /data .

# Restaurer le volume
docker run --rm -v social-to-mealie-data:/data -v $(pwd):/backup alpine tar xzf /backup/backup.tar.gz -C /data
```

## 📊 Logs et debug

```bash
# Voir les logs
docker-compose logs -f social-to-mealie

# Accéder au container
docker exec -it social-to-mealie sh
```

## ✅ Fonctionnalités Docker

- 🗄️ **Base de données** : Créée automatiquement au premier lancement
- 👤 **Setup initial** : Page de création d'utilisateur automatique
- 💾 **Persistance** : Données sauvegardées dans un volume Docker
- 🔄 **Migration auto** : Mise à jour du schéma automatique
- 🛡️ **Sécurité** : Conteneur sans privilèges
