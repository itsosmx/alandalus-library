"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, Download } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeShareProps {
  url: string;
  title: string;
  children?: React.ReactNode;
}

export const QRCodeShare: React.FC<QRCodeShareProps> = ({ url, title, children }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);

      // Generate QR code with custom options
      const qrCodeOptions = {
        width: 400,
        margin: 2,
        color: {
          dark: "#1f2937", // Dark color for QR code
          light: "#ffffff", // Light color for background
        },
        errorCorrectionLevel: "M" as const,
      };

      const dataUrl = await QRCode.toDataURL(url, qrCodeOptions);
      setQrCodeDataUrl(dataUrl);

      // Also generate on canvas for download
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, url, qrCodeOptions);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (canvasRef.current) {
      // Create a new canvas with padding and title
      const downloadCanvas = document.createElement("canvas");
      const ctx = downloadCanvas.getContext("2d");

      if (ctx) {
        const padding = 40;
        const titleHeight = 60;
        const qrSize = 400;

        downloadCanvas.width = qrSize + padding * 2;
        downloadCanvas.height = qrSize + padding * 2 + titleHeight;

        // Fill background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

        // Add title
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 24px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(title, downloadCanvas.width / 2, padding + 30);

        // Add subtitle
        ctx.font = "16px Arial, sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText("مكتبة الأندلس - Al-Andalus Library", downloadCanvas.width / 2, padding + 55);

        // Draw QR code
        ctx.drawImage(canvasRef.current, padding, padding + titleHeight);

        // Add footer text
        ctx.font = "14px Arial, sans-serif";
        ctx.fillStyle = "#9ca3af";
        ctx.fillText("امسح الكود للوصول للمنتج", downloadCanvas.width / 2, downloadCanvas.height - 15);

        // Download the image
        const link = document.createElement("a");
        link.download = `qr-code-${title.replace(/[^a-zA-Z0-9]/g, "-")}.png`;
        link.href = downloadCanvas.toDataURL("image/png");
        link.click();
      }
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && !qrCodeDataUrl) {
      generateQRCode();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex-1">
            <QrCode className="w-4 h-4 mr-2" />
            مشاركة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            مشاركة المنتج
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {isGenerating ? (
                <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : qrCodeDataUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-lg shadow-lg">
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-64 h-64" />
                </motion.div>
              ) : null}

              {/* Hidden canvas for download */}
              <canvas ref={canvasRef} className="hidden" width={400} height={400} />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">امسح الكود لمشاركة المنتج</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 max-w-xs break-all">{url}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={downloadQRCode}
              disabled={!qrCodeDataUrl || isGenerating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              تحميل كصورة
            </Button>

            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              إغلاق
            </Button>
          </div>

          {/* Share Options */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">أو شارك عبر:</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: title,
                      url: url,
                    });
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
                className="flex-1">
                نسخ الرابط
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`شاهد هذا المنتج الرائع: ${title}\n${url}`)}`;
                  window.open(whatsappUrl, "_blank");
                }}
                className="flex-1">
                واتساب
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeShare;
