/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Target, 
  Megaphone, 
  Layers, 
  Image as ImageIcon, 
  Send, 
  Download, 
  RefreshCcw, 
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Plus
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import confetti from "canvas-confetti";
import { generateMarketingCampaign, MarketingBrief, AdCampaign } from "./services/geminiService";

export default function App() {
  const [brief, setBrief] = useState<MarketingBrief>({
    productName: "",
    description: "",
    targetAudience: "",
    tone: "Professional & Persuasive",
    platform: "Instagram",
    objective: "Lead Generation"
  });

  const [campaign, setCampaign] = useState<AdCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.productName || !brief.description) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateMarketingCampaign(brief);
      setCampaign(result);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00FF00", "#FFFFFF", "#000000"]
      });
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to generate campaign. Please check your AI Studio configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const tones = ["Professional & Persuasive", "Fun & Energetic", "Minimalist & Luxury", "Bold & Disruptive", "Friendly & Helpful"];
  const platforms: MarketingBrief["platform"][] = ["Instagram", "Facebook", "LinkedIn", "Twitter/X", "Google Ads", "Email Marketing"];

  return (
    <div className="min-h-screen bg-dark-bg text-[#D4D4D8] font-sans selection:bg-gold-premium selection:text-black">
      {/* Header */}
      <nav className="border-b border-dark-border px-6 py-4 flex items-center justify-between sticky top-0 bg-dark-bg/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-premium rounded-sm flex items-center justify-center">
            <Sparkles className="text-black w-5 h-5" />
          </div>
          <span className="font-serif text-xl tracking-wide italic text-white">Mkt.Elite</span>
        </div>
        <div className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest font-bold text-[#71717A]">
          <a href="#" className="text-gold-premium">Campaigns</a>
          <a href="#" className="hover:text-white transition-colors">Analytics</a>
          <a href="#" className="hover:text-white transition-colors">Studio</a>
        </div>
        <button className="flex items-center gap-2 text-xs bg-gold-premium text-black px-5 py-2 rounded-full font-bold hover:brightness-110 transition-all shadow-xl shadow-gold-premium/10">
          <Plus className="w-4 h-4" /> New Draft
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
        {/* Input Pane */}
        <div className="lg:col-span-4 space-y-8">
          <div className="space-y-2">
            <h1 className="text-5xl font-serif italic tracking-tight leading-none text-white">
              Create the <br/>
              <span className="text-gold-premium">Perfect Ad.</span>
            </h1>
            <p className="text-[#71717A] text-sm max-w-sm">
              Refining visuals and narratives for the world's most exclusive brands.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6 bg-dark-card p-8 border border-dark-border rounded-2xl relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-premium/5 blur-3xl rounded-full" />
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-gold-premium block mb-3">Product Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Neo-Caffeine Fuel"
                  className="w-full bg-dark-input border border-dark-border rounded-lg px-4 py-3 text-sm focus:border-gold-premium outline-none transition-colors text-white"
                  value={brief.productName}
                  onChange={e => setBrief({...brief, productName: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-3">Platform</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {platforms.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setBrief({...brief, platform: p})}
                      className={`text-[10px] px-3 py-2 border transition-all rounded-md ${brief.platform === p ? 'bg-gold-premium border-gold-premium text-black font-bold shadow-lg shadow-gold-premium/20' : 'border-dark-border hover:border-[#71717A] text-[#71717A]'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-3">Target Audience</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Urban professionals, age 25-40"
                  className="w-full bg-dark-input border border-dark-border rounded-lg px-4 py-3 text-sm focus:border-gold-premium outline-none transition-colors text-white placeholder:text-[#52525B]"
                  value={brief.targetAudience}
                  onChange={e => setBrief({...brief, targetAudience: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-3">Product Description</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="What makes your product special?"
                  className="w-full bg-dark-input border border-dark-border rounded-lg p-4 text-sm focus:border-gold-premium outline-none transition-colors resize-none text-white"
                  value={brief.description}
                  onChange={e => setBrief({...brief, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-3">Creative Tone</label>
                  <select 
                    className="w-full bg-dark-input border border-dark-border p-3 text-xs outline-none focus:border-gold-premium rounded-lg text-white"
                    value={brief.tone}
                    onChange={e => setBrief({...brief, tone: e.target.value})}
                  >
                    {tones.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-3">Objective</label>
                  <select 
                    className="w-full bg-dark-input border border-dark-border p-3 text-xs outline-none focus:border-gold-premium rounded-lg text-white"
                    value={brief.objective}
                    onChange={e => setBrief({...brief, objective: e.target.value})}
                  >
                    <option>Brand Awareness</option>
                    <option>Lead Generation</option>
                    <option>Direct Sales</option>
                    <option>Event Sign-up</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 mt-8 bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#E4E4E7] transition-all disabled:opacity-50 rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Brief...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Generate Propostas
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2 rounded-lg">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </form>
        </div>

        {/* Results Pane */}
        <div className="lg:col-span-8" ref={resultsRef}>
          <AnimatePresence mode="wait">
            {!campaign ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[500px] border border-dark-border rounded-3xl bg-dark-card/50 flex flex-col items-center justify-center text-center p-12 space-y-4"
              >
                <div className="w-20 h-20 bg-dark-bg rounded-2xl border border-dark-border flex items-center justify-center shadow-inner">
                  <Megaphone className="text-[#52525B] w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif italic text-white tracking-wide">Refining Narrative</h3>
                  <p className="text-[#71717A] text-sm max-w-xs">Fill out the brief to start generating sophisticated marketing concepts.</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <div className="px-4 py-1.5 bg-[#121212] rounded-full text-[10px] uppercase font-bold tracking-widest text-gold-premium border border-dark-border">Elite Tier</div>
                  <div className="px-4 py-1.5 bg-[#121212] rounded-full text-[10px] uppercase font-bold tracking-widest text-[#71717A] border border-dark-border">Visual Asset AI</div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                key="results"
                className="space-y-8"
              >
                {/* Final Campaign Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-gold-premium text-black px-2 py-0.5 rounded-sm uppercase tracking-widest inline-block mb-2">Campaign Draft v1.0</span>
                    <h2 className="text-4xl font-serif italic text-white tracking-tight">{brief.platform} Strategy</h2>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-dark-card rounded-xl hover:text-white transition-colors border border-dark-border text-[#71717A]">
                      <Download className="w-5 h-5" />
                    </button>
                    <button onClick={handleGenerate} className="p-3 bg-gold-premium rounded-xl hover:brightness-110 transition-all border border-gold-premium text-black shadow-lg shadow-gold-premium/20">
                      <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Hero Layout */}
                <div className="grid md:grid-cols-12 gap-6">
                  {/* Headline Card */}
                  <div className="md:col-span-8 bg-dark-card p-10 border border-dark-border rounded-2xl relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-premium" />
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gold-premium block mb-6">Primary Narrative</label>
                    <h3 className="text-4xl font-serif italic text-white leading-tight group-hover:text-gold-premium transition-colors">
                      {campaign.headline}
                    </h3>
                  </div>

                  {/* Strategy Card - More Sidebar Style */}
                  <div className="md:col-span-4 bg-dark-surface p-8 border border-dark-border rounded-2xl flex flex-col justify-between shadow-xl">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-4">The Logic</label>
                      <p className="text-xs font-medium leading-relaxed italic text-[#D4D4D8]">
                        "{campaign.strategy}"
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-dark-border flex items-center gap-2 text-[10px] font-bold uppercase text-gold-premium tracking-widest">
                      <Target className="w-4 h-4" /> Verified Strategy
                    </div>
                  </div>
                </div>

                {/* Body Copy Section */}
                <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
                  <div className="px-8 py-4 border-b border-dark-border bg-dark-surface/50 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#71717A]">Copywriting Suite</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-premium"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-dark-border"></div>
                    </div>
                  </div>
                  <div className="p-10 space-y-8">
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-[#D4D4D8] prose-p:font-medium">
                      <ReactMarkdown>{campaign.bodyCopy}</ReactMarkdown>
                    </div>
                    
                    <div className="pt-8 border-t border-dark-border flex flex-wrap gap-10 items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gold-premium block mb-4">Call to Action</span>
                        <button className="px-8 py-3 border border-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all group">
                          {campaign.cta} <ChevronRight className="inline w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-4">Target Reach</span>
                        <div className="flex flex-wrap gap-3">
                          {campaign.hashtags.map(h => (
                            <span key={h} className="text-[10px] text-[#52525B] font-mono font-bold px-2 py-1 bg-dark-bg border border-dark-border rounded">#{h.replace('#', '')}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Concept */}
                <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-dark-bg border border-dark-border rounded-lg">
                      <ImageIcon className="text-gold-premium w-5 h-5" />
                    </div>
                    <h4 className="text-xs uppercase font-bold tracking-widest text-white">Visual Art Direction</h4>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3 aspect-[3/4] bg-dark-bg border border-dark-border rounded-xl relative overflow-hidden shadow-inner flex items-center justify-center">
                       <div className="absolute inset-0 bg-gradient-to-b from-dark-card via-transparent to-black opacity-60"></div>
                       <Sparkles className="w-12 h-12 text-[#1F1F1F]" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-[#71717A] block mb-4">AI Asset Generation Prompt</label>
                        <div className="bg-dark-bg border border-dark-border p-6 rounded-xl text-xs font-mono text-[#71717A] italic leading-relaxed relative group shadow-inner">
                          <button 
                            className="absolute top-4 right-4 p-2 bg-dark-card rounded-lg border border-dark-border opacity-0 group-hover:opacity-100 transition-all hover:text-gold-premium"
                            title="Copy Prompt"
                            onClick={() => {
                              navigator.clipboard.writeText(campaign.imagePrompt);
                              alert("Visual prompt copied to clipboard!");
                            }}
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          {campaign.imagePrompt}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#52525B]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-premium" /> Ultra-HD Textures
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#52525B]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-premium" /> Neutral Palettes
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#52525B]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-premium" /> Luxury Framing
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#52525B]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-premium" /> Studio Lighting
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Insight */}
                <div className="flex items-center gap-5 p-6 bg-gold-premium/5 border border-gold-premium/10 rounded-2xl shadow-lg">
                  <div className="p-3 bg-dark-bg rounded-xl border border-dark-border">
                    <Lightbulb className="text-gold-premium w-6 h-6" />
                  </div>
                  <p className="text-[12px] text-[#71717A] italic leading-relaxed">
                    <span className="text-gold-premium font-bold uppercase not-italic tracking-widest mr-2">Creative Note:</span> 
                    This {brief.platform} narrative is engineered for {brief.objective}. The use of high-contrast serif typography in the visual mockup will amplify the perceived value for the {brief.targetAudience} segment.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-20 border-t border-dark-border py-16 px-6 bg-dark-surface/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gold-premium rounded-md flex items-center justify-center text-black font-bold">M</div>
              <h2 className="text-2xl font-serif italic text-white tracking-wide">Mkt.Elite</h2>
            </div>
            <p className="text-[10px] text-[#52525B] uppercase tracking-[0.5em] leading-loose">
              Refining Digital Narratives.<br/>
              Exclusive for Luxury Portfolios.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase text-gold-premium tracking-widest block">The Studio</span>
              <ul className="text-xs space-y-3 font-medium text-[#71717A]">
                <li className="hover:text-white cursor-pointer transition-colors">Visionary Logic</li>
                <li className="hover:text-white cursor-pointer transition-colors">Asset Vault</li>
                <li className="hover:text-white cursor-pointer transition-colors">Craftsmanship</li>
              </ul>
            </div>
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase text-[#71717A] tracking-widest block">Collaborate</span>
              <ul className="text-xs space-y-3 font-medium text-[#71717A]">
                <li className="hover:text-white cursor-pointer transition-colors">Inquire</li>
                <li className="hover:text-white cursor-pointer transition-colors">Methodology</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-dark-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#262626]">
          <span>© 2026 Mkt.Elite Creative Engine</span>
          <span>EST. LONDON / PARIS / TOKYO</span>
        </div>
      </footer>
    </div>
  );
}
