COMPOSE = sudo docker compose

.PHONY: up down logs ps build rebuild stop prune db-shell

up:
	$(COMPOSE) up -d --build
	@echo "\n✅ Up! Frontend: http://localhost:3000  Backend: http://localhost:5000 (GET /healthz)\n"

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f --tail=200

ps:
	$(COMPOSE) ps

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) build --no-cache

stop:
	$(COMPOSE) stop

prune:
	$(COMPOSE) down -v --remove-orphans

db-shell:
	sudo docker exec -it $$(docker ps -qf name=postgres) psql -U postgres -d keijiban
