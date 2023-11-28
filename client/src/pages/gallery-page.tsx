import React from "react";

import Gallery2 from "../components/gallery/gallery2";
import Gallery3 from "../components/gallery/gallery3";
import Gallery4 from "../components/gallery/gallery4";
import { ModalContext } from "../components/modal/modal";

import HttpService from "../services/http.service";

import config from "../config/config";
import MediaViewer from "../components/media-viewer/media-viewer";

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

const GalleryPage: React.FC<any> = (props: any) => {

  const [mediaFileList, setMediaFileList] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState<boolean>(false);

  const modalContext = React.useContext(ModalContext);
  
  React.useEffect(() => {
    (async () => {
      setBusy(true);
      const res = await HttpService.get<string[]>('medialist');
      if (res.success && res.body) {
        setBusy(false);
        setMediaFileList(res.body);
      } 
    })();
  }, [])

  return (
    <div className="pt-16 diamonds">
      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
          &nbsp;&nbsp;Media Gallery&nbsp;&nbsp;
      </h1>
      <div className=" min-h-screen  mx-auto">

        {
          busy && (
            <div className="flex justify-center items-center h-screen -my-24">
                <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
          )
        }
        { (!busy && mediaFileList.length) && (
          <Gallery4 maxColumnWidth={288} maxColumns={6}>
            {
              mediaFileList.map(a => (
                <span key={a} className="inline-block relative my-[1px] mx-[1px]">
                  {
                    acceptedMedia.slice(0, 4).filter(accepted => a.toLowerCase().endsWith(accepted)).length ?
                      <img
                        loading={"lazy"}
                        className="inline-block cursor-pointer m-0 p-0" 
                        src={
                          (
                            a.toUpperCase().startsWith('HTTP://') ||
                            a.toUpperCase().startsWith('HTTPS://') ||
                            a.toUpperCase().startsWith('www.')
                          ) ?
                            a
                          :
                            config.ASSETS[config.ENVIRONMENT] + `media/${a}`
                        }
                        onClick={() => {
                          (new Promise<any>((res, rej) => {
                            modalContext.modal!({
                              node: (<MediaViewer filename={a}/>), 
                              resolve: res, 
                              reject: rej
                            });
                          })).then(result => {
                            modalContext.modal!();
                          }).catch(err => {});
                        }}
                      >
                      </img>
                    :
                      <video
                        className='cursor-pointer -mb-2 p-0'
                        src={
                          (
                            a.toUpperCase().startsWith('HTTP://') ||
                            a.toUpperCase().startsWith('HTTPS://') ||
                            a.toUpperCase().startsWith('www.')
                          ) ?
                            a
                          :
                            config.ASSETS[config.ENVIRONMENT] + `media/${a}`
                        }
                        autoPlay={false} muted={true} loop={true} playsInline={true} 
                        onClick={() => {
                          (new Promise<any>((res, rej) => {
                            modalContext.modal!({
                              node: (<MediaViewer filename={a}/>), 
                              resolve: res, 
                              reject: rej
                            });
                          })).then(result => {
                            modalContext.modal!();
                          }).catch(err => {});
                        }}
                      ></video>
                  }
                </span>
              ))
            }
          </Gallery4>
        )}

      </div>
    </div>
  )
}

export default GalleryPage;