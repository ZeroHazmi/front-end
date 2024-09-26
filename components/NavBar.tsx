import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const router = useRouter();

    const logout = () => {
        // Remove the token from local storage
        localStorage.removeItem('token');
        // Redirect to the login page
        router.push('/login'); // Adjust the path based on your routes
    };

  return (
        <nav>
        <div className="user-navbar-container">
            <div className="user-navbar-left">
                <Image src="/Images/navbarlogo.png" className="logo" alt="Logo" height={50} width={50}/>
                <div className="user-navbar-title">
                    Police
                    <div className="user-navbar-subtitle">
                        Reporting AI System
                    </div>
                </div>
            </div>
            <div className="user-navbar-links">
                <div className="user-navbar-items">Communication</div>
                <div className="user-navbar-items">FAQ</div>
                <div className="user-navbar-logout-container">
                    <button className="user-navbar-logout-button" type='button' onClick={logout}>Logout</button>
                    <Image src="https://via.placeholder.com/50x50" className="user-navbar-icon" alt="User" height={50} width={50}/>
                </div>
            </div>
        </div>
    </nav>    
  )
};
