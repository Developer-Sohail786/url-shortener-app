export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="max-w-3xl w-full px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          About This Project
        </h1>

        <p className="text-gray-700 mb-4">
          This project is a secure, full-stack URL shortener built using modern
          web technologies. It allows users to create short links, manage them
          privately, and safely share them with others.
        </p>

        <p className="text-gray-700 mb-4">
          Every URL is tied to a specific user account. Only the owner can view,
          create, or delete their links, ensuring proper authorization and data
          security.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
          Key Features
        </h2>

        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Email & password authentication</li>
          <li>Google OAuth login</li>
          <li>User-scoped URL management</li>
          <li>Protected API routes and pages</li>
          <li>Fast server-side redirects</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
          Technology Stack
        </h2>

        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Next.js (App Router)</li>
          <li>NextAuth with JWT sessions</li>
          <li>MongoDB (Native Driver)</li>
          <li>Tailwind CSS</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">
          Purpose
        </h2>

        <p className="text-gray-700">
          This project is built to demonstrate real-world full-stack development
          concepts such as authentication, authorization, secure data handling,
          and clean architecture. It serves as a strong foundation for scaling
          into analytics, dashboards, and advanced features.
        </p>
      </div>
    </div>
  );
}
