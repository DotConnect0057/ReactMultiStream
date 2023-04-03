import React, { useState, useCallback } from 'react'
import { BsSearch } from 'react-icons/bs'
import axios from 'axios'
import _ from 'lodash'
import { RxAvatar } from 'react-icons/rx'
import { BsTwitch, BsYoutube } from 'react-icons/bs'
import { MdOutlineLiveTv } from 'react-icons/md'
import { useStateContext } from '../context/ContextProvider'
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'


const SearchBox = () => {

  const clientId = '' //twitch client ID
  const accessToken = '' //twitch access token
  const APIKEY = '' //youtube api key

  const {selectPlatform, setSelectPlatform} = useStateContext();
  const [channels, setChannels] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [selectedId, setSelectedId] = useState(); //channel id 
  const [iconUrl, setIconUrl] = useState(); // channel icon
  const [loading, setLoading] = useState(true);
  const [loadStream, setLoadStreams] = useState(true);
  const [searchResult, setSearchResult] = useState();
  const {streamData, setStreamData} = useStateContext();


  const platforms = [
    {value: "twitch", "label": <BsTwitch />},
    {value: "youtube", "label": <BsYoutube />},
  ]

  const changePlatform = (event) => {
    let crtValue = selectPlatform;
    crtValue = event;
    setSelectPlatform(crtValue);
    console.log(selectPlatform);
  }

  const fetchTwitchChannel = async (value) => {
    const endpoint = `https://api.twitch.tv/helix/search/channels?query=${value}`;
    setLoading(true);
    try {
      const res = await axios
        .get(endpoint, {
          headers: {
            "Client-ID": clientId,
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const filterData = response.data.data.map(({ 
            display_name, id, is_live, thumbnail_url 
          }) => ({ 
            display_name, id, is_live, thumbnail_url 
          }))
          const rename = filterData.map( item => {
            return { name:item.display_name, id:item.id, is_live:item.is_live,
            image:item.thumbnail_url}
          })
          console.log(rename);
          setSearchResult(rename);
        })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchYoutubeChannel = async (value) => {
    const endpoint = `https://www.googleapis.com/youtube/v3/search?key=${APIKEY}&part=snippet&type=channel&maxResult=10&q=${value}`;
    try {
      const res = await axios
        .get(endpoint)
        .then((response) => {
          const filterData = response.data.items.map((item) => {return item.snippet});
          const rename = filterData.map((item) => {
            return {name:item.channelTitle, id:item.channelId, is_live:item.liveBroadcastContent, image:item.thumbnails.default.url}
          })
          setSearchResult(rename);
        })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const updateInput = useCallback(_.debounce((value, platform) => {
    console.log(value);
    if (platform === "twitch") {
      fetchTwitchChannel(value);
    }
    if (platform === "youtube") {
      fetchYoutubeChannel(value);
    }
  }, 1000), []);

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
  

  return (
    <div className="flex flex-wrap w-[400px]">
        <div className="w-8/12 h-10">
            <input className="w-full h-10 dark:bg-[#3d3d3f]
              focus:dark:bg-[#121212] focus:outline-none focus:dark:border-blue-600
              dark:text-white p-2 rounded-tl-lg rounded-bl-lg border
              dark:border-slate-700 duration-300"
              type="text"
              placeholder="Search"
              value={inputValue}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={e => {
                updateInput(e.target.value, selectPlatform);
                setInputValue(e.target.value);
              }}
            />
        </div>
        <div className="flex w-10 h-10 justify-center dark:bg-[#2a2a2d]
          rounded-tr-lg rounded-br-lg border dark:border-slate-700
          p-2"
        >
            <button type="button" className="items-center"
              onClick={() => getStreams(selectedId)}
            >
                <BsSearch />
            </button>
        </div>
        <div className="flex w-2/12 justify-center items-center ml-5"
        >
          <Select.Root value={selectPlatform} 
            onValueChange={changePlatform}
          >
            <Select.Trigger
              className="inline-flex items-center justify-center rounded 
              px-[15px] text-[13px] leading-none h-[35px] gap-[5px] 
              bg-white dark:bg-[#2a2a2d] text-black dark:text-white
              shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 
              focus:shadow-[0_0_0_2px] focus:shadow-black 
              data-[placeholder]:text-[#121212]] outline-none border
              dark:border-slate-700"
              aria-label="platform"
            >
              <Select.Value placeholder="Select a platform" />
              <Select.Icon className="text-[#121212] dark:text-white">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white dark:bg-[#2a2a2d]
                rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),
                0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
              >
                <Select.ScrollUpButton className="flex items-center 
                  justify-center h-[25px] bg-white dark:bg-[#2a2a2d] 
                  text-black dark:text-white cursor-default"
                >
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-[5px]">
                  <Select.Group>
                    {platforms.map((option) => (
                      <SelectItem value={option.value}>{option.label}</SelectItem>
                    ))}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center 
                  justify-center h-[25px] bg-white dark:bg-[#2a2a2d] 
                  text-black dark:text-white cursor-default"
                >
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {isFocus && (loading ? <>loading...</> : (
          <div className="fixed w-[300px] mt-[50px] dark:bg-[#1b1b1b] dark:text-white">
            {searchResult.map((option) => 
              <>
                <div className="flex w-full hover:dark:bg-[#121212]">
                  <div className="flex items-center justify-center w-2/12">
                    <RxAvatar />
                  </div>
                  <div className="flex w-full p-2">
                    <p className="flex flex-nowrap"
                      onMouseDown={() => {
                        setIconUrl(option.image);
                        setInputValue(option.name);
                        setSelectedId(option.id);
                        updateInput(option.name, selectPlatform);
                        setIsFocus(false);
                      }}
                    >
                      {option.name}
                      {option.is_live && <span className="ml-2 text-red-600">
                        <MdOutlineLiveTv /></span>}
                    </p>
                </div>

                </div>
              </>
            )}
          </div>
        ))}


    </div>
  )
}

const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={classnames(
        'text-[13px] leading-none text-black dark:text-white rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-600 data-[highlighted]:text-violet1',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default SearchBox