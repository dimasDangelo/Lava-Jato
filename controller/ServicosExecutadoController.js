const pool = require('../repository/connectionDB');

const getServicosExecutados = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Servico_Executado");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const insertServicosExecutados = async (req, res) => {
    try {
        const { nome, valor, Id_controle } = req.body;
        const [result] = await pool.query('INSERT INTO Servico_Executado (nome, valor, Id_controle) VALUES (?, ?, ?)', [nome, valor, Id_controle]);
        res.json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
  getServicosExecutados,
  insertServicosExecutados,
};
