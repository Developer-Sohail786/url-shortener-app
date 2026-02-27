"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Shorten = () => {
  const [url, seturl] = useState("");
  const [urls, seturls] = useState([]);
  const [shorturl, setshorturl] = useState("");
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [copiedId, setcopiedId] = useState(null);

  const fetchUrls = async () => {
    try {
      const response = await fetch("/api/urls");
      const data = await response.json();
      if (data.success) seturls(data.data);
    } catch {
      console.error("Error fetching urls");
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const copyToClipboard = async (shorturl) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_HOST}/${shorturl}`;
    await navigator.clipboard.writeText(fullUrl);
    setcopiedId(shorturl);
    setTimeout(() => setcopiedId(null), 1500);
  };

  return (
    <main className="bg-purple-100">
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh]">
        
        {/* Text section */}
        <div className="flex flex-col justify-center items-center text-center md:text-left gap-4 px-6">
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Best URL shortener
          </p>

          <p className="text-gray-700">
            Trusted URL shortener
          </p>

          <div className="flex gap-3 text-white flex-wrap justify-center md:justify-start">
            <Link href="/shorten">
              <button className="bg-purple-500 rounded-lg shadow-lg px-5 py-2 font-bold hover:bg-purple-600">
                Try Now
              </button>
            </Link>

            <Link href="/github">
              <button className="bg-purple-500 rounded-lg shadow-lg px-5 py-2 font-bold hover:bg-purple-600">
                Github
              </button>
            </Link>
          </div>
        </div>

        {/* Image section */}
        <div className="relative h-75 sm:h-100 md:h-auto">
          <Image
            src="https://raw.githubusercontent.com/CodeWithHarry/Sigma-Web-Dev-Course/refs/heads/main/Video%20136/bitlinks/public/vector.jpg"
            alt="vector"
            fill
            className="object-contain mix-blend-darken"
            priority
          />
        </div>
      </section>
    </main>
  );
};

export default Shorten;
