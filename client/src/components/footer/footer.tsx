import React from "react";
import { Link, useNavigate } from 'react-router-dom';

type FooterProps = {
  links?: { title: string, href: string }[],
  socials?: { icon: React.ReactElement<SVGElement>, href: string }[],
  blurb?: string
}

const Footer: React.FC<FooterProps> = ({ links, socials, blurb }) => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <div className="grid grid-flow-col gap-4">
        {
          links &&
            links.map((l,i) => (
              (
                l.href.toUpperCase().startsWith('HTTPS://') ||
                l.href.toUpperCase().startsWith('HTTP://') ||
                l.href.toUpperCase().startsWith('WWW.')
              ) ?
                <a key={i} target="_blank" rel="noopener noreferrer" href={l.href}>{l.title}</a>
              :
                <Link key={i} className={`link link-hover`} to={l.href}>{l.title}</Link>
            ))
        }
      </div> 
      <div>
        <div className="grid grid-flow-col gap-4">
          {
            socials &&
              socials.map((s,i) => (
                (
                  s.href.toUpperCase().startsWith('HTTPS://') ||
                  s.href.toUpperCase().startsWith('HTTP://') ||
                  s.href.toUpperCase().startsWith('WWW.')
                ) ?
                  <a key={i} target="_blank" rel="noopener noreferrer" href={s.href}>{s.icon}</a>
                :
                  <Link key={i} className={`link link-hover`} to={s.href}>{s.icon}</Link>
              ))
          }
        </div>
      </div> 
      <div>
        <p>Copyright © 2022 - All right reserved by ACME Industries Ltd</p>
      </div>
    </footer>
  )
}

export default Footer;