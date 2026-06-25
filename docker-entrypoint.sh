#!/bin/sh
set -e

echo "⏳ Aguardando banco de dados..."
sleep 3

echo "🔄 Executando migrations do Prisma..."
npx prisma migrate deploy

echo "✅ Migrations concluídas. Iniciando aplicação..."
exec "$@"