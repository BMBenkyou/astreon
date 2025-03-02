import "./NewInputGroup.css";

const NInputGroup = ({ label, type, placeholder, value, onChange, children }) => {
  return (
    <div className="Ninput-group">
      {label && <label>{label}</label>}
      <div className="Ninput-wrapper">
        <div className="Ninput-field-wrapper">
          <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
        {children} {/* The "Show/Hide" button goes here */}
      </div>
    </div>
  );
};

export default NInputGroup;

