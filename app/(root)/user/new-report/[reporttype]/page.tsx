'use client'

import React, { useState, useEffect, useRef } from "react";
import PHNavBar from "@/components/PHNavBar";
import { useParams, useRouter } from 'next/navigation';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowUp, faMicrophone, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ReportType } from "@/types/index.d";
import Recorder, { mimeType } from "@/components/Recorder";
import { useFormState } from "react-dom";
import OpenAIApi, { OpenAI } from "openai";
import transcribe from "@/actions/transcribe";
import GoogleMaps from "@/components/GoogleMap";
import MapForm from "@/components/MapForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { cookies } from "next/headers";
import { fetchPriority } from "@/app/api/open-ai/route";
import { toast } from "@/hooks/use-toast";
import SubmitReportPage from "@/components/ReportSubmissionPage";



export default function UserTypingReport() {

    return (
        <div>
            <SubmitReportPage />
        </div>
    );
}