import React from "react";

import { ModalContext } from "../../components/modal/modal";
import HttpService from "../../services/http.service";
import { Review } from "../../models/models";
import ReviewComponent from "../../components/review/review";
import storageContext from "../../components/storage/storage-context";

const AdminReviews: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);

  const [reviews, setReviews] = React.useState<Review[]>([]);

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

  React.useEffect(() => {
    (async () => setReviews(await quickGet('reviewstream', { afterID: 0, numrows: 10 }) || []))();
  }, []);
  
  return (
    <div className="py-16 px-4 mx-auto bubbles">
      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin Users&nbsp;&nbsp;
      </h1>
      <div className="text-center p-8 m-8 bg-slate-400 bg-opacity-90 rounded-lg">


      <div className='text-center'>
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
                          className="btn btn-circle btn-lg shadow-xl btn-warning border-2 border-black absolute top-2 right-20"
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
            </div>


      </div>
    </div>
  )
}

export default AdminReviews;