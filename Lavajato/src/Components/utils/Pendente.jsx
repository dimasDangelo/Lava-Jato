import React, { Fragment, useEffect, useState } from "react";
import useFetch from "../hooks/UseRequest";
import SelectComponent from "./SelectComponent ";
import DataGrid from "./DataGrid";
import Cliente from "../Cliente";
import useAlerta from "../hooks/UseAlerta";
import Modal from "./Modal";


const Pendente = () => {
    const [input, setInput] = useState({
        cliente: 0,
        dataInicio: "",
        dataFim: ""
    })
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [clearField, setClearField] = useState(false);
    const { exibirAlerta } = useAlerta();
    const [ordens, setOrdens] = useState([]);
    const { fetchData } = useFetch();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };
    const modalClose = () => {
        setModalOpen(false);
    }
    const modalConfirm = async () => {
        let idsOs = ordens.map(oder => ({ id: oder.id }));
        
        const dados = await fetchData("/os/marcarPG", "POST", idsOs);
        if (dados) {
            modalClose();
            setInput({ cliente: 0, dataInicio: "", dataFim: "" });
            limpaCampo();
            setOrdens([]);
            exibirAlerta("Confirmado!", "success")
        }
    }
    const buscarClienteFiltro = async () => {
        if (input.dataInicio === "" && input.dataFim !== "" || input.dataInicio !== "" && input.dataFim === "") {
            setInput({
                cliente: 0,
                dataInicio: "",
                dataFim: ""
            })
            exibirAlerta("Para buscar por Data preencha os dois Campos!", "warning");
            return;
        }
        const dados = await fetchData(`/controle/pornotaPendentes/${input.cliente}/${input.dataInicio === "" ? "vazio" : input.dataInicio}/${input.dataFim === "" ? "vazio" : input.dataFim}`);
        if (Object.values(dados).length > 0) {
            setOrdens(dados);
        } else {
            exibirAlerta("Esse cliente nao possui nota pendente!", "warning");
        }


    }

    const limpaCampo = () => {
        setClearField(true); // Aciona a limpeza do campo
        setTimeout(() => {
            setClearField(false); // Reseta o estado após um pequeno atraso para permitir o efeito de limpeza
        }, 200); // O tempo de 200ms pode ser ajustado conforme a necessidade
    };
    const maracarComoPago = () => {
        if (Object.values(ordens).length > 0) {
            setModalOpen(true);
        } else {
            exibirAlerta("Selecione um cliente!", "warning");
        }
    }

    useEffect(() => {
        const carregarClientes = async () => {
            const dados = await fetchData("/clientes/pendentes");
            if (dados) {
                setClientes(dados);
            }
        };
        carregarClientes();
    }, []);


    return (
        <Fragment>
            <div className="container mt-3">
                <h3>Buscar por Notas Pendentes: 📋</h3>
                <div className="row">
                    <div className="col">
                        <SelectComponent options={clientes} name={'cliente'} onChange={handleChange} title="Selecione Um Cliente:" clearField={clearField} />
                    </div>
                    <div className="col">
                        <label className="form-label">Data Inicio</label>
                        <input type="date" className="form-control" name="dataInicio" value={input.dataInicio} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <label className="form-label">Data Fim</label>
                        <input type="date" className="form-control" name="dataFim" value={input.dataFim} onChange={handleChange} />
                    </div>
                    <div className="col">
                        <div className="d-flex">
                            <button className="btn btn-primary mt-4 me-2" onClick={() => buscarClienteFiltro()}> {/* Adicionando me-2 para margem direita */}
                                Buscar
                            </button>
                            <button className="btn btn-danger mt-4" onClick={() => {
                                setInput({ cliente: 0, dataInicio: "", dataFim: "" });
                                limpaCampo();
                                setOrdens([]);
                            }}>
                                X
                            </button>
                        </div>
                    </div>
                </div>
                <div>
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
                            { key: "forma_pagamento", label: "Forma de Pagamento", flex: 1 },
                            { key: "pendente", label: "Pendente", flex: 1 }
                        ]}
                        pageSize={5}
                    />
                </div>
                <div className="d-flex justify-content-center mt-4">
                    <button
                        className="btn btn-primary btn-lg" // btn-lg para botão maior
                        onClick={() => { maracarComoPago() }}
                        style={{ width: "300px" }} // Defina a largura desejada
                    >
                        Marcar Como Pago
                    </button>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onClose={modalClose}
                    onConfirm={modalConfirm}
                    size={'gg'}
                >
                    <h4>Deseja confirmar Pagamento? </h4>

                </Modal>
            </div>
        </Fragment>
    )
};
export default Pendente;