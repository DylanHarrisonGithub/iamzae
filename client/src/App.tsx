import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from './components/footer/footer';
import Navbar from './components/navbar/navbar';
import Modal from './components/modal/modal';
import Storage from './components/storage/storage-context';

import Home from './pages/home';
import Contact from './pages/contact';
import Item from './pages/item';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import NoPage from './pages/nopage';
import Admin from './pages/admin';
import Events from './pages/events';

import config from './config/config';
import GalleryPage from './pages/gallery-page';
import Listen from './pages/listen';

function App() {

  // console.log(process.env.NODE_ENV);
  // console.log(process.env.PUBLIC_URL);
  // console.log(process.env.TZ);

  return (
    <div className=" mx-auto">
      <Storage keys={['token', 'user']}>
        <Modal>
          <BrowserRouter>
            <Navbar
              brand={config.APP_NAME}
              links={[
                { title: 'home', href: '/home' },
                { title: 'events', href: '/events' },
                { title: 'listen', href: '/listen' }
              ]}
              menus={[
                {
                  title: 'about', submenu: [
                    { title: 'about me', href: '/about' },
                    { title: 'gallery', href: '/gallery' },
                    { title: 'contact', href: '/contact' },
                  ] 
                },
                {
                  title: 'socials', submenu: [
                    { title: 'instagram', href: 'https://www.instagram.com/deejzae/' },
                    { title: 'soundcloud', href: 'https://soundcloud.com/zanae33' },
                  ]
                }
              ]}
            />
            <Routes>
              <Route path="/" element={<Home />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />
              </Route>
              {/* <Route path="browse" element={<Browse />}>
                <Route path=":category" element={<Browse />}/>
              </Route> */}
              <Route path="contact" element={<Contact />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<Events />} />
              <Route path="listen" element={<Listen />} />
              <Route path="item" element={<Item />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="about" element={<About />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="nopage" element={<NoPage />} />
              <Route path="admin" element={<Admin />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </Modal>
      </Storage>
    </div>
  );
}

export default App;
