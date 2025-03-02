import "./ProceedButton.css";

const ProceedButton = ({ onClick }) => {
  return (
    <button className="proceed-button" onClick={onClick}>
      Proceed
    </button>
  );
};

export default ProceedButton;
