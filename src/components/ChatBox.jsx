import React, { useState, useEffect } from 'react'
import { TwitchChat } from 'react-twitch-embed'

const YoutubeChat = (props) => {
    let height = props.height;
    let width = props.width;
    let channel = props.channel;
    const endpoint = `https://www.youtube.com/live_chat?v=${channel}&embed_domain=localhost`

    return (
        <>
          <iframe width={width} height={height}
            src={endpoint} frameborder="0"
          /> 
        </>
    )
}

const ChatBox = (props) => {

  const [platform, setPlatform] = useState(props.platform);
  let height = props.height;
  let width = props.width;

  useEffect(() => {
    width = props.width;
    height = props.height;
    setPlatform(props.platform);
  }, [props])

  return (
    <div>
        {platform === "twitch" &&
          <TwitchChat channel={props.chatId}
            width={width} height={height} darkMode
          />
        }
        {platform === "youtube" &&
          <YoutubeChat channel={props.chatId}
            width={width} height={height}
          />
        }
    </div>
  )
}

export default ChatBox