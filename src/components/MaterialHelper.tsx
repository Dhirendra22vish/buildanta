"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  AlertTriangle, 
  Loader2, 
  Building2, 
  CheckCircle, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  HardHat,
  ShieldCheck,
  HelpCircle
} from "lucide-react";

interface CheckItem {
  title: string;
  description: string;
  criticalWarning?: string;
}

interface ApiResponse {
  material: string;
  checks: CheckItem[];
  isMock?: boolean;
  mockReason?: string;
  error?: string;
  isConfigError?: boolean;
}

const POPULAR_MATERIALS = [
  "Cement",
  "TMT Bar (Steel)",
  "Morang Sand (Coarse)",
  "Red Clay Bricks",
  "Vitrified Tiles",
  "Plumbing PVC Pipes"
];

// Fun changing load messages to keep Kanpur homeowners engaged
const LOADING_STEPS = [
  "Connecting to Buildanta Kanpur network...",
  "Analyzing gangetic soil and weather profiles...",
  "Consulting local structural safety codes...",
  "Retrieving supplier quality checklists for Kanpur...",
  "Finalizing your 3-step inspection guide..."
];

export default function MaterialHelper() {
  const [material, setMaterial] = useState("");
  const [inputError, setInputError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<{ message: string; isConfig?: boolean } | null>(null);

  // Rotate loading steps while fetching
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2000);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const validateInput = (): boolean => {
    if (!material.trim()) {
      setInputError("Please enter a construction material (e.g. Cement, TMT Bar).");
      return false;
    }
    if (material.trim().length < 2) {
      setInputError("Material name must be at least 2 characters long.");
      return false;
    }
    setInputError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);
    setApiError(null);
    setResult(null);

    try {
      const response = await fetch("/api/material-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ material: material.trim() }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve information from the server.");
      }

      setResult(data);
    } catch (err: any) {
      console.error("Submission error:", err);
      // Check if it looks like a config error (missing OpenAI key)
      const isConfig = err.message.includes("OpenAI API Key") || err.message.includes("not configured");
      setApiError({
        message: err.message || "Something went wrong. Please check your connection and try again.",
        isConfig
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (selectedMaterial: string) => {
    setMaterial(selectedMaterial);
    setInputError("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Badge Indicator */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20 glow-indicator">
          <MapPin size={12} />
          Kanpur Localized Edition
        </span>
      </div>

      {/* Main Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 bg-clip-text text-transparent text-glow flex items-center justify-center gap-3">
          <HardHat className="text-amber-500 animate-bounce" size={40} />
          Buildanta
        </h1>
        <p className="text-xl md:text-2xl font-bold text-gray-200 mt-2">
          Material Quality procurement Helper
        </p>
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mt-2">
          First-time Kanpur homebuilders: Enter any construction material to receive 3 localized, safety-critical quality checks before you purchase.
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/15 to-transparent rounded-tr-2xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="material-input" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Building2 size={16} className="text-amber-400" />
              What material are you buying today?
            </label>
            <div className="relative flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="material-input"
                  type="text"
                  placeholder="e.g. Portland Pozzolan Cement, 8mm TMT Bar, Morang Sand..."
                  value={material}
                  onChange={(e) => {
                    setMaterial(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/80 border border-slate-700/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-gray-500 outline-none transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/15 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get Quality Checks
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            {inputError && (
              <p className="text-sm text-red-400 flex items-center gap-1.5 mt-1 font-medium">
                <AlertTriangle size={14} />
                {inputError}
              </p>
            )}
          </div>
        </form>

        {/* Popular Suggestions */}
        <div className="mt-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Try searching:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_MATERIALS.map((mat) => (
              <button
                key={mat}
                type="button"
                onClick={() => handleSuggestionClick(mat)}
                disabled={loading}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 text-gray-300 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-200 cursor-pointer"
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State UI */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          {/* Status Message */}
          <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-amber-500/20">
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin text-amber-500" size={20} />
              <span className="text-sm font-medium text-gray-200">{LOADING_STEPS[loadingStepIdx]}</span>
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 loading-dot" />
              <span className="w-2 h-2 rounded-full bg-amber-500 loading-dot" />
              <span className="w-2 h-2 rounded-full bg-amber-500 loading-dot" />
            </div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-6 h-64 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-6 w-12 bg-slate-800 rounded-md" />
                  <div className="h-5 w-3/4 bg-slate-800 rounded-md" />
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-slate-800 rounded-md" />
                    <div className="h-3 w-5/6 bg-slate-800 rounded-md" />
                    <div className="h-3 w-4/5 bg-slate-800 rounded-md" />
                  </div>
                </div>
                <div className="h-8 w-full bg-slate-800/50 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State Card */}
      {apiError && (
        <div className="glass-panel rounded-2xl p-6 md:p-8 border-red-500/20 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-bold text-red-400">Failed to Retrieve Advice</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{apiError.message}</p>

              {apiError.isConfig && (
                <div className="bg-slate-900/90 border border-slate-700/50 rounded-xl p-5 mt-4 text-xs text-gray-400 space-y-3">
                  <p className="font-bold text-gray-300 text-sm flex items-center gap-1.5">
                    <Sparkles className="text-amber-500" size={14} />
                    How to setup your environment variables:
                  </p>
                  <ol className="list-decimal pl-4 space-y-2 leading-relaxed">
                    <li>Create a file named <code className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">.env.local</code> in the root folder of this project.</li>
                    <li>Add your OpenAI API key inside the file:
                      <pre className="mt-1.5 p-2 rounded bg-slate-950 border border-slate-800 text-green-400 font-mono text-xs overflow-x-auto">
                        OPENAI_API_KEY=sk-proj-yourActualKeyHere...
                      </pre>
                    </li>
                    <li>Restart the development server (<code className="px-1 py-0.5 bg-slate-800 rounded font-mono">npm run dev</code>).</li>
                  </ol>
                  <p className="text-[10px] text-gray-500 italic mt-2">
                    Note: Your key is processed on the backend server route and is never shared or exposed to client browsers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Material Guide Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl px-6 py-5 border-amber-500/15">
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Inspection Guide</p>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mt-0.5">
                <ShieldCheck className="text-green-500" size={24} />
                Buying Checklist for: <span className="text-amber-400">{result.material}</span>
              </h2>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setMaterial("");
              }}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-xs font-semibold text-gray-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <RefreshCw size={12} />
              Clear & Search New
            </button>
          </div>

          {/* Mock / Fallback Mode Warning Banner */}
          {result.isMock && (
            <div className="glass-panel border-amber-500/20 rounded-xl p-4 bg-amber-500/5 text-amber-400 text-xs flex items-center gap-3 animate-fadeIn">
              <AlertTriangle className="flex-shrink-0 animate-pulse text-amber-500" size={18} />
              <div className="flex-1 leading-relaxed">
                <span className="font-bold text-amber-300">Offline Database Mode Active:</span> {result.mockReason || "OpenAI API quota limits reached. Displaying Buildanta regional structural guidelines."}
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.checks.map((check, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden"
              >
                {/* Visual Number Indicator */}
                <div className="absolute -top-3 -right-2 text-7xl font-black text-slate-800/15 pointer-events-none select-none font-mono">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-bold font-mono">
                    0{index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                    {check.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {check.description}
                  </p>
                </div>

                {/* Critical Warning / Tip Section */}
                {check.criticalWarning && (
                  <div className="mt-6 pt-4 border-t border-slate-800/60 local-tip-glow rounded-r-lg p-2.5 space-y-1 relative z-10">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-[11px] uppercase tracking-wider">
                      <AlertTriangle size={12} />
                      Kanpur Nagar Tip
                    </div>
                    <p className="text-xs text-gray-400 leading-normal italic">
                      &ldquo;{check.criticalWarning}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer Notice */}
          <div className="text-center py-4 text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <HelpCircle size={12} />
            Always verify procurement specifications with a certified civil engineer before final payment.
          </div>
        </div>
      )}
    </div>
  );
}
