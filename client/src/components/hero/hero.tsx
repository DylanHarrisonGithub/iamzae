//todo:
//  1.  [x] add optional video playback or image or svg in background.  
//  2.  [ ] alternate video or image for portrait or landscape orientation.
//  3.  [x] pass custom react hero content element.
//  4.  [ ] variable content justification.
//  5.  [ ] audio mute/unmute button.
import React from "react";
import config from "../../config/config";

export type HeroProps = {
  image?: string;
  video?: string;
  svg?: string;
  translateX?: number;
  translateY?: number;
  children?: React.ReactNode;
};

const Hero: React.FC<HeroProps> = (props: HeroProps) => {
  return (
    <div 
      className={`relative w-full min-h-screen flex justify-center items-center ${props.svg ? props.svg : `bg-cover bg-center`}`} 
      style={
        props.image ?
        { backgroundImage: `url("${config.ASSETS[config.ENVIRONMENT]}media/${props.image}` }
      :
        undefined

      }
    >
      {
        props.video && (
          <video 
            className="min-w-full h-screen absolute object-cover"
            src={`${config.ASSETS[config.ENVIRONMENT]}media/${props.video}`}
            autoPlay={true} muted={true} loop={true}
          >
          </video>
        )
      }
      {
                      // ${
                      //   props.translateX && (
                      //     (props.translateX > 0) ?
                      //       `transform translate-x-${props.translateX}`
                      //     :
                      //       `transform -translate-x-${Math.abs(props.translateX)}`
                      //   ) || ''
                      // } ${
                      //   props.translateY && (
                      //     (props.translateY > 0) ?
                      //       `transform translate-y-${props.translateY}`
                      //     :
                      //       `transform` ///-translate-y-${Math.abs(props.translateY)}`
                      //   ) || ''
                      // }
        props.children && (
          <div 
            className={`flex justify-center items-center max-w-full`}
            style={(props.translateX || props.translateY) ? {transform: `translate(${
              (props.translateX ? props.translateX + 'rem, ' : '0, ') +
              (props.translateY ? props.translateY + 'rem' : '0')
            })`} : {}}
          >
            { props.children }
          </div>)
      }
    </div>
  )
}

export default Hero;