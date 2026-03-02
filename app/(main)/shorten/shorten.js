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

useEffect(() => {
  const handleFocus = () => {
    fetchUrls();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    window.removeEventListener("focus", handleFocus);
  };
}, []);
  const handleChange = (e) => {
  seturl(e.target.value);
};

const handleChange1 = (e) => {
  setshorturl(e.target.value);
};
const generate = async () => {
  if (loading) return;
  setloading(true);
  seterror("");

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, shorturl }),
    });

    const result = await res.json();

    if (!result.success) {
      seterror(result.message);
    } else {
      seturl("");
      setshorturl("");
      fetchUrls();
    }
  } catch {
    seterror("Something went wrong");
  } finally {
    setloading(false);
  }
};

const deleteURL = async (id) => {
  try {
    await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUrls();
  } catch {
    console.error("Delete failed");
  }
};

  const copyToClipboard = async (shorturl) => {
    const fullUrl = `${process.env.NEXT_PUBLIC_HOST}/${shorturl}`;
    await navigator.clipboard.writeText(fullUrl);
    setcopiedId(shorturl);
    setTimeout(() => setcopiedId(null), 1500);
  };

  return (
    <>
      {/* Generate box */}
      <div className="mx-auto max-w-lg bg-purple-100 my-6 p-5 rounded-lg flex flex-col gap-5">
        <h1 className="font-bold text-2xl text-center sm:text-left">
          Generate short URL's
        </h1>

        <div className="flex flex-col gap-4">
          <input
            className="px-4 py-2 focus:outline-purple-600 rounded-md bg-white w-full"
            value={url}
            type="url"
            placeholder="Enter the URL"
            onChange={handleChange}
          />

          <input
            className="px-4 py-2 focus:outline-purple-600 rounded-md bg-white w-full"
            value={shorturl}
            type="text"
            placeholder="Enter your preferred short URL text"
            onChange={handleChange1}
          />

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              onClick={generate}
              disabled={loading}
              className={`rounded-lg shadow-lg px-6 py-2 font-bold cursor-pointer
              ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
     <div className="px-4">
  <h2 className="text-xl font-bold text-center mb-4">
    Generated URLs
  </h2>

  <div className="w-full overflow-x-auto rounded-lg shadow">
    <table className="min-w-200 w-full border border-gray-300 text-sm sm:text-base">
      
      <thead className="bg-purple-100 text-purple-900">
        <tr>
          <th className="border px-3 sm:px-4 py-2 text-left whitespace-nowrap">
            Original URL
          </th>
          <th className="border px-3 sm:px-4 py-2 text-left whitespace-nowrap">
            Short URL
          </th>
          <th className="border px-3 sm:px-4 py-2 text-center whitespace-nowrap">
            Clicks
          </th>
          <th className="border px-3 sm:px-4 py-2 text-center whitespace-nowrap">
            Created
          </th>
          <th className="border px-3 sm:px-4 py-2 text-center whitespace-nowrap">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {urls.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-6 text-gray-500">
              Generate your first URL
            </td>
          </tr>
        ) : (
          urls.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50 transition">

              {/* Original URL */}
              <td className="border px-3 sm:px-4 py-2 truncate max-w-62.5 align-middle">
                {item.url}
              </td>

              {/* Short URL */}
              <td className="border px-3 sm:px-4 py-2 align-middle">
                <div className="flex items-center gap-2">
                  <a
                    href={`/${item.shorturl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline break-all"
                  >
                    {process.env.NEXT_PUBLIC_HOST}/{item.shorturl}
                  </a>

                  <button
                    onClick={() => copyToClipboard(item.shorturl)}
                    className="p-1 rounded hover:bg-gray-200 transition"
                  >
                    {copiedId === item.shorturl ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="green"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </td>

              {/* Clicks */}
              <td className="border px-3 sm:px-4 py-2 text-center font-semibold align-middle">
                {item.clicks ?? 0}
              </td>

              {/* Created */}
              <td className="border px-3 sm:px-4 py-2 text-center text-xs sm:text-sm align-middle">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>

              {/* Action */}
              <td className="border px-3 sm:px-4 py-2 text-center align-middle">
                <button
                  onClick={() => deleteURL(item._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))
        )}
      </tbody>

    </table>
  </div>
</div>
    </>
  );

};

export default Shorten;
