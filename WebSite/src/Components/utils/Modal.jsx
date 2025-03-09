import React, { useState } from 'react';


const Modal = ({ isOpen, onClose, onConfirm, children, title, size }) => {
  if (!isOpen) return null;

  // Definindo classes para os diferentes tamanhos de modal
  const modalSizeClass = size ? `modal-${size}` : 'modal-m';  // Default to 'm' if no size is provided

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${modalSizeClass}`}>
        {/* Título dinâmico */}
        <h2>{title}</h2>
        
        {/* Corpo do modal onde o conteúdo será inserido */}
        <div className="modal-body">
          {children}
        </div>

        <div className="modal-actions">
          <button className="btn-confirm" onClick={onConfirm}>Confirmar</button>
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;



// CSS no mesmo arquivo (usando estilo inline no JSX)
const styles = `
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-body {
  margin-top: 20px;
  margin-bottom: 20px;
}

.modal-actions {
  margin-top: 20px;
}

.modal-p {
  width: 200px;  /* Pequena */
}

.modal-m {
  width: 300px;  /* Média */
}

.modal-g {
  width: 400px;  /* Grande */
}

.modal-gg {
  width: 800px;  /* Extra grande */
}

.btn-cancel, .btn-confirm {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-confirm {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel:hover, .btn-confirm:hover {
  opacity: 0.8;
}

`;

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
