const pool = require('../repository/connectionDB');

const getAllClients = async (req, res) => {
  try {
    const [rows] = await pool.query("SElECT * FROM cliente");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar Clientes:", error);
    res.status(500).json({ error: error.message });
  }
};

const getPendingClients = async (req, res) => {
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
};
const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query("DELETE FROM cliente WHERE id = ?", [id]);
    res.json({
      message: "Cliente excluído com sucesso",
      affectedRows: rows.affectedRows,
    });
  } catch (error) {
    //console.error(error);
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.json({
        message: `Cliente não pode ser excluído, pois existem OSs atreladas a ele!`,
        affectedRows: 0,
      });
    }
    res.status(500).json({ message: error.message });
  }
};
const updateClient = async (req, res) => {
  try {
    const { id, nome, telefone, endereco } = req.params;
    const [rows] = await pool.query(
      "UPDATE cliente SET nome = ?, telefone = ?, endereco = ? WHERE id = ?",
      [nome, telefone, endereco, id]
    );
    res.json({
      message: "Cliente atualizado com sucesso",
      affectedRows: rows.affectedRows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const insertCLients = async (req, res) => {
  try {
    const { nome, telefone, endereco } = req.params;
    const [rows] = await pool.query(
      "INSERT INTO cliente (nome, telefone, endereco) VALUES (?, ?, ?)",
      [nome, telefone, endereco]
    );
    res.json({
      message: "Cliente adicionado com sucesso",
      insertId: rows.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllClients,
  getPendingClients,
  deleteClient,
  updateClient,
  insertCLients,
};
