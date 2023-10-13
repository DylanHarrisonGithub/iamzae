// todo:
//   1.  css fix navbar extending off right of page
//   2.  add logic for href to external links 
import React from "react";
import { Link, useNavigate } from 'react-router-dom';
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
  links?: { title: string, href: string}[],
  avatar?: string
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

  const [search, setSearch] = React.useState<string>("");
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (search.length) navigate('/browse/?search='+search)
  }, [search]);

  return (
    <div className="navbar shadow-lg border-2 glass absolute m-auto z-50 text-white"> {/* bg-base-100 hex2 */}
      <div className="navbar-start">
        
        <div className="dropdown"> {/* drop down menu when display width is smaller */}
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabIndex={0} className="menu menu-compact dropdown-content p-2 shadow bg-base-100 rounded-box w-52">

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

        {/* <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered" value={search} onInput={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}/>
        </div> */}

        <div className="flex-none">
          {/* <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <span className="badge badge-sm indicator-item">8</span>
              </div>
            </label>
            <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">8 Items</span>
                <span className="text-info">Subtotal: $999</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">View cart</button>
                </div>
              </div>
            </div>
          </div> */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={`${config.ASSETS[config.ENVIRONMENT]}media/${props.avatar ? props.avatar : 'img_3645.jpg'}`} />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 glass">
              {/* <li>
                <a className="justify-between">
                  Login
                  <span className="badge">New</span>
                </a>
              </li> */}
              <li><Link to={'/admin'}>Admin</Link></li>
              <li><Link to={'/register'}>Register</Link></li>
              <li><Link to={'/login'}>Login</Link></li>
              <li><Link to={'/logout'}>Logout</Link></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar;