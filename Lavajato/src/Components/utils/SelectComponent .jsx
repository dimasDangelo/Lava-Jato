import { useEffect, useState } from "react";

const SelectComponent = ({ options, onChange, name, title = '', clearField = false }) => {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedName, setSelectedName] = useState("");

    const filteredOptions = options.filter(option =>
        option.nome.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (option) => {
        setSearch(option.nome);
        setSelectedName(option.nome);
        setShowDropdown(false);
        onChange({
            target: {
                name: name,
                value: option.id
            }
        });
    };

    // Use useEffect para limpar os campos quando o clearField mudar para true
    useEffect(() => {
        if (clearField) {
            setSearch("");
            setSelectedName("");
        }
    }, [clearField]);

    return (
        <div className="mb-3 position-relative">
            <label className="form-label">{title}</label>
            <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Digite para buscar..."
            />
            {showDropdown && filteredOptions.length > 0 && (
                <ul className="list-group position-absolute w-100 mt-1 shadow" style={{ zIndex: 10 }}>
                    {filteredOptions.map((option) => (
                        <li
                            key={option.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelect(option)}
                            style={{ cursor: "pointer" }}
                        >
                            {option.nome}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectComponent;
