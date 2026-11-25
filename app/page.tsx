"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const MedicalVoiceAgentLanding: React.FC = () => {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const specialists = [
    { icon: "🫀", name: "Cardiologist", desc: "Heart & cardiovascular" },
    { icon: "🧠", name: "Neurologist", desc: "Brain & nervous system" },
    { icon: "🦷", name: "Dentist", desc: "Oral health & hygiene" },
    { icon: "👁️", name: "Ophthalmologist", desc: "Eyes & vision" },
    { icon: "🩺", name: "General Physician", desc: "Everyday health" },
    { icon: "🧬", name: "Dermatologist", desc: "Skin, hair & nails" },
  ];

  const steps = [
    { step: "01", title: "Choose Your Specialist", desc: "Pick from 10+ AI medical specialists trained for your specific health concern.", icon: "🩺" },
    { step: "02", title: "Start Voice Consultation", desc: "Speak naturally — describe your symptoms just like talking to a real doctor.", icon: "🎙️" },
    { step: "03", title: "Get Instant Report", desc: "Receive a detailed AI-generated medical report with recommendations instantly.", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-[#020818] text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#020818]/90 backdrop-blur-xl border-b border-white/5 py-3' : 'py-5'}`}>
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-60" />
              <div className="relative bg-linear-to-br from-blue-400 to-blue-700 p-2.5 rounded-xl text-xl">🎙️</div>
            </div>
            <span className="text-xl font-black tracking-tight">Med<span className="text-blue-400">Doc</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Specialists', 'How it Works'].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-400 hover:text-white font-medium transition-colors duration-200">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link href="/sign-in">
                  <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="relative group rounded-xl overflow-hidden px-5 py-2.5 text-sm font-bold">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:scale-105" />
                    <span className="relative">Get Started Free</span>
                  </button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <UserButton />
                <Link href="/dashboard">
                  <button className="relative group rounded-xl overflow-hidden px-5 py-2.5 text-sm font-bold">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-300 group-hover:scale-105" />
                    <span className="relative">Dashboard →</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-150 w-150 rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-125 w-125 rounded-full bg-cyan-500/15 blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 h-100 w-100 rounded-full bg-indigo-600/10 blur-[80px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[72px_72px]" />

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-8 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
              <span className="h-2 w-2 rounded-full bg-green-400 absolute" />
              AI Doctors Available Now · No Waiting Room
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-none tracking-tight">
              <span className="text-white">Your AI</span>
              <br />
              <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Medical
              </span>
              <br />
              <span className="text-white">Doctor</span>
              <br />
              <span className="text-gray-500 text-5xl font-bold">is Online.</span>
            </h1>

            <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-lg">
              Skip the waiting room. Talk to an AI specialist 24/7 — describe your symptoms, get diagnosed, and receive a full medical report in minutes.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={user ? "/dashboard" : "/sign-up"}>
                <button className="group relative rounded-2xl overflow-hidden px-8 py-4 text-base font-bold text-white shadow-2xl shadow-blue-500/25">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-blue-400 to-cyan-400" />
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    🎙️ Start Free Consultation
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </span>
                </button>
              </Link>
             
            </div>

          </div>

          {/* Right — Floating Card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/40 to-cyan-400/20 rounded-3xl blur-3xl scale-110" />

              {/* Main image card */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://cdn.prod.website-files.com/621de55357719363b658d18c/6826713034a5bb9859c31d6c_ChatGPT%20Image%20May%2015%2C%202025%2C%2003_56_20%20PM.png"
                  alt="AI Medical Voice Agent"
                  className="h-105 w-95 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020818] via-transparent to-transparent" />
              </div>

              {/* Floating badge — top left */}
              <div className="absolute -top-4 -left-4 bg-linear-to-br from-green-400 to-emerald-600 rounded-2xl p-4 shadow-xl shadow-green-500/25 border border-green-300/20">
                <div className="text-2xl">🟢</div>
                <p className="text-white text-xs font-bold mt-1">Live Now</p>
              </div>

              {/* Floating card — bottom */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[320px] bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-xl shadow-lg">🩺</div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">AI Doctor is Ready</p>
                    <p className="text-gray-400 text-xs">Analyzing symptoms in real-time</p>
                    <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-linear-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat — right */}
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/10 shadow-xl text-center">
                <p className="text-3xl font-black text-white">98%</p>
                <p className="text-gray-400 text-xs mt-1">Accuracy<br />Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <p className="text-xs uppercase tracking-widest">Scroll to explore</p>
          <div className="h-10 w-6 rounded-full border border-gray-700 flex items-start justify-center p-1.5">
            <div className="h-2 w-1 rounded-full bg-blue-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/5 bg-white/3">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          <div className="flex items-center justify-center gap-24">
            {[
              
              { value: '24/7', label: 'Available', icon: '⚡' },
              { value: '10+', label: 'Specialists', icon: '🧬' },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-4xl font-black bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialists ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">Specialist Agents</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Choose Your <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Expert</span>
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
            10+ AI specialists trained on millions of medical records to give you accurate guidance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {specialists.map((s) => (
            <div key={s.name} className="group relative rounded-2xl border border-white/5 bg-white/3 p-6 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="text-white font-bold text-lg">{s.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Consult Now <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-950/30 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black">
              How It <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-px bg-linear-to-r from-blue-500/50 to-transparent z-10 -translate-y-1/2" />
                )}
                <div className="group relative rounded-2xl border border-white/5 bg-white/3 p-8 hover:border-blue-500/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-md" />
                      <div className="relative h-14 w-14 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg">
                        {step.icon}
                      </div>
                    </div>
                    <span className="text-5xl font-black text-white/5">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800" />
          <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />

          <div className="relative px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-100 mb-8">
              🎙️ No appointment needed
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white max-w-3xl mx-auto leading-tight">
              Talk to a Doctor.<br />
              <span className="text-cyan-300">Right Now.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-blue-100 text-lg">
              No waiting rooms, no appointments. Just instant, AI-powered medical guidance whenever you need it.
            </p>
            <Link href={user ? "/dashboard" : "/sign-up"}>
              <button className="mt-10 group relative rounded-2xl overflow-hidden px-10 py-5 text-lg font-black text-blue-800 shadow-2xl shadow-black/30">
                <div className="absolute inset-0 bg-white" />
                <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  🎙️ Start Free Consultation
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </span>
              </button>
            </Link>
            <p className="mt-4 text-blue-200 text-sm">Free forever · No credit card required</p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5">
  <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-linear-to-br from-blue-400 to-blue-700 p-1.5 rounded-lg text-sm">🎙️</div>
      <span className="font-black text-white">Med<span className="text-blue-400">Doc</span></span>
    </div>
    <p className="text-sm text-gray-600">MedDoc AI...</p>
  </div>
</footer>

    </div>
  );
};

export default MedicalVoiceAgentLanding;