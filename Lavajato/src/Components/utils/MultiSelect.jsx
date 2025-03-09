import { useState, useRef, useEffect } from "react";

const MultiSelect = ({ options, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (id) => {
    setSelectedOptions((prev) => {
      const updatedSelection = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      
      // Chama o callback onChange passando os itens selecionados
      if (onChange) {
        onChange(getSelectedItems(updatedSelection));
      }

      return updatedSelection;
    });
  };

  const getSelectedNames = () => {
    return options
      .filter((option) => selectedOptions.includes(option.id))
      .map((option) => `${option.nome}`)
      .join(", ") || "Selecione...";
  };

  const getSelectedItems = (selectedList) => {
    return options
      .filter((option) => selectedList.includes(option.id))
      .map((option) => ({ nome: option.nome, valor: option.valor }));
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef} style={{ width: "100%" }}>
      <button
        className="btn btn-outline-primary dropdown-toggle"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          whiteSpace: "normal",  // Permite que o texto quebre a linha
          textAlign: "left",     // Alinha o texto à esquerda
        }}
      >
        {getSelectedNames()}
      </button>
      {isOpen && (
        <div
          className="dropdown-menu show"
          style={{
            display: "block",
            maxHeight: "150px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          {options.map((option) => (
            <div key={option.id} className="dropdown-item">
              <input
                type="checkbox"
                className="form-check-input me-2"
                id={`option-${option.id}`}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleSelect(option.id)}
              />
              <label className="form-check-label" htmlFor={`option-${option.id}`}>
                {option.nome} - R$ {option.valor}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
