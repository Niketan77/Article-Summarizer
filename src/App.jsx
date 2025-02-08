import { useState } from 'react';
import { FaNewspaper, FaSpinner, FaGithub, FaLinkedin } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { summarizeArticle } from './utils/gemini';

function App() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await summarizeArticle(url);
      setSummary(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((line, index) => {
      if (line.startsWith('Source:') || line.startsWith('Summary:') || 
          line.startsWith('Key Takeaways:') || line.startsWith('Key Insight:')) {
        return <h3 key={index} className="font-bold text-xl mt-6 mb-3 text-gray-800">{line}</h3>;
      }
      if (line.match(/^\d\./)) {
        return <li key={index} className="ml-6 mb-2 text-gray-700">{line.substring(3)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-3 text-gray-700">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <FaNewspaper className="mx-auto h-12 w-12 text-indigo-500" />
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900">Article Summarizer</h2>
          <p className="mt-2 text-lg text-gray-600">
            Get instant summaries, key points, and insights from any article
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Powered by Google Gemini AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex gap-4">
            <input
              type="url"
              required
              className="flex-1 appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm shadow-sm transition duration-150 ease-in-out"
              placeholder="Paste your article URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-sm"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Analyzing...
                </>
              ) : (
                'Generate Summary'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="mt-8 space-y-4 bg-white rounded-lg shadow-sm p-6">
            <Skeleton count={1} height={30} />
            <Skeleton count={3} />
            <Skeleton height={30} />
            <Skeleton count={5} />
            <Skeleton height={30} />
            <Skeleton count={1} />
          </div>
        ) : summary && (
          <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 ease-in-out">
            <div className="px-6 py-6">
              {formatContent(summary)}
            </div>
          </div>
        )}

        {/* Footer with attribution and social links */}
        <footer className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Built by Niketan Choudhari</p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/Niketan77"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaGithub className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/niketan-choudhari-807980270/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaLinkedin className="h-6 w-6" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;