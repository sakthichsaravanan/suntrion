import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="px-6 py-2 bg-primary text-white rounded-xl shadow hover:bg-secondary transition-colors">
        Go Home
      </Link>
    </div>
  );
}
