import Button from "./Button";

const Pagination = ({ currentPage, totalPages, onPageChange }:{currentPage: number, totalPages: number, onPageChange: (pageNumber: number) => void}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-2 py-1 ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded`}
      >
        Previous
      </Button>
      {pageNumbers.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 py-1 ${page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black hover:bg-blue-700 hover:text-white'} rounded`}
        >
          {page}
        </Button>
      ))}
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-2 py-1 ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded`}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;