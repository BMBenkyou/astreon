import "./header.css";
import { useState } from "react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-teal-50 bg-opacity-0 h-[50px] w-auto flex items-center justify-between px-4">
            <div className="flex items-center">
                <img src="../public/Astreon_Logo.svg" alt="Logo" className="h-10" />
            </div>
            <div className="hidden md:flex space-x-4">
                <p className="text-black cursor-pointer hover:text-gray-800">What we offer</p>
                <p className="text-black cursor-pointer hover:text-gray-800">About Us</p>
                <p className="text-black cursor-pointer hover:text-gray-800">FAQS</p>
                <p className="text-black cursor-pointer hover:text-gray-800">Learn More</p>
            </div>
           
        </header>
    );
};

export default Header;
