#!/bin/sh

# Script d'initialisation pour Docker
echo "🚀 Initialisation de Social to Mealie Plus..."

# S'assurer que le répertoire /app/data existe avec les bonnes permissions
echo "📁 Vérification du répertoire de données..."

# Créer le répertoire s'il n'existe pas
mkdir -p /app/data /app/temp

# Donner les permissions appropriées
chmod 755 /app/data /app/temp
chown -R nextjs:nodejs /app/data /app/temp
touch /app/data/.permissions_test && rm -f /app/data/.permissions_test && echo "✅ Permissions d'écriture OK" || echo "❌ Problème de permissions d'écriture"

echo "📋 Informations du répertoire /app/data:"
ls -la /app/data/ || echo "Répertoire vide"
echo "👤 Utilisateur actuel: $(whoami)"
echo "🔐 ID utilisateur: $(id)"

# Vérifier si la base de données existe
if [ ! -f "/app/data/database.db" ]; then
    echo "📁 Création de la base de données..."
    su-exec nextjs npx prisma db push
    echo "✅ Base de données créée avec succès!"
else
    echo "📁 Base de données existante trouvée"
    # Vérifier si des migrations sont nécessaires
    su-exec nextjs npx prisma db push
fi

echo "🎯 Démarrage de l'application..."
echo "👤 Changement vers l'utilisateur nextjs..."
exec su-exec nextjs "$@"
