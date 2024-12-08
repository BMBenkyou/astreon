import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import "./flashcards.css";
import "./sidebar.css";

export function Flashcards() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [flashcardTitle, setflashcardTitle] = useState("");
    const [flashcardPrompt, setflashcardPrompt] = useState("");
    const [statusMessage, setStatusMessage] = useState(""); // For feedback to the user
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef(null); // Reference for file input
    const imageInputRef = useRef(null); // Reference for image input

    const handleCancel = () => {
            // Clear form inputs
            setSelectedFile(null);
            setSelectedImage(null);
            setflashcardTitle("");
            setflashcardPrompt("");
            setStatusMessage("");
    };

    const handleFileUpload = () => {
        fileInputRef.current.click(); // Trigger file input click
    };

    const handleImageUpload = () => {
        imageInputRef.current.click(); // Trigger image input click
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleImageChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };


    const handleNext = async () => {
        const formData = new FormData();
    
        // Collect form data
        if (selectedFile) {
            formData.append("files", selectedFile);
        }
        if (selectedImage) {
            formData.append("images", selectedImage);
        }
        formData.append("action", "generate_flashcards");
        formData.append("fname", flashcardTitle);
        formData.append("lname", flashcardPrompt); 
         const token = localStorage.getItem('authToken');   
        try {
            const response = await fetch('http://localhost:8000/api/chat/', {
                method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                    body: formData,
                });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Response:', result);
            alert('Flashcard created successfully!');
        } catch (error) {
            console.error('Error creating flashcard:', error);
            alert('An error occurred. Please try again.');
        }
    };
    

    return (
        <div className="body">
            <Header />
            <div className="grid">
            <div className="sidebar">
                <Link to="/chatbox" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/aichat.svg"
                        alt="AI Study"
                    />
                    AI Study
                </Link>
                <Link to="/quizme" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/quiz.svg"
                        alt="Quiz Me"
                    />
                    Quiz Me
                </Link>
                <Link to="/flashcards" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/cards.svg"
                        alt="Flashcards"
                    />
                    Flashcards
                </Link>
                <Link to="/sessions" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/sessions.svg"
                        alt="Sessions"
                    />
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
                        <div className="page-title">FlashCards</div>
                        <hr />
                    </div>
                    <div className="main-div-1">
                        <form>
                            <div className="title-body-div">
                                <div className="title-main-border">
                                   <br />
                                    <input className="title-input" type="text" id="fname" name="fname" placeholder="Title"
                                    
                                     value={flashcardTitle}
                                      onChange={(e) =>setflashcardTitle(e.target.value)}/>
                                    <div className="title-div-chat-icon">
                                        <div className="chat-icon-div">
                                            <img
                                                className="vector"
                                                src="./imgs/svgs/chatIcon.svg"
                                                alt="flashcardchaticon"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                            <br />
                            <div className="flashcard-body-input-div">
                                <div className="flashcard-body-border">
                                    <br />
                                    <textarea className="flashcard-body-text" id="lname" name="lname" placeholder="Enter your text here..."
                                     value={flashcardPrompt}
                                    onChange={(e) =>setflashcardPrompt(e.target.value)}
                                    
                                    ></textarea>
                                </div>
                            </div>

                            <br></br>

                            <span className="upload-label" onClick={handleFileUpload}>
                                <div className="upload-icon-div">
                                    <img
                                        className="flashcard-upload-css"
                                        src="./imgs/svgs/UploadFile.svg"
                                        alt="flashcarduploadfile"
                                    />
                                </div>
                                Upload a File
                            </span>

                            <br />

                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }} // Hide the file input
                                onChange={handleFileChange} // Handle file selection
                            />

                            <span className="upload-label" onClick={handleImageUpload}>
                                <div className="upload-icon-div">
                                    <img 
                                        className="flashcard-upload-css"
                                        src="./imgs/svgs/Uploadimg.svg"
                                        alt="flashcarduploadimage"
                                    />
                                </div>

                                Upload an Image
                            </span>

                            <input
                                type="file"
                                ref={imageInputRef}
                                accept="image/*" // Restrict to image files
                                style={{ display: 'none' }} // Hide the image input
                                onChange={handleImageChange} // Handle image selection
                            />

                            {/* Buttons and Upload Labels */}
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
        </div>
    );
}