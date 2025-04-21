const pool = require('../repository/connectionDB');
const PDFDocument = require('pdfkit')
const { QueryPorCliente } = require("../repository/ControleRepository");

//
const GerarPDf = async (res, { id_cliente, dataInicio, dataFim }) => {
  try {
    const query = QueryPorCliente(
      id_cliente,
      dataInicio,
      dataFim
    );
    const [dados] = await pool.query(query);

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${dados[0].nome}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    try {
      doc.image("logo.png", 50, 50, { width: 100, align: "center" });
    } catch (error) {
      console.error("Erro ao carregar a imagem:", error);
      doc
        .fontSize(12)
        .fillColor("red")
        .text("Erro ao carregar o logo.", 50, 50);
    }

    doc.moveDown(4);
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#333")
      .text(
        "Rua: Engenheiro José Márcio Paschoalino - Número: 10 - Bairro: Jardim Gaúcho",
        { align: "center" }
      );
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#333")
      .text(
        "Telefone: (32) 9 9951-5749 - Email: guimagalhaespcx2021@gmail.com",
        { align: "center" }
      );
    doc.moveDown(1);
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#333")
      .text("Registro de Serviços", { align: "center" });
    doc.moveDown(2);

    let totalGeral = 0;
    doc.fontSize(15).font("Helvetica-Bold").fillColor("#000");
    doc.text(`Cliente: ${dados[0].nome}`);
    doc.moveDown(2);

    dados.forEach((item) => {
      doc.fontSize(12).font("Helvetica").fillColor("#000");
      doc.text(`Data/Hora: ${formatarDataHora(item.data_hora)}`);
      doc.text(`Veículo: ${item.veiculo}`);
      doc.text(`Placa: ${item.placa}`);
      doc.text(`Serviços: ${item.servicos}`);
      doc.text(`Total: ${formatarMoeda(parseFloat(item.total))}`);
      doc.text(
        `Acréscimo/Desconto: ${formatarMoeda(
          parseFloat(item.acrescimo_desconto)
        )}`
      );
      if (item.observacao) {
        doc.text(`Observação: ${item.observacao}`);
      }
      doc
        .text(
          `Total Calculado: ${formatarMoeda(parseFloat(item.total_calculado))}`
        )
        .moveTo(50, doc.y);

      doc.moveDown(1);
      doc.strokeColor("#ddd").moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);
      totalGeral += parseFloat(item.total_calculado);
    });

    doc.moveDown(2);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#000")
      .text(`Total Geral: ${formatarMoeda(totalGeral)}`, 400, doc.y, {
        align: "right",
      });

    dados.forEach((item) => {
      pool.query(`UPDATE controle SET pendente = 1 Where id = ?`, [item.id]);
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao gerar o PDF.");
  } finally {
    if (global.gc) global.gc();
  }
};


// Função para formatar a data e hora
function formatarDataHora(dataHora) {
  const [data, hora] = dataHora.split(" ");
  const [dia, mes, ano] = data.split("-");
  return `${dia}/${mes}/${ano} às ${hora}`;
}

// Função para formatar valores monetários
function formatarMoeda(valor) {
  const formato = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Math.abs(valor));
  return valor < 0 ? `R$ -${formato.replace("R$", "").trim()}` : formato;
}

module.exports = {
  GerarPDf,
};
