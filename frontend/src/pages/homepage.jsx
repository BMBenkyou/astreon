const rightSquares = "/rightsquares.svg";
const page1 = "/page-1.jpg";
const page2 = "/page-2.jpg";
const icon = "/icon.png";

export default function HomePage() {
  return (
    <>
      <main className="w-screen mt-200">
        <div className="flex flex-col w-full">
          {/* This is the first section */}
          <div
            className="relative z-20 w-full flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat min-h-screen" // min-h-screen added in previous fix
            style={{ backgroundImage: "url(/homepage-firstpage.jpg)" }}
          >
            {/* Added padding to the container div to give some space inside the background image section */}
            <div className="relative z-20 grid gap-8 md:grid-cols-2 items-center text-left p-8 md:p-16 lg:p-24">
              <div>
                <p className="text-[#1B1819] font-inter text-4xl md:text-5xl lg:text-6xl font-bold">Bringing Smarter</p>
                <p className="text-[#23BA8E] font-inter text-4xl md:text-5xl lg:text-6xl font-bold">Learning</p>
                <p className="text-[#1B1819] font-inter text-4xl md:text-5xl lg:text-6xl font-bold inline">at</p>
                <p className="text-[#1B1819] font-inter text-4xl md:text-5xl lg:text-6xl italic font-normal inline">Your</p>
                <p className="mb-8 text-[#1B1819] font-inter text-4xl md:text-5xl lg:text-6xl font-bold">Fingertips</p>
                {/* Button Container */}
                <div className="flex flex-col sm:flex-row gap-4"> {/* Added flex container for buttons with responsive direction and gap */}
                  {/* Get Started Button (now a link) */}
                  <a
                    href="/signup"
                    className="bg-[ #23BA8E] mt-8 px-6 py-3 text-white px-6 py-3 rounded-lg font-semibold text-center transition duration-300 ease-in-out hover:bg-[#1A9B75] shadow-md" // Adjusted shadow slightly
                  >
                    Get Started
                  </a>
                  {/* Learn More Button (as a link) */}
                  <a
                    href="#what-youre-getting" // Link to the ID of the second section
                    className="inline-block border border-[#23BA8E] text-[#23BA8E] px-6 py-3 rounded-lg font-semibold text-center transition duration-300 ease-in-out hover:bg-[#E3FEF9] shadow-lg" // Added Tailwind classes for styling and hover
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img className="w-full md:block md:mb-3" src={rightSquares} alt="Decorative Squares" />
              </div>
            </div>
          </div>
          {/* Second section - Added an ID here to link from the "Learn More" button */}
          <div id="what-youre-getting" className="relative z-10 w-full h-auto flex flex-col justify-center items-center bg-[#E3FEF9] p-8 mt-16">
            <div className="grid gap-8 md:grid-cols-2 items-center text-left">
              <div>
                <p className="text-[#1B1819] font-inter text-4xl font-bold mb-4">What you’re getting</p>
                {/* Adjusted max-width for better responsiveness */}
                <p className="max-w-md text-black font-inter text-lg font-normal leading-[140%]">
                  Astreon is an AI-powered study buddy designed to enhance learning through intelligent assistance and personalized support. It helps students stay organized, generate quizzes and flashcards, and create study schedules tailored to their needs.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <img className="w-full md:block md:mb-3" src={page1} alt="Study Illustration" />
              </div>
            </div>
          </div>
          <div className="relative z-10 w-full h-auto flex flex-col justify-center items-center bg-[#E3FEF9] p-8 mt-16">
            <div className="grid gap-8 md:grid-cols-2 items-center text-left">
              <div className="flex items-center justify-center">
                <img className="w-full md:block md:mb-3" src={page2} alt="Progress Tracking" />
              </div>
              <div>
                <p className="max-w-md text-black font-inter text-[40px] font-bold leading-[normal]">Track Your Progress</p>
                 {/* Adjusted max-width for better responsiveness */}
                <p className="max-w-md text-black font-inter text-lg font-normal leading-[140%]">
                  Astreon provides insightful progress tracking through heatmaps and line graphs, allowing students to measure their learning effectively.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}