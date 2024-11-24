'use client'

import React, { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import axios from 'axios';

export interface ICScannerFields {
    documentNumber: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    addressFields?: {
        postalCode: string;
        state: string;
    };
    nationality: string;
    religion: string;
}

interface ICScannerProps {
    onScanComplete: (data: ICScannerFields) => void;
}

interface ICScannerResponse {
    status: number;
    error?: string;
    face_url?: string;
    mrz_img_url?: string;
    mrz_raw_text?: string;
    fields: ICScannerFields;
}

const ICScanner: React.FC<ICScannerProps> = ({ onScanComplete }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [scanResults, setScanResults] = useState<ICScannerResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const PIXLAB_API_KEY = process.env.PIXLAB_API_KEY;

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
            formData.append('key', PIXLAB_API_KEY!);
            formData.append('country', 'Malaysia');

            const response = await axios.post(
                'https://cors-anywhere.herokuapp.com/https://api.pixlab.io/docscan',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const data = response.data;
            if (data.status !== 200) {
                throw new Error(data.error || 'Failed to scan IC');
            }
            console.log(data);

            onScanComplete(data.fields); // Pass scanned fields to callback

        } catch (err) {
            setError('An error occurred while scanning.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>IC Scanner</CardTitle>
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
                            Select IC Image
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
                            {isLoading ? 'Scanning...' : 'Scan IC'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ICScanner;
