import "./RedoButton.css";

const RedoButton = ({ onClick }) => {
  return (
    <button className="redo-button" onClick={onClick}>
      Redo
    </button>
  );
};

export default RedoButton;
