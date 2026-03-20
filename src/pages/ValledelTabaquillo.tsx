import React, { useState, useRef, useEffect, ReactNode, useCallback, memo, useMemo } from "react"
import {
  MapPin, ArrowRight, ChevronLeft, ChevronRight,
  ShieldCheck, TreePine, Star, Waves,
  DollarSign, CalendarDays, BadgeCheck,
  X, Play, ZoomIn, Droplets,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import Map, { Marker } from "react-map-gl/mapbox"
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, TooltipProps,
} from "recharts"
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"

/* ─── TYPES ─────────────────────────────────────────────────── */
interface VideoItem  { src: string; label: string }
interface InfoCard   { icon: ReactNode; title: string; text: string }
interface FinancCard { icon: ReactNode; title: string; desc: string }
interface StatItem   { n: number; suffix: string; label: string }
interface ExpRow     { num: string; title: string; desc: string }
interface ChartDataPoint { año: string; valor: number }

/* ─── DEBOUNCE HOOK ─────────────────────────────────────────── */
function useDebounced<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

/* ─── SECTION REVEAL HOOK ───────────────────────────────────── */
function useSectionReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("in-view"); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

/* ─── GLOBAL STYLES ─────────────────────────────────────────── */
const FontStyleTab: React.FC = () => (
  <style>{`
    :root {
      --stone:       #8B7355;
      --stone-light: #C4A882;
      --stone-dark:  #5C4A2A;
      --cream:       #F7F4EF;
      --dark:        #1C1A16;
      --muted:       #8A8278;
      --border-tab:  rgba(139,115,85,0.22);
      --river:       #4A7C8E;
    }
    html, body { overflow-x: hidden; max-width: 100%; }
    *, *::before, *::after { box-sizing: border-box; }
    .font-display-tab { font-family: 'Cormorant Garamond', serif; }
    .font-body-tab    { font-family: 'Jost', sans-serif; }

    @keyframes fadeUpTab {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInTab {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scrollBounceTab {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(8px); }
    }

    .reveal-tab {
      opacity: 0;
      animation-fill-mode: both;
      animation-duration: 0.6s;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    .in-view .reveal-tab               { animation-name: fadeUpTab; }
    .reveal-tab[data-delay="1"]        { animation-delay: 0.08s; }
    .reveal-tab[data-delay="2"]        { animation-delay: 0.16s; }
    .reveal-tab[data-delay="3"]        { animation-delay: 0.24s; }
    .reveal-tab[data-delay="4"]        { animation-delay: 0.32s; }

    .hero-bg-tab { position: absolute; inset: 0; transform: translateZ(0); }
    .hero-bg-img-tab {
      position: absolute; inset: 0;
      background-image: url('https://imgur.com/zgiiUa6.jpg');
      background-size: cover; background-position: center 30%;
      will-change: transform;
      transform: translateZ(0);
    }

    input[type=range].premium-range-tab {
      -webkit-appearance: none; width: 100%; height: 4px;
      background: linear-gradient(
        to right, var(--stone) 0%, var(--stone) var(--val, 50%),
        rgba(139,115,85,0.2) var(--val, 50%), rgba(139,115,85,0.2) 100%
      );
      border-radius: 4px; outline: none;
    }
    input[type=range].premium-range-tab::-webkit-slider-thumb {
      -webkit-appearance: none; width: 22px; height: 22px;
      border-radius: 50%; background: var(--stone); border: 3px solid var(--cream);
      box-shadow: 0 0 0 1px var(--stone), 0 4px 12px rgba(139,115,85,0.4);
      cursor: pointer; transition: transform 0.15s;
    }
    input[type=range].premium-range-tab::-webkit-slider-thumb:hover { transform: scale(1.2); }
    input[type=range].premium-range-tab::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--stone); border: 3px solid var(--cream); cursor: pointer;
    }

    .stone-divider {
      width: 60px; height: 1px;
      background: linear-gradient(to right, transparent, var(--stone), transparent);
      margin: 0 auto;
    }
    .section-inner-tab { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 32px; }

    .sim-controls-grid-tab { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 40px; }
    .sim-results-grid-tab  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .stats-grid-tab        { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
    .info-cards-grid-tab   { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .exp-row-tab { display: flex; gap: 32px; align-items: flex-start; padding: 32px 0; text-align: left; }
    .exp-num-tab { font-size: 36px; flex-shrink: 0; }

    .vg-desktop-tab { display: flex; }
    .vg-mobile-tab  { display: none; }

    .info-card-tab {
      background: #fff; border: 1px solid var(--border-tab); border-radius: 20px; padding: 32px 24px;
      transition: box-shadow 0.3s ease, transform 0.3s ease; transform: translateZ(0);
    }
    .info-card-tab:hover { transform: translateY(-6px) translateZ(0); box-shadow: 0 24px 60px rgba(0,0,0,0.1); }
    .financ-card-tab {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(139,115,85,0.15);
      border-radius: 16px; padding: 28px 24px; transition: border-color 0.3s, background 0.3s;
    }
    .financ-card-tab:hover { border-color: rgba(139,115,85,0.4); background: rgba(139,115,85,0.06); }

    .render-grid-tab { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .render-item-tab {
      position: relative; border-radius: 12px; overflow: hidden;
      cursor: pointer; aspect-ratio: 4/3; background: #eee; contain: layout style paint;
    }
    .render-item-tab img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; transform: translateZ(0); }
    .render-item-tab:hover img { transform: scale(1.06) translateZ(0); }
    .render-overlay-tab { position: absolute; inset: 0; background: rgba(26,24,20,0); transition: background 0.3s; display: flex; align-items: center; justify-content: center; }
    .render-item-tab:hover .render-overlay-tab { background: rgba(26,24,20,0.38); }
    .render-zoom-tab { opacity: 0; transition: opacity 0.25s; }
    .render-item-tab:hover .render-zoom-tab { opacity: 1; }

    .lb-backdrop-tab {
      position: fixed; inset: 0; background: rgba(0,0,0,0.93);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
      padding: 24px; opacity: 0; pointer-events: none; transition: opacity 0.18s ease;
    }
    .lb-backdrop-tab.lb-open { opacity: 1; pointer-events: all; }
    .lb-img-tab { max-width: min(88vw, 1200px); max-height: 88vh; border-radius: 14px; object-fit: contain; box-shadow: 0 40px 120px rgba(0,0,0,0.8); display: block; }
    .lb-nav-tab { position: fixed; top: 50%; transform: translateY(-50%); width: 52px; height: 52px; border-radius: 50%; background: rgba(0,0,0,0.6); border: 1px solid rgba(139,115,85,0.35); color: var(--stone-light); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10001; }
    .lb-nav-tab:hover { background: rgba(139,115,85,0.25); border-color: var(--stone); }
    .lb-nav-tab.prev { left: 20px; }
    .lb-nav-tab.next { right: 20px; }
    .lb-close-tab { position: fixed; top: 20px; right: 20px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; z-index: 10001; }
    .lb-close-tab:hover { background: rgba(139,115,85,0.35); }

    .video-modal-inner-tab { position: relative; width: min(400px, 88vw); aspect-ratio: 9/16; border-radius: 24px; overflow: hidden; border: 1.5px solid rgba(139,115,85,0.3); box-shadow: 0 40px 120px rgba(0,0,0,0.8); }
    .scroll-line-tab { width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent); animation: scrollBounceTab 1.5s ease-in-out infinite; }

    /* Sector badges */
    .sector-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 20px; border-radius: 50px; font-family: 'Jost', sans-serif;
      font-size: 13px; font-weight: 500; letter-spacing: 0.05em;
    }
    .sector-I {
      background: rgba(92,74,42,0.12); border: 1px solid rgba(92,74,42,0.35); color: var(--stone-dark);
    }
    .sector-II {
      background: rgba(74,124,142,0.1); border: 1px solid rgba(74,124,142,0.35); color: var(--river);
    }

    @media (max-width: 768px) {
      .section-inner-tab { padding: 0 18px; }
      .stats-grid-tab    { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
      .hero-text-wrap-tab { padding: 0 18px !important; max-width: 100% !important; width: 100% !important; }
      .hero-title-tab     { font-size: clamp(60px, 16vw, 90px) !important; }
      .hero-badge-tab     { font-size: 10px !important; letter-spacing: 0.08em !important; }
      .hero-buttons-tab   { flex-direction: column !important; gap: 12px !important; }
      .hero-buttons-tab a { width: 100% !important; justify-content: center !important; }
      .sim-controls-grid-tab { grid-template-columns: 1fr !important; gap: 28px !important; }
      .sim-results-grid-tab  { grid-template-columns: 1fr !important; gap: 12px !important; }
      .sim-box-tab           { padding: 28px 18px !important; border-radius: 20px !important; }
      .exp-row-tab { gap: 16px !important; }
      .exp-num-tab { font-size: 22px !important; }
      .map-wrap-tab  { height: 260px !important; }
      .cta-inner-tab { padding: 44px 18px !important; }
      .map-tags-tab  { flex-wrap: wrap !important; justify-content: center !important; }
      .map-tag-tab   { font-size: 11px !important; padding: 6px 12px !important; }
      .vg-desktop-tab { display: none !important; }
      .vg-mobile-tab  { display: flex !important; }
      .render-grid-tab { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
      .render-item-tab { border-radius: 8px !important; }
      .lb-nav-tab      { display: none !important; }
      .sector-grid     { grid-template-columns: 1fr !important; }
    }
    @media (max-width: 400px) {
      .hero-title-tab { font-size: 52px !important; }
    }
  `}</style>
)

