.PHONY: start-database stop-database ver-database start-backend stop-backend start-backend-completo restart-backend-completo stop-backend-completo

#Levanto el container de nuestra base de datos.
start-database:
	cd ./backend && docker compose --profile db up -d

#Detengo el container de la base de datos.
stop-database:
	cd ./backend && docker compose --profile db down

#Entro desde la terminal a la base de datos(para poder manejarla rapido)
ver-database:
	cd ./backend && docker compose exec db psql -U Devs4U mateverse

#Inicia nuestro backend.
start-backend:
	cd ./backend && npm run dev 

#Detengo el backend.
stop-backend:
	pkill -f "npm run dev"

#Inicio todo nuestro backend, tanto la base de dato como el backend en sí.
start-backend-completo: start-database start-backend

#reinicia todo nuestro backend completo.
restart-backend-completo: stop-backend stop-database start-backend-completo

#Detiene todo nuestro backend completo
stop-backend-completo: stop-backend stop-database