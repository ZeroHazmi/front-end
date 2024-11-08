'use client'

import React, { useEffect, useState } from 'react';
// import '../globals.css';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons'
import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons'
import PHNavBar from '@/components/PHNavBar';
import ReportContent from '@/components/ReportContent';
import { ReportType } from '@/types/index.d';
// import NavBar from '../../components/userNavBar';

const UserMainPage = () => {
  return (
    <div>
        <PHNavBar />
        <ReportContent />
    </div>
  )
}

export default UserMainPage


