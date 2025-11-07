'use client';

import React, { useState } from 'react';
import { Person, Settings } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

const Header = () => {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname=usePathname();

  const router=useRouter();

  const headerTitle=()=>{
    if(pathname==='/dashboard'){
      return 'Dashboard';
    }
    else if(pathname==='/explore-jharkhand'){
      return 'Explore Jharkhand';
    }
    else if(pathname==='/blogs'){
      return 'Blogs';
    }
    else if(pathname==='/enquiry'){
      return 'Enquiry';
    }
   }

   const handleLogout=()=>{
     // Clear session storage on logout
     sessionStorage.removeItem('token');
     sessionStorage.removeItem('admin');
     router.push('/login');
   }

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">{headerTitle()}</h1>
      </div>

      <div className="header-right">
        <div
          className="avatar"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <Person sx={{ fontSize: 18 }} />
          {isProfileOpen && (
            <div className="avatar-dropdown">
              <Button onClick={handleLogout} className="dropdown-item danger">Logout</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
