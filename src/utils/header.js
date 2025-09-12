// components/ui/Header.jsx
// components/ui/Header.jsx
// components/ui/Header.jsx
export const Header = ({ children, size = "3xl" }) => (
  <h2
    className={`
      text-${size} font-extrabold tracking-wide
      bg-clip-text text-transparent
      drop-shadow-xl
      transition-all duration-500
    `}
    style={{
      backgroundImage: `linear-gradient(135deg, var(--gray-900), var(--gray-900))`,
      fontFamily: "var(--font-sans), sans-serif",
    }}
  >
    {children}
  </h2>
);

// components/ui/Button.jsx
export const Button = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`
      px-6 py-2 rounded-full
      font-semibold
      shadow-lg hover:shadow-xl
      transition-all duration-300 ease-in-out
      transform hover:-translate-y-0.5
      text-gray-800
      ${className}
    `}
    style={{
      background: `linear-gradient(120deg, var(--yellow-light), var(--yellow-dark))`,
    }}
  >
    {children}
  </button>
);
