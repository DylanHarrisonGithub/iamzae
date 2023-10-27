import React from 'react';

import ReviewComponent from './review';

import { Review } from '../../models/models';

import HttpService from '../../services/http.service';

import { ModalContext } from '../modal/modal';

import config from '../../config/config';

type Props = {
  eventID: number,
  resolve: () => any
};

const EventReviews: React.FC<Props> = ({ eventID, resolve }) => {
  
  const modalContext = React.useContext(ModalContext);
  const init = React.useRef(true);

  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [busy, setBusy] = React.useState<boolean>(true);

  const streamReviews = async () => {
    const res = await HttpService.get<Review[]>('reviewstream', { afterID: reviews.length ? reviews.at(-1)!.id : 0, numrows: 10, event: eventID });
    if (res.success && res.body && res.body.length) {
      setReviews(reviews => [...reviews, ...res.body!.filter(r => !reviews.some(r2 => r.id === r2.id))]);
      if (res.body.length === 10) {
        await streamReviews();
      } else {
        setBusy(false);
      }
    } else {
      setBusy(false);
    }
  };

  React.useEffect(() => {
    (async () => {
      await streamReviews();
    })();
  }, [])

  return (
    <div className='text-center bg-slate-500 w-screen lg:w-auto max-h-96 overflow-y-scroll'>
      <h1>Reviews</h1>
      {
        reviews.map((r, i) => (
          <span key={i} className='relative'>
            <button 
              className="btn btn-circle btn-lg shadow-xl btn-error border-2 border-black absolute top-2 right-1"
              onClick={() => (modalContext.modal!({prompt: `Are you sure you want to delete ${r.name}'s review?`, options: ["yes", "no"]}))!.then(res => {
                if (res === "yes") {
                  HttpService.delete<void>('reviewdelete', { id: r.id }).then(res => {
                    if (res.success) {
                      setReviews(rs => rs.filter(e => e.id !== r.id));
                      res.messages.forEach(m => modalContext.toast!('success', m));
                    } else {
                      modalContext.toast!('warning', `Unable to delete event ${r.name}'s review?.`);
                      res.messages.forEach(m => modalContext.toast!('warning', m));
                    }
                  });
                }
              }).catch(e => {})}
            >
              <svg className=" fill-black-800" xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>            
            </button>
            {
              (r.approved === 'true') ?
                <button 
                  className="btn btn-circle btn-lg shadow-xl btn-info border-2 border-black absolute top-2 right-20"
                  onClick={async () => {
                    const res = await HttpService.patch<void>('reviewupdate', { id: r.id, update: { approved: false } });
                    if (res.success) {
                      modalContext.toast!('success', `${r.name}'s review has been unapproved!`);
                      setReviews(revs => revs.map(rr => rr.id === r.id ? { ...r, approved: 'false' } : rr));
                    } else {
                      modalContext.toast!('error', `${r.name}'s review could not be unapproved!`);
                    }
                  }}
                >
                  <svg className=" fill-black-800" xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>            
                </button>
              :
                <button 
                  className="btn btn-circle btn-lg shadow-xl btn-alert border-2 border-black absolute top-2 right-20"
                  onClick={async () => {
                    const res = await HttpService.patch<void>('reviewupdate', { id: r.id, update: { approved: true } });
                    if (res.success) {
                      modalContext.toast!('success', `${r.name}'s review has been approved!`);
                      setReviews(revs => revs.map(rr => rr.id === r.id ? { ...r, approved: 'true' } : rr));
                    } else {
                      modalContext.toast!('error', `${r.name}'s review could not be approved!`);
                    }
                  }}
                >
                  <svg className=" fill-black-800" xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 0 64 512"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>            
                </button>
            }
            <ReviewComponent reviewerName={r.name} reviewText={r.text} rating={r.stars} date={(new Date(parseInt(r.timestamp.toString())))}/>
          </span>
        ))
      }
      {
        busy && 
          <div className="flex justify-center mt-40">
            <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          </div>
      }
      {
        (!busy) && 
          <p>{reviews.length ? `no more reviews for this event` : `no reviews for this event`}</p>
      }
    </div>
  );
}

export default EventReviews;