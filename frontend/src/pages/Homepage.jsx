import Header from "../components/Header";
import Footer from "../components/Footer"; 
import "./homepage.css"

const sections = [
  {
    id: 1,
    customStyle: "bg-cover bg-center bg-no-repeat backdrop-blur",
    bgImage: "../public/homepage-firstpage.jpg",
    content: () => (
      <div className="grid gap-8 md:grid-cols-2 md:item-center md:text-left">
        <div className="margin-placer">
          <div className="h-full mt-[50px] ml-[50px]">
            <p className="text-[#1B1819] [font-family:Inter] text-6xl font-bold ">Bringing Smarter</p>
            <p className="text-[#23BA8E] [font-family:Inter] text-6xl font-bold ">Learning</p>
            <p className="text-[#1B1819] [font-family:Inter] text-6xl font-bold inline">at</p>
            <p className="[-webkit-text-stroke-width:1px] [-webkit-text-stroke-color:#1B1819] [font-family:Inter] text-6xl italic font-normal inline">Your</p>

            <p className="mb-[30px] text-[#1B1819] [font-family:Inter] text-6xl font-bold gap-8">Fingertips</p>
            
            <div className="margin-placer-1">
              <button className="get-started-btn">
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div className="h-full flex items-center justify-center">
          <div className="square-div margin-3">
            <img 
            className="w-full md:block md:mb-3"
            src="../public/rightsquares.svg" />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    bgColor: "bg-[#E3FEF9]",
    content: () => (
      <div className="grid gap-8 md:grid-cols-2 md:item-center md:text-left">
      <div className="margin-placer-3 justify-center items-center w-full">
        <h1 className="text-[#1B1819] [font-family:Inter] text-4xl font-bold mb-4 ">
        What you’re getting
        </h1>
        <p className="w-[453px] text-black [font-family:Inter] text-lg font-normal leading-[140%]">
        Astreon is an AI-powered study buddy designed to enhance learning through intelligent assistance and personalized support. It helps students stay organized, generate quizzes and flashcards, and create study schedules tailored to their needs. With built-in spaced repetition, Astreon ensures efficient long-term retention by optimizing review sessions.
        </p>
      </div>

      <div className="h-full flex items-center justify-center">
        <div className="margin-3">
          <img 
          className="w-full md:block md:mb-3"
          src="../public/page-1.jpg" />
        </div>
      </div>
    </div>
    )
  },
  {
    id: 3,
    bgColor: "bg-[#E3FEF9]",
    content: () => (
      <div className="grid gap-8 md:grid-cols-2 md:item-center md:text-left">
      <div className="h-full flex items-center justify-center">
        <div className="margin-3">
          <img 
          className="w-full md:block md:mb-3"
          src="../public/page-2.jpg" />
        </div>
      </div>

      <div className="margin-placer-3">
        <h1 className="w-[464px] text-black [font-family:Inter] text-[40px] font-bold leading-[normal]">
        We Measure in Graphs
        </h1>
        <p className="w-[453px] text-black [font-family:Inter] text-lg font-normal leading-[140%]">
        Astreon provides insightful progress tracking through heatmaps and line graphs, allowing students to measure their learning effectively. Heatmaps highlight study consistency and engagement over time, while line graphs track performance trends, helping users identify strengths and areas for improvement.
        </p>
      </div>
    </div>
    )
  },
  {
    id: 4,
    bgColor: " [background:rgba(255,255,255,0.50)] backdrop-blur-[175px]",
    content: () => (
      <div className="grid gap-8 md:grid-cols-3 md:item-center md:text-left">
        <div className="flex justify-center items-center h-screen">
            <div className="relative group duration-500 cursor-pointer overflow-hidden text-gray-50 h-72 w-56 rounded-2xl hover:duration-700 duration-700">
          <div className="w-56 h-72  text-gray-800 bg-[#D9D9D9]" >
            <div className="flex flex-row justify-between">
              <img src="../public/visualize.jpg" className="" />
            </div>
          </div>
          <div className="absolute bg-[#D9D9D9] -bottom-24 w-56 p-3 flex flex-col gap-1 group-hover:-bottom-0 group-hover:duration-600 duration-500">
            <div>
            <span className="text-lime-400 font-bold text-xs"></span>
            <span className="text-gray-800 font-bold text-3xl">Visualize</span>
            <p className="text-neutral-800">Gain clear insights into your progress through data-driven graphs and heatmaps.</p>
            </div>
            
            </div>
          </div>


        </div>

        <div className="flex justify-center items-center h-screen">
        <div className="relative group duration-500 cursor-pointer overflow-hidden text-gray-50 h-72 w-56 rounded-2xl hover:duration-700 duration-700">
          <div className="w-56 h-72  text-gray-800 bg-[#D9D9D9]" >
            <div className="flex flex-row justify-between">
              <img src="../public/recall.jpg" className="" />
            </div>
          </div>
          <div className="absolute bg-[#D9D9D9] -bottom-24 w-56 p-3 flex flex-col gap-1 group-hover:-bottom-0 group-hover:duration-600 duration-500">
            <div>
            <span className="text-lime-400 font-bold text-xs"></span>
            <span className="text-gray-800 font-bold text-3xl">Recall</span>
            <p className="text-neutral-800">Strengthen memory by tracking past reviews and optimizing study sessions</p>
            </div>
            
            </div>
          </div>

        </div>
        <div className="flex justify-center items-center h-screen">
        <div className="relative group duration-500 cursor-pointer overflow-hidden text-[#D9D9D9] h-72 w-56 rounded-2xl hover:duration-700 duration-700">
          <div className="w-56 h-72  text-gray-800 bg-[#D9D9D9]" >
            <div className="flex flex-row justify-between">
              <img src="../public/practice.jpg" className="" />
            </div>
          </div>
          <div className="absolute bg-[#D9D9D9] -bottom-24 w-56 p-3 flex flex-col gap-1 group-hover:-bottom-0 group-hover:duration-600 duration-500">
            <div>
            <span className="text-lime-400 font-bold text-xs"></span>
            <span className="text-gray-800 font-bold text-3xl">Practice</span>
            <p className="text-neutral-800">Improve long-term learning with spaced repetition and smart review strategies.</p>
            </div>
            
            </div>
          </div>

        </div>
      </div>
    )
  }
];

export function HomePage() {
  return (
    <>
      <Header />
      <main className="w-screen">
        <title>Welcome to Astreon</title>
        <div className="flex flex-col w-full">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`w-full min-h-screen h-auto flex flex-col justify-center ${section.bgColor || section.customStyle}`}
              style={section.bgImage ? { backgroundImage: `url(${section.bgImage})` } : {}}
            >
              {section.content()}
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
