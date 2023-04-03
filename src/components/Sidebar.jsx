import React, { useState, useEffect } from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import { useStateContext } from '../context/ContextProvider';
import * as Avatar from '@radix-ui/react-avatar';
import * as Separator from '@radix-ui/react-separator';
import { BsTwitch, BsYoutube } from 'react-icons/bs';
import axios from 'axios';
import _ from 'lodash';

const Sidebar = () => {
  const clientId = '' //twitch client ID
  const accessToken = '' //twitch access token
  const APIKEY = '' //youtube api key

  const {activeMenu, setActiveMenu, screenSize} = useStateContext();
  const [loading, setLoading] = useState(true);
  const {twitchFavorites, setTwitchFavorites} = useStateContext();
  const {youtubeFavorites, setYoutubeFavorites} = useStateContext();
  const {streamData, setStreamData} = useStateContext();
  const {selectPlatform, setSelectPlatform} = useStateContext();
  const [loadStream, setLoadStreams] = useState(true);
  const [selectedId, setSelectedId] = useState(); //channel id 
  const [iconUrl, setIconUrl] = useState(); // channel icon

  const fetchFav = async (value) => {
    // setLoading(true);
    try {
      const res = await axios
        .get(`http://a.b.c.d:3001/getFav`) // replace your api to fetch favorite
        .then((response) => {
          setTwitchFavorites(response.data.favarite.twitch);
          setYoutubeFavorites(response.data.favarite.youtube);
          console.log(response.data);
        })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFav();
  }, [])
  
  const getTwitchStream = async (streamId) => {
    setLoadStreams(true);
    try {
      const endpoint = `https://api.twitch.tv/helix/streams?user_id=${streamId}`;
      const res = await axios
        .get(endpoint, {
          headers: {
            "Client-ID": clientId,
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          if (!Object.keys(response.data.data).length) {
            setStreamData([]);
          } else {
            const newRes = response.data.data;
            const updateUrl = newRes.map((item, index) => {
              let tmpUrl = _.replace(item.thumbnail_url, "{width}", "440");
              let replaceUrl = _.replace(tmpUrl);
              newRes[index].thumbnail_url = replaceUrl;
              const updateData = newRes.map((item) => {
                return {user_name: item.user_name, id:selectedId, icon_url:iconUrl,
                  videoId:item.user_login, title:item.title, thumbnail_url:item.thumbnail_url,
                  viewer_count: item.viewer_count, platform: selectPlatform
                }
              })
              console.log("debug twitch", updateData);
              setStreamData(updateData);
            })
          }
        })
    } catch (error) {
      console.error(error);
    } finally {
      setLoadStreams(false);
    }
  };

  const getYoutubeStream = async (streamId) => {
    setLoadStreams(true);
    try {
      const endpoint = `https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&part=snippet,id&channelId=${streamId}&eventType=live&type=video`;
      const res = await axios
        .get(endpoint)
        .then((response) => {
          if (!Object.keys(response.data.items).length) {
            setStreamData([]);
          } else {
            const newRes = response.data.items.map((item) => {
              return item.snippet
            });
            const videoId = response.data.items.map((item) => {
              return item.id.videoId
            });
            const updateData = newRes.map((item) => {
              return {user_name:item.channelTitle, id:item.channelId,
                icon_url:iconUrl, videoId:videoId[0], title:item.title,
                thumbnail_url:item.thumbnails.medium.url, platform:selectPlatform
              }
            });
            console.log("debug youtube", updateData);
            setStreamData(updateData);
          }
        })
    } catch (error) {
      console.error(error);
    } finally {
      setLoadStreams(false);
    }
  };

  const getStreams = (value) => {
    // skip if there is no input
    if (Object(value).length !== 0) {
      if (selectPlatform === "twitch") {
        getTwitchStream(value);
      }
      if (selectPlatform === "youtube") {
        getYoutubeStream(value);
      }  
    }
  };
  

  const Navbutton = ({ title, customFunc, icon, color }) => (
    <button type={title} onClick={customFunc} style={{ color }} className="relative text-xl rounded-full p-3 hover:bg-light-gray" >
        <span className="absolute inline-flex rounded-full h-2 right-2 top-2" />
        {icon}
    </button>
  )

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
        <div className="flex mt-3 justify-end items-center">
            Your Favorite
            <Navbutton title="menu" customFunc={() => setActiveMenu((preActiveMenu) => !preActiveMenu)} color="" icon={<AiOutlineMenu />} />
        </div>
        {activeMenu ? (
          <div className="mt-10">
            <div key="twitch">
              <p className="flex flex-nowrap m-2 mt-4 text-black 
                dark:text-white capitalize justify-start items-center">
                  <span>twitch</span><span className="ml-3 text-purple-600"><BsTwitch /></span>
              </p>
              <Separator.Root
                className="bg-purple-600 data-[orientation=horizontal]:h-px
                  data-[orientation=horizontal]:w-24 mx-[5px]"
                decorative
                orientation="horizontal"
              />
              {loading ? <>loading ...</> : (
                <>
                  {twitchFavorites.map((link) => (
                    <div key={link.user_name} onClick={() => {getStreams(link.id)}} //
                    className="flex items-center gap-2 pl-1 pt-1 pb-1 rounded-sm
                      text-md text-gray-700 dark:text-gray-300 dark:hover:text-black hover:bg-gray-500 m-2 hover:drop-shadow-lg"
                    >
                      <Avatar.Root className="bg-blackA3 inline-flex 
                      h-[30px] w-[30px] select-none items-center 
                      justify-center overflow-hidden rounded-full align-middle"
                      >
                        <Avatar.Image
                          className="h-full w-full rounded-[inherit] object-cover"
                          src={link.icon_url}
                          alt={link.use_name}
                        />
                        <Avatar.Fallback
                          className="text-black dark:text-white leading-1 flex 
                          h-full w-full items-center justify-center bg-black dark:bg-white
                          text-[15px] font-medium"
                          delayMs={600}
                        >
                          U
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <span className="capitalize">{link.user_name}</span>
                    </div>
                  ))}
                </>
              )}
              
            </div>

            <div key="youtube">
              <p className="flex flex-nowrap m-2 mt-4 text-black 
                dark:text-white capitalize justify-start items-center">
                  <span>twitch</span><span className="ml-3 text-red-600"><BsYoutube /></span>
              </p>
              <Separator.Root
                className="bg-red-600 data-[orientation=horizontal]:h-px
                  data-[orientation=horizontal]:w-24 mx-[5px]"
                decorative
                orientation="horizontal"
              />
              {loading ? <>loading ...</> : (
                <>
                  {youtubeFavorites.map((link) => (
                    <div key={link.user_name} onClick={() => {getStreams(link.id)}} //
                    className="flex items-center gap-2 pl-1 pt-1 pb-1 rounded-sm
                      text-md text-gray-700 dark:text-gray-300 dark:hover:text-black hover:bg-gray-500 m-2 hover:drop-shadow-lg"
                    >
                      <Avatar.Root className="bg-blackA3 inline-flex 
                      h-[30px] w-[30px] select-none items-center 
                      justify-center overflow-hidden rounded-full align-middle"
                      >
                        <Avatar.Image
                          className="h-full w-full rounded-[inherit] object-cover"
                          src={link.icon_url}
                          alt={link.use_name}
                        />
                        <Avatar.Fallback
                          className="text-black dark:text-white leading-1 flex 
                          h-full w-full items-center justify-center bg-black dark:bg-white
                          text-[15px] font-medium"
                          delayMs={600}
                        >
                          U
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <span className="capitalize">{link.user_name}</span>
                    </div>
                  ))}
                </>
              )}
              
            </div>

          </div>
        ) : (
          <div className="mt-10">
            <div key="twitch">
              <p className="flex flex-nowrap m-2 mt-4 text-black 
                dark:text-white capitalize justify-start items-center">
                  <span className="ml-3 text-purple-600"><BsTwitch /></span>
              </p>
              <Separator.Root
                className="bg-purple-600 data-[orientation=horizontal]:h-px
                  data-[orientation=horizontal]:w-full mx-[5px]"
                decorative
                orientation="horizontal"
              />
              {loading ? <>loading ...</> : (
                <>
                  {twitchFavorites.map((link) => (
                    <div key={link.user_name} onClick={() => {}} //
                    className="flex w-[35px] justify-center rounded-sm
                      text-md text-gray-700 dark:text-gray-300 
                      dark:hover:text-black hover:bg-gray-500 m-2 hover:drop-shadow-lg"
                    >
                      <Avatar.Root className="bg-blackA3 inline-flex 
                      h-[30px] w-[30px] select-none items-center 
                      justify-center overflow-hidden rounded-full align-middle"
                      >
                        <Avatar.Image
                          className="h-full w-full rounded-[inherit] object-cover"
                          src={link.icon_url}
                          alt={link.use_name}
                        />
                        <Avatar.Fallback
                          className="text-black dark:text-white leading-1 flex 
                          h-full w-full items-center justify-center bg-black dark:bg-white
                          text-[15px] font-medium"
                          delayMs={600}
                        >
                          U
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </div>
                  ))}
                </>
              )}
              
            </div>

            <div key="youtube">
              <p className="flex flex-nowrap m-2 mt-4 text-black 
                dark:text-white capitalize justify-start items-center">
                  <span className="ml-3 text-red-600"><BsYoutube /></span>
              </p>
              <Separator.Root
                className="bg-red-600 data-[orientation=horizontal]:h-px
                  data-[orientation=horizontal]:w-full mx-[5px]"
                decorative
                orientation="horizontal"
              />
              {loading ? <>loading ...</> : (
                <>
                  {youtubeFavorites.map((link) => (
                    <div key={link.user_name} onClick={() => {}} //
                    className="flex w-[35px] justify-center rounded-sm
                      text-md text-gray-700 dark:text-gray-300 
                      dark:hover:text-black hover:bg-gray-500 m-2 hover:drop-shadow-lg"
                    >
                      <Avatar.Root className="bg-blackA3 inline-flex 
                      h-[30px] w-[30px] select-none items-center 
                      justify-center overflow-hidden rounded-full align-middle"
                      >
                        <Avatar.Image
                          className="h-full w-full rounded-[inherit] object-cover"
                          src={link.icon_url}
                          alt={link.use_name}
                        />
                        <Avatar.Fallback
                          className="text-black dark:text-white leading-1 flex 
                          h-full w-full items-center justify-center bg-black dark:bg-white
                          text-[15px] font-medium"
                          delayMs={600}
                        >
                          U
                        </Avatar.Fallback>
                      </Avatar.Root>
                    </div>
                  ))}
                </>
              )}
              
            </div>

          </div>
        )}
    </div>
  )
}

export default Sidebar