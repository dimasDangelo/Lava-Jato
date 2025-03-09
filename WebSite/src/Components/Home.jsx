import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GerarPdf from './utils/GerarPdf';
import Pendente from './utils/Pendente';

function Home() {
    const [conteudoExibido, setConteudoExibido] = useState('Clique em um card para exibir o conteúdo.');

    const handleCardClick = (conteudo) => {
        setConteudoExibido(conteudo);
    };
    useEffect(() => {
        setConteudoExibido(<GerarPdf />)
    }, []);

    return (
        <div className="container-fluid"> {/* Use container-fluid para ocupar toda a largura */}
            <div className="row">
                <div className="col-md-4">
                    <div className="card" onClick={() => handleCardClick(<GerarPdf />)}>
                        <div className="card-body">
                            <h5 className="card-title">Gerar Pdfs</h5>
                            <p className="card-text">Gera PDF de notas Pendentes</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
          <div className="card" onClick={() => handleCardClick(<Pendente/>)}>
            <div className="card-body">
              <h5 className="card-title">Notas Pendentes</h5>
              <p className="card-text">Marcar como pago notas que ja foram geradas</p>
            </div>
          </div>
        </div>
        {/* <div className="col-md-4">
          <div className="card" onClick={() => handleCardClick('Conteúdo do Card 3')}>
            <div className="card-body">
              <h5 className="card-title">Card 3</h5>
              <p className="card-text">Conteúdo do Card 3.</p>
            </div>
          </div>
        </div> */}
            </div>
            <div className="mt-4 p-3 border rounded shadow" style={{ width: '90%', margin: '0 auto' }}>
                {conteudoExibido}
            </div>
        </div>
    );
}

export default Home;