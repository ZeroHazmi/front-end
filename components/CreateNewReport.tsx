'use client'

import { toast } from '@/hooks/use-toast';
import { ReportType } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, MicIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchSuggestions {
    icNumber: string;
    userId: string;
}

const CreateNewReport = ({ type }: { type: string }) => {
    const router = useRouter();
    const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
    const [selectedReportType, setSelectedReportType] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestions[]>([]);
    const [selectedUserId, setselectedUserId] = useState("");
    const currentRoute = usePathname();
    const { t } = useLanguage()

    async function fetchReportType() {
        const isOnlineParam = type === 'user' ? '?isOnline=true' : '';
        const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}reporttype${isOnlineParam}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setReportTypes(data);
        } else {
            console.error('Failed to fetch report types');
        }
    }

    const fetchSuggestions = async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/getIcNumber?icnumber=${query}`);
        if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
        } else {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        fetchSuggestions(searchQuery);
    }, [searchQuery]);

    function handleSearchChange(value: string) {
        setSearchQuery(value);
        if (value.length >= 2) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    }

    function newReportButton(e: React.MouseEvent) {
        e.preventDefault();
        if (selectedReportType === 0) {
            toast({
                title: t.reportType,
                description: t.reportTypeError,
                variant: "destructive",
            });
            return;
        } else {
            if (currentRoute.includes('police')) {
                router.push(`/police/create-report/${selectedReportType}?userId=${selectedUserId}`);
            } else {
                router.push(`/user/reports/new/${selectedReportType}`);
            }
        }
    }

    useEffect(() => {
        fetchReportType();
    }, [type]);

    return (
        <section className="pt-16">
            <div className="flex justify-center items-center font-bold text-6xl text-center text-7 my-12">
                <h1>{t.reportingSubmission}</h1>
            </div>
            <div className="flex flex-col justify-center items-center">
                <Card className="bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800">{t.createNewReport}</CardTitle>
                        <CardDescription>{t.reportFeatures}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col items-start p-4 border rounded-lg">
                            <FileTextIcon className="mb-2 h-6 w-6 text-blue-600" />
                            <div className="font-semibold">{t.textReport}</div>
                            <p className="mt-1 text-sm text-gray-600">{t.textReportDescription}</p>
                        </div>
                        <div className="flex flex-col items-start p-4 border rounded-lg">
                            <MicIcon className="mb-2 h-6 w-6 text-blue-600" />
                            <div className="font-semibold">{t.voiceReport}</div>
                            <p className="mt-1 text-sm text-gray-600">{t.voiceReportDescription}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col items-start">
                        <p className="mb-4 text-sm text-gray-600">
                            {t.speechToTextInfo}
                        </p>
                        <div className="w-full space-y-4">
                            <Select onValueChange={(value) => setSelectedReportType(Number(value))} required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t.selectReportType} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0" disabled>
                                    {t.reportType}
                                    </SelectItem>
                                    {reportTypes.map((reportType) => (
                                        <SelectItem key={reportType.id} value={reportType.id.toString()}>
                                            {reportType.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {type === 'police' && (
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Search for a user by IC Number"
                                        value={searchQuery}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        className="w-full"
                                    />
                                    {suggestions.length > 0 && (
                                        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                            {suggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => {
                                                        setselectedUserId(suggestion.userId);
                                                        setSearchQuery(suggestion.icNumber);
                                                        setSuggestions([]);
                                                    }}
                                                >
                                                    {suggestion.icNumber}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                            <Button
                                className="w-full sm:w-auto bg-[#0044cc] text-white rounded-lg font-bold hover:bg-[#0022aa]"
                                onClick={newReportButton}
                            >
                                {t.startNewReport}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
};

export default CreateNewReport;

