

const QueryPorCliente = (id, dataInicio, dataFim, pendente = false, getAll = false) => {
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
};

const Teste = () => {
  return "select 1";
}

module.exports ={
  QueryPorCliente,
  Teste

}