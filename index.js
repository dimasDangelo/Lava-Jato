const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const routes = require('./route/routes');

dotenv.config();
const app = express();

app.use(cors({
    //origin: 'http://localhost:3000', //produção
    origin: 'http://localhost:5173', //homologação
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//  // Servir arquivos estáticos do React
// const frontendPath = path.join(__dirname, 'WebSite/dist');
// app.use(express.static(frontendPath));

//  // Rota fallback para React Router
// app.get('http://localhost:5173', (req, res) => {
//     res.sendFile(path.join(frontendPath, 'index.html'));
// });

const port = 3000;
app.use(express.json());



app.use('/', routes);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});


