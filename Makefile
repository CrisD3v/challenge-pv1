# Makefile para comandos Docker simplificados

.PHONY: help dev-local dev-cloud dev-full prod build clean logs

# Mostrar ayuda
help:
	@echo "🐳 Docker Commands para Challenge PV1"
	@echo ""
	@echo "Desarrollo:"
	@echo "  make dev-local    - Desarrollo con DB en la nube"
	@echo "  make dev-full     - Desarrollo completo con hot reload"
	@echo ""
	@echo "Producción:"
	@echo "  make prod         - Producción con DB en la nube"
	@echo ""
	@echo "Utilidades:"
	@echo "  make build        - Construir todas las imágenes"
	@echo "  make clean        - Limpiar contenedores y volúmenes"
	@echo "  make logs         - Ver logs de todos los servicios"
	@echo "  make logs-api     - Ver logs solo del API"
	@echo "  make logs-client  - Ver logs solo del client"

# Desarrollo
dev-local:
	@echo "🚀 Iniciando desarrollo con DB en la nube..."
	docker-compose --env-file .env.docker -f docker-compose.yml -f docker-compose.cloud.yml up --build

# Desarrollo completo con hot reload
dev-full:
	@echo "🚀 Iniciando desarrollo completo con hot reload..."
	docker-compose --env-file .env.docker -f docker-compose.yml -f docker-compose.cloud.yml -f docker-compose.dev.yml up --build

# Producción con DB en la nube
prod:
	@echo "🚀 Iniciando producción con DB en la nube..."
	NODE_ENV=production docker-compose -f docker-compose.yml -f docker-compose.cloud.yml up --build -d

# Construir imágenes
build:
	@echo "🔨 Construyendo todas las imágenes..."
	docker-compose -f docker-compose.yml build

# Limpiar contenedores y volúmenes
clean:
	@echo "🧹 Limpiando contenedores y volúmenes..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Ver logs
logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f backend

logs-client:
	docker-compose logs -f frontend

# Parar servicios
stop:
	docker-compose down

# Reiniciar servicios
restart:
	docker-compose restart
