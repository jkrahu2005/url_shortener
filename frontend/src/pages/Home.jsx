import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Copy, ExternalLink, Link as LinkIcon, Check, Sparkles, Zap, Shield, Infinity, Sun, Moon, Clock, Trash2 } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [urlError, setUrlError] = useState("");

  // ---- DARK MODE ----
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // ---- HISTORY ----
  useEffect(() => {
    const savedHistory = localStorage.getItem("shortly_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem("shortly_history", JSON.stringify(newHistory));
  };

  // ---- URL VALIDATION (blocks our own backend domain) ----
  const getBackendHost = () => {
    try {
      const base = axiosClient.defaults.baseURL;
      if (base) {
        const url = new URL(base);
        return url.hostname;
      }
    } catch (_) {}
    // fallback if baseURL not available
    return "urlixa.vercel.app";
  };

  const validateUrl = (url) => {
    if (!url.trim()) {
      setUrlError("");
      return false;
    }
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(url)) {
      setUrlError("URL must start with http:// or https://");
      return false;
    }
    try {
      const parsed = new URL(url);
      // Block our own backend domain
      const backendHost = getBackendHost();
      if (parsed.hostname === backendHost) {
        setUrlError("This is already a shortened URL from our service.");
        return false;
      }
      setUrlError("");
      return true;
    } catch (_) {
      setUrlError("Please enter a valid URL (e.g., https://example.com)");
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setLongUrl(value);
    validateUrl(value);
  };

  const isUrlValid = () => {
    return longUrl.trim() !== "" && urlError === "";
  };

  // ---- API ----
  async function handleShorten() {
    if (!isUrlValid()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    try {
      setLoading(true);
      setShortUrl("");

      const response = await axiosClient.post("/url/shorten", { longUrl });
      const newShort = response.data.shortUrl;

      setShortUrl(newShort);
      toast.success("✨ Link shortened successfully!");

      const newEntry = {
        id: Date.now(),
        long: longUrl,
        short: newShort,
      };
      const updatedHistory = [newEntry, ...history.filter(item => item.short !== newShort)].slice(0, 5);
      saveHistory(updatedHistory);

      setUrlError("");

    } catch (err) {
      toast.error("Failed to shorten URL. Please check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("📋 Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isUrlValid() && !loading) {
      handleShorten();
    }
  };

  const clearHistory = () => {
    saveHistory([]);
    toast.success("History cleared.");
  };

  const copyHistoryItem = (shortUrl) => {
    handleCopy(shortUrl);
  };

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-primary/5"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--fallback-b1, oklch(0.98 0.01 240))",
            color: "var(--fallback-bc, oklch(0.2 0.01 240))",
            border: "1px solid var(--fallback-b2, oklch(0.95 0.01 240))",
            borderRadius: "12px",
            padding: "12px 20px",
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
          },
          success: {
            icon: "✅",
            style: { borderLeft: "4px solid #22c55e" },
          },
          error: {
            icon: "❌",
            style: { borderLeft: "4px solid #ef4444" },
          },
        }}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 py-6 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
              <LinkIcon className="w-6 h-6 text-primary-content" />
            </div>
            <span className="text-2xl font-bold text-base-content">Shortly</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle text-base-content hover:bg-base-300"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <span className="hidden md:block text-sm font-medium text-base-content/70 bg-base-300/50 backdrop-blur-sm px-4 py-2 rounded-full border border-base-300/30">
              Backend-focused URL Shortener
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 backdrop-blur-sm rounded-2xl mb-6 border border-primary/20">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-base-content">
            Shorten Your Long URLs
          </h1>
          <p className="text-lg md:text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
            Transform lengthy links into clean, memorable URLs instantly
          </p>
        </div>

        {/* ─── Main Glass Card ─── */}
        <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 mb-8">
          <div className="bg-base-100/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl shadow-primary/5 border border-white/10 dark:border-white/5">
            <div className="space-y-6">
              {/* Input Section */}
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm font-semibold text-base-content/80 uppercase tracking-wider">
                    Enter Your Long URL
                  </span>
                  <div className="relative mt-3">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LinkIcon className={`h-5 w-5 ${urlError ? 'text-error/70' : 'text-base-content/50'}`} />
                    </div>
                    <input
                      type="text"
                      placeholder="https://example.com/very-long-url-that-needs-shortening"
                      className={`w-full pl-12 pr-4 py-4 bg-base-200/70 backdrop-blur-sm border rounded-xl outline-none transition-all duration-200 placeholder:text-base-content/40 text-base-content text-base ${
                        urlError
                          ? "border-error/70 focus:border-error focus:ring-3 focus:ring-error/20"
                          : "border-base-300/60 focus:border-primary focus:ring-3 focus:ring-primary/20"
                      }`}
                      value={longUrl}
                      onChange={handleUrlChange}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                    />
                  </div>
                </label>
                {/* Inline Error Message */}
                {urlError && (
                  <div className="flex items-center gap-2 text-error text-sm animate-fade-in">
                    <span>⚠️</span>
                    <span>{urlError}</span>
                  </div>
                )}
                {longUrl.trim() && !urlError && (
                  <div className="flex items-center gap-2 text-success text-sm animate-fade-in">
                    <span>✅</span>
                    <span>URL looks valid</span>
                  </div>
                )}
              </div>

              {/* Button */}
              <button
                onClick={handleShorten}
                disabled={loading || !isUrlValid()}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-content font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></div>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span className="text-base">Shorten URL</span>
                  </>
                )}
              </button>

              {/* Result Card */}
              {shortUrl && (
                <div className="animate-fade-in">
                  <div className="p-6 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Check className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base-content text-lg">
                            Success! URL Shortened
                          </h3>
                          <p className="text-base-content/70 text-sm">
                            Your link is ready to share
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="text-sm font-medium text-base-content/80">
                        Your Short URL:
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-base-200/60 backdrop-blur-sm border border-base-300/60 rounded-xl space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                            <LinkIcon className="w-4 h-4 text-primary" />
                          </div>
                          <code className="text-base-content font-mono text-base truncate bg-base-300/40 px-3 py-2 rounded-lg border border-base-300/50 w-full">
                            {shortUrl}
                          </code>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleCopy(shortUrl)}
                            className="px-4 py-2 bg-base-300/60 backdrop-blur-sm text-base-content hover:bg-base-300/80 rounded-lg transition-all duration-200 flex items-center space-x-2 border border-base-300/50"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </button>
                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center space-x-2 border border-primary"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Open</span>
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center justify-center pt-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                          <span className="text-base-content/70">
                            Link is active and ready to use
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── History ─── */}
        {history.length > 0 && (
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 mb-12">
            <div className="bg-base-100/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 dark:border-white/5 shadow-xl shadow-primary/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-base-content/70" />
                  <h2 className="text-lg font-semibold text-base-content">Recent Links</h2>
                  <span className="text-sm text-base-content/50 bg-base-300/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-base-300/30">
                    {history.length} / 5
                  </span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-sm text-error/80 hover:text-error flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2 bg-base-200/60 backdrop-blur-sm border border-base-300/50 rounded-full px-4 py-2 hover:border-primary/50 transition-all duration-200 cursor-pointer"
                    onClick={() => copyHistoryItem(item.short)}
                    title={`Original: ${item.long}`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-sm font-mono text-base-content truncate max-w-[150px] sm:max-w-xs">
                      {item.short}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyHistoryItem(item.short);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Copy link"
                    >
                      <Copy className="w-3.5 h-3.5 text-base-content/50 hover:text-primary transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-base-content/50 mt-2">
                Click any chip to copy the short URL
              </p>
            </div>
          </div>
        )}

        {/* ─── Features ─── */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Zap, label: "Lightning Fast", desc: "Optimized backend delivers shortened URLs in milliseconds", color: "primary" },
            { icon: Shield, label: "Secure & Reliable", desc: "Enterprise-grade security with 99.9% uptime guarantee", color: "secondary" },
            { icon: Infinity, label: "No Limits", desc: "Unlimited URL shortening, completely free forever", color: "accent" },
          ].map((feat, idx) => (
            <div
              key={idx}
              className="relative p-[1px] rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10"
            >
              <div className="bg-base-100/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 dark:border-white/5 shadow-xl shadow-primary/5 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className={`w-12 h-12 bg-${feat.color}/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-${feat.color}/20`}>
                  <feat.icon className={`w-6 h-6 text-${feat.color}`} />
                </div>
                <h3 className="font-semibold text-base-content mb-2 text-lg">
                  {feat.label}
                </h3>
                <p className="text-base-content/70 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Stats ─── */}
        <div className="text-center mb-12">
          <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 inline-block w-full max-w-2xl">
            <div className="bg-base-100/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 dark:border-white/5 shadow-xl shadow-primary/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="px-4 py-3">
                  <div className="text-3xl font-bold text-base-content">10M+</div>
                  <div className="text-sm text-base-content/70 font-medium">Links Created</div>
                </div>
                <div className="px-4 py-3 border-t sm:border-t-0 sm:border-x border-base-300/40">
                  <div className="text-3xl font-bold text-base-content">99.9%</div>
                  <div className="text-sm text-base-content/70 font-medium">Uptime</div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-3xl font-bold text-base-content">&lt;100ms</div>
                  <div className="text-sm text-base-content/70 font-medium">Avg. Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 max-w-7xl mx-auto border-t border-base-300/40 backdrop-blur-sm mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-1.5 bg-gradient-to-r from-primary to-secondary rounded-lg">
              <LinkIcon className="w-4 h-4 text-primary-content" />
            </div>
            <span className="text-lg font-bold text-base-content">Shortly</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-base-content/70 text-sm">
              A backend-focused URL shortener project
            </p>
            <p className="text-base-content/60 text-sm mt-1">
              © {new Date().getFullYear()} Shortly • All links are anonymous and secure
            </p>
          </div>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
        input::placeholder {
          color: #6b7280;
          opacity: 0.8;
        }
        input:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        * {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .border-white\\/10 {
          border-color: rgba(255,255,255,0.1);
        }
        .dark .border-white\\/10 {
          border-color: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}

export default Home;