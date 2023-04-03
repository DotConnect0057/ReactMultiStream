import React, { useState } from 'react'
import { useStateContext } from '../context/ContextProvider';
import { MdOutlineFavorite, MdOutlineRemoveCircle } from 'react-icons/md';
import axios from 'axios';

const AddFavorite = () => {

  const {twitchFavorites, setTwitchFavorites} = useStateContext();
  const {youtubeFavorites, setYoutubeFavorites} = useStateContext();
  const {streamData, setStreamData} = useStateContext();


  const updateFav = async (value) => {
    try {
        const res = await axios
        .post(`http://a.b.c.d:3001/updateFav`, value,{ // replace your api to store favorite
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            console.log(response);
        })
    } catch (error) {
        console.error(error);
    }
  };

  const handleClick = () => {

    if (streamData[0].platform === "twitch") {
        let tmpFavorites = [...twitchFavorites];
        const favID = streamData[0].id;
        if (Object(twitchFavorites).length === 0) {
            tmpFavorites.push(streamData[0]);
            setTwitchFavorites(tmpFavorites);
            console.log(twitchFavorites);
        } else {
            console.log(twitchFavorites);
            const checkId = twitchFavorites.some((item) => {
                if (item.id === favID) {
                    return true
                }
            })
            if (checkId === true) {
                console.log('already added');
            }
            else {
                tmpFavorites.push(streamData[0]);
                setTwitchFavorites(tmpFavorites);
            }
        }
    }
    if (streamData[0].platform === "youtube") {
        let tmpFavorites = [...youtubeFavorites];
        const favID = streamData[0].id;
        if (Object(youtubeFavorites).length === 0) {
            tmpFavorites.push(streamData[0]);
            setYoutubeFavorites(tmpFavorites);
            console.log(youtubeFavorites);
        } else {
            console.log(youtubeFavorites);
            const checkId = youtubeFavorites.some((item) => {
                if (item.id === favID) {
                    return true
                }
            })
            if (checkId === true) {
                console.log('already added');
            }
            else {
                tmpFavorites.push(streamData[0]);
                setYoutubeFavorites(tmpFavorites);
            }
        }
    }
    const jsonData = {name:"my", favarite:{"twitch":twitchFavorites, "youtube":youtubeFavorites }};
    updateFav(jsonData);
    console.log(jsonData);
  };

  const resetFavorite = () => {
    setTwitchFavorites([]);
    setYoutubeFavorites([]);
  }

  return (
    <div className="flex flex-nowrap">
         <div className="flex w-10 h-10 items-center justify-center dark:bg-[#2A2A2D] rounded-lg border dark:border-slate-700 p-5">
             <button type="button" className="items-center justify-center" onClick={() => {handleClick()}}>
                 <MdOutlineFavorite />
             </button>
         </div>
         <div className="flex w-10 h-10 items-center justify-center dark:bg-[#2A2A2D] rounded-lg border dark:border-slate-700 p-5">
             <button type="button" className="items-center justify-center" onClick={() => {resetFavorite()}}>
                 <MdOutlineRemoveCircle />
             </button>
         </div>
        {/* favorite
        {streamData.map((item) => (
            <div>{item.user_name}, <img src={item.icon_url} /></div>
        ))} */}
    </div>
  )
}

export default AddFavorite