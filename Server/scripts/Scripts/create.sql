CREATE DATABASE IF NOT EXISTS LavaJato;

use Lavajato;

CREATE TABLE IF NOT EXISTS Cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL CHECK (LENGTH(nome) > 2), 
    telefone VARCHAR(15) NOT NULL,
    endereco VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS Servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Controle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data_hora DATETIME NOT NULL,
    id_Cliente INT NOT NULL,
    veiculo VARCHAR(100),
    placa VARCHAR(20),
    acrescimo_desconto DECIMAL(10, 2),
    total DECIMAL(10, 2) NOT NULL,
    observacao TEXT,
    pago BOOLEAN DEFAULT FALSE,
    pendente boolean DEFAULT false,
    forma_pagamento VARCHAR(50),
    FOREIGN KEY (id_Cliente) REFERENCES cliente(id)
);

CREATE TABLE IF NOT EXISTS Servico_Executado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    Id_controle INT NOT NULL,
    FOREIGN KEY (Id_controle) REFERENCES controle(id)
);


