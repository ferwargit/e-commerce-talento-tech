// src/components/Paginador.jsx
import React from "react";
import styles from "../styles/Paginador.module.css"; // 1. Importa el módulo CSS

function Paginador({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Navegación de páginas">
      {/* 2. Aplicamos nuestra clase principal del módulo */}
      <ul className={`pagination justify-content-center ${styles.pagination}`}>
        {/* 3. Aplicamos la clase a cada item y link */}
        <li
          className={`${styles.pageItem} page-item ${
            currentPage === 1 ? styles.disabled + " disabled" : ""
          }`}
        >
          <button
            className={`${styles.pageLink} page-link`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`${styles.pageItem} page-item ${
              currentPage === number ? styles.active + " active" : ""
            }`}
          >
            <button
              className={`${styles.pageLink} page-link`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}

        <li
          className={`${styles.pageItem} page-item ${
            currentPage === totalPages ? styles.disabled + " disabled" : ""
          }`}
        >
          <button
            className={`${styles.pageLink} page-link`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Paginador;
