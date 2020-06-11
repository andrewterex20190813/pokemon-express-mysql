# Rest Api Node and Mysql

# Create or Update .env File

# Create Database and Tables using MySql Query
CREATE DATABASE IF NOT EXISTS pokemon;
DROP TABLE IF EXISTS users;
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50), password VARCHAR(50), pokemon INT);
DROP TABLE IF EXISTS pokemons;
CREATE TABLE pokemons (id INT AUTO_INCREMENT PRIMARY KEY, number INT NOT NULL, name VARCHAR(50), image VARCHAR(255), assigned BOOLEAN);

