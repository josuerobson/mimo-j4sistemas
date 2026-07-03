#!/bin/sh
set -e

echo "⏳ Aguardando banco de dados..."
sleep 3

echo "🔄 Sincronizando schema do Prisma..."
node node_modules/prisma/build/index.js db push --accept-data-loss

echo "✅ Schema sincronizado."
echo "🚀 Iniciando aplicação..."
exec "$@"