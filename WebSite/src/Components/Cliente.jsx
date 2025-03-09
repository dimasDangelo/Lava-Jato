import React, { Fragment, useEffect, useState } from "react";
import useFetch from "./hooks/UseRequest";
import useAlerta from "./hooks/UseAlerta";
import DataGrid from "./utils/DataGrid";
import Modal from "./utils/Modal";

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedClient, SetselectedClient] = useState();
  const [oss, setOss] = useState([]);
  const { fetchData } = useFetch();
  const { exibirAlerta } = useAlerta(2000);
  const [novoCliente, setNovoCliente] = useState({ nome: "", telefone: "", endereco: "" });
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setNovoCliente({ nome: "", telefone: "", endereco: "" });
    setModalOpen(false);
  };

  const handleConfirm = (e) => {
    handleSubmit(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCliente({ ...novoCliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (novoCliente.nome === "" || novoCliente.telefone === "" || novoCliente.endereco === "") {
      exibirAlerta("Preencha todos os campos !", "danger");
      return;
    }
    if (novoCliente.id !== undefined) {
      await updateCliente();
    } else {
      await addCliente();
    }
    handleCloseModal();
  };

  const addCliente = async () => {
    const dados = await fetchData(`/clientes/add/${novoCliente.nome}/${novoCliente.telefone}/${novoCliente.endereco}`);
    if (dados) {
      setClientes([...clientes, novoCliente]);
      exibirAlerta("Cliente adicionado com sucesso!", "success");
    }
  };

  const updateCliente = async () => {
    const dados = await fetchData(`/clientes/update/${novoCliente.id}/${novoCliente.nome}/${novoCliente.telefone}/${novoCliente.endereco}`);
    if (dados) {
      setClientes((prev) =>
        prev.map((item) => (item.id === novoCliente.id ? { ...item, ...novoCliente } : item))
      );
      exibirAlerta("Cliente atualizado com sucesso!", "warning");
    }
  };

  const deleteCliente = async (id) => {
    const dados = await fetchData(`/clientes/delete/${id}`);
    if (dados.affectedRows !== undefined && dados.affectedRows > 0) {
      setClientes((prev) => prev.filter((item) => item.id !== id));
      exibirAlerta(dados.message, "success");
      return
    }
    exibirAlerta(dados.message, "danger");
  };

  const visualizarDataCliente = async (id) => {
    SetselectedClient(id);
    const dados = await fetchData(`/controle/totalcliente/${id}`);
        if (dados) {
            setOss(dados);
        }
  }
  const deleteOs = async(id) => {
    const dados = await fetchData(`/controle/delete/${id}`);
    if (dados.affectedRows !== undefined && dados.affectedRows > 0) {
      const dados = await fetchData(`/controle/totalcliente/${selectedClient}`);
      if (dados) {
          setOss(dados);
      }
      exibirAlerta("Os Excluida com Sucesso!", "success");
      return
    }
    exibirAlerta(dados.message, "danger");
}

  useEffect(() => {
    const carregarClientes = async () => {
      const dados = await fetchData("/clientes");
      if (dados) {
        setClientes(dados);
      }
    };
    carregarClientes();
  }, []);

  return (
    <Fragment>
      <div className="card rounded shadow" >
        <div className="card-header bg-primary text-white">Cadastro de Clientes</div>
        <div className="card-body">
          <button className="btn btn-primary" onClick={handleOpenModal}>Adicionar Cliente</button>
          <DataGrid
            data={clientes}
            columns={[
              { key: "nome", label: "Nome" },
              { key: "telefone", label: "Telefone" },
              { key: "endereco", label: "Endereço" },
            ]}
            pageSize={4}
            actionColumns={[
              { label: "Visualizar", onAction: (e) => visualizarDataCliente(e), color: "blue" },
              { label: "Editar", onAction: (e) => setNovoCliente(clientes.find(c => c.id === e)) || handleOpenModal(), color: "green" },
              { label: "Deletar", onAction: (e) => deleteCliente(e), color: "red" },
            ]}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        title={"Cliente:"}
        size={'gg'}
      >
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col mb-3">
              <label className="form-label">Nome</label>
              <input type="text" className="form-control" name="nome" value={novoCliente.nome} onChange={handleChange} required />
            </div>
            <div className="col mb-3">
              <label className="form-label">Telefone</label>
              <input type="text" className="form-control" name="telefone" value={novoCliente.telefone} onChange={handleChange} required />
            </div>
            <div className="col mb-3">
              <label className="form-label">Endereço</label>
              <input type="text" className="form-control" name="endereco" value={novoCliente.endereco} onChange={handleChange} required />
            </div>
          </div>
        </form>
      </Modal>
      <div className="card rounded shadow" >
      <DataGrid
                        data={oss}
                        columns={[
                            { key: "id", label: "OS", flex: 1 },
                            { key: "data_hora", label: "Data", flex: 1 },
                            { key: "nome", label: "Cliente", flex: 1 },
                            { key: "veiculo", label: "Veículo", flex: 1 },
                            { key: "placa", label: "Placa", flex: 1 },
                            { key: "servicos", label: "Serviços", flex: 1 },
                            { key: "total", label: "Total", flex: 1 },
                            { key: "acrescimo_desconto", label: "Acréscimo ou Desconto", flex: 1 },
                            { key: "total_calculado", label: "Total com Acréscimo", flex: 1 },
                            { key: "observacao", label: "Observação", flex: 1 },
                            { key: "pago", label: "Pago", flex: 1, },
                            { key: "forma_pagamento", label: "Forma de Pagamento", flex: 1 }
                        ]}
                        pageSize={4}
                        actionColumns={[
                            { label: "Deletar", onAction: (e) => {deleteOs(e)}, color: "red" }
                        ]}
                    />
      </div>
    </Fragment>
  );
};

export default Cliente;
