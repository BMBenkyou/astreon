import { useState } from "react";
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

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        <div className="grid-container">
          <div className="sidebar">
            <Sidebar />
          </div>

          <div>
            <div className="flashcards-maincontainer">
              <h1 className="title">Create Flashcards</h1>

              {/* Title Input Field */}
              <div className="title-flashcards">
                <div className="chat-div">
                  <input
                    type="text"
                    className="chat-input"
                    id="chat-input"
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
                <button className="title-button" id="title-button">
                  <img src={titleicon} alt="Send" className="send-icon-1" />
                </button>
              </div>

              {/* Description Textarea Field */}
              <div className="title-flashcards-textbox">
                <div className="chat-div">
                  <textarea
                    className="chat-input-textbox"
                    id="chat-input"
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

              {/* Type Here Input Field */}
              <div className="type-textarea">
                <div className="icon-div">
                  <img src={fileicon} alt="Attach" className="icon-img" />
                </div>
                <div className="chat-div">
                  <input
                    type="text"
                    className="chat-input"
                    id="chat-input"
                    spellCheck="false"
                    placeholder="Generate me a multiple questions flashcards based on this file"
                    required
                  />
                </div>
                <button className="send-btn" id="send-btn">
                  <img src={sendIcon} alt="Send" className="send-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
