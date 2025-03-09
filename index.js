const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const PDFDocument = require('pdfkit')
const fs = require('fs');
const cors = require('cors');
const path = require('path');

dotenv.config();
const app = express();



app.use(cors({
    origin: 'http://localhost:3000', //produção
    //origin: 'http://localhost:5173', //homologação
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// // // Servir arquivos estáticos do React
const frontendPath = path.join(__dirname, 'dist');
app.use(express.static(frontendPath));

// // // Rota fallback para React Router
app.get('http://localhost:5173', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const port = 3000;
app.use(express.json());



const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT)
});
// Função para formatar a data e hora
function formatarDataHora(dataHora) {
    const [data, hora] = dataHora.split(' ');
    const [dia, mes, ano] = data.split('-');
    return `${dia}/${mes}/${ano} às ${hora}`;
}

// Função para formatar valores monetários
function formatarMoeda(valor) {
    const formato = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(valor));
    return valor < 0 ? `R$ -${formato.replace('R$', '').trim()}` : formato;
}
function QueryPorCliente(id, dataInicio, dataFim, pendente = false, getAll = false) {
    let _getAll = getAll ? "" : "AND co.pago = 0";
    let _pendente = pendente ? "AND pendente = 1" : ""
    let data = dataInicio === "vazio" ? "" : `AND co.data_hora BETWEEN '${dataInicio} 00:00:00' AND '${dataFim} 23:59:59'`;
    return `
           SELECT
            co.id,
            DATE_FORMAT(CONVERT_TZ(STR_TO_DATE(REPLACE(co.data_hora, 'T', ' '), '%Y-%m-%d %H:%i:%s.000Z'), '+00:00', @@session.time_zone), '%d-%m-%Y %H:%i') AS data_hora,
            cl.nome,
            co.veiculo,
             (
              SELECT GROUP_CONCAT(se.nome SEPARATOR ', ')
              FROM Servico_Executado se
              WHERE se.Id_controle = co.id
             ) AS servicos,
            co.placa,
            co.total,
            co.acrescimo_desconto,
            (
             SELECT COALESCE(SUM(se.valor), 0)
             FROM Servico_Executado se
             WHERE se.Id_controle = co.id
             ) + COALESCE(co.acrescimo_desconto, 0) AS total_calculado,
            co.observacao,
            CASE co.pago
            WHEN 1 THEN 'Sim'
            WHEN 0 THEN 'Não'
            END AS pago,
            CASE co.pendente
            WHEN 1 THEN 'Sim'
            WHEN 0 THEN 'Não'
            END AS pendente,
            co.forma_pagamento
          FROM Controle co
          INNER JOIN Cliente cl ON cl.id = co.id_Cliente
          WHERE cl.id = ${id}
          ${_getAll}
          ${data}
          ${_pendente}
          ORDER BY co.id DESC`;
}

app.get('/controle/pornotaPendentes/:id_cliente/:dataInicio/:dataFim', async (req, res) => {

    try {
        const query = QueryPorCliente(req.params.id_cliente, req.params.dataInicio, req.params.dataFim, true);
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//rota para PDF:
app.get('/getpdfs/:id_cliente/:dataInicio/:dataFim', async (req, res) => {

    const query = QueryPorCliente(req.params.id_cliente, req.params.dataInicio, req.params.dataFim);
    const [dados] = await pool.query(query);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Disposition', `attachment; filename=${dados[0].nome}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    try {
        doc.image('logo.png', 50, 50, { width: 100, align: 'center' });
    } catch (error) {
        console.error('Erro ao carregar a imagem:', error);
        doc.fontSize(12).fillColor('red').text('Erro ao carregar o logo.', 50, 50);
    }
    doc.moveDown(4);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#333')
        .text('Rua: Engenheiro José Márcio Paschoalino - Número: 10 - Bairro: Jardim Gaúcho', { align: 'center' });
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#333')
        .text('Telefone: (32) 9 9951-5749 - Email: guimagalhaespcx2021@gmail.com', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#333')
        .text('Registro de Serviços', { align: 'center' });
    doc.moveDown(2);

    let totalGeral = 0;
    doc.fontSize(15).font('Helvetica-Bold').fillColor('#000');
    doc.text(`Cliente: ${dados[0].nome}`);
    doc.moveDown(2);

    dados.forEach(item => {
        doc.fontSize(12).font('Helvetica').fillColor('#000');
        doc.text(`Data/Hora: ${formatarDataHora(item.data_hora)}`);
        doc.text(`Veículo: ${item.veiculo}`);
        doc.text(`Placa: ${item.placa}`);
        doc.text(`Serviços: ${item.servicos}`);
        doc.text(`Total: ${formatarMoeda(parseFloat(item.total))}`);
        doc.text(`Acréscimo/Desconto: ${formatarMoeda(parseFloat(item.acrescimo_desconto))}`);
        if (item.observacao) {
            doc.text(`Observação: ${item.observacao}`);
        }
        doc.text(`Total Calculado: ${formatarMoeda(parseFloat(item.total_calculado))}`).moveTo(50, doc.y);

        doc.moveDown(1);
        doc.strokeColor('#ddd').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);
        totalGeral += parseFloat(item.total_calculado);
    });

    // Exibir o total geral no final
    doc.moveDown(2);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#000')
        .text(`Total Geral: ${formatarMoeda(totalGeral)}`, 400, doc.y, { align: 'right' });

    // Setando as notas que gerou o pdf como pendente 
    dados.forEach(item => {
        pool.query(`UPDATE controle SET pendente = 1 Where id = ?`, [item.id]);
    })

    doc.end();
    if (global.gc) {
        global.gc();
    }
});

// Rotas para Clientes
app.get('/clientes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cliente');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/clientes/pendentes', async (req, res) => {
    try {
        const [rows] = await pool.query(`select 
               cliente.id,
              cliente.nome
              from controle
              inner join cliente on cliente.id = controle.id_Cliente
              group by cliente.id;`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/clientes/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query('DELETE FROM cliente WHERE id = ?', [id]);
        res.json({ message: 'Cliente excluído com sucesso', affectedRows: rows.affectedRows });
    } catch (error) {
        //console.error(error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.json({ message: `Cliente não pode ser excluído, pois existem OSs atreladas a ele!`, affectedRows: 0 });
        }
        res.status(500).json({ message: error.message });
    }
});

