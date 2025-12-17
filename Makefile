.PHONY: start-database start-backend stop-database run-backend

#Levanto el container de nuestra base de datos.
start-database:
	cd ./backend && docker compose up -d

#Detengo el container de la base de datos.
stop-database:
	cd ./backend && docker compose down

#Inicia nuestro backend.
start-backend:
	cd ./backend && npm run dev

#Inicio todo nuestro backend, tanto la base de dato como el backend en sí.
run-backend: start-database start-backend