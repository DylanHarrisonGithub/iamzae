// todo:
//   1.  css fix navbar extending off right of page
//   2.  add logic for href to external links 
import React from "react";
import { Link, useNavigate } from 'react-router-dom';

import AuthService from "../../services/auth.service";
import { ModalContext } from "../modal/modal";
import { StorageContext } from "../storage/storage-context";
import StorageService from "../../services/storage.service";

import config from "../../config/config";

type Menu = {
  href?: string,
  submenu?: Menu[]
} & (
  | { href: string }
  | { submenu: Menu[] }
) & {
  title: string
}

export type NavbarProps = {
  brand?: string,
  menus?: Menu[],
  links?: { title: string, href: string}[]
}

const NavbarMenu: React.FC<Menu> = (props: Menu) => {



  return (
    <li>
      { 
        props.href &&
          (
            (
              props.href.toUpperCase().startsWith('HTTPS://') ||
              props.href.toUpperCase().startsWith('HTTP://') ||
              props.href.toUpperCase().startsWith('WWW.')
            ) ?
              <a target="_blank" rel="noopener noreferrer" href={props.href}>{props.title}</a>
            :
              <Link to={props.href}>{props.title}</Link>
          )
      }
      { props.submenu && 
        <>
          <button className="btn-link justify-between">
            {props.title}
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>
          </button>
          <ul className="menu menu-compact p-2 shadow rounded-box glass"> {/*bg-base-100*/} 
            { props.submenu.map((m, i) => 
              m.href ? 
                <NavbarMenu key={i} title={m.title} href={m.href!}></NavbarMenu>
              :
                <NavbarMenu key={i} title={m.title} submenu={m.submenu!}></NavbarMenu>
            )}
          </ul>
        </>
      }
    </li>
  );
}

const Navbar: React.FC<any> = (props: NavbarProps) => {

  const navigate = useNavigate();
  const modalContext = React.useContext(ModalContext);
  const storageContext = React.useContext(StorageContext);

  return (
    <div className="navbar shadow-lg border-2 glass absolute m-auto z-50 text-white"> {/* bg-base-100 hex2 */}
      <div className="navbar-start">
        
        <div className="dropdown"> {/* drop down menu when display width is smaller */}
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content p-2 shadow  rounded-box w-52 glass">

            { props.links?.map((l, i) => (<li key={i} ><Link to={l.href}>{l.title}</Link></li>)) }

            { props.menus?.map((m, i) => <NavbarMenu key={i} title={m.title} submenu={m.submenu!}></NavbarMenu>)}

          </ul>
        </div>

        <a className="btn btn-ghost normal-case text-xl gold-text">{props.brand || "Brand"}</a>

        <div className="hidden lg:flex">

          <ul tabIndex={0} className="menu menu-horizontal p-0 font-extrabold">
            { props.links?.map((l, i) => (<li key={i} ><Link to={l.href}>{l.title}</Link></li>)) }
            { props.menus?.map((m, i) => <NavbarMenu key={i} title={m.title} submenu={m.submenu!}></NavbarMenu>)}
          </ul>

        </div>
      </div>

      <div className="navbar-end">

        <div className="flex-none">

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {
                  (storageContext['token'] && storageContext.user?.avatar) &&
                    <img src={`${config.ASSETS[config.ENVIRONMENT]}media/${storageContext.user.avatar}`} />
                }
                {
                  !(storageContext['token'] && storageContext.user?.avatar) &&
                    <svg xmlns="http://www.w3.org/2000/svg" height="1.5em" className="ml-2.5 mt-2" viewBox="0 0 448 512"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
                }
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 glass">
              {
                (storageContext['token']) && (
                  <li><Link to={'/admin'}>Admin</Link></li>
                )
              }
              {
                (storageContext['token']) && (
                  <li><Link to={'/register'}>Register</Link></li>
                )
              }
              {
                (storageContext['token']) && (            
                  <li><Link to={'/home'} onClick={async () => { 
                    await AuthService.logout(); 
                    await StorageService[config.APP_STORAGE_METHOD].store('user', undefined );
                    modalContext.toast!('success', 'logged out');
                    navigate('/home'); 
                  }}>Logout</Link></li>
                )
              }
              {
                !(storageContext['token']) && (            
                  <li><Link to={'/login'}>Login</Link></li>
                )
              }
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar;