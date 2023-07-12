const { Sequelize } = require('sequelize');

const db = new Sequelize({
    dialect: 'postgres',
    host: 'localhost', //Direccion donde se encuentra la DB
    username: 'postgres', //Usuario por defecto postgres
    password: 'root', //Contraseña que se digita en postgre
    database: 'bankaca', //Nombre de la DB
    logging: false
});

module.exports = { db };