/* ─── RECHARTS TOOLTIP ──────────────────────────────────────── */
const CustomTooltipTab: React.FC<TooltipProps<ValueType, NameType>> = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "rgba(28,26,22,0.95)", border: "1px solid var(--stone)", borderRadius: 12, padding: "10px 16px", fontFamily: "'Jost',sans-serif", fontSize: 13, color: "#fff", maxWidth: 160 }}>
      <p style={{ color: "var(--stone-light)", marginBottom: 4 }}>{label}</p>
      <p>USD <strong>{Number(payload[0].value).toLocaleString()}</strong></p>
    </div>
  )
})

/* ─── VIDEO MODAL ───────────────────────────────────────────── */
const VideoModalTab: React.FC<{ video: VideoItem; onClose: () => void }> = memo(({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = videoRef.current
    if (v) { v.load(); v.play().catch(() => {}) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [video, onClose])
  return (
    <motion.div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
      <motion.div className="video-modal-inner-tab" initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
        <video ref={videoRef} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
          <source src={video.src} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 28, left: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--stone)" }} />
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.9)", letterSpacing: "0.09em", textTransform: "uppercase" }}>{video.label}</span>
        </div>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(139,115,85,0.4)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,115,85,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}>
          <X size={15} />
        </button>
      </motion.div>
    </motion.div>
  )
})

const videosTab: VideoItem[] = [
  { src: "/videos/tabaquillo1.mp4", label: "El río" },
  { src: "/videos/tabaquillo2.mp4", label: "Entorno serrano" },
  { src: "/videos/tabaquillo3.mp4", label: "Los lotes" },
]
type Direction = 1 | -1

