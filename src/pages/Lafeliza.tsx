import React, { useState, useRef, useEffect, ReactNode, useCallback, memo, useMemo } from "react"
import {
  MapPin, ArrowRight, ChevronLeft, ChevronRight,
  ShieldCheck, TreePine, Star, Sun, Waves,
  DollarSign, CalendarDays, BadgeCheck, Percent,
  X, Play, ZoomIn,
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

/* ─── DEBOUNCE HOOK ──────────────────────────────────────────
   Evita que el gráfico Recharts redibuje en cada píxel del slider
─────────────────────────────────────────────────────────────── */
function useDebounced<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

/* ─── SECTION REVEAL HOOK ────────────────────────────────────
   Un único IntersectionObserver por sección.
   Agrega .in-view al contenedor; CSS maneja stagger con animation-delay.
─────────────────────────────────────────────────────────────── */
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
const FontStyle: React.FC = () => (
  <style>{`
    :root {
      --gold:       #C9A96E;
      --gold-light: #E8D5B0;
      --gold-dark:  #A07840;
      --cream:      #FAF8F4;
      --dark:       #1A1814;
      --muted:      #8A8278;
      --border:     rgba(201,169,110,0.2);
    }
    html, body { overflow-x: hidden; max-width: 100%; }
    *, *::before, *::after { box-sizing: border-box; }
    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body    { font-family: 'Jost', sans-serif; }
    .font-pinyon  { font-family: 'Pinyon Script', cursive; font-weight: 400; }

    /* ══ CSS SCROLL REVEAL ══
       Un @keyframes reutilizado por toda la página.
       .reveal: invisible por defecto.
       .in-view .reveal: arranca la animación.
       data-delay controla el stagger.
    ══════════════════════════════════════════════════════════ */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scrollBounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(8px); }
    }

    .reveal {
      opacity: 0;
      animation-fill-mode: both;
      animation-duration: 0.6s;
      animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    .in-view .reveal               { animation-name: fadeUp; }
    .reveal[data-delay="1"]        { animation-delay: 0.08s; }
    .reveal[data-delay="2"]        { animation-delay: 0.16s; }
    .reveal[data-delay="3"]        { animation-delay: 0.24s; }
    .reveal[data-delay="4"]        { animation-delay: 0.32s; }
    .reveal-fade                   { opacity: 0; animation-fill-mode: both; animation-duration: 0.55s; }
    .in-view .reveal-fade          { animation-name: fadeIn; }

    /* ── HERO ── */
    .hero-bg { position: absolute; inset: 0; transform: translateZ(0); }
    .hero-bg-img {
      position: absolute; inset: 0;
      background-image: url('https://imgur.com/pgVMN5C.jpg');
      background-size: cover; background-position: center;
      will-change: transform;
      transform: translateZ(0);
    }

    /* ── RANGE ── */
    input[type=range].premium-range {
      -webkit-appearance: none; width: 100%; height: 4px;
      background: linear-gradient(
        to right, var(--gold) 0%, var(--gold) var(--val, 50%),
        rgba(201,169,110,0.2) var(--val, 50%), rgba(201,169,110,0.2) 100%
      );
      border-radius: 4px; outline: none;
    }
    input[type=range].premium-range::-webkit-slider-thumb {
      -webkit-appearance: none; width: 22px; height: 22px;
      border-radius: 50%; background: var(--gold); border: 3px solid var(--cream);
      box-shadow: 0 0 0 1px var(--gold), 0 4px 12px rgba(201,169,110,0.4);
      cursor: pointer; transition: transform 0.15s;
    }
    input[type=range].premium-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
    input[type=range].premium-range::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--gold); border: 3px solid var(--cream); cursor: pointer;
    }

    /* ── LAYOUT ── */
    .gold-divider {
      width: 60px; height: 1px;
      background: linear-gradient(to right, transparent, var(--gold), transparent);
      margin: 0 auto;
    }
    .section-inner { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 32px; }

    /* ── GRIDS ── */
    .sim-controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 40px; }
    .sim-results-grid  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .stats-grid        { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
    .info-cards-grid   { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .exp-row { display: flex; gap: 32px; align-items: flex-start; padding: 32px 0; text-align: left; }
    .exp-num { font-size: 36px; flex-shrink: 0; }

    /* ── VIDEO ── */
    .vg-desktop { display: flex; }
    .vg-mobile  { display: none; }

    /* ── CARD HOVER: CSS-only ── */
    .info-card {
      background: #fff; border: 1px solid var(--border); border-radius: 20px; padding: 32px 24px;
      transition: box-shadow 0.3s ease, transform 0.3s ease; transform: translateZ(0);
    }
    .info-card:hover { transform: translateY(-6px) translateZ(0); box-shadow: 0 24px 60px rgba(0,0,0,0.1); }
    .financ-card {
      background: rgba(255,255,255,0.04); border: 1px solid rgba(201,169,110,0.15);
      border-radius: 16px; padding: 28px 24px; transition: border-color 0.3s, background 0.3s;
    }
    .financ-card:hover { border-color: rgba(201,169,110,0.4); background: rgba(201,169,110,0.06); }

    /* ── RENDER GALLERY ── */
    .render-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .render-item {
      position: relative; border-radius: 12px; overflow: hidden;
      cursor: pointer; aspect-ratio: 4/3; background: #eee; contain: layout style paint;
    }
    .render-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; transform: translateZ(0); will-change: transform; }
    .render-item:hover img { transform: scale(1.06) translateZ(0); }
    .render-overlay { position: absolute; inset: 0; background: rgba(26,24,20,0); transition: background 0.3s; display: flex; align-items: center; justify-content: center; }
    .render-item:hover .render-overlay { background: rgba(26,24,20,0.38); }
    .render-zoom { opacity: 0; transition: opacity 0.25s; }
    .render-item:hover .render-zoom { opacity: 1; }

    /* ── LIGHTBOX: CSS transition sin AnimatePresence ── */
    .lb-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.93);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
      padding: 24px; opacity: 0; pointer-events: none; transition: opacity 0.18s ease;
    }
    .lb-backdrop.lb-open { opacity: 1; pointer-events: all; }
    .lb-img { max-width: min(88vw, 1200px); max-height: 88vh; border-radius: 14px; object-fit: contain; box-shadow: 0 40px 120px rgba(0,0,0,0.8); display: block; }
    .lb-nav { position: fixed; top: 50%; transform: translateY(-50%); width: 52px; height: 52px; border-radius: 50%; background: rgba(0,0,0,0.6); border: 1px solid rgba(201,169,110,0.35); color: var(--gold-light); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; z-index: 10001; }
    .lb-nav:hover { background: rgba(201,169,110,0.25); border-color: var(--gold); }
    .lb-nav.prev { left: 20px; }
    .lb-nav.next { right: 20px; }
    .lb-close { position: fixed; top: 20px; right: 20px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; z-index: 10001; }
    .lb-close:hover { background: rgba(201,169,110,0.35); }

    /* ── VIDEO MODAL ── */
    .video-modal-inner { position: relative; width: min(400px, 88vw); aspect-ratio: 9/16; border-radius: 24px; overflow: hidden; border: 1.5px solid rgba(201,169,110,0.3); box-shadow: 0 40px 120px rgba(0,0,0,0.8); }
    .vg-thumb:hover .vg-thumb-overlay { opacity: 1 !important; }
    .scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent); animation: scrollBounce 1.5s ease-in-out infinite; }

    /* ════ MOBILE ════ */
    @media (max-width: 768px) {
      .page-root { overflow-x: hidden; width: 100%; }
      .page-root * { max-width: 100%; }
      .section-inner { padding: 0 18px; }
      .section-pad   { padding: 64px 0 !important; }
      .stats-grid    { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
      .hero-text-wrap { padding: 0 18px !important; max-width: 100% !important; width: 100% !important; }
      .hero-title     { font-size: clamp(72px, 18vw, 100px) !important; }
      .hero-badge     { font-size: 10px !important; letter-spacing: 0.08em !important; }
      .hero-buttons   { flex-direction: column !important; gap: 12px !important; }
      .hero-buttons a { width: 100% !important; justify-content: center !important; }
      .sim-controls-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
      .sim-results-grid  { grid-template-columns: 1fr !important; gap: 12px !important; }
      .sim-box           { padding: 28px 18px !important; border-radius: 20px !important; }
      .exp-row { gap: 16px !important; }
      .exp-num { font-size: 22px !important; }
      .map-wrap { height: 260px !important; }
      .cta-inner { padding: 44px 18px !important; }
      .map-tags  { flex-wrap: wrap !important; justify-content: center !important; }
      .map-tag   { font-size: 11px !important; padding: 6px 12px !important; }
      .recharts-wrapper { overflow: hidden !important; }
      .vg-desktop { display: none !important; }
      .vg-mobile  { display: flex !important; }
      .render-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
      .render-item { border-radius: 8px !important; }
      .lb-nav      { display: none !important; }
    }
    @media (max-width: 400px) {
      .hero-title { font-size: 60px !important; }
      .sim-results-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
)

/* ─── RECHARTS TOOLTIP ──────────────────────────────────────── */
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = memo(({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: "rgba(26,24,20,0.95)", border: "1px solid var(--gold)", borderRadius: 12, padding: "10px 16px", fontFamily: "'Jost',sans-serif", fontSize: 13, color: "#fff", maxWidth: 160 }}>
      <p style={{ color: "var(--gold)", marginBottom: 4 }}>{label}</p>
      <p>USD <strong>{Number(payload[0].value).toLocaleString()}</strong></p>
    </div>
  )
})

/* ─── VIDEO MODAL ───────────────────────────────────────────── */
const VideoModal: React.FC<{ video: VideoItem; onClose: () => void }> = memo(({ video, onClose }) => {
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
      <motion.div className="video-modal-inner" initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
        <video ref={videoRef} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
          <source src={video.src} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "38%", background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 28, left: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.9)", letterSpacing: "0.09em", textTransform: "uppercase" }}>{video.label}</span>
        </div>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(201,169,110,0.4)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}>
          <X size={15} />
        </button>
      </motion.div>
    </motion.div>
  )
})

/* ─── IS-MOBILE HOOK ──────────────────────────────────────────
   Evita montar ambos VideoPlayer (desktop + mobile) al mismo tiempo.
   Solo monta el relevante para el viewport actual.
─────────────────────────────────────────────────────────────── */
function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= breakpoint)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [breakpoint])
  return isMobile
}

/* ─── VIDEO GALLERY ─────────────────────────────────────────── */
const videos: VideoItem[] = [
  { src: "/videos/video1.mp4", label: "Vista general" },
  { src: "/videos/video2.mp4", label: "Entorno natural" },
  { src: "/videos/video3.mp4", label: "Infraestructura" },
]
type Direction = 1 | -1

const slideVariants = {
  enter: (dir: Direction) => ({ x: dir > 0 ? 48 : -48, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir: Direction) => ({ x: dir > 0 ? -48 : 48, opacity: 0, scale: 0.97, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }),
}
const mobileVariants = {
  enter: { opacity: 0, scale: 0.97 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, scale: 0.97, transition: { duration: 0.2 } },
}

const VideoGallery: React.FC = () => {
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
    setDirection(resolved); setActive((idx + videos.length) % videos.length); setIsPlaying(true)
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

  const isMobile = useIsMobile()

  const VideoPlayer = ({ vref, isMobile: isM = false }: { vref: React.RefObject<HTMLVideoElement>; isMobile?: boolean }) => (
    <AnimatePresence initial={false} custom={direction} mode="popLayout">
      <motion.div key={active} custom={direction} variants={isM ? mobileVariants : slideVariants} initial="enter" animate="center" exit="exit" style={{ position: "absolute", inset: 0 }}>
        <video ref={vref} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
          <source src={videos[active].src} type="video/mp4" />
        </video>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "42%", background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: isM ? 22 : 28, left: isM ? 16 : 22, right: isM ? 16 : 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: isM ? 10 : 11, color: "rgba(255,255,255,0.9)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{videos[active].label}</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {videos.map((_, i) => (
              <div key={i} style={{ flex: i === active ? 2 : 1, height: 2, borderRadius: 2, background: i === active ? "var(--gold)" : "rgba(255,255,255,0.28)", transition: "flex 0.4s ease" }} />
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", top: isM ? 18 : 20, right: isM ? 14 : 18, fontFamily: "'Cormorant Garamond',serif", fontSize: isM ? 12 : 13, color: "rgba(255,255,255,0.4)" }}>
          <span style={{ color: "var(--gold-light)", fontSize: isM ? 15 : 17 }}>{active + 1}</span>/{videos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  )

  const NavBtn = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
    <button onClick={onClick} style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--gold-light)", transition: "all 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,169,110,0.15)"; e.currentTarget.style.borderColor = "var(--gold)" }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)" }}>
      {children}
    </button>
  )

  return (
    <section style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 80%, rgba(201,169,110,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 20%, rgba(201,169,110,0.04) 0%, transparent 55%)", pointerEvents: "none", contain: "strict" }} />
      <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>

        <div ref={headerRef} style={{ textAlign: "center", marginBottom: 60 }}>
          <p className="reveal" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Galería</p>
          <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff" }}>
            La Feliza en <em style={{ color: "var(--gold-light)" }}>movimiento</em>
          </h2>
          <div className="reveal gold-divider" data-delay="2" style={{ marginTop: 20 }} />
        </div>

        {/* Desktop — solo se monta si NO es mobile */}
        <div className="vg-desktop" style={{ alignItems: "center", justifyContent: "center", gap: 20 }}>
          <NavBtn onClick={prev}><ChevronLeft size={20} /></NavBtn>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videos.map((v, i) => i < active ? <ThumbButton key={i} video={v} index={i} active={active} onClick={() => goTo(i)} onOpenModal={() => setModalVideo(v)} /> : null)}
          </div>
          <div style={{ position: "relative", width: "min(320px, 42vw)", aspectRatio: "9/16", borderRadius: 24, overflow: "hidden", border: "1.5px solid rgba(201,169,110,0.25)", boxShadow: "0 0 0 1px rgba(201,169,110,0.08), 0 40px 100px rgba(0,0,0,0.7)", background: "#000", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 64, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.55)", zIndex: 10 }} />
            {!isMobile && <VideoPlayer vref={videoRef} />}
            <button onClick={(e) => { e.stopPropagation(); togglePlay() }} style={{ position: "absolute", bottom: 64, right: 16, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(201,169,110,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, color: "var(--gold)", transition: "all 0.2s" }}>
              {isPlaying ? <span style={{ fontSize: 12 }}>⏸</span> : <span style={{ fontSize: 12, paddingLeft: 2 }}>▶</span>}
            </button>
            <button onClick={() => setModalVideo(videos[active])} style={{ position: "absolute", bottom: 64, left: 16, width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(201,169,110,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, color: "var(--gold)", transition: "all 0.2s" }}>
              <Play size={12} style={{ fill: "var(--gold)", marginLeft: 2 }} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videos.map((v, i) => i > active ? <ThumbButton key={i} video={v} index={i} active={active} onClick={() => goTo(i)} onOpenModal={() => setModalVideo(v)} /> : null)}
          </div>
          <NavBtn onClick={next}><ChevronRight size={20} /></NavBtn>
        </div>
        <p className="vg-desktop" style={{ justifyContent: "center", color: "rgba(255,255,255,0.18)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 20 }}>Clic en el video para pantalla completa</p>

        {/* Mobile — solo se monta si ES mobile */}
        <div className="vg-mobile" style={{ flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative", width: "min(280px, 72vw)", aspectRatio: "9/16", borderRadius: 22, overflow: "hidden", border: "1.5px solid rgba(201,169,110,0.25)", boxShadow: "0 28px 70px rgba(0,0,0,0.65)", background: "#000" }}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onClick={togglePlay}>
            <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 56, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.5)", zIndex: 10 }} />
            {isMobile && <VideoPlayer vref={mobileVideoRef} isMobile />}
            <div
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 52, height: 52, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1.5px solid rgba(201,169,110,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20, pointerEvents: "none", opacity: isPlaying ? 0 : 1, transition: "opacity 0.18s ease" }}>
              <span style={{ color: "var(--gold)", fontSize: 18, paddingLeft: 3 }}>▶</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={prev} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--gold-light)" }}><ChevronLeft size={15} /></button>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {videos.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{ width: i === active ? 22 : 7, height: 7, borderRadius: 4, background: i === active ? "var(--gold)" : "rgba(201,169,110,0.28)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.35s ease" }} />
              ))}
            </div>
            <button onClick={next} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.25)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--gold-light)" }}><ChevronRight size={15} /></button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: -4 }}>{videos[active].label}</p>
        </div>
      </div>
      <AnimatePresence>
        {modalVideo && <VideoModal video={modalVideo} onClose={() => setModalVideo(null)} />}
      </AnimatePresence>
    </section>
  )
}

/* ─── THUMBNAIL ─────────────────────────────────────────────── */
const ThumbButton: React.FC<{ video: VideoItem; index: number; active: number; onClick: () => void; onOpenModal: () => void }> = memo(({ video, index, active, onClick, onOpenModal }) => {
  const isActive = index === active
  return (
    <button className="vg-thumb" onClick={onClick} style={{ position: "relative", width: 100, aspectRatio: "9/16", borderRadius: 14, overflow: "hidden", border: isActive ? "2px solid var(--gold)" : "2px solid rgba(255,255,255,0.08)", background: "#111", cursor: "pointer", padding: 0, opacity: isActive ? 1 : 0.5, transition: "opacity 0.25s, border-color 0.25s, transform 0.2s ease", transform: "translateZ(0)", flexShrink: 0 }}
      onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.04) translateZ(0)" } }}
      onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.transform = "translateZ(0)" } }}>
      <video muted playsInline preload="none" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
        <source src={`${video.src}#t=0.5`} type="video/mp4" />
      </video>
      {isActive && <div style={{ position: "absolute", inset: 0, background: "rgba(201,169,110,0.1)" }} />}
      <div className="vg-thumb-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} onClick={(e) => { e.stopPropagation(); onOpenModal() }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "1px solid rgba(201,169,110,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Play size={10} style={{ color: "var(--gold)", fill: "var(--gold)", marginLeft: 2 }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)", padding: "14px 6px 6px", fontFamily: "'Jost',sans-serif", fontSize: 8, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center" }}>{video.label}</div>
    </button>
  )
})

