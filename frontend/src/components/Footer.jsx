import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#5fb399] text-black w-full h-[291px] opacity-80 flex justify-center items-center">
         
            <div className="max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">

                <div className="flex flex-col items-center md:items-start">
                    <img src="../public/Astreon_Logo.svg" alt="Logo" className="h-10 mb-2" />
                </div>

                <div className="flex flex-col items-center md:items-start">
                    <p className="text-sm font-semibold uppercase mb-2">Learn More</p>
                    <a href="#" className="hover:underline">Spaced Repetition</a>
                    <a href="#" className="hover:underline">Visual Progress</a>
                    <a href="#" className="hover:underline">Getting Started</a>
                    <a href="#" className="hover:underline">Support & Contact</a>
                </div>

                <div className="flex flex-col items-center md:items-start">
                    <p className="text-sm font-semibold uppercase mb-2">Menu</p>
                    <a href="#" className="hover:underline">Home</a>
                    <a href="#" className="hover:underline">About Us</a>
                    <a href="#" className="hover:underline">What We Offer</a>
                </div>

                <div className="flex flex-col items-center md:items-start">
                    <p className="text-sm font-semibold uppercase mb-2">Contact</p>
                    <p className="text-sm">scaves2024@gmail.com</p>
                    
               
                    <div className="flex flex-row justify-center md:justify-start gap-4 mt-4">
                        <a href="#">
                            <img src="../public/whatsapp.svg" alt="WhatsApp" className="h-6 w-6" />
                        </a>
                        <a href="#">
                            <img src="../public/facebook.svg" alt="Facebook" className="h-6 w-6" />
                        </a>
                        <a href="#">
                            <img src="../public/insta.svg" alt="Instagram" className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
