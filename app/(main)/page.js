import Image from "next/image";
import Link from "next/link";


export default function Home() {
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
              <button className="bg-purple-500 rounded-lg shadow-lg px-5 py-2 font-bold cursor-pointer hover:bg-purple-600">
                Try Now
              </button>
            </Link>

            <Link href="/github">
              <button className="bg-purple-500 rounded-lg shadow-lg px-5 py-2 cursor-pointer font-bold hover:bg-purple-600">
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

  )
}
