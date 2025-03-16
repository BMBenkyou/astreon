import { useState, useRef } from "react";
import Header from "../components/HeaderLoggedIn";
import Sidebar from "../components/NSidebar";
import "./ai-chat.css";

const fileicon = "/file-attachment-icon.svg";
const sendIcon = "/send-btn-icon.svg";

export default function Aichat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);

  // Handle text message send
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "This is a bot response!", sender: "bot" }
      ]);
    }, 1000);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newMessage = {
      text: `📎 ${file.name}`, // Display file name
      sender: "user",
      file: URL.createObjectURL(file) // Create a preview URL
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        <div className="grid-container-aichat">
          <div className="sidebar">
            <Sidebar />
          </div>

          <div className="chatbot-maincontainer">
            <div className="chat-cont">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                  {msg.file && (
                    <a href={msg.file} download target="_blank" rel="noopener noreferrer">
                      📂 Download
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="type-textarea">
              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />

              {/* File Attach Icon */}
              <div className="icon-div" onClick={() => fileInputRef.current.click()}>
                <img src={fileicon} alt="Attach" className="icon-img" />
              </div>

              {/* Chat Input */}
              <div className="chat-div">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type here"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  required
                />
              </div>

              {/* Send Button */}
              <button className="send-btn" onClick={handleSendMessage}>
                <img src={sendIcon} alt="Send" className="send-icon" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
