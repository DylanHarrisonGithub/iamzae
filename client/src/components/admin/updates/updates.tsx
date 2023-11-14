import React from 'react';
import ReactQuill from 'react-quill';


import EventMediaForm from '../../event/event-media-form';
import HttpService from '../../../services/http.service';
import { ModalContext } from '../../modal/modal';

import config from '../../../config/config';

import { Update } from '../../../models/models';

type Props = {
  mediaList: string[]
};

const Updates: React.FC<Props> = ({mediaList}) => {

  const modalContext = React.useContext(ModalContext);

  const [search, setSearch] = React.useState<string>('');
  const [updates, setUpdates] = React.useState<Update[]>([]);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [quill, setQuill] = React.useState<string>('test');

  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => forceUpdate());

  const imageHandler = () => { new Promise<string[] | null>((res, rej) => {
      modalContext.modal!({
        node: (<EventMediaForm resolve={res} media={mediaList} associatedMedia={[]}/>),
        resolve: res,
        reject: rej
      })
    }).then(async result => {
      modalContext.modal!();
      if (result) {

        
      }
    }).catch(err => console.log(err))
  };

  return (
    <div className="">
              <ReactQuill 

          value={quill} 
          onChange={setQuill}
          modules={{  
            toolbar: {  
              container: [  
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  
                ['bold', 'italic', 'underline'],  
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],  
                [{ 'align': [] }],  
                ['link', 'image'],
                ['clean'],
                [{ 'color': [] }]  
              ],  
              handlers: {  
                image: imageHandler  
              }  
            }
          }}  
        />
      <div className='bg-white text-black block w-full h-screen'>

      </div>

      <div className="md:w-1/3">
        <button 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-3 my-5 rounded"
          // onClick={() => {
          //   (new Promise<EventPerformance | null>((res, rej) => {
          //     modalContext.modal!({node: (
          //       <EventForm resolve={res} mediaList={mediaList}/>
          //     ), resolve: res, reject: rej});
          //   })).then(async result => {
          //     modalContext.modal!();
          //     if (result) {
          //       const newEventResponse = await HttpService.post<EventPerformance>('eventcreate', result);
          //       if (newEventResponse.success) {
          //         quickGet<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10 }).then(res => setEvents(res || []));
          //         init.current = false;
          //       }
          //       newEventResponse.messages.forEach(m => modalContext.toast!(newEventResponse.success ? 'success' : 'warning', m));
          //     }
          //   }).catch(err => {});
          // }}
        >
          CREATE NEW UPDATE
        </button>
      </div>
    
      <div className="md:w-2/3 mr-3">

        <input
          className="bg-gray-200 text-right appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          id="inline-event-search"
          type="text"
          placeholder="Search Updates"
          // value={}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

    </div>
  );
}

export default Updates;