/* ─── RENDER GALLERY ─────────────────────────────────────────── */
const RENDERS_INITIAL = 8
const RenderGallery: React.FC<{ renders: string[] }> = memo(({ renders }) => {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? renders : renders.slice(0, RENDERS_INITIAL)
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
      <div className="render-grid">
        {visible.map((src, i) => (
          <div key={src + i} className="render-item" onClick={() => setLightbox(i)}>
            <img src={src} alt={`Render ${i + 1}`} loading="lazy" decoding="async" width="400" height="300" />
            <div className="render-overlay">
              <div className="render-zoom" style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "1px solid rgba(201,169,110,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ZoomIn size={15} color="var(--gold)" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {renders.length > RENDERS_INITIAL && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button onClick={() => setExpanded(!expanded)} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "transparent", border: "1px solid var(--border)", borderRadius: 50, padding: "13px 30px", color: "var(--gold-dark)", fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "'Jost',sans-serif", transition: "all 0.25s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,169,110,0.08)"; e.currentTarget.style.borderColor = "var(--gold)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)" }}>
            {expanded ? <>Mostrar menos <ChevronRight size={13} style={{ transform: "rotate(-90deg)" }} /></> : <>Ver todas <span style={{ opacity: 0.5, fontSize: 12 }}>({renders.length})</span> <ChevronRight size={13} style={{ transform: "rotate(90deg)" }} /></>}
          </button>
        </div>
      )}
      {/* Lightbox CSS puro, sin Framer */}
      <div className={`lb-backdrop${isOpen ? " lb-open" : ""}`} onClick={closeLb}>
        <button className="lb-close" onClick={closeLb}><X size={17} /></button>
        <button className="lb-nav prev" onClick={lbPrev}><ChevronLeft size={22} /></button>
        {lightbox !== null && <img key={lightbox} className="lb-img" src={renders[lightbox]} onClick={(e) => e.stopPropagation()} />}
        <button className="lb-nav next" onClick={lbNext}><ChevronRight size={22} /></button>
        {lightbox !== null && (
          <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: "rgba(255,255,255,0.35)" }}>
            <span style={{ color: "var(--gold-light)", fontSize: 19 }}>{lightbox + 1}</span> / {renders.length}
          </div>
        )}
      </div>
    </>
  )
})

