import React, { useRef, useState, useEffect, useCallback } from 'react'
import { TwitchPlayer, TwitchPlayerNonInteractive } from 'react-twitch-embed'
import YouTube from 'react-youtube'


const StreamBox = (props) => {
//   const embed = useRef();
  const [platform, setPlatform] = useState(props.platform);
//   const handleReady = (e) => {
//     embed.current = e;
//   };

  const streamId = useCallback(props.streamId);

  const wMargin = 10;
  const hMargin = 10;
  let height = props.height-hMargin;
//   let width = (height/9)*16; // adjust for 16:9
  let width = props.width-wMargin;

  const opts = {
    height: height,
    width: width,
    playerVars: {
        autoplay:0,
      }        
  };

  useEffect(() => {
    height = props.height-hMargin;
    width = props.width-wMargin;
    setPlatform(props.platform);
    // opts.heigth = props.height-hMargin;
    // opts.width = props.width-wMargin;
    // width = (height/9)*16;
  }, [props])


  return (
    <div>
        {platform === "twitch"
         &&
           <>
             <TwitchPlayerNonInteractive channel={streamId}
               height={height} width={width} autoplay muted 
             />
           </>
         }
         {platform === "youtube"
           &&
             <>
               <YouTube
                 videoId={streamId}
                 opts={opts}
               />
             </>
         }
    </div>
  )
}

export default StreamBox