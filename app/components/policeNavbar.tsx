'use client'

import Link from "next/link"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function PoliceNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

    return (
        <button onClick={() => setIsMenuOpen(false)}>
            Close Menu
        </button>
    );
    
};