import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./quiz.css";
import "./sidebar.css";

export function Quiz() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quizTitle, setQuizTitle] = useState("");
    const [quizPrompt, setQuizPrompt] = useState("");
    const [statusMessage, setStatusMessage] = useState(""); // For feedback to the user
    const [loading, setLoading] = useState(false); // New loading state

    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    const navigate = useNavigate(); // Hook for navigation after quiz is generated

    const handleCancel = () => {
        // Clear form inputs
        setSelectedFile(null);
        setSelectedImage(null);
        setQuizTitle("");
        setQuizPrompt("");
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

    const handleNext = async (event) => {
        event.preventDefault();
        if (!quizTitle || !quizPrompt) {
            setStatusMessage("Title and prompt are required.");
            return;
        }
        if (!selectedFile && !selectedImage) {
            setStatusMessage("Please upload at least one file or image.");
            return;
        }
    
        setLoading(true);
    
        // Prepare form data
        const formData = new FormData();
        if (selectedFile) {
            formData.append("files", selectedFile);
        }
        if (selectedImage) {
            formData.append("images", selectedImage);
        }
        formData.append("action", "generate_quiz");
        formData.append("fname", quizTitle);
        formData.append("lname", quizPrompt);
        const token = localStorage.getItem('authToken');
    
        try {
            const response = await fetch("http://localhost:8000/api/chat/", {
                method: "POST",
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setStatusMessage("Quiz generated successfully!");
                console.log(data);
                navigate("/sessions");
               
            } else {
                setStatusMessage(data.error_message || "Failed to generate quiz.");
            }
        } catch (error) {
            console.error("Error:", error);
            setStatusMessage("An error occurred while generating the quiz.");
        } finally {
            setLoading(false);
        }
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
                    <div className="helpbuttonsdiv">
                        <a className="helplink" href="#">
                            <img
                                className="helpbuttons"
                                src="./imgs/svgs/help.svg"
                                alt="Help"
                            />
                            <p className="phelpbuttons">Help</p>
                        </a>
                    </div>
                    <div className="helpbuttonsdiv">
                        <a className="helplink" href="#">
                            <img
                                className="helpbuttons"
                                src="./imgs/svgs/feedback.svg"
                                alt="Feedback"
                            />
                            <p className="phelpbuttons">Feedback</p>
                        </a>
                    </div>
                </div>

                <div className="main-page-div">
                    <div className="main-age-title-div">
                        <div className="page-title">Quiz</div>
                        <hr />
                    </div>
                    <div className="main-div-1">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="title-body-div">
                                <div className="title-main-border">
                                    <br />
                                    <input
                                        className="title-input"
                                        type="text"
                                        id="fname"
                                        name="fname"
                                        placeholder="Title"
                                        value={quizTitle}
                                        onChange={(e) => setQuizTitle(e.target.value)}
                                    />
                                </div>
                            </div>

                            <br />
                            <div className="quiz-body-input-div">
                                <div className="quiz-body-border">
                                    <br />
                                    <textarea
                                        className="quiz-body-text"
                                        id="lname"
                                        name="lname"
                                        placeholder="Generate me a 10 question quiz about this"
                                        value={quizPrompt}
                                        onChange={(e) => setQuizPrompt(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            <br />
                            <span className="upload-label" onClick={handleFileUpload}>
                                <div className="upload-icon-div">
                                    <img
                                        className="quiz-upload-css"
                                        src="./imgs/svgs/UploadFile.svg"
                                        alt="quizuploadfile"
                                    />
                                </div>
                                Upload a File
                            </span>

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            <span className="upload-label" onClick={handleImageUpload}>
                                <div className="upload-icon-div">
                                    <img
                                        className="quiz-upload-css"
                                        src="./imgs/svgs/Uploadimg.svg"
                                        alt="quizuploadimage"
                                    />
                                </div>
                                Upload an Image
                            </span>

                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />

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

                    {loading && (
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    )}

                    <div className="main-div-2">
                        {selectedFile && (
                            <div>
                                <p>Selected File: {selectedFile.name}</p>
                            </div>
                        )}
                        {selectedImage && (
                            <div>
                                <p>Selected Image: {selectedImage.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
