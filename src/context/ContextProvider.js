import React, { createContext, useContext, useState } from 'react'

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize, setScreenSize] = useState(undefined);
    const [darkMode, setDarkMode] = useState(false);
    const [activeScreen, setActiveScreen] = useState("1");
    const [selectPlatform, setSelectPlatform] = useState("twitch");
    const [streamData, setStreamData] = useState([]);
    const [twitchFavorites, setTwitchFavorites] = useState([]);
    const [youtubeFavorites, setYoutubeFavorites] = useState([]);

    return (
        <StateContext.Provider
            value={{ activeMenu, setActiveMenu,
                screenSize, setScreenSize, darkMode, setDarkMode,
                activeScreen, setActiveScreen, selectPlatform, setSelectPlatform,
                streamData, setStreamData, twitchFavorites, setTwitchFavorites,
                youtubeFavorites, setYoutubeFavorites
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);