import React, { ReactNode } from 'react';
import UserNavBar from '@/components/userNavBar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <UserNavBar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;