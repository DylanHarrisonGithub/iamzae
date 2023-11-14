import React from "react";

import { Contact } from "../../models/models";
import HttpService from "../../services/http.service";

import { ModalContext } from "../../components/modal/modal";
import ContactCard from "../../components/admin/contact/contact-card";

const AdminContacts: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  
  const [contacts, setContacts] = React.useState<Contact[]>([]);
  const [contactsBusy, setContactsBusy] = React.useState<boolean>(true);

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
  
  const getContacts = async () => {
    setContactsBusy(true);
    const newContacts = await quickGet<Contact[]>('contactstream', { afterID: contacts.length ? contacts.at(-1)!.id : 0, numrows: 10 }) || [];
    setContacts(cs => [...cs, ...newContacts]);
    if (newContacts.length === 10) {
      getContacts();
    } else {
      setContactsBusy(false);
    }
  }

  React.useEffect(() => {
    (async () => {
      getContacts();
    })();
  }, []);

  return (
    <div className="py-16 px-4 mx-auto bubbles">
      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin Contacts&nbsp;&nbsp;
      </h1>
      <div className="text-center p-8 m-8 bg-slate-400 bg-opacity-90 rounded-lg">


      <div className='text-center'>
              {
                contacts.map((c, i) => (
                  <div 
                    key={i} 
                    className='inline-block cursor-pointer'
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
              {
                contactsBusy &&
                <div>
                  <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
              }
              {
                !contactsBusy &&
                <div>
                  no more contact messages.
                </div>
              }
            </div>


      </div>
    </div>
  )
}

export default AdminContacts;