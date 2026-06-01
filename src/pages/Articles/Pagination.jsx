import React from 'react'

export default function Pagination({ page, totalPages, pageNumbers, goToPage }) {
    if (totalPages <= 1) return null

    return (
        <nav className="pagination" aria-label="Paginação">
            {page > 1 && (
                <button
                    className="page-btn page-btn--arrow"
                    onClick={() => goToPage(page - 1)}
                    aria-label="Página anterior"
                >
                    ←
                </button>
            )}

            {pageNumbers.map(i => (
                <button
                    key={i}
                    className={`page-btn ${i === page ? 'active' : ''}`}
                    onClick={() => goToPage(i)}
                >
                    {i}
                </button>
            ))}

            {page < totalPages && (
                <button
                    className="page-btn page-btn--arrow"
                    onClick={() => goToPage(page + 1)}
                    aria-label="Próxima página"
                >
                    →
                </button>
            )}
        </nav>
    )
}