const slideVariantsTab = {
  enter: (dir: Direction) => ({ x: dir > 0 ? 48 : -48, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir: Direction) => ({ x: dir > 0 ? -48 : 48, opacity: 0, scale: 0.97, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }),
}
const mobileVariantsTab = {
  enter: { opacity: 0, scale: 0.97 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
}

const VideoGalleryTab: React.FC = () => {
  const [active, setActive]         = useState(0)
  const [direction, setDirection]   = useState<Direction>(1)
  const [isPlaying, setIsPlaying]   = useState(true)
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null)
  const videoRef       = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const touchStartX    = useRef<number | null>(null)
  const headerRef      = useSectionReveal(0.2)

  useEffect(() => {
    ;[videoRef, mobileVideoRef].forEach((ref) => {
      const v = ref.current; if (!v) return
      v.load(); if (isPlaying) v.play().catch(() => {})
    })
  }, [active])

  const goTo = useCallback((idx: number, dir?: Direction) => {
    const resolved = dir ?? (idx > active ? 1 : -1)
    setDirection(resolved); setActive((idx + videosTab.length) % videosTab.length); setIsPlaying(true)
  }, [active])
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo])
  const next = useCallback(() => goTo(active + 1, 1),  [active, goTo])
  const togglePlay = useCallback(() => {
    ;[videoRef, mobileVideoRef].forEach((ref) => {
      const v = ref.current; if (!v) return
      if (v.paused) { v.play(); setIsPlaying(true) } else { v.pause(); setIsPlaying(false) }
    })
  }, [])
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 44) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  const VideoPlayer = ({ vref, isMobile = false }: { vref: React.RefObject<HTMLVideoElement>; isMobile?: boolean }) => (
    <AnimatePresence initial={false} custom={direction} mode="sync">
      <motion.div key={active} custom={direction} variants={isMobile ? mobileVariantsTab : slideVariantsTab} initial="enter" animate="center" exit="exit" style={{ position: "absolute", inset: 0 }}>
        <video ref={vref} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
          <source src={videosTab[active].src} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "42%", background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: isMobile ? 22 : 28, left: isMobile ? 16 : 22, right: isMobile ? 16 : 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--stone)", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? 10 : 11, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{videosTab[active].label}</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {videosTab.map((_, i) => (
              <div key={i} style={{ flex: i === active ? 2 : 1, height: 2, borderRadius: 2, background: i === active ? "var(--stone)" : "rgba(255,255,255,0.28)", transition: "flex 0.4s ease" }} />
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", top: isMobile ? 18 : 20, right: isMobile ? 14 : 18, fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 12 : 13, color: "rgba(255,255,255,0.4)" }}>
          <span style={{ color: "var(--stone-light)", fontSize: isMobile ? 15 : 17 }}>{active + 1}</span>/{videosTab.length}
        </div>
      </motion.div>
    </AnimatePresence>
  )

  const NavBtn = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
    <button onClick={onClick} style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,115,85,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--stone-light)", transition: "all 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,115,85,0.15)"; e.currentTarget.style.borderColor = "var(--stone)" }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(139,115,85,0.3)" }}>
      {children}
    </button>
  )

  return (
    <section style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 80%, rgba(139,115,85,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 20%, rgba(74,124,142,0.05) 0%, transparent 55%)", pointerEvents: "none", contain: "strict" }} />
      <div className="section-inner-tab" style={{ position: "relative", zIndex: 1 }}>
        <div ref={headerRef} style={{ textAlign: "center", marginBottom: 60 }}>
          <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Galería</p>
          <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff" }}>
            Valle del Tabaquillo en <em style={{ color: "var(--stone-light)" }}>movimiento</em>
          </h2>
          <div className="reveal-tab stone-divider" data-delay="2" style={{ marginTop: 20 }} />
        </div>

        {/* Desktop */}
        <div className="vg-desktop-tab" style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
          <NavBtn onClick={prev}><ChevronLeft size={20} /></NavBtn>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videosTab.map((v, i) => i < active ? <ThumbButtonTab key={i} video={v} index={i} active={active} onClick={() => goTo(i)} onOpenModal={() => setModalVideo(v)} /> : null)}
          </div>
          <div style={{ position: "relative", width: "min(320px, 42vw)", aspectRatio: "9/16", borderRadius: 24, overflow: "hidden", border: "1.5px solid rgba(139,115,85,0.25)", boxShadow: "0 0 0 1px rgba(139,115,85,0.08), 0 40px 100px rgba(0,0,0,0.7)", background: "#000", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 64, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.55)", zIndex: 10 }} />
            <VideoPlayer vref={videoRef} />
            <button onClick={(e) => { e.stopPropagation(); togglePlay() }} style={{ position: "absolute", bottom: 64, right: 16, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(139,115,85,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, color: "var(--stone)", transition: "all 0.2s" }}>
              {isPlaying ? <span style={{ fontSize: 12 }}>⏸</span> : <span style={{ fontSize: 12, paddingLeft: 2 }}>▶</span>}
            </button>
            <button onClick={() => setModalVideo(videosTab[active])} style={{ position: "absolute", bottom: 64, left: 16, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(139,115,85,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, color: "var(--stone)", transition: "all 0.2s" }}>
              <Play size={12} style={{ fill: "var(--stone)", marginLeft: 2 }} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videosTab.map((v, i) => i > active ? <ThumbButtonTab key={i} video={v} index={i} active={active} onClick={() => goTo(i)} onOpenModal={() => setModalVideo(v)} /> : null)}
          </div>
          <NavBtn onClick={next}><ChevronRight size={20} /></NavBtn>
        </div>
        <p className="vg-desktop-tab" style={{ justifyContent: "center", color: "rgba(255,255,255,0.18)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 20 }}>Clic en el video para pantalla completa</p>

        {/* Mobile */}
        <div className="vg-mobile-tab" style={{ flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: "min(280px, 72vw)", aspectRatio: "9/16", borderRadius: 22, overflow: "hidden", border: "1.5px solid rgba(139,115,85,0.25)", boxShadow: "0 28px 70px rgba(0,0,0,0.65)", background: "#000" }}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={togglePlay}>
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 56, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.5)", zIndex: 10 }} />
            <VideoPlayer vref={mobileVideoRef} isMobile />
            <AnimatePresence>
              {!isPlaying && (
                <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }} transition={{ duration: 0.15 }}
                  style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1.5px solid rgba(139,115,85,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, pointerEvents: "none" }}>
                  <span style={{ color: "var(--stone)", fontSize: 18, paddingLeft: 3 }}>▶</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={prev} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,115,85,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--stone-light)" }}><ChevronLeft size={15} /></button>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {videosTab.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{ width: i === active ? 22 : 7, height: 7, borderRadius: 4, background: i === active ? "var(--stone)" : "rgba(139,115,85,0.28)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.35s ease" }} />
              ))}
            </div>
            <button onClick={next} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,115,85,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--stone-light)" }}><ChevronRight size={15} /></button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: -4 }}>{videosTab[active].label}</p>
        </div>
      </div>
      <AnimatePresence>
        {modalVideo && <VideoModalTab video={modalVideo} onClose={() => setModalVideo(null)} />}
      </AnimatePresence>
    </section>
  )
}

