import "./ResetButton.css";
import { GrPowerReset } from "react-icons/gr";

const ResetButton = ({ onClick }) => {
  return (
    <div className="flex justify-center mt-4">
      <button className="reset-button" onClick={onClick}>
        <GrPowerReset className="reset-icon" />
        <span className="button-text2">Reset-Button</span>
      </button>
    </div>
  );
};

export default ResetButton;

