import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, SwitchCamera } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageSrc: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      return;
    }

    const startCamera = async () => {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode }
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please ensure permissions are granted.");
        onClose();
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, facingMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageSrc);
        onClose();
      }
    }
  };

  const toggleCamera = () => {
     if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <button onClick={onClose} className="text-white p-2 bg-black/50 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 pb-safe">
           <button 
            onClick={toggleCamera}
            className="p-4 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30"
          >
            <SwitchCamera size={24} />
          </button>

          <button 
            onClick={handleCapture}
            className="p-1 rounded-full border-4 border-white"
          >
            <div className="w-16 h-16 bg-white rounded-full hover:bg-slate-200 transition-colors" />
          </button>

          <div className="w-14" /> {/* Spacer for balance */}
        </div>
      </div>
    </div>
  );
};
