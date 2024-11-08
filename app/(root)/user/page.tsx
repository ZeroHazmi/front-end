'use client'

import React, { useEffect, useState } from 'react';
// import '../globals.css';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons'
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons'
import ReportContent from '@/components/ReportContent';
import { ReportType } from '@/types/index.d';
import UserNavBar from '@/components/userNavBar';
// import NavBar from '../../components/userNavBar';

const UserMainPage = () => {
  return (
    <div>
        <UserNavBar />
        <ReportContent />
    </div>
  )
}

export default UserMainPage


