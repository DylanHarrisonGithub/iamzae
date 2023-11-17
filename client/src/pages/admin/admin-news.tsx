import React from "react";

import Update from "../../components/update/update";
import UpdateForm from "../../components/update/update-form";

import { ModalContext } from "../../components/modal/modal";
import HttpService from "../../services/http.service";

import { UpdateType } from "../../models/models";

import config from "../../config/config";

const AdminNews: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);

  const [updates, setUpdates] = React.useState<UpdateType[]>([]);
  const [busy, setBusy] = React.useState<boolean>(true);

  const [media, setMedia] = React.useState<string[]>([]);

  const streamUpdates = async (afterID?: number) => {
    const streamRes = await HttpService.get<UpdateType[]>('updatestream', { afterID: afterID || 0, numrows: 10 });
    if (streamRes.success && streamRes.body && streamRes.body.length) {
      if (streamRes.body.length < 10) {
        setBusy(false);
      }
      if (afterID) {
        setUpdates(updates => [...updates, ...streamRes.body!.filter(sru => !updates.some(u => u.id === sru.id)) ].sort((a, b) => a.id! - b.id!));
      } else {
        setUpdates(streamRes.body);
      }
    } else {
      setBusy(false);
    }
  };

  React.useEffect(() => {(async () => {
    if (busy) {
      streamUpdates(updates.length ? updates.at(-1)?.id! : 0);
    }
  })();}, [updates]);

  React.useEffect(() => {
    setBusy(true);
    streamUpdates();
  }, []);

  return (
    <div className="py-16 px-4 mx-auto bubbles">
      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin News&nbsp;&nbsp;
      </h1>

      <div className="text-center p-1 m-3 mt-4 rounded-lg glass">
        <div className='inline-block relative mx-2 my-4 align-top text-left w-11/12 md:w-4/12'>
          <div className="text-left">
            <button 
              className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded inline-block w-full md:w-auto"
              onClick={() => {
                (new Promise<UpdateType | null>((res, rej) => {
                  modalContext.modal!({node: (
                    <UpdateForm resolve={res}/>
                  ), resolve: res, reject: rej});
                })).then(async result => {
                  modalContext.modal!();
                  if (result) {
                    setBusy(true);
                    await HttpService.post<any>('updatecreate', { subject: result.subject, date: result.date, update: result.update });
                    streamUpdates();
                  }
                }).catch(err => {});
              }}
            >
              CREATE NEW UPDATE
            </button>
          </div>
        </div>

        <div className='inline-block relative mx-2 my-3 w-11/12 md:w-5/12 text-left'>
          <input
            className="bg-gray-200 text-left md:text-right appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            placeholder="Search Updates"
            value={''}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {}}
          />
        </div>



      </div>

      <div className="p-1 m-3 rounded-lg glass">
        <p className="text-white ml-8 mt-8 mb-4">Updates</p>
        {
          updates.map((u, i) => (<Update key={i} update={u} />))
        }
        {
          busy &&
            <div className="text-center">
              <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        }  
      </div>


    </div>
  )
}

export default AdminNews;