/* ─── THUMBNAIL ─────────────────────────────────────────────── */
const ThumbButtonTab: React.FC<{ video: VideoItem; index: number; active: number; onClick: () => void; onOpenModal: () => void }> = memo(({ video, index, active, onClick, onOpenModal }) => {
  const isActive = index === active
  return (
    <button onClick={onClick} style={{ position: "relative", width: 100, aspectRatio: "9/16", borderRadius: 14, overflow: "hidden", border: isActive ? "2px solid var(--stone)" : "2px solid rgba(255,255,255,0.08)", background: "#111", cursor: "pointer", padding: 0, opacity: isActive ? 1 : 0.5, transition: "opacity 0.25s, border-color 0.25s, transform 0.2s ease", transform: "translateZ(0)", flexShrink: 0 }}
      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.04) translateZ(0)" } }}
      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.transform = "translateZ(0)" } }}>
      <video muted playsInline preload="none" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
        <source src={`${video.src}#t=0.5`} type="video/mp4" />
      </video>
      {isActive && <div style={{ position: "absolute", inset: 0, background: "rgba(139,115,85,0.1)" }} />}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} onClick={(e) => { e.stopPropagation(); onOpenModal() }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(139,115,85,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Play size={10} style={{ color: "var(--stone)", fill: "var(--stone)", marginLeft: 2 }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)", padding: "14px 6px 6px", fontFamily: "'Jost',sans-serif", fontSize: 8, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center" }}>{video.label}</div>
    </button>
  )
})

/* ─── RENDER GALLERY ─────────────────────────────────────────── */
const RENDERS_INITIAL_TAB = 8
const RenderGalleryTab: React.FC<{ renders: string[] }> = memo(({ renders }) => {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? renders : renders.slice(0, RENDERS_INITIAL_TAB)
  const isOpen  = lightbox !== null

  const closeLb = useCallback(() => setLightbox(null), [])
  const lbPrev  = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setLightbox((p) => p !== null ? (p - 1 + renders.length) % renders.length : 0) }, [renders.length])
  const lbNext  = useCallback((e: React.MouseEvent) => { e.stopPropagation(); setLightbox((p) => p !== null ? (p + 1) % renders.length : 0) }, [renders.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === "Escape") closeLb()
      if (e.key === "ArrowLeft")  setLightbox((p) => p !== null ? (p - 1 + renders.length) % renders.length : 0)
      if (e.key === "ArrowRight") setLightbox((p) => p !== null ? (p + 1) % renders.length : 0)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, renders.length, closeLb])

  return (
    <>
      <div className="render-grid-tab">
        {visible.map((src, i) => (
          <div key={src + i} className="render-item-tab" onClick={() => setLightbox(i)}>
            <img src={src} alt={`Foto ${i + 1}`} loading="lazy" decoding="async" />
            <div className="render-overlay-tab">
              <div className="render-zoom-tab" style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(139,115,85,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomIn size={15} color="var(--stone)" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {renders.length > RENDERS_INITIAL_TAB && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button onClick={() => setExpanded(!expanded)} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "transparent", border: "1px solid var(--border-tab)", borderRadius: 50, padding: "13px 30px", color: "var(--stone-dark)", fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "'Jost',sans-serif", transition: "all 0.25s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,115,85,0.08)"; e.currentTarget.style.borderColor = "var(--stone)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border-tab)" }}>
            {expanded ? <>Mostrar menos <ChevronRight size={13} style={{ transform: "rotate(-90deg)" }} /></> : <>Ver todas <span style={{ opacity: 0.5, fontSize: 12 }}>({renders.length})</span> <ChevronRight size={13} style={{ transform: "rotate(90deg)" }} /></>}
          </button>
        </div>
      )}
      <div className={`lb-backdrop-tab${isOpen ? " lb-open" : ""}`} onClick={closeLb}>
        <button className="lb-close-tab" onClick={closeLb}><X size={17} /></button>
        <button className="lb-nav-tab prev" onClick={lbPrev}><ChevronLeft size={22} /></button>
        {lightbox !== null && <img key={lightbox} className="lb-img-tab" src={renders[lightbox]} onClick={(e) => e.stopPropagation()} />}
        <button className="lb-nav-tab next" onClick={lbNext}><ChevronRight size={22} /></button>
        {lightbox !== null && (
          <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: "rgba(255,255,255,0.35)" }}>
            <span style={{ color: "var(--stone-light)", fontSize: 19 }}>{lightbox + 1}</span> / {renders.length}
          </div>
        )}
      </div>
    </>
  )
})

