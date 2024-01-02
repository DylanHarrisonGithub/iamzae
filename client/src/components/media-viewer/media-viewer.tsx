import React from "react";

import config from "../../config/config";
import { acceptedMediaExtensions } from "../../models/models";

export type MediaViewerProps = { filename: string }

const MediaViewer: React.FC<MediaViewerProps> = ({ filename }) => {
  return (
    <div className=" inline-block">
      {
        acceptedMediaExtensions.image.filter(accepted => filename.toLowerCase().endsWith(accepted)).length ?
          <img 
            // style={{height: window.innerHeight-100}}
            // height={ window.innerHeight - 100 }
            src={
              (
                filename.toUpperCase().startsWith('HTTP://') ||
                filename.toUpperCase().startsWith('HTTPS://') ||
                filename.toUpperCase().startsWith('www.')
              ) ?
                filename
              :
                config.ASSETS[config.ENVIRONMENT] + `media/${filename}`
            }
          >
          </img>
        :
          (
            filename.toUpperCase().startsWith('HTTP://') ||
            filename.toUpperCase().startsWith('HTTPS://') ||
            filename.toUpperCase().startsWith('www.')
          ) ?  
            <iframe 
              className=" w-full h-auto"
              src={filename} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          :
            <video
              // style={{height: window.innerHeight-100}}
              src={config.ASSETS[config.ENVIRONMENT] + `media/${filename}`}
              controls={true} autoPlay={false} muted={true} loop={true}
            ></video>
      }
    </div>
  )
}

export default MediaViewer;