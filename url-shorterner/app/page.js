import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
            className={`rounded-lg shadow-lg px-6 py-2 font-bold
              ${
                loading
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

      <div className="overflow-x-auto">
        <table className="w-full min-w-150 border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Original URL</th>
              <th className="border px-4 py-2 text-left">Short URL</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {urls.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  Generate your URL
                </td>
              </tr>
            ) : (
              urls.map((item) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2 break-all">
                    {item.url}
                  </td>

                  <td className="border px-4 py-2 break-all flex items-center gap-2">
                    <a
                      href={`/${item.shorturl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 underline"
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
                  </td>

                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => deleteURL(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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

}
