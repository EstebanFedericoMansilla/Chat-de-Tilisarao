-- Script de inicialización de la base de datos para el Chat de Tilisarao
-- Este archivo debe ejecutarse en la base de datos PostgreSQL del despliegue

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nick VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Crear tabla de mensajes del chat
CREATE TABLE IF NOT EXISTS chats (
  id SERIAL PRIMARY KEY,
  nick VARCHAR(255) NOT NULL,
  msg TEXT NOT NULL,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_chats_created ON chats(created);
CREATE INDEX IF NOT EXISTS idx_users_nick ON users(nick);

-- Comentario: Las tablas se crean automáticamente si no existen
-- gracias al uso de "CREATE TABLE IF NOT EXISTS" 