import React from 'react';
import UserNavBar from '@/components/userNavBar';

const Layout = ({ children }) => {
    return (
        <div>
            <UserNavBar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;