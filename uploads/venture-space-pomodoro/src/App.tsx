import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Play, 
  Clock, 
  Globe, 
  Image as ImageIcon, 
  Movie as MovieIcon, 
  Lightbulb,
  SkipForward,
  RotateCcw,
  Pause
} from 'lucide-react';
import { usePomoLogic, DURATIONS } from './lib/pomoLogic';
import { FadingVideo } from './components/FadingVideo';
import { BlurText } from './components/BlurText';

export default function App() {
  const {
    mode,
    timeLeft,
    isRunning,
    cycle,
    activity,
    setActivity,
    stats,
    toggleTimer,
    resetTimer,
    skipPhase,
    switchMode,
    clearStats
  } = usePomoLogic();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="relative h-screen bg-black overflow-hidden flex flex-col">
        <FadingVideo 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
          style={{ width: "120%", height: "120%", opacity: 0.6 }}
        />

        {/* Navbar */}
        <nav className="fixed top-4 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between">
          <div className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center font-heading text-2xl lowercase italic">
            a
          </div>
          
          <div className="hidden lg:flex items-center gap-1.5 p-1.5 liquid-glass rounded-full">
            {['Home', 'Voyages', 'Worlds', 'Innovation', 'Plan Launch'].map((link) => (
              <button key={link} className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
                {link}
              </button>
            ))}
          </div>

          <button className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white/90 transition-all">
            Claim a Spot <ArrowUpRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Hero Content / Timer */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="liquid-glass rounded-full p-1 pl-1 flex items-center gap-3 pr-3 mb-6"
          >
            <span className="bg-white text-black px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider">ORBITING</span>
            <span className="text-xs text-white/80 uppercase tracking-widest">Phase 01: Deep Space Focus</span>
          </motion.div>

          <BlurText 
            text="Venture Past Our Sky Across the Universe" 
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl tracking-[-4px] mb-8"
          />

          {/* TIMER CORE */}
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, scale: 0.9 }}
            animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative mb-8"
          >
            <div 
              className="text-[8rem] md:text-[10rem] font-heading italic text-white leading-none tracking-[-8px] flex items-center justify-center tabular-nums"
              style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}
            >
              {minutes.toString().padStart(2, '0')}
              <span className="opacity-30 mx-2">:</span>
              {seconds.toString().padStart(2, '0')}
            </div>
            <p className="text-sm font-light opacity-60 tracking-[0.3em] uppercase mt-4 mb-8">Secure your trajectory</p>
            
            <div className="flex items-center justify-center gap-4 mt-4">
              {['focus', 'short', 'long'].map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all ${
                    mode === m 
                      ? 'bg-white text-black' 
                      : 'liquid-glass text-white/60 hover:text-white'
                  }`}
                >
                  {m === 'focus' ? 'Enfoque' : m === 'short' ? 'Pausa' : 'Descanso'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="flex items-center gap-6">
              <button 
                onClick={toggleTimer}
                className="liquid-glass-strong rounded-full px-10 py-4 text-sm font-semibold tracking-[0.2em] text-white flex items-center gap-3 transition-transform active:scale-95 group uppercase"
              >
                {isRunning ? (
                  <>PAUSE MISSION <Pause className="w-4 h-4 fill-white" /></>
                ) : (
                  <>INITIATE VOYAGE <Play className="w-4 h-4 fill-white" /></>
                )}
              </button>
              <div className="flex items-center gap-3">
                <button 
                  onClick={resetTimer}
                  className="w-11 h-11 liquid-glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button 
                  onClick={skipPhase}
                  className="w-11 h-11 liquid-glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full max-w-sm">
               <input 
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="¿En qué estás trabajando?"
                className="w-full bg-transparent border-b border-white/20 py-2 text-center text-lg font-light focus:border-white focus:outline-none transition-colors placeholder:text-white/20"
               />
               <div className="flex justify-center gap-2 mt-4">
                 {[0, 1, 2, 3].map((i) => (
                   <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      i < cycle ? 'bg-white scale-125 shadow-[0_0_8px_white]' : 'bg-white/20'
                    }`}
                   />
                 ))}
               </div>
            </div>
          </motion.div>

          {/* Partners row */}
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0 }}
            animate={{ filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-auto pb-12 w-full max-w-4xl"
          >
            <div className="flex flex-col items-center gap-6">
              <span className="liquid-glass rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
                Collaborating with top aerospace pioneers globally
              </span>
              <div className="flex flex-wrap justify-center gap-x-16 gap-y-4 font-heading text-3xl italic text-white/80">
                {['Aeon', 'Vela', 'Apex', 'Orbit', 'Zeno'].map(p => (
                  <span key={p} className="hover:text-white transition-colors cursor-default">{p}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: CAPABILITIES (Stats) */}
      <section className="relative min-h-screen bg-black overflow-hidden py-32 px-8 md:px-16 lg:px-24">
        <FadingVideo 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <header className="mb-24">
            <span className="text-sm font-light uppercase tracking-[0.3em] text-white/50 block mb-6">// Space Capabilities</span>
            <h2 className="font-heading italic text-white text-7xl md:text-8xl lg:text-[7rem] leading-[0.85] tracking-[-4px]">
              Production <br /> evolved
            </h2>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CARD 1: OVERALL STATS */}
            <div className="liquid-glass rounded-[2rem] p-8 flex flex-col min-h-[440px]">
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 liquid-glass rounded-xl flex items-center justify-center text-white">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {['Voyages', 'Global Sync', 'Quantum Data', 'Space Net'].map(t => (
                    <span key={t} className="liquid-glass rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-8">
                  <div className="text-[5rem] font-heading italic leading-none tracking-tight">{stats.total}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mt-1">Total Pomodoros</div>
                </div>
                <div className="mb-8">
                  <div className="text-[5rem] font-heading italic leading-none tracking-tight">{stats.focusMin}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mt-1">Focus Minutes</div>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                 <h3 className="font-heading italic text-3xl mb-2">Voyage Summary</h3>
                 <p className="text-sm font-light text-white/50 leading-relaxed max-w-[28ch]">
                   Detailed analytics of your deep-space focus sessions across the planetary systems.
                 </p>
              </div>
            </div>

            {/* CARD 2: WEEKLY CHART */}
            <div className="liquid-glass rounded-[2rem] p-8 flex flex-col min-h-[440px] lg:col-span-1">
               <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 liquid-glass rounded-xl flex items-center justify-center text-white">
                  <Clock className="w-6 h-6" />
                </div>
                <button 
                  onClick={clearStats}
                  className="text-[9px] font-bold uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors"
                >
                  Purge Data
                </button>
              </div>

              <div className="flex-1 group">
                <div className="h-64 flex items-end justify-between gap-2 px-2 mt-8">
                  {(() => {
                    const days = [];
                    const maxVal = Math.max(...Object.values(stats.days), 1);
                    for (let i = 6; i >= 0; i--) {
                      const d = new Date(); d.setDate(d.getDate() - i);
                      const key = d.toISOString().slice(0, 10);
                      const val = stats.days[key] || 0;
                      const label = d.toLocaleDateString('en-US', { weekday: 'short' })[0];
                      days.push({ val, label });
                    }
                    return days.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                        <div className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity mb-1">{d.val}</div>
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${(d.val / maxVal) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="w-full min-h-[4px] liquid-glass-strong rounded-full bg-white/20"
                        />
                        <span className="text-[10px] font-bold opacity-40">{d.label}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                 <h3 className="font-heading italic text-3xl mb-2">Planetary Chart</h3>
                 <p className="text-sm font-light text-white/50 leading-relaxed max-w-[28ch]">
                   Weekly focus intensity mapped across solar cycles and cosmic phases.
                 </p>
              </div>
            </div>

            {/* CARD 3: ACTIVITIES */}
            <div className="liquid-glass rounded-[2rem] p-8 flex flex-col min-h-[440px]">
               <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 liquid-glass rounded-xl flex items-center justify-center text-white">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {['Top Ops', 'Active Crew', 'Mission Ready'].map(t => (
                    <span key={t} className="liquid-glass rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 mt-4 scrollbar-hide">
                {Object.entries(stats.acts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([name, count]) => {
                    const maxV = Math.max(...Object.values(stats.acts), 1);
                    return (
                      <div key={name} className="space-y-2">
                        <div className="flex justify-between text-xs uppercase tracking-widest font-bold">
                          <span className="truncate max-w-[150px] opacity-80 italic font-heading text-sm">{name}</span>
                          <span className="tabular-nums opacity-40">{count} Units</span>
                        </div>
                        <div className="h-1 liquid-glass rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(count / maxV) * 100}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-white/40"
                          />
                        </div>
                      </div>
                    );
                  })}
                {Object.keys(stats.acts).length === 0 && (
                  <div className="h-full flex items-center justify-center text-sm font-light text-white/20 italic">
                    No active missions found...
                  </div>
                )}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                 <h3 className="font-heading italic text-3xl mb-2">Mission Log</h3>
                 <p className="text-sm font-light text-white/50 leading-relaxed max-w-[28ch]">
                   The core objectives and operational frequency of your current exploration.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Meta */}
      <footer className="bg-black py-12 px-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
          Venture Space Pomodoro &copy; 2026 // Exploration is limitless
        </p>
      </footer>
    </div>
  );
}
