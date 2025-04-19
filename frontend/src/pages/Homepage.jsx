import Footer from "../components/Footer";
import Header from "../components/Header";
import "./homepage.css";

const rightSquares = "/rightsquares.svg";
const page1 = "/page-1.jpg";
const page2 = "/page-2.jpg";
const visualize = "/visualize.jpg";
const recall = "/recall.jpg";
const practice = "/practice.jpg";
const icon = "/icon.png";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="w-screen mt-16">
        <title>Welcome to Astreon</title>
        <link rel="icon" href={icon} type="image/x-icon" />
        <div className="flex flex-col w-full">
          <div
            className="relative z-20 w-full h-auto flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/homepage-firstpage.jpg)" }}
          >
            <div className="relative z-20 grid gap-8 md:grid-cols-2 items-center text-left p-8 border border-red-500">
              <div>
                <p className="text-[#1B1819] font-inter text-6xl font-bold">Bringing Smarter</p>
                <p className="text-[#23BA8E] font-inter text-6xl font-bold">Learning</p>
                <p className="text-[#1B1819] font-inter text-6xl font-bold inline">at</p>
                <p className="text-[#1B1819] font-inter text-6xl italic font-normal inline">Your</p>
                <p className="mb-8 text-[#1B1819] font-inter text-6xl font-bold">Fingertips</p>
                <button className="get-started-btn">Get Started</button>
              </div>
              <div className="flex items-center justify-center">
                <img className="w-full md:block md:mb-3" src={rightSquares} alt="Decorative Squares" />
              </div>
            </div>
          </div>
          <div className="relative z-10 w-full h-auto flex flex-col justify-center items-center bg-[#E3FEF9] p-8 mt-16">
            <div className="grid gap-8 md:grid-cols-2 items-center text-left">
              <div>
                <p className="text-[#1B1819] font-inter text-4xl font-bold mb-4">What you’re getting</p>
                <p className="w-[453px] text-black font-inter text-lg font-normal leading-[140%]">
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
                <p className="w-[464px] text-black font-inter text-[40px] font-bold leading-[normal]">Track Your Progress</p>
                <p className="w-[453px] text-black font-inter text-lg font-normal leading-[140%]">
                  Astreon provides insightful progress tracking through heatmaps and line graphs, allowing students to measure their learning effectively.
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-10 w-full h-auto flex flex-col justify-center items-center bg-white bg-opacity-50 backdrop-blur-xl py-12">
            <div className="grid gap-8 md:grid-cols-3 items-center text-center">
              {[{ img: visualize, title: "Visualize", desc: "Gain insights into progress through data-driven graphs and heatmaps." },
                { img: recall, title: "Recall", desc: "Strengthen memory by tracking past reviews and optimizing study sessions." },
                { img: practice, title: "Practice", desc: "Improve learning with spaced repetition and smart review strategies." }].map((card, index) => (
                <div key={index} className="flex justify-center items-center h-72">
                  <div className="relative group cursor-pointer overflow-hidden text-gray-50 h-72 w-56 rounded-2xl hover:duration-700 duration-700">
                    <div className="w-56 h-72 text-gray-800 bg-[#D9D9D9] flex items-center justify-center">
                      <img src={card.img} className="w-full" alt={card.title} />
                    </div>
                    <div className="absolute bg-[#D9D9D9] -bottom-24 w-56 p-3 flex flex-col gap-1 group-hover:bottom-0 group-hover:duration-600 duration-500">
                      <span className="text-gray-800 font-bold text-3xl">{card.title}</span>
                      <p className="text-neutral-800">{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
