import "./Button.css";

const Button = ({ children, type = "button", onClick }) => {
  return (
    <button className="button" type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
