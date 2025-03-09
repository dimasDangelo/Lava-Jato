import { useState } from "react";

const DataGrid = ({ data, columns, pageSize = 5, actionColumns = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const totalPages = Math.ceil(data.length / pageSize);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (typeof valA === "number" && typeof valB === "number") {
      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    } else {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
  });

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div>
      <table border="1" cellPadding="5" cellSpacing="0" className="table table-bordered mt-4">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label} {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "🔼" : "🔽") : ""}
              </th>
            ))}
            {actionColumns.length > 0 && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {currentPageData.length > 0 ? (
            currentPageData.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
                {actionColumns.length > 0 && (
                  <td>
                    {actionColumns.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => action.onAction(row.id)}
                        style={{
                          marginRight: "5px",
                          backgroundColor: action.color || "gray",
                          color: "#fff",
                          border: "none",
                          padding: "5px 10px",
                          cursor: "pointer",
                          borderRadius: "3px",
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actionColumns.length > 0 ? 1 : 0)} style={{ textAlign: "center" }}>
                Nenhum dado disponível
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{"<<"}</button>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>{"<"}</button>
        <span> Página {currentPage} de {totalPages} </span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>{">"}</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{">>"}</button>
      </div>
    </div>
  );
};

export default DataGrid;
