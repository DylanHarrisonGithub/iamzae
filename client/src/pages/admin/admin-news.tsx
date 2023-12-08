import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import InfiniteContentScroller from "../../components/infinite-content-scroller/infinite-content-scroller";
import Update from "../../components/update/update";
import UpdateForm from "../../components/update/update-form";

import { ModalContext } from "../../components/modal/modal";

import HttpService from "../../services/http.service";

import { UpdateType } from "../../models/models";

import config from "../../config/config";

const AdminNews: React.FC<any> = (props: any) => {

  const { id } = useParams();
  const navigate = useNavigate();
  const modalContext = React.useContext(ModalContext);

  const [updates, setUpdates] = React.useState<UpdateType[]>([]);
  const [search, setSearch] = React.useState<string>('');

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
                    await HttpService.post<any>('updatecreate', { subject: result.subject, date: result.date, update: result.update });
                    setSearch('');
                    setUpdates([]);
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
            value={search}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

      </div>


      {
        (id !== undefined) &&
          <div className="flex">
            <button 
              className="btn btn-circle btn-lg ml-auto"
              onClick={() => navigate('/admin/reviews')}
            >
              Close
            </button>
          </div>
      }

      <div className="p-1 m-3 rounded-lg glass">


        <InfiniteContentScroller<UpdateType> contentStreamingRoute={'updatestream'} content={updates} contentSetter={setUpdates} search={search} id={id}>

          {
            updates.map((u, i) => (
              <div className="relative">

                <button 
                  className="btn btn-circle btn-lg shadow-xl btn-warning border-2 border-black absolute top-2 right-32"
                  onClick={() => {
                    (new Promise<UpdateType | null>((res, rej) => {
                      modalContext.modal!({node: (
                        <UpdateForm updateInit={{...u}} resolve={res}/>
                      ), resolve: res, reject: rej});
                    })).then(async result => {
                      modalContext.modal!();
                      if (result) {
                        const { id, ...rest } = result;
                        // get object containing only key-values that are changed
                        const update = ((Object.keys(rest) as Array<keyof UpdateType>).filter(k => result[k] !== u[k]) as Array<keyof UpdateType>).reduce((uu, k) => 
                          ({ [k]: result[k], ...uu })
                        , {});
                        if (Object.keys(update).length) {
                          await HttpService.patch<any>('updateupdate', { id: u.id, update: update});
                          // design choice reload everything??
                          setUpdates([]);
                        }
                      }
                    }).catch(err => {});
                  }}
                >
                  <svg className=" fill-black-800" xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
                </button>

                <button 
                  className="btn btn-circle btn-lg shadow-xl btn-error border-2 border-black absolute top-2 right-8"
                  onClick={async () => {
                    const confirmed = (await modalContext.modal!({ prompt: `Are you sure you want to delete update: ${u.subject}?`, options: ['yes', 'no']})!) === 'yes';
                    if (confirmed) {
                      const res = await HttpService.delete<void>('updatedelete', { id: u.id });
                      res.messages.forEach(m => modalContext.toast!(res.success ? 'success' : 'warning', m));
                      setUpdates([]);
                    }
                  }}
                >
                  <svg className=" fill-black-800" xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>            
                </button>

                <Update key={i} update={u} />
              </div>
            ))
          }


        </InfiniteContentScroller>

      </div>


    </div>
  )
}

export default AdminNews;