app.get('/clientes/update/:id/:nome/:telefone/:endereco', async (req, res) => {
    try {
        const { id, nome, telefone, endereco } = req.params;
        const [rows] = await pool.query('UPDATE cliente SET nome = ?, telefone = ?, endereco = ? WHERE id = ?', [nome, telefone, endereco, id]);
        res.json({ message: 'Cliente atualizado com sucesso', affectedRows: rows.affectedRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/clientes/add/:nome/:telefone/:endereco', async (req, res) => {
    try {
        const { nome, telefone, endereco } = req.params;
        const [rows] = await pool.query('INSERT INTO cliente (nome, telefone, endereco) VALUES (?, ?, ?)', [nome, telefone, endereco]);
        res.json({ message: 'Cliente adicionado com sucesso', insertId: rows.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para Serviços
app.get('/servicos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM servico');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get(`/servicos/delete/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query(`DELETE FROM servico WHERE id = ${id}`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get(`/servicos/update/:id/:nome/:valor`, async (req, res) => {
    try {
        const [rows] = await pool.query(`UPDATE servico SET nome = ${req.params.nome}, valor = ${req.params.valor} WHERE id = ${req.params.id}`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get(`/servicos/add/:nome/:valor`, async (req, res) => {
    try {
        const [rows] = await pool.query(`INSERT INTO servico (nome, valor) values('${req.params.nome}', ${req.params.valor})`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/servicos', async (req, res) => {
    try {
        const { nome, valor } = req.body;
        const [result] = await pool.query('INSERT INTO servico (nome, valor) VALUES (?, ?)', [nome, valor]);
        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para Controle
app.get('/controle', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                co.id,
                 DATE_FORMAT(CONVERT_TZ(STR_TO_DATE(REPLACE(co.data_hora, 'T', ' '), '%Y-%m-%d %H:%i:%s.000Z'), '+00:00', @@session.time_zone), '%d-%m-%Y %H:%i') AS data_hora,
                cl.nome,
                co.veiculo,
                (
                    SELECT GROUP_CONCAT(se.nome SEPARATOR ', ')
                    FROM Servico_Executado se
                    WHERE se.Id_controle = co.id
                ) AS servicos,
                co.placa,
                co.total,
                co.acrescimo_desconto,
                (
                    SELECT COALESCE(SUM(se.valor), 0)
                    FROM Servico_Executado se
                    WHERE se.Id_controle = co.id
                ) + COALESCE(co.acrescimo_desconto, 0) AS total_calculado,
    
                co.observacao,
                CASE co.pago
                        WHEN 1 THEN 'Sim'
                        WHEN 0 THEN 'Não'
                END AS pago,
                co.forma_pagamento
            FROM Controle co
            INNER JOIN Cliente cl ON cl.id = co.id_Cliente
            ORDER BY co.id DESC
            LIMIT 1000`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/controle/porcliente/:id_cliente/:dataInicio/:dataFim', async (req, res) => {
    try {
        const query = QueryPorCliente(req.params.id_cliente, req.params.dataInicio, req.params.dataFim);
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/controle/add', async (req, res) => {
    try {
        const { data_hora, idCliente, veiculo, placa, acrescimo_desconto, total, observacao, pago, forma_pagamento, servicos } = req.body;
        const [result] = await pool.query('INSERT INTO controle (data_hora, id_Cliente, veiculo, placa, acrescimo_desconto, total, observacao, pago, forma_pagamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [data_hora, idCliente, veiculo, placa, acrescimo_desconto, total, observacao, pago, forma_pagamento]);
        for (const servico of servicos) {
            pool.query('INSERT INTO Servico_Executado (nome,valor,Id_controle) VALUES(?,?,?)', [servico.nome, servico.valor, result.insertId]);
        }
        res.json({ id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
app.get('/controle/totalcliente/:id', async (req, res) => {
    try {
        var query = QueryPorCliente(req.params.id, "vazio", "vazio", false, true);
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get(`/controle/delete/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        pool.query('DELETE FROM Servico_Executado WHERE id_controle = ?', [id]);
        const [rows] = await pool.query(`DELETE FROM controle WHERE id = ${id}`);
        res.json({ message: 'OS excluída com sucesso', affectedRows: rows.affectedRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para Serviços Executados
app.get('/servicos-executados', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Servico_Executado');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/servicos-executados', async (req, res) => {
    try {
        const { nome, valor, Id_controle } = req.body;
        const [result] = await pool.query('INSERT INTO Servico_Executado (nome, valor, Id_controle) VALUES (?, ?, ?)', [nome, valor, Id_controle]);
        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/os/marcarPG', async (req, res) => {
    try {
        req.body.forEach(id => {
            pool.query('update controle set pendente = 0, pago = 1 where id = ?', [id]);
            res.json({ status: true });
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
