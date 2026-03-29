#!/bin/bash
# local_run.sh
# Script pour build et lancer le projet complet localement

echo "=== Build Frontend React ==="
cd Front || { echo "Front folder not found"; exit 1; }
npm install
npm run build || { echo "Build Front failed"; exit 1; }

echo "=== Copier le build dans le backend ==="
rm -rf ../Backend/src/main/resources/static/*
cp -r dist/* ../Backend/src/main/resources/static/

echo "=== Build Backend Spring Boot ==="
cd ../Backend || { echo "Backend folder not found"; exit 1; }
./mvnw clean install || { echo "Build Backend failed"; exit 1; }

echo "=== Lancer le Backend ==="
./mvnw spring-boot:run