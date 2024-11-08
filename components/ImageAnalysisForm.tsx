'use client'

import { useState } from "react";
import { analyzeImage } from "@/actions/upload";

export default function ImageAnalysisForm() {
    const [image, setImage] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            alert("Please select an image.");
            return;
        }

        setLoading(true);
        try {
            const base64Image = await convertToBase64(image);
            const result = await analyzeImage(base64Image);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            setAnalysisResult("Failed to analyze image.");
        } finally {
            setLoading(false);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(",")[1]);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Upload an image:
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze Image"}
                </button>
            </form>

            {analysisResult && (
                <div>
                    <h3>Analysis Result:</h3>
                    <p>{analysisResult}</p>
                </div>
            )}
        </div>
    );
}
