import { useState, useRef } from "react";
import Header from "../components/HeaderLoggedIn";
import Sidebar from "../components/NSidebar";
import "./flashcards.css";

const fileicon = "/file-attachment-icon.svg";
const sendIcon = "/send-btn-icon.svg";
const titleicon = "./title-icon.svg";

export default function Flashcards() {
  // State for Title Input
  const [titleFocused, setTitleFocused] = useState(false);
  const [titleText, setTitleText] = useState("");

  // State for Description Textarea
  const [descFocused, setDescFocused] = useState(false);
  const [descText, setDescText] = useState("");

  // State for messages (including text & file messages)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Generating flashcards from your file...", sender: "bot" }
      ]);
    }, 1000);
  };

  // Handle file uploads
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
        <div className="grid-container-flashcards">
          <div className="sidebar-flashcards">
            <Sidebar />
          </div>

          <div className="flashcards-maincontainer">
            <h1 className="title">Create Flashcards</h1>

            {/* Title Input Field */}
            <div className="title-flashcards">
              <div className="chat-div">
                <input
                  type="text"
                  className="chat-input"
                  spellCheck="false"
                  placeholder={titleFocused ? "" : "Title"}
                  value={titleText}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={(e) => {
                    setTitleFocused(e.target.value.length > 0);
                    setTitleText(e.target.value);
                  }}
                  onChange={(e) => setTitleText(e.target.value)}
                  required
                />
              </div>
              <button className="title-button">
                <img src={titleicon} alt="Send" className="send-icon-1" />
              </button>
            </div>

            {/* Description Textarea Field */}
            <div className="title-flashcards-textbox">
              <div className="chat-div">
                <textarea
                  className="chat-input-textbox"
                  spellCheck="false"
                  placeholder={descFocused ? "" : "Description"}
                  value={descText}
                  onFocus={() => setDescFocused(true)}
                  onBlur={(e) => {
                    setDescFocused(e.target.value.length > 0);
                    setDescText(e.target.value);
                  }}
                  onChange={(e) => setDescText(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-cont">
              {messages.map((msg, index) => (
                <div className={msg.file ? "file-message" : "message"} key={index}>
                  {msg.text}
                  {msg.file && (
                    <a href={msg.file} download target="_blank" rel="noopener noreferrer">
                      📂 Download
                    </a>
                  )}
                </div>

              ))}
            </div>

            {/* Type Here Input Field */}
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
                  spellCheck="false"
                  placeholder="Generate me multiple questions flashcards based on this file"
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
