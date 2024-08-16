export function Button({ label, onClick, type = "submit" }) {
    return (
      <button
        onClick={onClick}
        type={type}
        className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
      >
        {label}
      </button>
    );
  }
  