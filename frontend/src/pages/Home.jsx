import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { Copy, ExternalLink, Link as LinkIcon, Check, Sparkles, X, Zap, Shield, Infinity } from "lucide-react";

function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleShorten() {
    if (!longUrl.trim()) return;

    try {
      setLoading(true);
      setError("");
      setShortUrl("");
      setCopied(false);

      const response = await axiosClient.post("/url/shorten", {
        longUrl,
      });
      console.log(response)
      setShortUrl(response.data.shortUrl);
      console.log(shortUrl);
    } catch (err) {
      setError("Failed to shorten URL. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleShorten();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 py-6 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Shortly
            </span>
          </div>
          <div className="hidden md:block">
            <span className="text-sm text-gray-600 font-medium bg-gray-100 px-4 py-2 rounded-full">
              Backend-focused URL Shortener
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Shorten Your Long URLs
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Transform lengthy links into clean, memorable URLs instantly
          </p>
        </div>

        {/* Shortening Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 mb-8">
          <div className="space-y-6">
            
            {/* Input Section */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-gray-800 uppercase tracking-wider">
                  Enter Your Long URL
                </span>
                <div className="relative mt-3">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-3 focus:ring-blue-200 outline-none transition-all duration-200 placeholder:text-gray-500 text-gray-900 text-base"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </label>
            </div>

            {/* Button */}
            <button
              onClick={handleShorten}
              disabled={loading || !longUrl.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span className="text-base">Shorten URL</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="animate-fade-in">
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                  <X className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">{error}</p>
                    <p className="text-red-700 text-sm mt-1">Make sure your URL starts with http:// or https://</p>
                  </div>
                </div>
              </div>
            )}

            {/* Result Card */}
            {shortUrl && (
              <div className="animate-fade-in">
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Check className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          Success! URL Shortened
                        </h3>
                        <p className="text-gray-700 text-sm">
                          Your link is ready to share
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm font-medium text-gray-800">
                      Your Short URL:
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-white border border-gray-300 rounded-xl space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <LinkIcon className="w-4 h-4 text-blue-700" />
                        </div>
                        <code className="text-gray-900 font-mono text-base truncate bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-full">
                          {shortUrl}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={handleCopy}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                            copied
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 border border-blue-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Open</span>
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center pt-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-700">Link is active and ready to use</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Lightning Fast</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Optimized backend delivers shortened URLs in milliseconds
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-indigo-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Secure & Reliable</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Enterprise-grade security with 99.9% uptime guarantee
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Infinity className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">No Limits</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Unlimited URL shortening, completely free forever
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mb-12">
          <div className="inline-grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm w-full max-w-2xl">
            <div className="px-4 py-3">
              <div className="text-3xl font-bold text-gray-900">10M+</div>
              <div className="text-sm text-gray-700 font-medium">Links Created</div>
            </div>
            <div className="px-4 py-3 border-t sm:border-t-0 sm:border-x border-gray-100">
              <div className="text-3xl font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-700 font-medium">Uptime</div>
            </div>
            <div className="px-4 py-3">
              <div className="text-3xl font-bold text-gray-900">&lt;100ms</div>
              <div className="text-sm text-gray-700 font-medium">Avg. Response</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 max-w-7xl mx-auto border-t border-gray-300 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <LinkIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Shortly
            </span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-700 text-sm">
              A backend-focused URL shortener project
            </p>
            <p className="text-gray-600 text-sm mt-1">
              © {new Date().getFullYear()} Shortly • All links are anonymous and secure
            </p>
          </div>
        </div>
      </footer>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        /* Improve text visibility */
        input::placeholder {
          color: #6b7280;
          opacity: 0.8;
        }

        /* Better focus states */
        input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Smooth transitions */
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
      `}</style>
    </div>
  );
}

export default Home;