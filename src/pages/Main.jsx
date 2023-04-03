import React, { useEffect, useState, useRef } from 'react'
import ChatBox from '../components/ChatBox';
import StreamBox from '../components/StreamBox';
import { useStateContext } from '../context/ContextProvider';

const Main = () => {

  const refHeight = useRef(null);
  const refWidth = useRef(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const {activeMenu, setActiveMenu} = useStateContext();
  const {activeScreen, setActiveScreen} = useStateContext();
  const {streamData, setStreamData} = useStateContext();
  const [stream1, setStream1] = useState([]);
  const [stream2, setStream2] = useState([]);
  const [stream3, setStream3] = useState([]);

  const getSize = () => {
    const newWidth = Math.floor(refWidth.current.clientWidth-(refWidth.current.clientWidth/100));
    setWidth(newWidth);
    const newHeight = Math.floor(refHeight.current.clientHeight-(refHeight.current.clientHeight/100));
    setHeight(newHeight);
  }
  const handleClick = (screen) => {
    setActiveScreen(() => (screen));
  }

  useEffect(() => {
    getSize();
  }, [activeMenu]);

  useEffect(() => {
    const handleWindowResize = () => {
        getSize();
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
        window.removeEventListener('resize', handleWindowResize);
    }
  }, [])

  useEffect(() => {
    if (activeScreen === "1") {
      setStream1(streamData);
    }
    if (activeScreen === "2") {
      setStream2(streamData);
    }
    if (activeScreen === "3") {
      setStream3(streamData);
    }
  }, [streamData]);


  return (
    <div id="top" className="flex flex-col w-full h-full pr-3">
        <div ref={refHeight} key="row1" className="flex w-full h-1/2 m-1 flex-nowrap">
            <div ref={refWidth} className="flex w-1/2 mr-1 
              bg-[#1b1b1b] border border-[#1b1b1b] 
              hover:border-blue-600 justify-center items-center"
              onClick={() => handleClick("1")}
            >
              {stream1.length === 0 ? <>loading...</> :
                <StreamBox width={width} height={height}
                  platform={stream1[0].platform}
                  streamId={stream1[0].videoId}
                />
              }
                {/* screen1, {width}, {height}, active {activeScreen} */}
                {/* {streamData[0].user_name} */}
            </div>
            <div ref={refWidth} className="flex w-1/2 mr-1 
              bg-[#1b1b1b] border border-[#1b1b1b] 
              hover:border-blue-600 justify-center items-center"
              onClick={() => handleClick("2")}
            >
              {stream2.length === 0 ? <>loading...</> :
                <StreamBox width={width} height={height}
                  platform={stream2[0].platform}
                  streamId={stream2[0].videoId}
                />
              }
                {/* screen2, {width}, {height}, active {activeScreen} */}
            </div>
        </div>
        <div ref={refHeight} key="row2" className="flex w-full h-1/2 mr-1 ml-1 flex-nowrap">
            <div ref={refWidth} className="flex w-1/2 mr-1 
              bg-[#1b1b1b] border border-[#1b1b1b] 
              hover:border-blue-600 justify-center items-center"
              onClick={() => handleClick("3")}
            >
              {stream3.length === 0 ? <>loading... {width}, {height}</> :
                <StreamBox width={width} height={height}
                  platform={stream3[0].platform}
                  streamId={stream3[0].videoId}
                />
              }
                {/* screen3, {width}, {height}, active {activeScreen} */}
            </div>
            <div ref={refWidth} className="flex w-1/2 mr-1 
              bg-[#1b1b1b] border border-[#1b1b1b] 
              hover:border-blue-600 justify-center items-center"
              onClick={() => handleClick("4")}
            >
              {stream1.length === 0 ? <>loading..</> :
                <ChatBox width={width/3} height={height}
                  title={stream1[0].user_name} chatId={stream1[0].videoId} 
                  platform={stream1[0].platform}
                />
              }
              {stream2.length === 0 ? <>loading..</> :
                <ChatBox width={width/3} height={height}
                  title={stream2[0].user_name} chatId={stream2[0].videoId} 
                  platform={stream2[0].platform}
                />
              }
              {stream3.length === 0 ? <>loading..</> :
                <ChatBox width={width/3} height={height}
                  title={stream3[0].user_name} chatId={stream3[0].videoId} 
                  platform={stream3[0].platform}
                />
              }
                {/* screen4, {width}, {height}, active {activeScreen} */}
            </div>
        </div>

    </div>
  )
}

export default Main