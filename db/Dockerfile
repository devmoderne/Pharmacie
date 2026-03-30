FROM mysql:8.1

# Permet mot de passe vide
ENV MYSQL_ALLOW_EMPTY_PASSWORD yes

# Nom de la base
ENV MYSQL_DATABASE=dbvente

# Copie le script SQL d'initialisation
COPY dbvente.sql /docker-entrypoint-initdb.d/

# Port interne du container
EXPOSE 3306