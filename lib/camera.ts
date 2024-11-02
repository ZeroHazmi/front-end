//     // FUNCTIONS RELATED TO CAMERA WILL BE USED IN LATER VERSIONS

//     import React, { useState, useRef } from 'react';
//     import '../globals.css';
//     import { useRouter } from 'next/navigation';
//     import Link from 'next/link';
//     import { toast, useToast } from '@/hooks/use-toast';
//     import { AppUser } from '../Models';
//     import { registerUser } from '../lib/api';
//     import Tesseract from 'tesseract.js';
//     import Image from 'next/image';
    
//     const CameraComponent: React.FC = () => {
//       const [imageSrc, setImageSrc] = useState<string | null>(null);
//       const [ocrResult, setOcrResult] = useState<string | null>(null);
//       const [cameraActive, setCameraActive] = useState<boolean>(false);
//       const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
//       const videoRef = useRef<HTMLVideoElement>(null);
//       const canvasRef = useRef<HTMLCanvasElement>(null);
    
//       const startCamera = async () => {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//             videoRef.current.play();
//           }
//         } catch (error) {
//           console.error('Error accessing camera:', error);
//           toast({ variant: 'destructive', description: 'Error accessing camera' });
//         }
//       };
    
//       const captureImage = () => {
//         if (canvasRef.current && videoRef.current) {
//           const context = canvasRef.current.getContext('2d');
//           context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
//           const imageData = canvasRef.current.toDataURL('image/png');
//           setImageSrc(imageData);
//           processImage(imageData);
//           stopCamera(); // Stop the camera after capturing
//         }
//       };
    
//       const processImage = async (imageSrc: Tesseract.ImageLike) => {
//         try {
//           const result = await Tesseract.recognize(imageSrc, 'eng', {
//             logger: (m) => console.log(m),
//           });
//           setOcrResult(result.data.text);
//           toast({ description: 'OCR completed successfully' });
//         } catch (error) {
//           console.error('Error processing image:', error);
//           toast({ variant: 'destructive', description: 'Error processing image' });
//         }
//       };
    
//       const stopCamera = () => {
//         if (videoRef.current && videoRef.current.srcObject) {
//           const stream = videoRef.current.srcObject as MediaStream;
//           const tracks = stream.getTracks();
//           tracks.forEach((track) => track.stop());
//           videoRef.current.srcObject = null;
//         }
//       };
    
//        return (
//         <>
//           {/* Your component JSX goes here */}
//           <video ref={videoRef} style={{ display: cameraActive ? 'block' : 'none' }} />
//           <canvas ref={canvasRef} style={{ display: 'none' }} />
//           <button onClick={startCamera}>Start Camera</button>
//           <button onClick={captureImage}>Capture Image</button>
//           {imageSrc && <Image src={imageSrc} alt="Captured" width={500} height={500} />}
//           {ocrResult && <p>OCR Result: {ocrResult}</p>}
//         </>
//        );
//     };
    
//     export default CameraComponent;


// {/* <button type="button" className="user-signup-icid-img-button" onClick={handleScanClick}>
//     <span className="material-symbols-outlined">flip</span>
//     {cameraActive ? 'Capture' : 'Scan IC/ID'}
// </button> */}

// {/* Camera Modal */}
// {/* {isModalOpen && (
//     <div className="modal">
//         <div className="modal-content">
//             <button className="close-button" onClick={stopCamera}>X</button>
//             <video ref={videoRef} width="100%" height="auto" autoPlay></video>
//             <canvas ref={canvasRef} style={{ display: 'none' }} />
//             <button className="capture-button" onClick={captureImage}>Capture Image</button>
//         </div>
//     </div>
// )} */}

// // Add styles for the modal (could be in your CSS file)
// {/* <style jsx>{`
//     .modal {
//         position: fixed;
//         top: 0;
//         left: 0;
//         right: 0;
//         bottom: 0;
//         background: rgba(0, 0, 0, 0.7);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         z-index: 1000;
//     }
//     .modal-content {
//         background: white;
//         padding: 20px;
//         border-radius: 5px;
//         text-align: center;
//     }
//     .close-button {
//         background: transparent;
//         border: none;
//         font-size: 24px;
//         position: absolute;
//         top: 10px;
//         right: 20px;
//         cursor: pointer;
//     }
//     .capture-button {
//         margin-top: 20px;
//     }
// `}</style> */}