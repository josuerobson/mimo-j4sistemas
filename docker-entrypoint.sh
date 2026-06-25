#!/bin/sh
set -e

echo "⏳ Aguardando banco de dados..."
sleep 3

echo "🔄 Executando migrations do Prisma..."
node node_modules/prisma/build/index.js migrate deploy

echo "✅ Migrations concluídas."
echo "🚀 Iniciando aplicação..."
exec "$@"