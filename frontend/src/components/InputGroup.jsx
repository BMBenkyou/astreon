import "./InputGroup.css";

const InputGroup = ({ label, type, placeholder, value, onChange, children }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <div className="input-wrapper">
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        {children} {/* The "Show/Hide" button goes here */}
      </div>
    </div>
  );
};

export default InputGroup;
