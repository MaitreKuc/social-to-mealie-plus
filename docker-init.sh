#!/bin/sh

# Script d'initialisation pour Docker
echo "🚀 Initialisation de Social to Mealie Plus..."

# Vérifier si la base de données existe
if [ ! -f "/app/data/database.db" ]; then
    echo "📁 Création de la base de données..."
    npx prisma db push
    echo "✅ Base de données créée avec succès!"
else
    echo "📁 Base de données existante trouvée"
    # Vérifier si des migrations sont nécessaires
    npx prisma db push
fi

echo "🎯 Démarrage de l'application..."
exec "$@"

echo "🎯 Démarrage de l'application..."
exec "$@"
