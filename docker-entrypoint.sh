#!/bin/sh
set -e

echo "⏳ Aguardando banco de dados..."
sleep 3

echo "🔄 Executando migrations do Prisma..."
./node_modules/.bin/prisma migrate deploy

echo "✅ Migrations concluídas. Iniciando aplicação..."
exec "$@"