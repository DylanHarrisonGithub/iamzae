import React from 'react';
import Gallery from '../components/gallery/gallery';

import config from '../config/config';

import HttpService from '../services/http.service';

import { ModalContext } from '../components/modal/modal';

import { User, EventPerformance, Review, Contact } from '../models/models';
import ToggleableContainer from '../components/toggleable-container/toggleable-container';

import Media from '../components/admin/media/media';
import Users from '../components/admin/users/users';
import EventsComponent from '../components/admin/event/event';
import ReviewComponent from '../components/review/review';
import ReviewForm from '../components/review/review-form';
import ContactCard from '../components/admin/contact/contact-card';
import Gallery2 from '../components/gallery/gallery2';

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];


// const reviews = [
//   { reviewerName: 'Bob Sampson', reviewText: 'Really enjoyed the show, great product we had a good time z is the best dj i have ever seen', rating: 4, date: new Date("2023-10-01") },
//   { reviewerName: 'Bob Sampson', reviewText: 'Really enjoyed the show', rating: 3, date: new Date("2023-10-01") },
//   { reviewerName: 'Bob Sampson', reviewText: 'Really enjoyed the show', rating: 1, date: new Date("2023-10-01") },
//   { reviewerName: 'Bob Sampson', reviewText: 'Really enjoyed the show', rating: 5, date: new Date("2023-10-01") },
//   { reviewerName: 'Bob Sampson', reviewText: 'Really enjoyed the show', rating: 0, date: new Date("2023-10-01") }
// ]

const Admin: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);

  const [media, setMedia] = React.useState<string[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [events, setEvents] = React.useState<EventPerformance[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [contacts, setContacts] = React.useState<Contact[]>([]);

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
    (async () => {
      setContacts(await quickGet<Contact[]>('contactstream', { afterID: 0, numrows: 10 }) || []);
    })();
  }, []);

  return (
    <div className='py-16 hex2'>
      <div className="card w-11/12 md:w-5/6 bg-base-100 mx-auto mt-16">
        <h1 className="text-center text-4xl font-bold">Admin</h1>
          {/* ------------------------------------------------------- USERS ------------------------------------------------------- */}

          <ToggleableContainer title="Users" color1='purple-500'>
            <Users users={users} avatarImages={media} setUsers={setUsers} quickGet={quickGet}></Users>
          </ToggleableContainer>

          {/* ------------------------------------------------------- Media ------------------------------------------------------- */}
          <ToggleableContainer title="Media" color1='green-500'>
            <Media media={media} setMedia={setMedia} quickGet={quickGet}></Media>
          </ToggleableContainer>

          {/* ------------------------------------------------------- Events ------------------------------------------------------- */}

          <ToggleableContainer title="Events" color1='blue-500'>
            {/* media.filter(fname => acceptedMedia.slice(0, 4).filter(accepted => fname.toLowerCase().endsWith(accepted)).length) */}
            <EventsComponent events={events} mediaList={media} setEvents={setEvents} quickGet={quickGet}></EventsComponent>
          </ToggleableContainer>

          {/* ------------------------------------------------------- Reviews ------------------------------------------------------- */}

          <ToggleableContainer title="All Reviews" color1='red-500'>
            <Gallery>
              {
                reviews.map((r, i) => (<ReviewComponent key={i} reviewerName={r.name} reviewText={r.text} rating={r.stars} date={new Date(r.timestamp)}/>))
              }
            </Gallery>
          </ToggleableContainer>

          {/* ------------------------------------------------------- Contact ------------------------------------------------------- */}

          <ToggleableContainer title="Contact" color1='green-500'>
            <Gallery2>
              {
                contacts.map((c, i) => (<ContactCard key={i} contact={{
                  date: new Date().toISOString(),
                  email: c.email,
                  subject: c.subject,
                  message: c.message
                }}/>))
              }
            </Gallery2>
          </ToggleableContainer>

        <hr />
      </div>
    </div>
  );
}

export default Admin;
