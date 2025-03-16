import "./Header.css";
import { useState } from "react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="h-[50px] w-full flex items-center justify-between px-4 bg-transparent fixed top-0 left-0 right-0 z-50">
          
            <div className="flex items-center">
                <img src="../public/Astreon_Logo.svg" alt="Logo" className="h-10" />
            </div>

  
            <div className="hidden md:flex space-x-6">
                <p className="text-black cursor-pointer hover:text-gray-800">What We Offer</p>
                <p className="text-black cursor-pointer hover:text-gray-800">About Us</p>
                <p className="text-black cursor-pointer hover:text-gray-800">FAQs</p>
                <p className="text-black cursor-pointer hover:text-gray-800">Learn More</p>
            </div>

            <div className="md:hidden flex items-center z-50">
                <img 
                    src="../public/Menu.svg" 
                    alt="Menu" 
                    className="h-8 cursor-pointer relative" 
                    onClick={toggleDropdown} 
                />
            </div>

            
            <div 
                className={`fixed top-0 right-0 h-screen w-2/3 max-w-xs bg-[#23BA8E] shadow-lg transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
              
                <div className="p-4 flex justify-end">
                    <img 
                        src="../public/Menu.svg" 
                        alt="Close Menu" 
                        className="h-8 cursor-pointer opacity-0" 
                        onClick={toggleDropdown} 
                    />
                </div>

                <div className="flex flex-col items-end">
                    <p className="text-black text-xl font-medium cursor-pointer hover:text-gray-800">Home</p>
                    <p className="text-black text-xl font-medium cursor-pointer hover:text-gray-800">About Us</p>
                    <p className="text-black text-xl font-medium cursor-pointer hover:text-gray-800">What We Offer</p>
                    <p className="text-black text-xl font-medium cursor-pointer hover:text-gray-800">Learn More</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