/* ─── MAIN ───────────────────────────────────────────────────── */
const ValledelTabaquillo: React.FC = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string

  const [investment, setInvestment] = useState(115000)
  const [years, setYears]           = useState(5)
  const debouncedInvestment         = useDebounced(investment, 120)
  const debouncedYears              = useDebounced(years, 120)

  const whatsappLink = "https://wa.me/5493515052474"
  const whatsappSector1 = `https://wa.me/5493515052474?text=${encodeURIComponent("Hola, me interesa el Valle del Tabaquillo Sector I (USD 135.000). ¿Pueden darme más información sobre disponibilidad, características del lote y formas de pago?")}`
  const whatsappSector2 = `https://wa.me/5493515052474?text=${encodeURIComponent("Hola, me interesa el Valle del Tabaquillo Sector II (USD 115.000). ¿Pueden darme más información sobre disponibilidad, características del lote y formas de pago?")}`
  const whatsappCTA     = `https://wa.me/5493515052474?text=${encodeURIComponent("Hola, me interesa Valle del Tabaquillo. Me gustaría recibir información sobre los lotes disponibles y las opciones de financiación.")}`

  // TODO: reemplazar con fotos reales del proyecto
  const renders: string[] = [
    "https://imgur.com/Dopfsjl.jpg",
    "https://imgur.com/2yTmyKE.jpg",
    "https://imgur.com/HYFsnFT.jpg",
    "https://imgur.com/zgiiUa6.jpg",
    "https://imgur.com/ZL4y7kV.jpg",
    "https://imgur.com/C2hQ89d.jpg",
    "https://imgur.com/6PbzvNz.jpg",
    "https://imgur.com/yOipAs2.jpg",
  ]

  // TODO: actualizar con coordenadas exactas de San Miguel de los Ríos
  const latitude  = -31.9200
  const longitude = -64.9300
  const minInv    = 115000
  const maxInv    = 135000
  const RATE      = 0.09
  const rangeVal  = ((investment - minInv) / (maxInv - minInv)) * 100

  const chartData: ChartDataPoint[] = useMemo(() =>
    Array.from({ length: debouncedYears + 1 }, (_, i) => ({
      año: i === 0 ? "Hoy" : `Año ${i}`,
      valor: Math.round(debouncedInvestment * Math.pow(1 + RATE, i)),
    })), [debouncedInvestment, debouncedYears])

  const finalValue = chartData[chartData.length - 1].valor
  const gain       = finalValue - debouncedInvestment

  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.25 })

  const handleInvestmentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setInvestment(Number(e.target.value)), [])
  const handleYearsChange      = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setYears(Number(e.target.value)), [])

  const infoRef     = useSectionReveal(0.15)
  const financRef   = useSectionReveal(0.1)
  const statsRevRef = useSectionReveal(0.2)
  const mapRef      = useSectionReveal(0.15)
  const rendersRef  = useSectionReveal(0.1)
  const simRef      = useSectionReveal(0.1)
  const expRef      = useSectionReveal(0.1)
  const ctaRef      = useSectionReveal(0.2)
  const sectorRef   = useSectionReveal(0.15)

  const infoCards: InfoCard[] = [
    { icon: <MapPin size={20} />,      title: "Ubicación privilegiada",    text: "A 1h30 de Córdoba, en un entorno serrano con acceso directo al río." },
    { icon: <Droplets size={20} />,    title: "Lotes frente al río",        text: "Terrenos con contacto real con la naturaleza y bajada directa al agua." },
    { icon: <ShieldCheck size={20} />, title: "Escritura garantizada",      text: "Todos los lotes cuentan con escritura, brindando seguridad y respaldo legal." },
    { icon: <TreePine size={20} />,    title: "Entorno en crecimiento",     text: "Zona en desarrollo con instalación de servicios en proceso." }
  ]

  const financCards: FinancCard[] = [
    { icon: <DollarSign size={20} />,  title: "Sin banco",              desc: "Operación directa, sin requisitos bancarios ni procesos complejos." },
    { icon: <CalendarDays size={20}/>, title: "Planes a medida",        desc: "Opciones de pago adaptadas a cada cliente, en pesos o dólares." },
    { icon: <BadgeCheck size={20} />,  title: "Inversión sólida",       desc: "Tierra con escritura en una zona con alto potencial de valorización." },
    { icon: <Star size={20} />,        title: "Uso inmediato",          desc: "Podés empezar a proyectar o construir desde el primer momento." },
  ]

  const stats: StatItem[] = [
    { n: 9,   suffix: "",    label: "Lotes disponibles" },
    { n: 90,  suffix: "min", label: "De Córdoba capital" },
    { n: 9,   suffix: "%",   label: "ROI anual estimado" },
    { n: 2,   suffix: "",    label: "Sectores con río" },
  ]

  const expRows: ExpRow[] = [
    { num: "01", title: "Asesoramiento sin presiones",  desc: "Un equipo dedicado te guía desde la consulta inicial hasta la escritura. Información transparente y sin compromisos." },
    { num: "02", title: "Financiamiento a medida",      desc: "Planes de pago adaptados a tu situación. Cuotas en pesos o dólares, con condiciones pensadas para que la inversión sea accesible." },
    { num: "03", title: "Tierra con escritura propia",  desc: "Todos los lotes cuentan con escritura. Desde la firma del boleto, el lote es tuyo. Seguridad real sobre un activo real." },
    { num: "04", title: "Naturaleza desde el primer día", desc: "Podés acceder al río, proyectar tu casa de descanso o simplemente disfrutar del entorno. El lote es tuyo para usar desde el primer momento." },
  ]

  return (
    <div className="font-body-tab page-root" style={{ background: "var(--cream)", color: "var(--dark)", overflowX: "hidden", width: "100%", position: "relative" }}>
      <FontStyleTab />

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-start", overflow: "hidden", paddingTop: 160 }}>
        <div className="hero-bg-tab">
          <div className="hero-bg-img-tab" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(28,26,22,0.82) 0%, rgba(28,26,22,0.45) 60%, transparent 100%)", contain: "strict" }} />
        </div>

        <motion.div
          className="hero-text-wrap-tab"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 2, maxWidth: 760, padding: "0 48px 80px", width: "100%" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-badge-tab"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,115,85,0.18)", border: "1px solid var(--stone)", borderRadius: 40, padding: "6px 16px", marginBottom: 28, color: "var(--stone-light)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}
          >
            <Waves size={10} /> San Miguel de los Ríos · Córdoba
          </motion.div>

          {/* Título principal */}
          <motion.h1
            className="font-display-tab hero-title-tab"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: "clamp(72px,11vw,148px)", fontWeight: 300, color: "#fff", lineHeight: 0.9, marginBottom: 28, letterSpacing: "-0.01em" }}
          >
            Valle del <span style={{ color: "var(--stone-light)" }}>Tabaquillo</span>
          </motion.h1>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(14px,2vw,18px)", lineHeight: 1.75, maxWidth: 500, marginBottom: 40, fontWeight: 300 }}
          >
            Tu lugar en la naturaleza, a solo 1 hora y 30 de Córdoba. Lotes frente al río en San Miguel de los Ríos, pensados para quienes buscan desconectar, invertir y construir en un entorno único.
          </motion.p>

          {/* Botones */}
          <motion.div
            className="hero-buttons-tab"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
          >
            <a href={whatsappLink} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--stone)", color: "#fff", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 8px 32px rgba(139,115,85,0.4)", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(139,115,85,0.55)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,115,85,0.4)" }}>
              Consultar lotes <ArrowRight size={16} />
            </a>
            <a href="#sectores"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 400, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}>
              Ver sectores y precios
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.15em", zIndex: 2 }}
        >
          <span style={{ textTransform: "uppercase" }}>Explorar</span>
          <div className="scroll-line-tab" />
        </motion.div>
      </section>

      {/* ══ INFO CARDS ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner-tab">
          <div ref={infoRef}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>El proyecto</p>
              <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
                Un entorno natural para<br /><em>vivir o invertir</em>
              </h2>
              <div className="reveal-tab stone-divider" data-delay="2" style={{ marginTop: 24 }} />
            </div>
            <div className="info-cards-grid-tab">
              {infoCards.map((item, i) => (
                <div key={i} className="info-card-tab reveal-tab" data-delay={String((i % 4) + 1) as "1"|"2"|"3"|"4"}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,115,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--stone)", marginBottom: 20 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTORES Y PRECIOS ══ */}
      <section id="sectores" className="section-pad" style={{ padding: "100px 0", background: "#fff" }}>
        <div className="section-inner-tab">
          <div ref={sectorRef}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Disponibilidad</p>
              <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>
                Dos sectores con acceso<br /><em>directo al río</em>
              </h2>
              <p className="reveal-tab" data-delay="2" style={{ color: "var(--muted)", fontSize: 15, maxWidth: 520, margin: "20px auto 0", lineHeight: 1.7 }}>
                Un desarrollo dividido en etapas, con vistas abiertas y conexión directa con el entorno natural.
              </p>
              <div className="reveal-tab stone-divider" data-delay="3" style={{ marginTop: 28 }} />
            </div>

            <div className="sector-grid reveal-tab" data-delay="2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

              {/* Sector I */}
              <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid var(--border-tab)", background: "var(--cream)" }}>
                <div style={{ padding: "12px 20px", background: "rgba(92,74,42,0.08)", borderBottom: "1px solid var(--border-tab)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="sector-badge sector-I">Valle del Tabaquillo I</span>
                </div>
                <div style={{ padding: "36px 32px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                    <span className="font-display-tab" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 300, color: "var(--stone-dark)", lineHeight: 1 }}>USD 135.000</span>
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>por lote · Lotes 1, 2 y 3</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                    {[
                      "3 lotes disponibles frente al río",
                      "Acceso directo y bajada al agua",
                      "Escritura garantizada",
                      "Posibilidad de construir de inmediato",
                    ].map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--dark)" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--stone)", flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <a href={whatsappSector1} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--stone-dark)", color: "#fff", padding: "14px 28px", borderRadius: 50, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "all 0.25s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "" }}>
                    Consultar Sector I <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Sector II */}
              <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(74,124,142,0.3)", background: "var(--cream)" }}>
                <div style={{ padding: "12px 20px", background: "rgba(74,124,142,0.08)", borderBottom: "1px solid rgba(74,124,142,0.2)", display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="sector-badge sector-II">Valle del Tabaquillo II</span>
                </div>
                <div style={{ padding: "36px 32px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                    <span className="font-display-tab" style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 300, color: "var(--river)", lineHeight: 1 }}>USD 115.000</span>
                  </div>
                  <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28 }}>por lote · 6 lotes disponibles</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
                    {[
                      "6 lotes en zona verde",
                      "Entorno natural con acceso al río",
                      "Escritura garantizada",
                      "Servicios en instalación",
                    ].map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--dark)" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--river)", flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <a href={whatsappSector2} target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--river)", color: "#fff", padding: "14px 28px", borderRadius: 50, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "all 0.25s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "" }}>
                    Consultar Sector II <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Nota de financiación directa */}
            <div className="reveal-tab" data-delay="3" style={{ marginTop: 28, padding: "20px 28px", borderRadius: 14, border: "1px solid var(--border-tab)", background: "rgba(139,115,85,0.05)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--stone)", flexShrink: 0 }} />
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: "var(--dark)" }}>Financiación directa y accesible.</strong> Sin banco, sin requisitos complejos. Accedé a tu lote con un proceso claro y directo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ IMAGEN DESTACADA ══ */}
      <div style={{ width: "100%", lineHeight: 0, overflow: "hidden" }}>
        <img
          src="https://imgur.com/9XelcLN.jpg"
          alt="Valle del Tabaquillo"
          style={{ width: "100%", maxHeight: 560, objectFit: "cover", objectPosition: "center", display: "block" }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* ══ FINANCIACIÓN ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 60% 50%, rgba(139,115,85,0.07) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(74,124,142,0.05) 0%, transparent 55%)", pointerEvents: "none", contain: "strict" }} />
        <div className="section-inner-tab" style={{ position: "relative", zIndex: 1 }}>
          <div ref={financRef}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr" }} className="financ-header-grid-tab">
              <style>{`@media (min-width: 769px) { .financ-header-grid-tab { grid-template-columns: 1fr 1fr !important; gap: 64px !important; align-items: end !important; } }`}</style>
              <div>
                <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Financiación propia</p>
                <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                  Invertí en tierra,<br /><em style={{ color: "var(--stone-light)" }}>de forma simple</em>
                </h2>
                <div className="reveal-tab stone-divider" data-delay="2" style={{ margin: "0 0 24px" }} />
                <p className="reveal-tab" data-delay="3" style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.8, maxWidth: 440 }}>
                  Accedé a tu lote sin intermediarios, con un proceso claro y directo. Una oportunidad para resguardar capital en un activo real y proyectar a largo plazo.
                </p>
              </div>
              <div className="reveal-tab" data-delay="2" style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 32 }}>
                <div style={{ borderLeft: "1px solid rgba(139,115,85,0.25)", paddingLeft: 32 }}>
                  <div className="font-display-tab" style={{ fontSize: "clamp(52px,7vw,88px)", fontWeight: 300, color: "var(--stone)", lineHeight: 0.9 }}>0%</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 10 }}>Interés para las primeras cuotas</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 72 }}>
              {financCards.map((item, i) => (
                <div key={i} className="financ-card-tab reveal-tab" data-delay={String(i + 1) as "1"|"2"|"3"|"4"}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(139,115,85,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--stone)", marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="reveal-tab" data-delay="1" style={{ marginTop: 48, padding: "28px 32px", borderRadius: 14, border: "1px solid rgba(139,115,85,0.2)", background: "rgba(139,115,85,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "clamp(14px,2vw,16px)", fontWeight: 500, marginBottom: 4 }}>¿Querés conocer tu plan de cuotas?</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Un asesor te arma una propuesta personalizada sin compromiso.</p>
              </div>
              <a href={whatsappLink} target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--stone)", color: "#fff", padding: "14px 28px", borderRadius: 50, fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 6px 24px rgba(139,115,85,0.35)", whiteSpace: "nowrap", flexShrink: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(139,115,85,0.5)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,115,85,0.35)" }}>
                Consultar financiación <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section ref={statsRef} className="section-pad" style={{ padding: "80px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(139,115,85,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(74,124,142,0.04) 0%, transparent 60%)", contain: "strict" }} />
        <div className="section-inner-tab" style={{ position: "relative", zIndex: 1 }}>
          <div ref={statsRevRef} className="stats-grid-tab">
            {stats.map((s, i) => (
              <div key={i} className="reveal-tab" data-delay={String(i + 1) as "1"|"2"|"3"|"4"}>
                <div className="font-display-tab" style={{ fontSize: "clamp(36px,4vw,64px)", fontWeight: 300, color: "var(--stone-light)", lineHeight: 1 }}>
                  {statsInView && <CountUp end={s.n} duration={1.8} />}{s.suffix}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAPA ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner-tab">
          <div ref={mapRef}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Ubicación</p>
              <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>San Miguel de los Ríos,<br /><em>Córdoba</em></h2>
            </div>
            <div className="reveal-tab" data-delay="2" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.15)", border: "1px solid var(--border-tab)" }}>
              <div className="map-wrap-tab" style={{ height: 480 }}>
                <Map mapboxAccessToken={mapboxToken} initialViewState={{ longitude, latitude, zoom: 13 }} mapStyle="mapbox://styles/mapbox/satellite-streets-v12" style={{ width: "100%", height: "100%" }}>
                  <Marker longitude={longitude} latitude={latitude} anchor="bottom">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "scrollBounceTab 2s ease-in-out infinite" }}>
                      <div style={{ background: "var(--stone)", color: "#fff", padding: "8px 16px", borderRadius: 40, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(139,115,85,0.5)", fontFamily: "'Jost',sans-serif" }}>Valle del Tabaquillo</div>
                      <div style={{ width: 2, height: 12, background: "var(--stone)" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--stone)" }} />
                    </div>
                  </Marker>
                </Map>
              </div>
            </div>
            <div className="map-tags-tab" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
              {[
                { icon: <MapPin size={13} />,    text: "San Miguel de los Ríos, Córdoba" },
                { icon: <Waves size={13} />,     text: "Lotes frente al río" },
                { icon: <TreePine size={13} />,  text: "1h30 de Córdoba capital" },
              ].map((tag, i) => (
                <span key={i} className="map-tag-tab" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(139,115,85,0.1)", border: "1px solid var(--border-tab)", borderRadius: 40, padding: "8px 14px", fontSize: 12, color: "var(--stone-dark)", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {tag.icon} {tag.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOTOS ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "#fff", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%" }}>
          <div ref={rendersRef}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>El entorno</p>
              <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Naturaleza que <em>enamora</em></h2>
              <p className="reveal-tab" data-delay="2" style={{ color: "var(--muted)", fontSize: 13, marginTop: 12 }}>Clic en cualquier imagen para verla en detalle</p>
            </div>
            <RenderGalleryTab renders={renders} />
          </div>
        </div>
      </section>

      {/* ══ VIDEO ══ */}
      <VideoGalleryTab />

      {/* ══ SIMULADOR ══ */}
      <section id="simulador" className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner-tab" style={{ maxWidth: 900 }}>
          <div ref={simRef}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Calculadora</p>
              <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Simulador de <em>inversión</em></h2>
            </div>
            <div className="reveal-tab sim-box-tab" data-delay="2" style={{ background: "#fff", border: "1px solid var(--border-tab)", borderRadius: 28, padding: "48px 40px", boxShadow: "0 30px 80px rgba(0,0,0,0.07)", width: "100%" }}>
              <div className="sim-controls-grid-tab">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Capital inicial</span>
                    <span className="font-display-tab" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>USD {investment.toLocaleString()}</span>
                  </div>
                  <input type="range" min={minInv} max={maxInv} step={1000} value={investment} onChange={handleInvestmentChange} className="premium-range-tab" style={{ "--val": `${rangeVal}%` } as React.CSSProperties} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                    <span>USD 115K</span><span>USD 135K</span>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Horizonte</span>
                    <span className="font-display-tab" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>{years} {years === 1 ? "año" : "años"}</span>
                  </div>
                  <input type="range" min={1} max={10} step={1} value={years} onChange={handleYearsChange} className="premium-range-tab" style={{ "--val": `${((years - 1) / 9) * 100}%` } as React.CSSProperties} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                    <span>1 año</span><span>10 años</span>
                  </div>
                </div>
              </div>
              <div className="sim-results-grid-tab" style={{ background: "rgba(139,115,85,0.06)", border: "1px solid var(--border-tab)", borderRadius: 16, padding: "24px 20px", marginBottom: 40 }}>
                {[
                  { label: "Inversión inicial",            value: `USD ${debouncedInvestment.toLocaleString()}`, color: "var(--dark)" },
                  { label: "Ganancia estimada",            value: `+USD ${gain.toLocaleString()}`,              color: "#16a34a" },
                  { label: `Valor en ${debouncedYears} años`, value: `USD ${finalValue.toLocaleString()}`,      color: "var(--stone-dark)" },
                ].map((r, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{r.label}</div>
                    <div className="font-display-tab" style={{ fontSize: "clamp(14px,3vw,20px)", fontWeight: 600, color: r.color, wordBreak: "break-word" }}>{r.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ width: "100%", overflow: "hidden" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="stoneGradTab" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B7355" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#8B7355" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="año" tick={{ fontSize: 10, fontFamily: "'Jost',sans-serif", fill: "#8A8278" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fontFamily: "'Jost',sans-serif", fill: "#8A8278" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} width={40} />
                    <Tooltip content={<CustomTooltipTab />} />
                    <Area type="monotone" dataKey="valor" stroke="#8B7355" strokeWidth={2.5} fill="url(#stoneGradTab)"
                      dot={{ fill: "#8B7355", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: "#8B7355", stroke: "#fff", strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 16, letterSpacing: "0.05em" }}>
                * Proyección basada en una tasa de valorización anual estimada del 9%. No constituye asesoramiento financiero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCIA ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(139,115,85,0.08) 0%, transparent 60%)", contain: "strict" }} />
        <div className="section-inner-tab" style={{ maxWidth: 900, position: "relative", zIndex: 1, textAlign: "center" }}>
          <div ref={expRef}>
            <p className="reveal-tab" style={{ color: "var(--stone)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Por qué elegirnos</p>
            <h2 className="reveal-tab font-display-tab" data-delay="1" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 60 }}>
              La experiencia<br /><em style={{ color: "var(--stone-light)" }}>Valle del Tabaquillo</em>
            </h2>
            <div style={{ display: "grid", gap: 2 }}>
              {expRows.map((item, i) => (
                <div key={i} className="exp-row-tab reveal-tab" data-delay={String(i + 1) as "1"|"2"|"3"|"4"} style={{ borderBottom: i < expRows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <span className="font-display-tab exp-num-tab" style={{ fontWeight: 300, color: "rgba(139,115,85,0.3)", lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{item.num}</span>
                  <div style={{ textAlign: "left", minWidth: 0 }}>
                    <h3 style={{ color: "#fff", fontSize: "clamp(14px,2.5vw,17px)", fontWeight: 500, marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(13px,2vw,14px)", lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}

export default ValledelTabaquillo