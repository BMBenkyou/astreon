import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./flashcards.css";
import "./sidebar.css";

export function Flashcards() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [title, setTitle] = useState("");
    const [prompt, setPrompt] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showFakeLoader, setShowFakeLoader] = useState(false);

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const navigate = useNavigate();

    const handleCancel = () => {
        setSelectedFile(null);
        setSelectedImage(null);
        setTitle("");
        setPrompt("");
        setStatusMessage("");
    };

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleImageUpload = () => {
        imageInputRef.current.click();
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleNext = (event) => {
        event.preventDefault();
        if (!title || !prompt) {
            setStatusMessage("Title and prompt are required.");
            return;
        }

        setShowFakeLoader(true);

        // Simulate a delay before redirecting to the sessions page
        setTimeout(() => {
            navigate("/sessions", { state: { title, category: "Flashcards" } });
        }, 3000);
    };

    return (
        <div className="body">
            <Header />
            <div className="grid">
                <div className="sidebar">
                    <Link to="/chatbox" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/aichat.svg" alt="AI Study" />
                        AI Study
                    </Link>
                    <Link to="/quizme" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/quiz.svg" alt="Quiz Me" />
                        Quiz Me
                    </Link>
                    <Link to="/flashcards" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/cards.svg" alt="Flashcards" />
                        Flashcards
                    </Link>
                    <Link to="/sessions" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/sessions.svg" alt="Sessions" />
                        Sessions
                    </Link>
                </div>
                <div className="main-page-div">
                    <div className="main-age-title-div">
                        <div className="page-title">Flashcards</div>
                        <hr />
                    </div>
                    <div className="main-div-1">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="title-body-div">
                                <input
                                    className="title-input"
                                    type="text"
                                    placeholder="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <br></br>
                            <textarea
                                className="quiz-body-text"
                                placeholder="Create flashcards about this"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            ></textarea>
                            <div className="upload-section">
                                <span className="upload-label" onClick={handleFileUpload}>
                                    <img className="upload-icon" src="./imgs/svgs/UploadFile.svg" alt="Upload file" />
                                    Upload a File
                                </span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                <span className="upload-label" onClick={handleImageUpload}>
                                    <img className="upload-icon" src="./imgs/svgs/Uploadimg.svg" alt="Upload image" />
                                    Upload an Image
                                </span>
                                <input
                                    type="file"
                                    ref={imageInputRef}
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="button-container">
                                <button type="button" onClick={handleCancel} className="cancel-button">
                                    Cancel
                                </button>
                                <button type="button" onClick={handleNext} className="next-button">
                                    Next
                                </button>
                            </div>
                        </form>
                    </div>
                    {showFakeLoader && (
                        <div className="loading-container">
                            <div className="loader"></div>
                            <p>Generating Flashcards...</p>
                        </div>
                    )}
                    {statusMessage && <p className="status-message">{statusMessage}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
}
