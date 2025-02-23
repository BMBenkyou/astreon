const Sidebar = () => {
    return (
      <aside className="w-64 bg-gray-200 p-4">
        <ul>
          <li><a href="/" className="block p-2">Home</a></li>
          <li><a href="/about" className="block p-2">About</a></li>
          <li><a href="/contact" className="block p-2">Contact</a></li>
        </ul>
      </aside>
    );
  };
  
  export default Sidebar;
  