import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const fixedPages = [1, 2, 3]; // Luôn hiển thị trang 1–3

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Trang trước */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-3 py-1 rounded transition ${
          currentPage <= 1
            ? "bg-gray-200 opacity-50 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Trang trước
      </button>

      {/* Các trang cố định 1–3 */}
      {fixedPages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded transition ${
            currentPage === page
              ? "bg-blue-900 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Trang sau */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-3 py-1 rounded transition ${
          currentPage >= totalPages
            ? "bg-gray-200 opacity-50 cursor-not-allowed"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Trang sau
      </button>
    </div>
  );
};

export default PaginationComponent;
