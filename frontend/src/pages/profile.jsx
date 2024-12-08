import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./profile.css";
import "./sidebar.css";

export function Profile() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your logic here to handle form submission
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
                        <div className="page-title">Account Settings</div>
                        <hr />
                    </div>
                    <div className="main-div-profile-01">
                        <div class="user-profile-div">
                            <div class="user-profile-info-div">
                                <div class="profile-pic-div">
                                    <img
                                        className="profile-pic-div"
                                        src="./imgs/default-profile-pic.png"
                                        alt="profilepic"
                                    />
                                </div>
                                <div class="user-information-div">
                                    <div class="username"><span class="text">User_username</span></div>
                                    <div class="user-location">
                                        <span class="location">San Francisco, California</span>
                                    </div>
                                    <div class="user-additional-info">
                                        <span class="teaching-since">Teaching since 2005</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <button class="edit-button">
                            Edit
                        </button>
                    </div>
                    <hr />

                    <div className="main-div-profile-02">
                        <span className="sub-title">Personal Information</span>
                        <div className="div-indented">
                            <label className="input-title">First name</label>
                            <br />
                            <input type="text" id="fname" name="firstName" value={user.firstName} onChange={handleInputChange} className="userinf-css-input" placeholder='user first name' /><br />

                            <label className="input-title">Last name</label>
                            <br />
                            <input type="text" id="lname" name="lastName" value={user.lastName} onChange={handleInputChange} className="userinf-css-input" placeholder='user last name' /><br />
                            <label className="input-title">Email</label>
                            <br />
                            <input type="text" id="useremail" name="email" value={user.email} onChange={handleInputChange} className="userinf-css-input" placeholder='user email' /><br />
                        </div>
                        <span className="sub-title">Login Methods</span>
                        <div className="div-indented">
                            <div class="login-method-mainest-div">
                                <div class="login-method-desc">
                                    <span class="login-method-desc-1"
                                    >You can use these methods to log into your account. If you lose
                                    access to one of these methods, you can use another to recover your
                                    account.</span
                                    >
                                </div>

                                <div class="full-google">
                                    <div class="google">
                                        <div class="google-frame">
                                            <div class="google-logo">
                                                <img
                                                    className="vector"
                                                    src="./imgs/svgs/google.svg"
                                                    alt="google-icon"
                                                />
                                            </div>
                                        </div>
                                        <div class="google-title-div"><span class="title">Google</span></div>
                                    </div>
                                    <div class="trash-div">
                                        <div class="trash-frame">
                                            <div class="trash-icon">
                                                <img
                                                    className="vector-4"
                                                    src="./imgs/svgs/trash.svg"
                                                    alt="Help"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="microsoft-div">
                                    <div class="microsoft-main">
                                        <div class="microsoft-frame-icon">
                                            <div class="mdi-microsoft">
                                                <img
                                                    className="vector"
                                                    src="./imgs/svgs/microsoft.svg"
                                                    alt="microsoft-icon"
                                                />
                                            </div>
                                        </div>
                                        <div class="microsoft-title-div">
                                            <span class="microsoft">Microsoft</span>
                                        </div>
                                    </div>
                                    <div class="trash-div-microsoft">
                                        <div class="trash-frame-microsoft">
                                            <div class="trash-icon-microsoft">
                                                <img
                                                    className="vector-4"
                                                    src="./imgs/svgs/trash.svg"
                                                    alt="Help"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <span className="sub-title">Change Password</span>
                        <div className="div-indented">
                            <label className="input-title">Current Password</label>
                            <br />
                            <input type="password" id="currentPassword" name="currentPassword" value={user.currentPassword} onChange={handleInputChange} className="userinf-css-input-pass" placeholder='Enter current password' /><br />

                            <label className="input-title">New Password</label>
                            <br />
                            <input type="password" id="newPassword" name="newPassword" value={user.newPassword} onChange={handleInputChange} className="userinf-css-input-pass" placeholder='Enter new password' /><br />
                            <label className="input-title">Confirm New Password</label>
                            <br />
                            <input type="password" id="confirmPassword" name="confirmPassword" value={user.confirmPassword} onChange={handleInputChange} className="userinf-css-input-pass" placeholder='Enter new password' /><br />
                            <input type="submit" className="new-password-button" value="Change Password" onClick={handleSubmit} />
                        </div>
                        <span className="sub-title">Danger Zone</span>

                        <div className="div-indented">
                            <span className="delete-desc">Once you delete your account, there is no going back. Please be certain.</span>
                            <button className="delete-acc-button">Delete Account</button>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}