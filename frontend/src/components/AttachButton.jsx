import "./AttachButton.css";
import { ImAttachment } from "react-icons/im";

const AttachButton = ({ type = "file", accept, onChange }) => {
  return (
    <div className="flex justify-center mt-4">
      <label className="attach-button" htmlFor="attach-file">
        <ImAttachment className="attach-icon" />
        <span className="button-text">Attach a photo</span>
        <input type={type} accept={accept} onChange={onChange} id="attach-file" className="hidden-input" />
      </label>
    </div>
  );
};

export default AttachButton;
