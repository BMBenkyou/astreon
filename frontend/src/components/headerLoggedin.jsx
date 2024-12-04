import { Button } from "../components/button";
import { ButtonGroup } from "./buttonGroup";
import "./headerLoggedin.css";

export function Header({ buttons }) {
    return (
        <header>
            <div className="Headercontainer">
                <div className="titleheader">
                    <p className="header">Astreon Study Buddy</p>
                </div>
                <div className="logindiv">
                    <input className="SearchButton" type="text" placeholder="Search" id="search" name="search" />
                    <button className="sessionbutton">Add to Notebook</button>
                    <a href="#"><img className="iconButton" src="./imgs/svgs/notification.svg" alt="Notification" /></a>
                    <Link to="/calendar" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/calendar.svg"
                        alt="Sessions"
                    />
                </Link> 
                    <a href="#"><img className="profile" src="./imgs/profile.png" alt="Profile" /></a>
                </div>
            </div>
            <hr className="header-hr"></hr>
        </header>
    );
}