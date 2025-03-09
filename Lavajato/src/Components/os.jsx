import React, { Fragment, useState, useEffect } from "react";
import DataGrid from "./utils/DataGrid";
import useFetch from "./hooks/UseRequest";
import Modal from "./utils/Modal";
import MultiSelect from "./utils/MultiSelect";
import SelectComponent from "./utils/SelectComponent ";
import UseValidation from "./hooks/UseValidation";
import useAlerta from "./hooks/UseAlerta";


const OS = () => {
    const { requiredFild, verifyRequiredField } = UseValidation();
    const { exibirAlerta } = useAlerta()
    const [inputError, setInputError] = useState({});
    const [ordens, setOrdens] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [servicos_executados, setServicosExecutado] = useState([]);
    const [total, setTotal] = useState("R$ 00,00");
    const { fetchData } = useFetch();
    const [novaOS, setNovaOS] = useState({
        data: "",
        cliente: "",
        veiculo: "",
        placa: "",
        servicos: "",
        acrescimoDesconto: "",
        total: "",
        observacao: "",
        pago: false,
        formaPagamento: "DINHEIRO",
    });
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setNovaOS({
            data: "",
            cliente: "",
            veiculo: "",
            placa: "",
            servicos: "",
            acrescimoDesconto: "",
            total: "",
            observacao: "",
            pago: false,
            formaPagamento: "DINHEIRO",
        });
        setTotal("R$ 00,00")
        setModalOpen(false);
        setInputError({});
    };

    const handleConfirm = (e) => {
        const inputRequired = [
            { label: 'data', value: novaOS.data },
            { label: 'cliente', value: novaOS.cliente },
            { label: 'veiculo', value: novaOS.veiculo },
            { label: 'placa', value: novaOS.placa },
        ];
        if (servicos_executados.length === 0) {
            inputRequired.push({ label: 'servicosExecutados', value: 'error' });
        }

        const errors = verifyRequiredField(inputRequired);
        setInputError(errors);
        if (Object.values(errors).length > 0) {
            exibirAlerta("Verifique os Campos Obrigatórios!", "danger");
            return;
        }

        handleSubmit(e);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name == 'acrescimoDesconto')
            setNovaOS({ ...novaOS, [name]: type === "checkbox" ? checked : value.replace(",", ".") });
        if (type === "select-one") {
            setNovaOS({ ...novaOS, [name]: value });
        }
        else
            setNovaOS({ ...novaOS, [name]: type === "checkbox" ? checked : value });
    };

    const handleChangeServicos = (e) => {
        setServicosExecutado(e);
    }
    const showTotal = () => {
        let soma = servicos_executados.reduce((_total, item) => _total + parseFloat(item.valor), 0);
        let _acrescimo = parseFloat(novaOS.acrescimoDesconto) || 0; // Garante que seja um número válido
        let totalFinal = soma + _acrescimo;
        setTotal(`R$ ${totalFinal.toFixed(2)}`); // Formata para duas casas decimais
    };

    useEffect(() => {
        showTotal();
    }, [handleChangeServicos,])

    const addCOontrole = async () => {
        const body = {
            data_hora: novaOS.data,
            idCliente: novaOS.cliente,
            veiculo: novaOS.veiculo,
            placa: novaOS.placa,
            acrescimo_desconto: novaOS.acrescimoDesconto === '' ? 0 : novaOS.acrescimoDesconto,
            total: parseFloat(total.replace("R$", "").trim()),
            observacao: novaOS.observacao,
            pago: novaOS.pago ? 1 : 0,
            forma_pagamento: novaOS.formaPagamento,
            servicos: servicos_executados
        }
        const dados = await fetchData("/controle/add", "POST", body);
        if (dados) {
            const dados = await fetchData("/controle");
            if (dados) {
                setOrdens(dados);
            }
            handleCloseModal();
            exibirAlerta("Ordem de Servico adicionada!", "success")
        } else {
            exibirAlerta("Falha ao Salvar a Ordem de Servico!", "danger")
        }
    }
    const deleteOs = async(id) => {
        const dados = await fetchData(`/controle/delete/${id}`);
        if (dados.affectedRows !== undefined && dados.affectedRows > 0) {
            const _dados = await fetchData("/controle");
            if (_dados) {
                setOrdens(_dados);
            }
          exibirAlerta(dados.message, "success");
          return
        }
        exibirAlerta(dados.message, "danger");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        addCOontrole();
        setNovaOS({
            data: "",
            cliente: "",
            veiculo: "",
            placa: "",
            servicos: "",
            acrescimoDesconto: "",
            total: "",
            observacao: "",
            pago: false,
            formaPagamento: "DINHEIRO",
        });
    };
    useEffect(() => {
        const carregarOSs = async () => {
            const dados = await fetchData("/controle");
            if (dados) {
                setOrdens(dados);
            }
        };
        const carregarServicos = async () => {
            const dados = await fetchData('/servicos');
            if (dados) {
                setServicos(dados);
            }
        };
        const carregarClientes = async () => {
            const dados = await fetchData("/clientes");
            if (dados) {
                setClientes(dados);
            }
        };

        carregarClientes();
        carregarServicos();
        carregarOSs();
    }, []);

    return (
        <Fragment>
            <div className="card rounded shadow">
                <div className="card-header bg-primary text-white">Cadastro de Ordem de Serviço</div>
                <div className="card-body">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>Adicionar OS</button>
                    <DataGrid
                        data={ordens}
                        columns={[
                            { key: "id", label: "id OS", flex: 1 },
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
                        pageSize={5}
                        actionColumns={[
                            { label: "Deletar", onAction: (e) => deleteOs(e), color: "red" }
                        ]}
                    />
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={(e) => handleConfirm(e)}
                    title={'Ordem de Serviço'}
                    size={'gg'}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Data</label>
                                <input type="datetime-local" className="form-control" name="data" value={novaOS.data} onChange={handleChange} required />
                                {requiredFild(inputError.data)}
                            </div>
                            <div className="col mb-3">
                                <SelectComponent options={clientes} name={'cliente'} onChange={handleChange} title="Selecione Um Cliente:"
                                />
                                {requiredFild(inputError.cliente)}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Veículo</label>
                                <input type="text" className="form-control" name="veiculo" value={novaOS.veiculo} onChange={handleChange} required />
                                {requiredFild(inputError.veiculo)}
                            </div>
                            <div className="col mb-3">
                                <label className="form-label">Placa</label>
                                <input type="text" className="form-control" name="placa" value={novaOS.placa} onChange={handleChange} required />
                                {requiredFild(inputError.placa)}
                            </div>
                        </div>

                        <div className="col mb-3">
                            <label className="form-label">Serviços</label>
                            <MultiSelect options={servicos} onChange={handleChangeServicos} />
                            {requiredFild(inputError.servicosExecutados)}
                        </div>
                        <div className="col-7 mb-3">
                            <label className="form-label">Acréscimo/Desconto em R$</label>
                            <input type="text" className="form-control" name="acrescimoDesconto" value={novaOS.acrescimoDesconto} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Total</label>
                            <input type="text" className="form-control" name="total" value={total} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Observação</label>
                            <textarea className="form-control" name="observacao" value={novaOS.observacao} onChange={handleChange}></textarea>
                        </div>
                        <div className="row">
                            <div className="col-3 mb-3">
                                <label className="form-label">Pago:</label>
                                <select className="form-control" name="pago" value={novaOS.pago} onChange={handleChange}>
                                    <option value="false">NÃO</option>
                                    <option value="true">SIM</option>
                                </select>
                            </div>
                            <div className="col-5 mb-3">
                                <label className="form-label">Forma de Pagamento</label>
                                <select className="form-control" name="formaPagamento" value={novaOS.formaPagamento} onChange={handleChange}>
                                    <option value="DINHEIRO">DINHEIRO</option>
                                    <option value="PIX">PIX</option>
                                    <option value="DEBITO">DÉBITO</option>
                                    <option value="CREDITO">CRÉDITO</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </Modal>
            </div>
        </Fragment>
    );
};

export default OS;
