import logo from './logo.svg';
import './App.css';
import { useStateContext } from './context/ContextProvider';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Main from './pages/Main';

function App() {

  const {activeMenu, setActiveMenu} = useStateContext();
  const {activeScreen, setActiveScreen} = useStateContext();


  return (
    <>
        <div key="top" className="dark:bg-[#121212] dark:text-white bg-slate-100 text-black">
          <div className="flex">
            { activeMenu ? (
              <div key="sidebar" className="mr-1 p-1 w-[200px] fixed sidebar bg-slate-100 dark:bg-[#1b1b1b]">
                <Sidebar />
              </div>
            ) : (
              <div key="sidebar" className="mr-0 p-1 w-[50px] bg-slate-100 dark:bg-[#1b1b1b]">
                <Sidebar />
              </div>
            )}

            <div className="flex w-full h-screen">
                <div key="main" className={`flex flex-col w-full content-center items-center bg-slate-100 dark:bg-[#1b1b1b] ${activeMenu ? "md:ml-[200px]" : "flex"}`}>
                  {activeMenu ? (
                    <div key="navbor" className="flex md:static p-1 w-full h-20 justify-between items-center fixed navbar dark:bg-[#1b1b1b] dark:text-white">
                      <Navbar />
                    </div>
                  ) : (
                    <></>
                  )}
                  <div key="hero" className="flex-1 w-full h-full dark:bg-[#121212]">
                    <Main />
                  </div>
                </div>
            </div>

          </div>
        </div>
    </>

  );
}

export default App;
