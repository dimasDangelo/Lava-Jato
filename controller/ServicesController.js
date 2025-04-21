const pool = require('../repository/connectionDB');

const getServices = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM servico');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query(`DELETE FROM servico WHERE id = ${id}`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const [rows] = await pool.query(`UPDATE servico SET nome = ${req.params.nome}, valor = ${req.params.valor} WHERE id = ${req.params.id}`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const insertService = async (req, res) => {
    try {
        const [rows] = await pool.query(`INSERT INTO servico (nome, valor) values('${req.params.nome}', ${req.params.valor})`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
  getServices,
  deleteService,
  updateService,
  insertService,
};
