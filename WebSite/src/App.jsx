import { Fragment, useState } from 'react'
import './App.css'
import Cliente from './Components/Cliente'
import Servico from './Components/Servico'
import OS from './Components/os'
import Home from './Components/Home'

function App() {
  const [componenteAtual, setComponenteAtual] = useState(null);
  const [open, setOpen] = useState(false);

  const renderComponente = () => {
    switch (componenteAtual) {
      case "Cliente":
        return <Cliente />;
      case "Servico":
        return <Servico />;
      case "OS":
        return <OS />;
        case "Home":
          return <Home/>
      default:
        return <Home/>
    }
  };

  return (
    <div className="d-flex">
    {/* Sidebar */}
    <nav className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white vh-100" style={{ width: "250px" }}>
      <h4 className="text-center">Lava a Jato</h4>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link text-white" onClick={() => setComponenteAtual("Home")}>🏠 Home</a>
          <a href="#" className="nav-link text-white" onClick={() =>  setComponenteAtual("OS")}>📋 Nova OS +</a>
        </li>

        {/* Seção com Submenu */}
        <li className="nav-item">
          <a
            href="#"
            className="nav-link text-white d-flex justify-content-between align-items-center"
            onClick={() => setOpen(!open)}
          >
            📁 Cadastros <span>{open ? "🔽" : "▶"}</span>
          </a>
          <div className={`collapse ${open ? "show" : ""}`}>
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <a href="#" className="nav-link text-white" onClick={() => setComponenteAtual("Cliente")}>Clientes</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white" onClick={() => setComponenteAtual("Servico")}>Serviços</a>
              </li>
            </ul>
          </div>
        </li>

        {/* <li className="nav-item">
          <a href="#" className="nav-link text-white">⚙ Configurações</a>
        </li> */}
      </ul>
    </nav>

    {/* Conteúdo Principal */}
    <main className="p-4 flex-grow-1 ">
    {renderComponente()}
    </main>
  </div>
    // <Fragment>
    //   <div className='row'>
    //     <div className='col botoes'>
    //         <button className="btn btn-primary m-2" onClick={() => setComponenteAtual("Cliente")}>Clientes</button>
    //        <button className="btn btn-primary m-2" onClick={() => setComponenteAtual("Servico")}>Serviços</button></div>
    //         <button className="btn btn-primary m-2" onClick={() => setComponenteAtual("OS")}>Ordem de Serviço</button>
    //     </div>
    //     <div className='col'>
    //       <div className="container mt-4">
    //         
    //       </div>
    //     </div>
    //   </div>
    // </Fragment>
  );
}

export default App
