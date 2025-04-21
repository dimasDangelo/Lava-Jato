const pool = require('../repository/connectionDB');
const ControleRepository = require("../repository/ControleRepository");

const getControle = async (req, res) => {
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
};

const getControlePorCliente = async (req, res) => {
  try {
    const query = ControleRepository.QueryPorCliente(
      req.params.id_cliente,
      req.params.dataInicio,
      req.params.dataFim
    );
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const getControlePorNotaPendente = async (req, res) => {
  try {
    const query = ControleRepository.QueryPorCliente(
      req.params.id_cliente,
      req.params.dataInicio,
      req.params.dataFim,
      true
    );
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const InsertControle = async (req, res) => {
  try {
    const {
      data_hora,
      idCliente,
      veiculo,
      placa,
      acrescimo_desconto,
      total,
      observacao,
      pago,
      forma_pagamento,
      servicos,
    } = req.body;
    const [result] = await pool.query(
      "INSERT INTO controle (data_hora, id_Cliente, veiculo, placa, acrescimo_desconto, total, observacao, pago, forma_pagamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        data_hora,
        idCliente,
        veiculo,
        placa,
        acrescimo_desconto,
        total,
        observacao,
        pago,
        forma_pagamento,
      ]
    );
    for (const servico of servicos) {
      pool.query(
        "INSERT INTO Servico_Executado (nome,valor,Id_controle) VALUES(?,?,?)",
        [servico.nome, servico.valor, result.insertId]
      );
    }
    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const TotalClientes = async (req, res) => {
  try {
    var query = ControleRepository.QueryPorCliente(req.params.id, "vazio", "vazio", false, true);
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteControle = async (req, res) => {
    try {
        const id = req.params.id;
        pool.query('DELETE FROM Servico_Executado WHERE id_controle = ?', [id]);
        const [rows] = await pool.query(`DELETE FROM controle WHERE id = ${id}`);
        res.json({ message: 'OS excluída com sucesso', affectedRows: rows.affectedRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
  getControle,
  getControlePorCliente,
  getControlePorNotaPendente,
  InsertControle,
  TotalClientes,
  deleteControle,
};
