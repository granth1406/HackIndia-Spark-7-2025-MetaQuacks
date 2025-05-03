import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Loader2, QrCode, Camera, X } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  // Initialize scanner when component mounts
  useEffect(() => {
    const scannerInstance = new Html5Qrcode('qr-reader');
    setScanner(scannerInstance);

    // Get list of cameras
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        }
      })
      .catch(err => {
        setError('Unable to access camera. Please check permissions.');
        console.error('Error getting cameras', err);
      });

    // Clean up on unmount
    return () => {
      if (scannerInstance.isScanning) {
        scannerInstance.stop()
          .catch(err => console.error('Error stopping scanner', err));
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scanner || !selectedCamera) return;
    
    setError(null);
    setIsScanning(true);

    try {
      await scanner.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Call the success callback with the result
          onScanSuccess(decodedText);
          
          // Stop scanning
          if (scanner.isScanning) {
            scanner.stop().catch(err => console.error('Error stopping scanner', err));
          }
          
          setIsScanning(false);
        },
        (errorMessage) => {
          // QR code detection error, ignored as it happens constantly until a QR is found
        }
      );
    } catch (err) {
      setError('Failed to start the camera. Please check permissions.');
      setIsScanning(false);
      console.error('Error starting scanner', err);
    }
  };

  const stopScanner = () => {
    if (scanner && scanner.isScanning) {
      scanner.stop()
        .then(() => setIsScanning(false))
        .catch(err => console.error('Error stopping scanner', err));
    }
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
      
      {/* Camera selection */}
      {cameras.length > 1 && (
        <div className="mb-4">
          <label htmlFor="camera-select" className="block text-gray-300 mb-1">
            Select Camera
          </label>
          <select
            id="camera-select"
            className="input-field"
            value={selectedCamera || ''}
            onChange={(e) => setSelectedCamera(e.target.value)}
            disabled={isScanning}
          >
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* QR scanner container */}
      <div className="relative overflow-hidden rounded-lg bg-dark-card">
        <div 
          id="qr-reader" 
          className={`w-full h-[300px] ${!isScanning ? 'hidden' : ''}`}
        ></div>
        
        {!isScanning && (
          <div className="w-full h-[300px] flex flex-col items-center justify-center bg-dark-card">
            <QrCode size={80} className="text-gray-600 mb-4" />
            <p className="text-gray-400 mb-6">
              Position the QR code within the scanner
            </p>
            
            <button 
              onClick={startScanner}
              className="btn btn-primary flex items-center"
              disabled={!selectedCamera}
            >
              <Camera size={16} className="mr-2" />
              Start Scanning
            </button>
          </div>
        )}
        
        {isScanning && (
          <button
            onClick={stopScanner}
            className="absolute top-4 right-4 bg-dark-card/80 p-2 rounded-full"
            aria-label="Stop scanning"
          >
            <X size={20} className="text-white" />
          </button>
        )}
        
        {/* Loading indicator */}
        {isScanning && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-dark-background/80 py-2 px-4 rounded-full flex items-center">
              <Loader2 size={16} className="text-primary-500 animate-spin mr-2" />
              <span className="text-gray-200 text-sm">Scanning...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 text-error-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default QRScanner;