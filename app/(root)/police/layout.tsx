import React from 'react';
import PoliceNavBar from '@/components/policeNavbar';

import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <PoliceNavBar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;