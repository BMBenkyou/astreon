import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
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
            <p className="text-[#1B1819] [font-family:Inter] text-6xl font-bold ">at</p>
            <p className="[-webkit-text-stroke-width:1px] [-webkit-text-stroke-color:#1B1819] [font-family:Inter] text-6xl italic font-normal ">Your</p>
            <p className="mb-2 text-[#1B1819] [font-family:Inter] text-6xl font-bold gap-8">Fingertips</p>
            <div className="gap-8">
               <button className="rounded bg[#039C87]">Get Started</button>
            </div>
            
          </div>
        </div>

        <div className="h-full flex items-center justify-center">
          <div>
            <img 
            className="w-full md:"
            src="../public/rightsquares.svg"></img>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    bgColor: "bg-[#E3FEF9]",
    content: () => (
      <div className="p-8 text-left">
        <h2 className="text-3xl font-bold mb-4">Section 2</h2>
        <p className="text-lg">This is the content of section 2.</p>
      </div>
    )
  },
  {
    id: 3,
    bgColor: "bg-teal-50",
    content: () => (
      <div className="p-8 text-right">
        <h2 className="text-3xl font-bold mb-4">Section 3</h2>
        <p className="text-lg">This is the content of section 3.</p>
      </div>
    )
  },
  {
    id: 4,
    bgColor: "bg-[#E3FEF9]",
    content: () => (
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Section 4</h2>
        <p className="text-lg">This is the content of section 4.</p>
      </div>
    )
  }
];

export function HomePage() {
  return (
    <>
      <Header />
      <main className="w-screen h-screen ">
        <title>Welcome to Astreon</title>
        <div className="flex flex-col w-full">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`w-full h-screen ${section.bgColor || section.customStyle}`}
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