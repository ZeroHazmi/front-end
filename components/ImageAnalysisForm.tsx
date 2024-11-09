'use client'

import React, { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import axios from 'axios';

interface ICScannerFields {
  issuingCountry: string; // "Malaysia"
  issuingState?: string; // Not provided in the sample, but could be added
  issuingStateCode?: string; // Not provided, could be used if needed
  fullName: string; // "ZAL HAZMI BIN MUSRIZAL"
  documentNumber: string; // "041107-05-0253"
  checkDigit?: string; // Not available in the sample
  nationality?: string; // Not provided, could be derived if available
  dateOfBirth: string; // "04-11-07"
  sex: string; // "male"
  dateOfExpiry?: string; // Not provided, could be inferred or added if available
  issuingDate?: string; // Not provided
  address?: string; // "NO 308 JALAN GEMILANG 12 TAMAN GEMILANG 09600 LUNAS KEDAH"
  addressFields?: { postalCode: string, state: string }; // { postalCode: '09600', state: 'KEDAH' }
  religion?: string; // "Islam"
  personalNumber?: string; // Not available in the sample
  finalCheckDigit?: string; // Not available in the sample
}



interface ICScannerResponse {
    status: number;
    error?: string;
    face_url?: string;
    mrz_img_url?: string;
    mrz_raw_text?: string;
    fields: ICScannerFields;
}

interface ICScannerProps {
    apiKey?: string;
}

const ICScanner = ({ apiKey }: ICScannerProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [scanResults, setScanResults] = useState<ICScannerResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const PIXLAB_API_KEY = process.env.NEXT_PUBLIC_PIXLAB_API_KEY;

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = event.target.files;
        if (files && files[0]) {
            if (files[0].size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size must be less than 5MB');
                return;
            }
            setSelectedFile(files[0]);
            setError(null);
            setScanResults(null);
        }
    };

    const scanPassport = async (): Promise<void> => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('type', 'idcard');
            formData.append('key', process.env.NEXT_PUBLIC_PIXLAB_API_KEY!);
            formData.append('country', 'Malaysia');

            // Make POST request with FormData
            const response = await axios.post('https://cors-anywhere.herokuapp.com/https://api.pixlab.io/docscan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;
console.log(data)
            if (data.status !== 200) {
                throw new Error(data.error || 'Failed to scan passport');
            }

            setScanResults(data);
        } catch (err) {
            let errorMessage = 'An unknown error occurred';
            if (err instanceof Error) {
                errorMessage = err.message;
                if (errorMessage.includes('Network Error')) {
                    errorMessage = 'CORS Error: Unable to access the API. Please check CORS configuration.';
                }
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Passport Scanner</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => document.getElementById('fileInput')?.click()}
                            disabled={isLoading}
                            type="button"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Select Passport Image
                        </Button>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Button
                            onClick={scanPassport}
                            disabled={!selectedFile || isLoading}
                            variant="default"
                            type="button"
                        >
                            {isLoading ? 'Scanning...' : 'Scan Passport'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ICScanner;
