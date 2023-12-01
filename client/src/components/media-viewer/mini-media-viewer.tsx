import React from "react";

import config from "../../config/config";

import { acceptedMediaExtensions } from "../../models/models";

export type MediaViewerProps = { filename: string }

const MiniMediaViewer: React.FC<any> = ({ filename }) => {
  return (
    <div>
     {
        acceptedMediaExtensions.image.filter(accepted => filename.toLowerCase().endsWith(accepted)).length ?
          <img
            className="inline-block"
            width={64} 
            height={64} 
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
          <video
            className="inline-block"
            width={64} 
            height={64} 
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
            controls={true} autoPlay={false} muted={true} loop={true}
          ></video>
      }
    </div>
  )
}

export default MiniMediaViewer;