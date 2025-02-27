export const Button = ({ children, ...props }) => (
  <button {...props} className="px-4 py-2 bg-blue-500 text-white rounded">
    {children}
  </button>
);

export const Input = (props) => (
  <input {...props} className="border px-3 py-2 rounded w-full" />
);

export const Label = ({ children, ...props }) => (
  <label {...props} className="block font-semibold">
    {children}
  </label>
);
