import React, { useState, useEffect } from "react";
import useFetch from "./hooks/UseRequest";
import DataGrid from "./utils/DataGrid";
import useAlerta from "./hooks/UseAlerta";
import Modal from "./utils/Modal";

const Servico = () => {
    const { fetchData } = useFetch();
    const { exibirAlerta } = useAlerta(2000);
    const [servicos, setServicos] = useState([]);
    const [novoServico, setNovoServico] = useState({ nome: "", valor: "" });
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setNovoServico({ nome: "", valor: "" });
        setModalOpen(false);
    };

    const handleConfirm = (e) => {
        handleSubmit(e);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoServico({ ...novoServico, [name]: value.replace(",", ".") });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(novoServico.id !== undefined)
            updateServico();
        else
            addServico();

        setServicos([...servicos, novoServico]);
        setNovoServico({ nome: "", valor: "" });
        handleCloseModal();
    };
    const editarServico = (row) => {
        const _servico = servicos.filter((x) => x.id === row);
        setNovoServico(_servico[0]);
        handleOpenModal();
    }
    
    const addServico = async () => {
        const dados = await fetchData(`/servicos/add/${novoServico.nome}/${novoServico.valor}`);   
        
        if (dados){
            setServicos([...servicos, novoServico])
            exibirAlerta("Adicionado Serviço com Sucesso!", "success");
        }
    }
    const updateServico = async () => {
        const dados = await fetchData(`/servicos/update/${novoServico.id}/${novoServico.nome}/${novoServico.valor}`);
        if (dados) {
            const _novoServico = { nome: novoServico.nome, valor: novoServico.valor };
            setServicos((prev) =>
                prev.map((item) => (item.id === novoServico.id ? { ...item, ..._novoServico } : item))
        );
            exibirAlerta("Atualizado Serviço com Sucesso!", "warning");
        }
    }
    const deleteServico = async (e) => {
        const dados = await fetchData(`/servicos/delete/${e}`);
        if (dados) {
            setServicos((prev) => prev.filter((item) => item.id !== e));
            exibirAlerta("Excluído Serviço com Sucesso!", "success");
        }
    }

    useEffect(() => {
        const carregarServicos = async () => {
            const dados = await fetchData('/servicos');
            if (dados) {
                setServicos(dados);
            }
        };
        carregarServicos();
    }, [fetchData]);

    return (
        <div className="card rounded shadow">
            <div className="card-header bg-primary text-white">Cadastro de Serviços</div>
            <div className="card-body">
                <button className="btn btn-primary" onClick={handleOpenModal}>Adicionar Serviço</button>
                <DataGrid data={servicos} columns={[
                    //  { key: "id", label: "ID" },
                    { key: "nome", label: "Nome" },
                    { key: "valor", label: "Valor" },
                ]} pageSize={5}
                    actionColumns={[
                        { label: "Editar", onAction: (e) => editarServico(e), color: "green" },
                        { label: "Deletar", onAction: (e) => deleteServico(e), color: "red" },
                    ]} />
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirm}
                    title={"Serviço:"}
                    size={'gg'}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Nome</label>
                                <input type="text" className="form-control" name="nome" value={novoServico.nome} onChange={handleChange} required />
                            </div>
                            <div className="col mb-3">
                                <label className="form-label">Valor</label>
                                <input type="number" className="form-control" name="valor" value={novoServico.valor} onChange={handleChange} required />
                            </div>
                        </div>
                    </form>
                </Modal>

            </div>
        </div >
    );
};

export default Servico;
