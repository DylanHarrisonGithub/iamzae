import React from "react";
import Media from "../../components/admin/media/media";

import { ModalContext } from "../../components/modal/modal";
import HttpService from "../../services/http.service";

const AdminMedia: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);

  const [media, setMedia] = React.useState<string[]>([]);
  
  const quickGet = async <T = void,>(route: string, params?: any): Promise<T | void> => HttpService.get<T>(route, params).then(res => {
    if (res.success && res.body) {
      modalContext.toast!('success', `GET request to ${route} successful.`);
      //res.messages?.forEach(m => modalContext.toast!('success', m));
      //console.log(route, res.messages);
      return res.body;
    } else {
      modalContext.toast!('warning', `GET request to ${route} failed.`);
      //res.messages.forEach(m => modalContext.toast!('warning', m));
      console.log(route, res.messages);
    }
  });
  return (
    <div className="py-16 px-4 mx-auto bubbles">
      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin Media&nbsp;&nbsp;
      </h1>
      <div className="text-center p-8 m-8 bg-slate-400 bg-opacity-90 rounded-lg">
        <Media media={media} setMedia={setMedia} quickGet={quickGet}></Media>
      </div>
    </div>
  )
}

export default AdminMedia;