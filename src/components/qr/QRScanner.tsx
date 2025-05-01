import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QRCodeData } from '../../types';
import { ScanLine, XCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: QRCodeData) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qrReaderRef = React.useRef<Html5Qrcode | null>(null);
  const containerId = 'qr-reader';

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: 250,
      aspectRatio: 1.0,
    };

    const handleScan = (decodedText: string) => {
      try {
        const data = JSON.parse(decodedText) as QRCodeData;
        stopScanner();
        onScan(data);
      } catch (err) {
        setError('Invalid QR code format');
      }
    };

    const handleError = (err: unknown) => {
      // Check if the error is a NotFoundException
      if (err instanceof Error && err.name === 'NotFoundException') {
        // Don't set error for QR code not found - this is normal when searching
        return;
      }
      
      // For other errors, set appropriate message
      if (err instanceof Error) {
        if (err.message.includes('Camera access')) {
          setError('Error accessing camera');
        } else {
          setError('Failed to read QR code. Please try again.');
        }
      } else {
        setError('An unexpected error occurred');
      }
    };

    const stopScanner = async () => {
      if (qrReaderRef.current && isScanning) {
        try {
          await qrReaderRef.current.stop();
          setIsScanning(false);
        } catch (err) {
          console.error('Error stopping scanner:', err);
        }
      }
    };

    const startScanner = async () => {
      // Prevent starting if already scanning
      if (isScanning || qrReaderRef.current) {
        return;
      }

      try {
        // Create new instance
        qrReaderRef.current = new Html5Qrcode(containerId);
        
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          const cameraId = cameras[0].id;
          
          // Ensure we're not already scanning before starting
          await qrReaderRef.current.start(
            cameraId,
            config,
            handleScan,
            handleError
          );
          
          setIsScanning(true);
          setError(null);
        } else {
          setError('No cameras found');
        }
      } catch (err) {
        console.error('Error starting scanner:', err);
        setError('Failed to start scanner');
        // Clean up on error
        if (qrReaderRef.current) {
          await stopScanner();
          qrReaderRef.current = null;
        }
      }
    };

    // Start scanner when component mounts
    startScanner();

    // Cleanup on unmount
    return () => {
      stopScanner();
      qrReaderRef.current = null;
    };
  }, [onScan, isScanning]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-dark-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-4 border-b border-dark-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="relative aspect-square w-full">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-dark-900">
              <div className="text-center p-6">
                <p className="text-error-500 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div id={containerId} className="w-full h-full"></div>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-neon-blue/50 rounded-md"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-neon-blue/30 animate-pulse"></div>
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-dark-700">
          <p className="text-sm text-center text-gray-400">
            Position the QR code within the frame to scan
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;