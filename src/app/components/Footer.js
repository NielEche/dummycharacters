"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import from next/navigation
import logoImage from '../../assets/DC3DTRANS.gif';
import smile from '../../assets/smile.png';
import spotify from '../../assets/spot.png';
import apple from '../../assets/apple.png';
import insta from '../../assets/insta.png';
import twitter from '../../assets/twitter.png';
import saatchi from '../../assets/saatchi.png';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname
  const [currentTime, setCurrentTime] = useState('');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };



  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateClock(); // Initialize immediately
    const timerId = setInterval(updateClock, 1000); // Update every second

    return () => clearInterval(timerId); // Cleanup interval on unmount
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-transparent p-0">
      <nav className="flex justify-between py-1 px-2">
        <ul className="flex justify-start space-x-2 w-full">
          <li className='WebButton px-2'>
            <Link href="/" className='flex'>
                <Image src={smile} alt="Home" width={20} height={20} />
              <span className='pr-2 font-black'>Eche</span> 
            </Link>
          </li>
          <li className='WebButton px-0'>
          </li>

          <li className="px-1">
            <Link href="https://www.instagram.com/niel_eche/" target='_blank' >
            <Image src={insta} alt="Instagram" width={20} height={20} />
            </Link>
          </li>
          <li className="px-1">
            <Link href="https://twitter.com/niel_eche" target='_blank' >
            <Image src={twitter} alt="twitter" width={20} height={20} />
            </Link>
          </li>
          <li className="px-1">
            <Link href="https://www.saatchiart.com/nieleche" target='_blank' >
            <Image src={saatchi} alt="saatchi" width={20} height={20} />
            </Link>
          </li>
       
        </ul>

        <ul className="flex justify-end space-x-2 w-full">
          <li className='WebButton px-0 h-full'>
          </li>
          <li className="px-0">
            <Link href="https://open.spotify.com/artist/5g0PVwViRJAMgEF2XBulgx" target='_blank' >
            <Image src={spotify} alt="Spotify" width={20} height={20} />
            </Link>
          </li>
          <li className=" px-0 ">
            <Link href="https://music.apple.com/ng/artist/niel-eche/1466858634" target='_blank'>
            <Image src={apple} alt="Apple" width={20} height={20} />
            </Link>
          </li>
         
          <li className="WebButton px-2">
            <span>{currentTime}</span>
          </li>
         
        </ul>
  
      </nav>

  
    </footer>
  );
}
