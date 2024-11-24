'use client'

import React from 'react';

import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <NavBar />
            <main>{children}</main>
        </div>
    );
};

export default Layout;