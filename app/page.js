"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };

  const downloadQrCode = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();

      if (window.showSaveFilePicker) {
        // ✅ Use File System Access API if available (modern browsers)
        const handle = await window.showSaveFilePicker({
          suggestedName: "qrcode.png",
          types: [
            {
              description: "PNG Image",
              accept: { "image/png": [".png"] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        // ❌ Fallback for unsupported browsers (uses auto-download)
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert("Failed to download QR Code.");
      console.error(error);
    }
  };

  const generateQrCode = async () => {
    if (!inputText) return alert("Please enter text to generate QR Code!");

    // Fetch the QR code URL from the API route
    const response = await fetch(
      `/api/qrcode?text=${encodeURIComponent(inputText)}`
    );
    if (response.ok) {
      const { qrCodeUrl } = await response.json();
      setQrCodeUrl(qrCodeUrl);
    } else {
      alert("Failed to generate QR Code. Please try again.");
    }
  };

  const clearAll = () => {
    setInputText("");
    setQrCodeUrl("");
  };

  // Determine the link target based on input
  const getLinkTarget = () => {
    if (isValidUrl(inputText)) {
      return inputText; // Direct link for valid URLs
    }
    // Construct a search query for text input
    const searchBaseUrl = "https://www.google.com/search?q=";
    return `${searchBaseUrl}${encodeURIComponent(inputText)}`;
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-4 text-center">
        QR Code Generator
      </h1>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text or URL"
        className="text-base w-full max-w-md p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />
      <div className="flex gap-3">
        <button
          onClick={generateQrCode}
          className="text-sm px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Generate QR Code
        </button>

        <button
          onClick={clearAll}
          className="text-sm px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Reset
        </button>
      </div>

      {qrCodeUrl && (
        <div className="mt-8 flex flex-col items-center">
          {/* Make QR code clickable */}
          <a
            href={getLinkTarget()}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-48 h-48"
          >
            <Image
              unoptimized
              src={qrCodeUrl}
              alt="Generated QR Code"
              fill
              className="object-contain cursor-pointer"
            />
          </a>
          <button
            onClick={downloadQrCode}
            className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            Download QR Code
          </button>
        </div>
      )}
      <Link href="/news" className="mt-8">
        News
      </Link>
      <Link href="/panel" className="mt-4">
        Panelling Calculator
      </Link>
      <Link href="https://taskmanager-lwj.vercel.app/" className="mt-4">
        Reminders
      </Link>
      <Link href="https://basic-tax-calc-lwj.vercel.app/" className="mt-4">
        Basic Tax - UK & NI
      </Link>
      <Link href="https://media-lw-jauth.vercel.app/" className="mt-4">
        Media Library
      </Link>
      <Link
        href="https://stock-portfolio-manager-psi.vercel.app/"
        className="mt-4"
      >
        Stock Manager
      </Link>
      <Link href="https://roller-kinnear.vercel.app/" className="mt-4">
        Dice Roller
      </Link>
      <Link
        href="https://uk030621.github.io/lwjwordle3987.io/"
        className="mt-4"
      >
        Wordle
      </Link>
      <footer className="mt-8 text-xs">
        <div className="text-center">
          <p className="flex flex-col gap-1">
            &copy; {new Date().getFullYear()} LWJ Quick Response Generator.
            <br />
            <span>All rights reserved.</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
