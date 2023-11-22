import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { ModalContext } from '../components/modal/modal';
import { StorageContext } from '../components/storage/storage-context';
import Gallery2 from '../components/gallery/gallery2';

const buttons: { title: string, route: string, svg: React.ReactElement<SVGElement> }[] = [
  { title: 'Users', route: '/admin/users', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>)},
  { title: 'Media', route: '/admin/media', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 640 512"><path d="M256 0H576c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64zM476 106.7C471.5 100 464 96 456 96s-15.5 4-20 10.7l-56 84L362.7 169c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h80 48H552c8.9 0 17-4.9 21.2-12.7s3.7-17.3-1.2-24.6l-96-144zM336 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM64 128h96V384v32c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V384H512v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64zm8 64c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V312c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V416c0-8.8-7.2-16-16-16H72zm336 16v16c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V416c0-8.8-7.2-16-16-16H424c-8.8 0-16 7.2-16 16z"/></svg>)},
  { title: 'Tracks', route: '/admin/tracks', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 512 512"><path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7v72V368c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V147L192 223.8V432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6V200 128c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"/></svg>          )},
  { title: 'Events', route: '/admin/events', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"/></svg>          )},
  { title: 'Reviews', route: '/admin/reviews', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>        )},
  { title: 'Contacts', route: '/admin/contacts', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 576 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>       )},
  { title: 'News', route: '/admin/news', svg: (<svg xmlns="http://www.w3.org/2000/svg" height="4em" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg> )}
];

const Admin: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  const storageContext = React.useContext(StorageContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      if (!(storageContext.token)) {
        navigate('/login');
      }
    })();
  }, []);

  return (
    <div className='py-16 bubbles'>

      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin&nbsp;&nbsp;
      </h1>

      <div className="text-center p-1 m-1 md:p-8 md:m-8 bg-slate-400 bg-opacity-90 rounded-lg">
        <h1 className='mb-8'>User</h1>
        {
          (() => {
            const u = storageContext.token ? JSON.parse(window.atob((storageContext.token).split('.')[1])) : '';

            return (<div>{JSON.stringify(u)}</div>)
          })()
        }
      </div>

      {/* <div className="text-center p-1 m-1 md:p-8 md:m-8 bg-slate-400 bg-opacity-90 rounded-lg">
        <h1 className='mb-8'>Content Management</h1>
        {
          buttons.map((b, i) => (
            <Link 
              key={i}
              className='inline-block relative glass  w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-2 my-1 rounded-md shadow-lg hover:shadow-xl cursor-pointer'
              to={b.route}
            >
              <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-0">

                {b.svg}
                <p className='mt-4'>{b.title}</p>
              </div>
            </Link>
          ))
        }
      </div> */}

      <div className='bg-slate-400 text-center bg-opacity-90 rounded-lg p-1 m-1  md:p-8 md:m-8'>
      <h1 className='mb-8'>Content Management</h1>
        <Gallery2>
        {
          buttons.map((b, i) => (
            <Link 
              key={i}
              className='flex relative glass aspect-1 w-full rounded-md shadow-lg hover:shadow-xl cursor-pointer m-1'
              to={b.route}
            >
              <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 m-0">

                {b.svg}
                <p className='mt-4'>{b.title}</p>
              </div>
            </Link>
          ))
        }
        </Gallery2>
      </div>

    </div>
  );
}

export default Admin;
