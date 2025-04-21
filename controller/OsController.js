const pool = require('../repository/connectionDB');
const OsService = require('../service/OsService');

const UpdateOsPg = async (req, res) => {
  try {
    req.body.forEach((id) => {
      pool.query("update controle set pendente = 0, pago = 1 where id = ?", [
        id,
      ]);
      res.json({ status: true });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const GeneratePdf = async (req, res) => {
  try {
    await OsService.GerarPDf(res, {
      id_cliente: req.params.id_cliente,
      dataInicio: req.params.dataInicio,
      dataFim: req.params.dataFim,
    });
    // Nada mais aqui porque o PDF já está sendo enviado no service
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  UpdateOsPg,
  GeneratePdf
};
