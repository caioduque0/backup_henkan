CREATE USER 'backend_node'@'%' IDENTIFIED BY '12345678A!';
GRANT ALL PRIVILEGES ON henkan.* TO 'backend_node'@'%';
FLUSH PRIVILEGES;

CREATE DATABASE IF NOT EXISTS henkan;

USE henkan;

-- Criação da tabela 'users'
CREATE TABLE IF NOT EXISTS users (
    id_user CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    mac CHAR(12) NOT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criação da tabela 'lists' com as novas colunas
CREATE TABLE IF NOT EXISTS lists (
    id_list CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    id_owner CHAR(36) NOT NULL,
    conteudo TEXT,
    data_criacao DATETIME,
    data_modificacao DATETIME,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lists_users FOREIGN KEY (id_owner) REFERENCES users(id_user)
);

-- Criação da tabela 'list_requests'
CREATE TABLE IF NOT EXISTS list_requests (
    id_lists_requests INT AUTO_INCREMENT PRIMARY KEY,
    situation CHAR(1) NOT NULL,
    user_id_user CHAR(36) NOT NULL,
    list_id_list CHAR(36) NOT NULL,
    confirmation_date TIMESTAMP DEFAULT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_list_requests_users FOREIGN KEY (user_id_user) REFERENCES users(id_user),
    CONSTRAINT fk_list_requests_lists FOREIGN KEY (list_id_list) REFERENCES lists(id_list) 
);

-- Criação da tabela 'products'
CREATE TABLE IF NOT EXISTS products (
    id_product CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) NOT NULL,
    quantity SMALLINT NOT NULL,
    price DOUBLE NOT NULL,
    user_id_user CHAR(36) NOT NULL,
    list_id_list CHAR(36) NOT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_users FOREIGN KEY (user_id_user) REFERENCES users(id_user),
    CONSTRAINT fk_products_lists FOREIGN KEY (list_id_list) REFERENCES lists(id_list)
);

-- Criação da tabela 'user_has_lists'
CREATE TABLE IF NOT EXISTS user_has_lists (
    id_user_lists CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    user_id_user CHAR(36) NOT NULL,
    list_id_list CHAR(36) NOT NULL,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_has_lists_users FOREIGN KEY (user_id_user) REFERENCES users(id_user),
    CONSTRAINT fk_user_has_lists_lists FOREIGN KEY (list_id_list) REFERENCES lists(id_list)
);