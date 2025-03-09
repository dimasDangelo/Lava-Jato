import { useState, useEffect, useRef } from 'react';

function useAlerta(tempoExibicao = 2000) {
  const [alerta, setAlerta] = useState(null);
  const alertaRef = useRef(null);

  const exibirAlerta = (texto, tipo) => {
    setAlerta({ texto, tipo });
  };

  useEffect(() => {
    if (alerta) {
      const alertaDiv = document.createElement('div');
      alertaDiv.className = 'alert';

      let corFundo, corTexto;

      switch (alerta.tipo) {
        case 'success':
          alertaDiv.classList.add('alert-success');
          corFundo = '#d4edda';
          corTexto = '#155724';
          break;
        case 'warning':
          alertaDiv.classList.add('alert-warning');
          corFundo = '#fff3cd';
          corTexto = '#856404';
          break;
        case 'danger':
          alertaDiv.classList.add('alert-danger');
          corFundo = '#f8d7da';
          corTexto = '#721c24';
          break;
        default:
          alertaDiv.classList.add('alert-secondary');
          corFundo = '#e2e3e5';
          corTexto = '#383d41';
      }

      alertaDiv.textContent = alerta.texto;
      alertaDiv.style.backgroundColor = corFundo;
      alertaDiv.style.color = corTexto;

      // Estilos para centralizar no topo
      alertaDiv.style.position = 'fixed';
      alertaDiv.style.top = '20px';
      alertaDiv.style.left = '50%';
      alertaDiv.style.transform = 'translateX(-50%)';
      alertaDiv.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.2)';
      alertaDiv.style.zIndex = '9999';

      document.body.appendChild(alertaDiv);
      alertaRef.current = alertaDiv;

      const timeout = setTimeout(() => {
        if (alertaRef.current) {
          document.body.removeChild(alertaRef.current);
          alertaRef.current = null;
          setAlerta(null);
        }
      }, tempoExibicao);

      return () => {
        clearTimeout(timeout);
        if (alertaRef.current) {
          document.body.removeChild(alertaRef.current);
          alertaRef.current = null;
        }
      };
    }
  }, [alerta, tempoExibicao]);

  return { exibirAlerta };
}

export default useAlerta;