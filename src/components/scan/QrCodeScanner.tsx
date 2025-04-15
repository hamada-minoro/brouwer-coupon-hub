
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, QrCode, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface QrCodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function QrCodeScanner({ onScan, onClose }: QrCodeScannerProps) {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const html5QrcodeScanner = new Html5Qrcode("reader");
    setScanner(html5QrcodeScanner);

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        }
      })
      .catch((err) => {
        console.error("Error getting cameras", err);
      });

    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = () => {
    if (!scanner || !selectedCamera) return;

    setScanning(true);
    scanner
      .start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {}
      )
      .catch((err) => {
        console.error("Error starting scanner", err);
        setScanning(false);
      });
  };

  const stopScanning = () => {
    if (scanner && scanner.isScanning) {
      scanner.stop().catch(console.error);
    }
    setScanning(false);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamera(e.target.value);
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-brouwer-primary" />
          <h2 className="text-xl font-semibold">Scanner de QR Code</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {cameras.length > 0 ? (
        <>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Câmera
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brouwer-primary"
              onChange={handleCameraChange}
              value={selectedCamera || ""}
              disabled={scanning}
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label}
                </option>
              ))}
            </select>
          </div>

          <div id="reader" className="w-full h-64 mb-4 overflow-hidden rounded-lg"></div>

          {!scanning ? (
            <Button 
              onClick={startScanning}
              className="w-full bg-brouwer-primary hover:bg-brouwer-secondary"
            >
              <Camera className="h-5 w-5 mr-2" />
              Iniciar Scanner
            </Button>
          ) : (
            <Button 
              onClick={stopScanning}
              variant="outline"
              className="w-full"
            >
              <X className="h-5 w-5 mr-2" />
              Parar Scanner
            </Button>
          )}
        </>
      ) : (
        <div className="w-full text-center p-6">
          <p className="text-gray-600 mb-2">Nenhuma câmera encontrada</p>
          <p className="text-sm text-gray-500">
            Por favor, certifique-se de que sua câmera está conectada e que você concedeu permissões de acesso ao navegador.
          </p>
        </div>
      )}
    </div>
  );
}
