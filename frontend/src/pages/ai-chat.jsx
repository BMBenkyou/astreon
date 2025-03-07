import Header from "../components/HeaderLoggedIn";
import Sidebar from "../components/NSidebar";
import "./ai-chat.css";

const fileicon = "/file-attachment-icon.svg";
const sendIcon ="/send-btn-icon.svg";


export default function Aichat() {
  return (
    <>
    <header>
    <Header />
    </header>
    

        <main>
        <div class="grid-container">
          

          <div class="sidebar">
            <Sidebar />
          </div>
        <div>
            <div class="chatbot-maincontainer">
             <div class="chat-cont">
                <div class="prompt-suggestions"></div> 
                <div class="centered-flex"></div>
            </div>

            <div className="type-textarea">
              <div className="icon-div">
                <img src={fileicon} alt="Attach" className="icon-img" />
              </div>
              <div className="chat-div">
              <input type="text" className="chat-input" id="chat-input" spellCheck="false" placeholder="Type here" required></input>
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


