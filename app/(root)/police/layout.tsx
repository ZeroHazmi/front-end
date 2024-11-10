import React from 'react';
import PoliceNavBar from '@/components/policeNavbar';

const Layout = ({ children }) => {
    return (
        <div>
            <PoliceNavBar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;