/* ─── MAIN ───────────────────────────────────────────────────── */
const LaFeliza: React.FC = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string

  // Slider: valor inmediato para la UI, debounced para el gráfico
  const [investment, setInvestment] = useState(300000)
  const [years, setYears]           = useState(5)
  const debouncedInvestment         = useDebounced(investment, 120)
  const debouncedYears              = useDebounced(years, 120)

  const whatsappLink = "https://wa.me/5493515052474"

  const renders: string[] = [
    "https://imgur.com/2IaGZZB.jpg","https://imgur.com/bPeK5g9.jpg","https://imgur.com/CcbDbEO.jpg",
    "https://imgur.com/jBDFS98.jpg","https://imgur.com/TLw0LOq.jpg","https://imgur.com/7HaU9Jy.jpg",
    "https://imgur.com/Zo4SBJD.jpg","https://imgur.com/LdOZWJW.jpg","https://imgur.com/ruqaU8A.jpg",
    "https://imgur.com/QbanUHf.jpg","https://imgur.com/MGsSmVx.jpg","https://imgur.com/TPNAgwg.jpg",
    "https://imgur.com/8pdeZXX.jpg","https://imgur.com/ksr3cHD.jpg","https://imgur.com/1DJvdJT.jpg",
    "https://imgur.com/4GPZRGU.jpg","https://imgur.com/QWqGA4g.jpg","https://imgur.com/9npk2iT.jpg",
    "https://imgur.com/6yGAlaG.jpg","https://imgur.com/29PyFj5.jpg","https://imgur.com/S0fKIUF.jpg",
    "https://imgur.com/2oqeq1S.jpg","https://imgur.com/DalOI52.jpg","https://imgur.com/jNdd9A1.jpg",
    "https://imgur.com/re8z09A.jpg","https://imgur.com/8TNu8rn.jpg",
  ]

  const latitude  = -31.509285
  const longitude = -64.179648
  const minInv = 100000
  const maxInv = 500000
  const RATE   = 0.08
  const rangeVal = ((investment - minInv) / (maxInv - minInv)) * 100

  // Gráfico solo recalcula cuando el slider descansa
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

  // Un observer por sección, no por elemento
  const infoRef    = useSectionReveal(0.15)
  const financRef  = useSectionReveal(0.1)
  const statsRevRef = useSectionReveal(0.2)
  const mapRef     = useSectionReveal(0.15)
  const rendersRef = useSectionReveal(0.1)
  const simRef     = useSectionReveal(0.1)
  const expRef     = useSectionReveal(0.1)
  const ctaRef     = useSectionReveal(0.2)

  const infoCards: InfoCard[] = [
    { icon: <MapPin size={20} />,     title: "Ubicación privilegiada",  text: "Zona sur de Córdoba con acceso directo desde Camino a San Carlos." },
    { icon: <Sun size={20} />,        title: "Lotes amplios",           text: "Desde 700 m² hasta más de 1.700 m² con privacidad y vistas abiertas." },
    { icon: <ShieldCheck size={20}/>, title: "Infraestructura completa",text: "Calles adoquinadas, iluminación y servicios subterráneos." },
    { icon: <TreePine size={20} />,   title: "Masterplan verde",        text: "Plaza central, SUM, espacios verdes y sector housing." },
  ]
  const financCards: FinancCard[] = [
    { icon: <DollarSign size={20} />,  title: "Sin banco",              desc: "Financiación 100% propia. Sin calificación crediticia ni papelerío bancario." },
    { icon: <CalendarDays size={20}/>, title: "Plazos flexibles",       desc: "Hasta 60 cuotas. Adaptamos el plan a tu situación financiera real." },
    { icon: <Percent size={20} />,     title: "Cuotas accesibles",      desc: "Pagás en pesos o dólares. Siempre con condiciones claras y sin sorpresas." },
    { icon: <BadgeCheck size={20} />,  title: "Escritura garantizada",  desc: "Desde la firma del boleto, el lote es tuyo. Escritura al completar el pago." },
  ]
  const stats: StatItem[] = [
    { n: 120, suffix: "",    label: "Lotes disponibles" },
    { n: 8,   suffix: "%",   label: "ROI anual estimado" },
    { n: 5,   suffix: "min", label: "Del centro" },
    { n: 2026,suffix: "",    label: "Año de lanzamiento" },
  ]
  const expRows: ExpRow[] = [
    { num: "01", title: "Asesoramiento personalizado", desc: "Un equipo dedicado te guía desde la consulta inicial hasta la escritura. Sin presiones, con información transparente." },
    { num: "02", title: "Financiamiento a medida",     desc: "Planes de pago adaptados a tu situación. Cuotas en pesos o dólares, con condiciones pensadas para que la inversión sea accesible." },
    { num: "03", title: "Entrega con infraestructura", desc: "Los lotes se entregan con todos los servicios instalados. Podés construir desde el primer día sin sorpresas." },
    { num: "04", title: "Comunidad en crecimiento",    desc: "Un barrio que nace con visión de largo plazo, con espacios comunes, seguridad y estética cuidada en cada detalle." },
  ]

  return (
    <div className="font-body page-root" style={{ background: "var(--cream)", color: "var(--dark)", overflowX: "hidden", width: "100%", position: "relative" }}>
      <FontStyle />

      {/* ══ HERO — Framer solo para la entrada al cargar (no scroll) ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 72 }}>
        <div className="hero-bg">
          <div className="hero-bg-img" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,24,20,0.78) 0%, rgba(26,24,20,0.4) 60%, transparent 100%)", contain: "strict" }} />
        </div>
        <motion.div className="hero-text-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          style={{ position: "relative", zIndex: 2, maxWidth: 760, padding: "0 48px", width: "100%" }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,169,110,0.15)", border: "1px solid var(--gold)", borderRadius: 40, padding: "6px 16px", marginBottom: 28, color: "var(--gold-light)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            <Star size={10} fill="currentColor" /> Desarrollo premium · Córdoba
          </motion.div>
          <motion.h1 className="font-pinyon hero-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontFamily: "'Pinyon Script',cursive", fontSize: "clamp(80px,11vw,148px)", fontWeight: 400, color: "#fff", lineHeight: 0.9, marginBottom: 28 }}>
            La <span style={{ color: "var(--gold-light)" }}>Feliza</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
            style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(14px,2vw,18px)", lineHeight: 1.7, maxWidth: 480, marginBottom: 40, fontWeight: 300 }}>
            Un desarrollo inmobiliario de alta gama pensado para quienes buscan combinar calidad de vida, naturaleza y una inversión con proyección real.
          </motion.p>
          <motion.div className="hero-buttons" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.34 }} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "#fff", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 8px 32px rgba(201,169,110,0.4)", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,169,110,0.55)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,169,110,0.4)" }}>
              Hablar con un asesor <ArrowRight size={16} />
            </a>
            <a href="#simulador" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 400, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}>
              Simular inversión
            </a>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.15em", zIndex: 2 }}>
          <span style={{ textTransform: "uppercase" }}>Explorar</span>
          <div className="scroll-line" />
        </motion.div>
      </section>

      {/* ══ INFO CARDS ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner">
          <div ref={infoRef}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <p className="reveal" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>El proyecto</p>
              <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
                Un desarrollo pensado<br /><em>para el futuro</em>
              </h2>
              <div className="reveal gold-divider" data-delay="2" style={{ marginTop: 24 }} />
            </div>
            <div className="info-cards-grid">
              {infoCards.map((item, i) => (
                <div key={i} className="info-card reveal" data-delay={String(i + 1) as "1"|"2"|"3"|"4"}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", marginBottom: 20 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FINANCIACIÓN ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.07) 0%, transparent 65%)", pointerEvents: "none", contain: "strict" }} />
        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <div ref={financRef}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }} className="financ-header-grid">
              <style>{`@media (min-width: 769px) { .financ-header-grid { grid-template-columns: 1fr 1fr !important; gap: 64px !important; align-items: end !important; } }`}</style>
              <div>
                <p className="reveal" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Financiación propia</p>
                <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                  Invertí sin necesitar<br /><em style={{ color: "var(--gold-light)" }}>un banco</em>
                </h2>
                <div className="reveal gold-divider" data-delay="2" style={{ margin: "0 0 24px" }} />
                <p className="reveal" data-delay="3" style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.8, maxWidth: 440 }}>
                  Contamos con planes de financiación directa, sin intermediarios bancarios. Cuotas accesibles en pesos o dólares, adaptadas a tu capacidad de pago.
                </p>
              </div>
              <div className="reveal" data-delay="2" style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 32 }}>
                <div style={{ borderLeft: "1px solid rgba(201,169,110,0.25)", paddingLeft: 32 }}>
                  <div className="font-display" style={{ fontSize: "clamp(52px,7vw,88px)", fontWeight: 300, color: "var(--gold)", lineHeight: 0.9 }}>0%</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 10 }}>Interés para las primeras cuotas</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 72 }}>
              {financCards.map((item, i) => (
                <div key={i} className="financ-card reveal" data-delay={String(i + 1) as "1"|"2"|"3"|"4"}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", marginBottom: 16 }}>{item.icon}</div>
                  <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="reveal" data-delay="1" style={{ marginTop: 48, padding: "28px 32px", borderRadius: 14, border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div>
                <p style={{ color: "#fff", fontSize: "clamp(14px,2vw,16px)", fontWeight: 500, marginBottom: 4 }}>¿Querés conocer tu plan de cuotas?</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Un asesor te arma una propuesta personalizada sin compromiso.</p>
              </div>
              <a href={whatsappLink} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "#fff", padding: "14px 28px", borderRadius: 50, fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 6px 24px rgba(201,169,110,0.35)", whiteSpace: "nowrap", flexShrink: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(201,169,110,0.5)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,169,110,0.35)" }}>
                Consultar financiación <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section ref={statsRef} className="section-pad" style={{ padding: "80px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.04) 0%, transparent 60%)", contain: "strict" }} />
        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <div ref={statsRevRef} className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="reveal" data-delay={String(i + 1) as "1"|"2"|"3"|"4"}>
                <div className="font-display" style={{ fontSize: "clamp(36px,4vw,64px)", fontWeight: 300, color: "var(--gold-light)", lineHeight: 1 }}>
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
        <div className="section-inner">
          <div ref={mapRef}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p className="reveal" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Ubicación</p>
              <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Encontranos en <em>Córdoba</em></h2>
            </div>
            <div className="reveal" data-delay="2" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}>
              <div className="map-wrap" style={{ height: 480 }}>
                <Map mapboxAccessToken={mapboxToken} initialViewState={{ longitude, latitude, zoom: 15 }} mapStyle="mapbox://styles/mapbox/satellite-streets-v12" style={{ width: "100%", height: "100%" }}>
                  <Marker longitude={longitude} latitude={latitude} anchor="bottom">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "scrollBounce 2s ease-in-out infinite" }}>
                      <div style={{ background: "var(--gold)", color: "#fff", padding: "8px 16px", borderRadius: 40, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(201,169,110,0.5)", fontFamily: "'Jost',sans-serif" }}>La Feliza</div>
                      <div style={{ width: 2, height: 12, background: "var(--gold)" }} />
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
                    </div>
                  </Marker>
                </Map>
              </div>
            </div>
            <div className="map-tags" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
              {[{ icon: <MapPin size={13} />, text: "Camino a San Carlos, Córdoba" }, { icon: <Waves size={13} />, text: "A 10 min del centro" }, { icon: <TreePine size={13} />, text: "Zona de alto crecimiento" }].map((tag, i) => (
                <span key={i} className="map-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,169,110,0.1)", border: "1px solid var(--border)", borderRadius: 40, padding: "8px 14px", fontSize: 12, color: "var(--gold-dark)", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {tag.icon} {tag.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ RENDERS ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "#fff", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%" }}>
          <div ref={rendersRef}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <p className="reveal" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Renders</p>
              <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Visualización del <em>proyecto</em></h2>
              <p className="reveal" data-delay="2" style={{ color: "var(--muted)", fontSize: 13, marginTop: 12 }}>Clic en cualquier imagen para verla en detalle · Flechas del teclado para navegar</p>
            </div>
            <RenderGallery renders={renders} />
          </div>
        </div>
      </section>

      {/* ══ VIDEO ══ */}
      <VideoGallery />

      {/* ══ SIMULADOR ══ */}
      <section id="simulador" className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          <div ref={simRef}>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <p className="reveal" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Calculadora</p>
              <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Simulador de <em>inversión</em></h2>
            </div>
            <div className="reveal sim-box" data-delay="2" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 28, padding: "48px 40px", boxShadow: "0 30px 80px rgba(0,0,0,0.07)", width: "100%" }}>
              <div className="sim-controls-grid">
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Capital inicial</span>
                    <span className="font-display" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>USD {investment.toLocaleString()}</span>
                  </div>
                  <input type="range" min={minInv} max={maxInv} step={5000} value={investment} onChange={handleInvestmentChange} className="premium-range" style={{ "--val": `${rangeVal}%` } as React.CSSProperties} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                    <span>USD 100K</span><span>USD 500K</span>
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Horizonte</span>
                    <span className="font-display" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>{years} {years === 1 ? "año" : "años"}</span>
                  </div>
                  <input type="range" min={1} max={10} step={1} value={years} onChange={handleYearsChange} className="premium-range" style={{ "--val": `${((years - 1) / 9) * 100}%` } as React.CSSProperties} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                    <span>1 año</span><span>10 años</span>
                  </div>
                </div>
              </div>
              {/* Resultados usan debouncedInvestment para no jerkear mientras se arrastra */}
              <div className="sim-results-grid" style={{ background: "rgba(201,169,110,0.06)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 40 }}>
                {[
                  { label: "Inversión inicial",          value: `USD ${debouncedInvestment.toLocaleString()}`, color: "var(--dark)" },
                  { label: "Ganancia estimada",          value: `+USD ${gain.toLocaleString()}`,              color: "#16a34a" },
                  { label: `Valor en ${debouncedYears} años`, value: `USD ${finalValue.toLocaleString()}`,    color: "var(--gold-dark)" },
                ].map((r, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{r.label}</div>
                    <div className="font-display" style={{ fontSize: "clamp(14px,3vw,20px)", fontWeight: 600, color: r.color, wordBreak: "break-word" }}>{r.value}</div>
                  </div>
                ))}
              </div>
              {/* isAnimationActive={false}: desactiva la animación SVG de Recharts en cada redibujado */}
              <div style={{ width: "100%", overflow: "hidden" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C9A96E" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#C9A96E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="año" tick={{ fontSize: 10, fontFamily: "'Jost',sans-serif", fill: "#8A8278" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fontFamily: "'Jost',sans-serif", fill: "#8A8278" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="valor" stroke="#C9A96E" strokeWidth={2.5} fill="url(#goldGrad)"
                      dot={{ fill: "#C9A96E", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: "#C9A96E", stroke: "#fff", strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 16, letterSpacing: "0.05em" }}>
                * Proyección basada en una tasa de valorización anual estimada del 8%. No constituye asesoramiento financiero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCIA ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 60%)", contain: "strict" }} />
        <div className="section-inner" style={{ maxWidth: 900, position: "relative", zIndex: 1, textAlign: "center" }}>
          <div ref={expRef}>
            <p className="reveal" style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Por qué elegirnos</p>
            <h2 className="reveal font-display" data-delay="1" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 60 }}>
              La experiencia<br /><em style={{ color: "var(--gold-light)" }}>La Feliza</em>
            </h2>
            <div style={{ display: "grid", gap: 2 }}>
              {expRows.map((item, i) => (
                <div key={i} className="exp-row reveal" data-delay={String(i + 1) as "1"|"2"|"3"|"4"} style={{ borderBottom: i < expRows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <span className="font-display exp-num" style={{ fontWeight: 300, color: "rgba(201,169,110,0.3)", lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{item.num}</span>
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

export default LaFeliza