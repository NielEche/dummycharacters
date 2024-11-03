
"use client";import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logoImage from '../../assets/DC3DTRANS.gif';
import useContentful from '../../lib/useContentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import code from '../../assets/43.ico';
import fashion from '../../assets/87.ico';
import design from '../../assets/96.ico';
import art from '../../assets/35.ico';
import publications from '../../assets/68.ico';
import crusero from '../../assets/crossTee2.png';
import lh from '../../assets/LHlogo.png';
import spaceG from '../../assets/spaceG.gif';
import Loading from '../components/Loading';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { records, loading } = useContentful();

  if (loading) {
    return <Loading />;
  }

  // Check if the pathname starts with /projects/
  const isProjectsPage = pathname.startsWith('/projects/');

  if (pathname === '/about') return null;

  return (
    <header className="left-0 w-full z-50 p-0 px-6">
      <div className=" pt-2">
        <div className="bio text-right">
          <button className="biobtn"> <span>X</span></button>
        </div>
        <div className="biodetails lg:flex justify-between">
          <div id="niel">
            <p className='lg:pr-20'>{records && documentToReactComponents(records)}</p>
            <div className='menlo text-base mt-2'>
              <Link href="/about">Read More</Link>
            </div>
          </div>
          <div className="text-center py-2">
            <h3 className="marquee">
              <span> Niel Eche™</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Only show the nav section if it's not a /projects/[tag] page */}
      {!isProjectsPage && (
        <nav className="py-6 px-2">
          <ul className="menlo flex space-x-8 w-full text-black">
            <li className=''>
              <Link href={`/projects/code`} className="fields">
                <Image src={code} alt="Code" width={40} height={40} />
                <span>Code</span>
              </Link>
            </li>
            <li>
              <Link href={`/projects/design`} className="fields">
                <Image src={design} alt="Design" width={40} height={40} />
                <span>Design</span>
              </Link>
            </li>
            <li>
              <Link href={`/projects/fashion`} className="fields">
                <Image src={fashion} alt="fashion" width={40} height={40} />
                <span>Fashion</span>
              </Link>
            </li>
            <li>
              <Link href={`/projects/art`} className="fields">
                <Image src={art} alt="art" width={40} height={40} />
                <span>Art</span>
              </Link>
            </li>
            <li>
              <Link href={`/projects/publication`} className="fields">
                <Image src={publications} alt="publications" width={40} height={40} />  
                <span>Publications</span>
              </Link>
            </li>
          </ul>

          <ul className="menlo py-6 flex justify-end space-x-8 w-full text-black">
            <li className=''>
                <Image className="fields" src={spaceG} alt="spaceG" width={120} height={120} />
            </li>
            <li>
              <Link href="https://www.instagram.com/loudhousephc/" target='_blank' className="fields">
                <Image src={lh} alt="loudhouse" width={70} height={70} />
                <span>LoudHouse</span>
              </Link>
            </li>
            <li>
              <Link href="https://www.crusero.store/" target='_blank' className="fields">
                <Image src={crusero} alt="crusero" width={70} height={70} />
                <span>Crusero</span>
              </Link>
            </li>
          </ul>

          <ul>
            <li className='headLogo'>
              <Link href="/">
                <Image src={logoImage} alt="Home" width={130} height={130} />
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
