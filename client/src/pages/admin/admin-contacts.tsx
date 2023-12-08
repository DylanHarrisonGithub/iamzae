import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import InfiniteContentScroller from "../../components/infinite-content-scroller/infinite-content-scroller";
import Gallery4 from "../../components/gallery/gallery4";
import ContactCard from "../../components/admin/contact/contact-card";

import { ModalContext } from "../../components/modal/modal";

import HttpService from "../../services/http.service";

import { Contact } from "../../models/models";


const AdminContacts: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  const navigate = useNavigate();

  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [search, setSearch] = React.useState<string>('');
  const { id } = useParams();

  return (
    <div className="py-16 px-4 mx-auto bubbles">
      {/* <p className="text-white">id: {(id !== undefined).toString()}</p> */}
      <div className="text-center p-1 m-3 mt-4">
        <div className='inline-block relative mx-2 my-4 align-top text-left w-11/12 md:w-4/12'>
          <div className="text-left">
            <h1 className="text-xl gold-text text-center align-middle inline-block">
              &nbsp;&nbsp;Admin Contacts&nbsp;&nbsp;
            </h1>
          </div>
        </div>

        <div className='inline-block relative mx-2 my-3 w-11/12 md:w-5/12 text-left'>
          <input
            className="bg-gray-200 text-left md:text-right appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            placeholder="Search Contacts"
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

      <div className="text-center p-8 m-8 bg-slate-400 bg-opacity-90 rounded-lg">

        <InfiniteContentScroller<Contact> contentStreamingRoute={'contactstream'} content={contacts} contentSetter={setContacts} search={search} id={id} >
          <div className='text-center'>
            <Gallery4 maxColumnWidth={288} maxColumns={6}>
              {
                contacts.map((c, i) => (
                  <div 
                    key={i} 
                    className='inline-block cursor-pointer text-left'
                    onClick={() => (modalContext.modal!({prompt: `Are you sure you want to delete ${c.email}'s message?`, options: ["yes", "no"]}))!.then(res => {
                      if (res === "yes") {
                        HttpService.delete<void>('contactdelete', { id: c.id }).then(res => {
                          if (res.success) {
                            setContacts(rs => rs.filter(e => e.id !== c.id));
                            res.messages.forEach(m => modalContext.toast!('success', m));
                          } else {
                            modalContext.toast!('warning', `Unable to delete ${c.email}'s message.`);
                            res.messages.forEach(m => modalContext.toast!('warning', m));
                          }
                        });
                      }
                    }).catch(e => {})}
                  >
                    <ContactCard contact={{
                      date: (new Date(parseInt(c.timestamp.toString()))).toLocaleDateString(),
                      email: c.email,
                      subject: c.subject,
                      message: c.message
                    }}/>
                  </div>
                ))
              }
            </Gallery4>
          </div>
        </InfiniteContentScroller>

      </div>
    </div>
  )
}

export default AdminContacts;