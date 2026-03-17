import React, { useState, useRef, useEffect, ReactNode } from "react"
import {
  MapPin,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Star,
  Sun,
  Waves,
  DollarSign,
  CalendarDays,
  BadgeCheck,
  Percent,
  X,
  Play,
  ZoomIn,
} from "lucide-react"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"
import Map, { Marker } from "react-map-gl/mapbox"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts"
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent"

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface VideoItem {
  src: string
  label: string
}

interface InfoCard {
  icon: ReactNode
  title: string
  text: string
}

interface FinancCard {
  icon: ReactNode
  title: string
  desc: string
}

interface StatItem {
  n: number
  suffix: string
  label: string
}

interface ExpRow {
  num: string
  title: string
  desc: string
}

interface ChartDataPoint {
  año: string
  valor: number
}

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const FontStyle: React.FC = () => (
  <style>{`
    :root {
      --gold:       #C9A96E;
      --gold-light: #E8D5B0;
      --gold-dark:  #A07840;
      --cream:      #FAF8F4;
      --dark:       #1A1814;
      --dark-2:     #2C2820;
      --muted:      #8A8278;
      --border:     rgba(201,169,110,0.2);
    }

    html, body { overflow-x: hidden; max-width: 100%; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .font-display { font-family: 'Cormorant Garamond', serif; }
    .font-body    { font-family: 'Jost', sans-serif; }
    .font-pinyon  { font-family: 'Pinyon Script', cursive; font-weight: 400; }

    /* ── RANGE ── */
    input[type=range].premium-range {
      -webkit-appearance: none; width: 100%; height: 4px;
      background: linear-gradient(
        to right,
        var(--gold) 0%,
        var(--gold) var(--val, 50%),
        rgba(201,169,110,0.2) var(--val, 50%),
        rgba(201,169,110,0.2) 100%
      );
      border-radius: 4px; outline: none;
    }
    input[type=range].premium-range::-webkit-slider-thumb {
      -webkit-appearance: none; width: 22px; height: 22px;
      border-radius: 50%; background: var(--gold);
      border: 3px solid var(--cream);
      box-shadow: 0 0 0 1px var(--gold), 0 4px 12px rgba(201,169,110,0.4);
      cursor: pointer; transition: transform 0.15s;
    }
    input[type=range].premium-range::-webkit-slider-thumb:hover { transform: scale(1.2); }
    input[type=range].premium-range::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--gold); border: 3px solid var(--cream); cursor: pointer;
    }

    /* ── LAYOUT HELPERS ── */
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

    /* ── VIDEO GALLERY — desktop ── */
    .vg-desktop { display: flex; }
    .vg-mobile  { display: none; }

    /* ── RENDER GALLERY ── */
    .render-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .render-item {
      position: relative; border-radius: 12px; overflow: hidden;
      cursor: pointer; aspect-ratio: 4/3; background: #eee;
    }
    .render-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
    .render-item:hover img { transform: scale(1.06); }
    .render-overlay {
      position: absolute; inset: 0; background: rgba(26,24,20,0);
      transition: background 0.3s; display: flex; align-items: center; justify-content: center;
    }
    .render-item:hover .render-overlay { background: rgba(26,24,20,0.38); }
    .render-zoom { opacity: 0; transition: opacity 0.25s; }
    .render-item:hover .render-zoom { opacity: 1; }

    /* ── LIGHTBOX ── */
    .lb-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.93);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
      padding: 24px; backdrop-filter: blur(10px);
    }
    .lb-img {
      max-width: min(88vw, 1200px); max-height: 88vh;
      border-radius: 14px; object-fit: contain;
      box-shadow: 0 40px 120px rgba(0,0,0,0.8); display: block;
    }
    .lb-nav {
      position: fixed; top: 50%; transform: translateY(-50%);
      width: 52px; height: 52px; border-radius: 50%;
      background: rgba(0,0,0,0.6); border: 1px solid rgba(201,169,110,0.35);
      color: var(--gold-light); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; z-index: 10001;
    }
    .lb-nav:hover { background: rgba(201,169,110,0.25); border-color: var(--gold); }
    .lb-nav.prev { left: 20px; }
    .lb-nav.next { right: 20px; }
    .lb-close {
      position: fixed; top: 20px; right: 20px;
      width: 44px; height: 44px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
      color: #fff; cursor: pointer; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; z-index: 10001;
    }
    .lb-close:hover { background: rgba(201,169,110,0.35); }

    /* ── VIDEO MODAL ── */
    .video-modal-inner {
      position: relative; width: min(400px, 88vw);
      aspect-ratio: 9/16; border-radius: 24px; overflow: hidden;
      border: 1.5px solid rgba(201,169,110,0.3);
      box-shadow: 0 40px 120px rgba(0,0,0,0.8);
    }

    /* ── THUMBNAIL HOVER ── */
    .vg-thumb:hover .vg-thumb-overlay { opacity: 1 !important; }

    /* ════════════════════════════════════════
       MOBILE ≤ 768px
    ════════════════════════════════════════ */
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
      .hero-buttons a { width: 100% !important; justify-content: center !important; text-align: center !important; }

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

/* ─────────────────────────────────────────────────────────────
   RECHARTS CUSTOM TOOLTIP
───────────────────────────────────────────────────────────── */
const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(26,24,20,0.95)",
          border: "1px solid var(--gold)",
          borderRadius: 12,
          padding: "10px 16px",
          fontFamily: "'Jost', sans-serif",
          fontSize: 13,
          color: "#fff",
          maxWidth: 160,
        }}
      >
        <p style={{ color: "var(--gold)", marginBottom: 4 }}>{label}</p>
        <p>
          USD <strong>{Number(payload[0].value).toLocaleString()}</strong>
        </p>
      </div>
    )
  }
  return null
}

/* ─────────────────────────────────────────────────────────────
   VIDEO MODAL
───────────────────────────────────────────────────────────── */
interface VideoModalProps {
  video: VideoItem
  onClose: () => void
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (v) {
      v.load()
      v.play().catch(() => {})
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [video, onClose])

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(14px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="video-modal-inner"
        initial={{ scale: 0.86, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.86, opacity: 0, y: 28 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        >
          <source src={video.src} type="video/mp4" />
        </video>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "38%",
            background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />
          <span
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            {video.label}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(201,169,110,0.4)",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
        >
          <X size={15} />
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────────
   VIDEO GALLERY
   Desktop: video principal 9:16 centrado + thumbnails 9:16 a los lados
            animación premium al cambiar (slide + fade + scale)
   Mobile:  carrusel horizontal de reels 9:16, animación leve fade+scale
───────────────────────────────────────────────────────────── */
const videos: VideoItem[] = [
  { src: "/videos/video1.mp4", label: "Vista general" },
  { src: "/videos/video2.mp4", label: "Entorno natural" },
  { src: "/videos/video3.mp4", label: "Infraestructura" },
]

/* dirección de la animación según si avanzamos o retrocedemos */
type Direction = 1 | -1

const slideVariants = {
  enter: (dir: Direction) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.96,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (dir: Direction) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.96,
    filter: "blur(6px)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

/* animación leve para mobile */
const mobileVariants = {
  enter: { opacity: 0, scale: 0.97 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
}

const VideoGallery: React.FC = () => {
  const [active, setActive] = useState<number>(0)
  const [direction, setDirection] = useState<Direction>(1)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const touchStartX = useRef<number | null>(null)

  /* cuando cambia el video activo, recarga y reproduce */
  useEffect(() => {
    ;[videoRef, mobileVideoRef].forEach((ref) => {
      const v = ref.current
      if (!v) return
      v.load()
      if (isPlaying) v.play().catch(() => {})
    })
  }, [active])

  const goTo = (idx: number, dir?: Direction) => {
    const resolved = dir ?? (idx > active ? 1 : -1)
    setDirection(resolved)
    setActive((idx + videos.length) % videos.length)
    setIsPlaying(true)
  }
  const prev = () => goTo(active - 1, -1)
  const next = () => goTo(active + 1, 1)

  const togglePlay = () => {
    ;[videoRef, mobileVideoRef].forEach((ref) => {
      const v = ref.current
      if (!v) return
      if (v.paused) { v.play(); setIsPlaying(true) }
      else { v.pause(); setIsPlaying(false) }
    })
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 44) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  /* ── inner video player (shared between desktop main + mobile) ── */
  const VideoPlayer = ({
    vref,
    isMobile = false,
  }: {
    vref: React.RefObject<HTMLVideoElement>
    isMobile?: boolean
  }) => (
    <AnimatePresence initial={false} custom={direction} mode="wait">
      <motion.div
        key={active}
        custom={direction}
        variants={isMobile ? mobileVariants : slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        style={{ position: "absolute", inset: 0 }}
      >
        <video
          ref={vref}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        >
          <source src={videos[active].src} type="video/mp4" />
        </video>

        {/* bottom gradient */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "42%",
            background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* label */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 22 : 28,
            left: isMobile ? 16 : 22,
            right: isMobile ? 16 : 22,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--gold)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: isMobile ? 10 : 11,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {videos[active].label}
            </span>
          </div>

          {/* progress bar */}
          <div style={{ display: "flex", gap: 4 }}>
            {videos.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: i === active ? 2 : 1,
                  height: 2,
                  borderRadius: 2,
                  background: i === active ? "var(--gold)" : "rgba(255,255,255,0.28)",
                  transition: "flex 0.4s ease, background 0.3s",
                }}
              />
            ))}
          </div>
        </div>

        {/* counter */}
        <div
          style={{
            position: "absolute",
            top: isMobile ? 18 : 20,
            right: isMobile ? 14 : 18,
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: isMobile ? 12 : 13,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          <span style={{ color: "var(--gold-light)", fontSize: isMobile ? 15 : 17 }}>
            {active + 1}
          </span>
          /{videos.length}
        </div>
      </motion.div>
    </AnimatePresence>
  )

  return (
    <section
      style={{
        padding: "100px 0",
        background: "var(--dark)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 30% 80%, rgba(201,169,110,0.07) 0%, transparent 55%), radial-gradient(ellipse at 70% 20%, rgba(201,169,110,0.04) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            style={{
              color: "var(--gold)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Galería
          </motion.p>
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } },
            }}
            className="font-display"
            style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff" }}
          >
            La Feliza en <em style={{ color: "var(--gold-light)" }}>movimiento</em>
          </motion.h2>
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
            }}
            style={{
              width: 60,
              height: 1,
              background: "linear-gradient(to right, transparent, var(--gold), transparent)",
              margin: "20px auto 0",
            }}
          />
        </motion.div>

        {/* ══════════════════════════════════════════════
            DESKTOP
            Layout: [thumb] [video principal 9:16] [thumb]
        ══════════════════════════════════════════════ */}
        <motion.div
          className="vg-desktop"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* ← flecha prev */}
          <button
            onClick={prev}
            style={{
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(201,169,110,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--gold-light)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,169,110,0.15)"
              e.currentTarget.style.borderColor = "var(--gold)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)"
              e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* thumbnails izquierda (los que NO son active, a la izquierda) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videos.map((v, i) => {
              if (i >= active) return null // solo los anteriores al activo
              return (
                <ThumbButton
                  key={i}
                  video={v}
                  index={i}
                  active={active}
                  onClick={() => goTo(i)}
                  onOpenModal={() => setModalVideo(v)}
                />
              )
            })}
          </div>

          {/* VIDEO PRINCIPAL */}
          <div
            style={{
              position: "relative",
              width: "min(320px, 42vw)",
              aspectRatio: "9/16",
              borderRadius: 24,
              overflow: "hidden",
              border: "1.5px solid rgba(201,169,110,0.25)",
              boxShadow:
                "0 0 0 1px rgba(201,169,110,0.08), 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(201,169,110,0.07)",
              background: "#000",
              flexShrink: 0,
            }}
          >
            {/* notch decorativo */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 64,
                height: 5,
                borderRadius: 3,
                background: "rgba(0,0,0,0.55)",
                zIndex: 10,
              }}
            />

            <VideoPlayer vref={videoRef} />

            {/* play/pause */}
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay() }}
              style={{
                position: "absolute",
                bottom: 64,
                right: 16,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(201,169,110,0.4)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                color: "var(--gold)",
                transition: "all 0.2s",
              }}
            >
              {isPlaying
                ? <span style={{ fontSize: 12, lineHeight: 1 }}>⏸</span>
                : <span style={{ fontSize: 12, lineHeight: 1, paddingLeft: 2 }}>▶</span>
              }
            </button>

            {/* expand to modal */}
            <button
              onClick={() => setModalVideo(videos[active])}
              style={{
                position: "absolute",
                bottom: 64,
                left: 16,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(201,169,110,0.4)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 20,
                color: "var(--gold)",
                transition: "all 0.2s",
              }}
            >
              <Play size={12} style={{ fill: "var(--gold)", marginLeft: 2 }} />
            </button>
          </div>

          {/* thumbnails derecha */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {videos.map((v, i) => {
              if (i <= active) return null // solo los posteriores al activo
              return (
                <ThumbButton
                  key={i}
                  video={v}
                  index={i}
                  active={active}
                  onClick={() => goTo(i)}
                  onOpenModal={() => setModalVideo(v)}
                />
              )
            })}
          </div>

          {/* → flecha next */}
          <button
            onClick={next}
            style={{
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(201,169,110,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--gold-light)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,169,110,0.15)"
              e.currentTarget.style.borderColor = "var(--gold)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)"
              e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)"
            }}
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* hint desktop */}
        <p
          className="vg-desktop"
          style={{
            justifyContent: "center",
            color: "rgba(255,255,255,0.18)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: 20,
          }}
        >
          Clic en el video para pantalla completa
        </p>

        {/* ══════════════════════════════════════════════
            MOBILE
            Reel 9:16 centrado + dot nav
        ══════════════════════════════════════════════ */}
        <motion.div
          className="vg-mobile"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* reel container */}
          <div
            style={{
              position: "relative",
              width: "min(280px, 72vw)",
              aspectRatio: "9/16",
              borderRadius: 22,
              overflow: "hidden",
              border: "1.5px solid rgba(201,169,110,0.25)",
              boxShadow: "0 28px 70px rgba(0,0,0,0.65)",
              background: "#000",
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={togglePlay}
          >
            {/* notch */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 56,
                height: 4,
                borderRadius: 2,
                background: "rgba(0,0,0,0.5)",
                zIndex: 10,
              }}
            />

            <VideoPlayer vref={mobileVideoRef} isMobile />

            {/* pause overlay */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.55)",
                    border: "1.5px solid rgba(201,169,110,0.55)",
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                    pointerEvents: "none",
                  }}
                >
                  <span style={{ color: "var(--gold)", fontSize: 18, paddingLeft: 3 }}>▶</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* dot + arrow nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={prev}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(201,169,110,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--gold-light)",
              }}
            >
              <ChevronLeft size={15} />
            </button>

            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === active ? 22 : 7,
                    height: 7,
                    borderRadius: 4,
                    background:
                      i === active ? "var(--gold)" : "rgba(201,169,110,0.28)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.35s ease",
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(201,169,110,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--gold-light)",
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* labels debajo */}
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: -4,
            }}
          >
            {videos[active].label}
          </p>
        </motion.div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {modalVideo && (
          <VideoModal video={modalVideo} onClose={() => setModalVideo(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   THUMBNAIL BUTTON (desktop sidebar)
───────────────────────────────────────────────────────────── */
interface ThumbButtonProps {
  video: VideoItem
  index: number
  active: number
  onClick: () => void
  onOpenModal: () => void
}

const ThumbButton: React.FC<ThumbButtonProps> = ({
  video,
  index,
  active,
  onClick,
  onOpenModal,
}) => {
  const isActive = index === active
  return (
    <motion.button
      className="vg-thumb"
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "relative",
        width: 100,
        aspectRatio: "9/16",
        borderRadius: 14,
        overflow: "hidden",
        border: isActive
          ? "2px solid var(--gold)"
          : "2px solid rgba(255,255,255,0.08)",
        background: "#111",
        cursor: "pointer",
        padding: 0,
        opacity: isActive ? 1 : 0.5,
        transition: "opacity 0.25s, border-color 0.25s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.opacity = "0.85"
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.opacity = "0.5"
      }}
    >
      <video
        muted
        playsInline
        preload="metadata"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      >
        <source src={`${video.src}#t=0.5`} type="video/mp4" />
      </video>

      {/* gold overlay si activo */}
      {isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(201,169,110,0.1)",
          }}
        />
      )}

      {/* hover overlay con ícono play */}
      <div
        className="vg-thumb-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        onClick={(e) => {
          e.stopPropagation()
          onOpenModal()
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(201,169,110,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Play size={10} style={{ color: "var(--gold)", fill: "var(--gold)", marginLeft: 2 }} />
        </div>
      </div>

      {/* label */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
          padding: "14px 6px 6px",
          fontFamily: "'Jost',sans-serif",
          fontSize: 8,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {video.label}
      </div>
    </motion.button>
  )
}

/* ─────────────────────────────────────────────────────────────
   RENDER GALLERY
───────────────────────────────────────────────────────────── */
const RENDERS_INITIAL = 8

interface RenderGalleryProps {
  renders: string[]
}

const RenderGallery: React.FC<RenderGalleryProps> = ({ renders }) => {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<boolean>(false)

  const visible = expanded ? renders : renders.slice(0, RENDERS_INITIAL)
  const hasMore = renders.length > RENDERS_INITIAL

  const closeLightbox = () => setLightbox(null)
  const lbPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightbox((prev) =>
      prev !== null ? (prev - 1 + renders.length) % renders.length : 0
    )
  }
  const lbNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightbox((prev) =>
      prev !== null ? (prev + 1) % renders.length : 0
    )
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft")
        setLightbox((p) =>
          p !== null ? (p - 1 + renders.length) % renders.length : 0
        )
      if (e.key === "ArrowRight")
        setLightbox((p) => (p !== null ? (p + 1) % renders.length : 0))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox, renders.length])

  return (
    <>
      <div className="render-grid">
        {visible.map((src, i) => (
          <motion.div
            key={src + i}
            className="render-item"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.42, delay: (i % 4) * 0.055 }}
            onClick={() => setLightbox(i)}
          >
            <img src={src} alt={`Render ${i + 1}`} loading="lazy" />
            <div className="render-overlay">
              <div
                className="render-zoom"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.45)",
                  border: "1px solid rgba(201,169,110,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ZoomIn size={15} color="var(--gold)" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onClick={() => setExpanded(!expanded)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 50,
              padding: "13px 30px",
              color: "var(--gold-dark)",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              cursor: "pointer",
              fontFamily: "'Jost',sans-serif",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201,169,110,0.08)"
              e.currentTarget.style.borderColor = "var(--gold)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.borderColor = "var(--border)"
            }}
          >
            {expanded ? (
              <>Mostrar menos <ChevronRight size={13} style={{ transform: "rotate(-90deg)" }} /></>
            ) : (
              <>
                Ver todas las imágenes{" "}
                <span style={{ opacity: 0.5, fontSize: 12 }}>({renders.length})</span>{" "}
                <ChevronRight size={13} style={{ transform: "rotate(90deg)" }} />
              </>
            )}
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lb-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
          >
            <button className="lb-close" onClick={closeLightbox}><X size={17} /></button>
            <button className="lb-nav prev" onClick={lbPrev}><ChevronLeft size={22} /></button>
            <motion.img
              key={lightbox}
              className="lb-img"
              src={renders[lightbox]}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button className="lb-nav next" onClick={lbNext}><ChevronRight size={22} /></button>
            <div
              style={{
                position: "fixed",
                bottom: 22,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 15,
                color: "rgba(255,255,255,0.35)",
              }}
            >
              <span style={{ color: "var(--gold-light)", fontSize: 19 }}>{lightbox + 1}</span>
              <span style={{ margin: "0 6px" }}>/</span>
              {renders.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
const Proyectos: React.FC = () => {
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string
  const [investment, setInvestment] = useState<number>(300000)
  const [years, setYears] = useState<number>(5)

  const whatsappLink = "https://wa.me/5493515052474"

  const renders: string[] = [
    "https://imgur.com/2IaGZZB.jpg",
    "https://imgur.com/bPeK5g9.jpg",
    "https://imgur.com/CcbDbEO.jpg",
    "https://imgur.com/jBDFS98.jpg",
    "https://imgur.com/TLw0LOq.jpg",
    "https://imgur.com/7HaU9Jy.jpg",
    "https://imgur.com/Zo4SBJD.jpg",
    "https://imgur.com/LdOZWJW.jpg",
    "https://imgur.com/ruqaU8A.jpg",
    "https://imgur.com/QbanUHf.jpg",
    "https://imgur.com/MGsSmVx.jpg",
    "https://imgur.com/TPNAgwg.jpg",
    "https://imgur.com/8pdeZXX.jpg",
    "https://imgur.com/ksr3cHD.jpg",
    "https://imgur.com/1DJvdJT.jpg",
    "https://imgur.com/4GPZRGU.jpg",
    "https://imgur.com/QWqGA4g.jpg",
    "https://imgur.com/9npk2iT.jpg",
    "https://imgur.com/6yGAlaG.jpg",
    "https://imgur.com/29PyFj5.jpg",
    "https://imgur.com/S0fKIUF.jpg",
    "https://imgur.com/2oqeq1S.jpg",
    "https://imgur.com/DalOI52.jpg",
    "https://imgur.com/jNdd9A1.jpg",
    "https://imgur.com/re8z09A.jpg",
    "https://imgur.com/8TNu8rn.jpg",


  ]

  const latitude = -31.509285
  const longitude = -64.179648

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, 80])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  const RATE = 0.08
  const minInv = 100000
  const maxInv = 500000
  const rangeVal = ((investment - minInv) / (maxInv - minInv)) * 100

  const chartData: ChartDataPoint[] = Array.from({ length: years + 1 }, (_, i) => ({
    año: i === 0 ? "Hoy" : `Año ${i}`,
    valor: Math.round(investment * Math.pow(1 + RATE, i)),
  }))
  const finalValue = chartData[chartData.length - 1].valor
  const gain = finalValue - investment

  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 })

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  const infoCards: InfoCard[] = [
    { icon: <MapPin size={20} />, title: "Ubicación privilegiada", text: "Zona sur de Córdoba con acceso directo desde Camino a San Carlos." },
    { icon: <Sun size={20} />, title: "Lotes amplios", text: "Desde 700 m² hasta más de 1.700 m² con privacidad y vistas abiertas." },
    { icon: <ShieldCheck size={20} />, title: "Infraestructura completa", text: "Calles adoquinadas, iluminación y servicios subterráneos." },
    { icon: <TreePine size={20} />, title: "Masterplan verde", text: "Plaza central, SUM, espacios verdes y sector housing." },
  ]

  const financCards: FinancCard[] = [
    { icon: <DollarSign size={20} />, title: "Sin banco", desc: "Financiación 100% propia. Sin calificación crediticia ni papelerío bancario." },
    { icon: <CalendarDays size={20} />, title: "Plazos flexibles", desc: "Hasta 60 cuotas. Adaptamos el plan a tu situación financiera real." },
    { icon: <Percent size={20} />, title: "Cuotas accesibles", desc: "Pagás en pesos o dólares. Siempre con condiciones claras y sin sorpresas." },
    { icon: <BadgeCheck size={20} />, title: "Escritura garantizada", desc: "Desde la firma del boleto, el lote es tuyo. Escritura al completar el pago." },
  ]

  const stats: StatItem[] = [
    { n: 120, suffix: "", label: "Lotes disponibles" },
    { n: 8, suffix: "%", label: "ROI anual estimado" },
    { n: 5, suffix: "min", label: "Del centro" },
    { n: 2026, suffix: "", label: "Año de lanzamiento" },
  ]

  const expRows: ExpRow[] = [
    { num: "01", title: "Asesoramiento personalizado", desc: "Un equipo dedicado te guía desde la consulta inicial hasta la escritura. Sin presiones, con información transparente." },
    { num: "02", title: "Financiamiento a medida", desc: "Planes de pago adaptados a tu situación. Cuotas en pesos o dólares, con condiciones pensadas para que la inversión sea accesible." },
    { num: "03", title: "Entrega con infraestructura", desc: "Los lotes se entregan con todos los servicios instalados. Podés construir desde el primer día sin sorpresas." },
    { num: "04", title: "Comunidad en crecimiento", desc: "Un barrio que nace con visión de largo plazo, con espacios comunes, seguridad y estética cuidada en cada detalle." },
  ]

  return (
    <div
      className="font-body page-root"
      style={{ background: "var(--cream)", color: "var(--dark)", overflowX: "hidden", width: "100%", position: "relative" }}
    >
      <FontStyle />

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 72 }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://imgur.com/pgVMN5C.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,24,20,0.78) 0%, rgba(26,24,20,0.4) 60%, transparent 100%)" }} />
        </motion.div>

        <motion.div className="hero-text-wrap" style={{ opacity: heroOpacity, position: "relative", zIndex: 2, maxWidth: 760, padding: "0 48px", width: "100%" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="hero-badge"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,169,110,0.15)", border: "1px solid var(--gold)", borderRadius: 40, padding: "6px 16px", marginBottom: 28, color: "var(--gold-light)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}
          >
            <Star size={10} fill="currentColor" /> Desarrollo premium · Córdoba
          </motion.div>

          <motion.h1
            className="font-pinyon hero-title"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            style={{ fontFamily: "'Pinyon Script', cursive", fontSize: "clamp(80px,11vw,148px)", fontWeight: 400, color: "#fff", lineHeight: 0.9, marginBottom: 28 }}
          >
            La <span style={{ color: "var(--gold-light)" }}>Feliza</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(14px,2vw,18px)", lineHeight: 1.7, maxWidth: 480, marginBottom: 40, fontWeight: 300 }}
          >
            Un desarrollo inmobiliario de alta gama pensado para quienes buscan combinar calidad de vida, naturaleza y una inversión con proyección real.
          </motion.p>

          <motion.div className="hero-buttons" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.38 }} style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href={whatsappLink} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "#fff", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 8px 32px rgba(201,169,110,0.4)", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(201,169,110,0.55)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,169,110,0.4)" }}
            >
              Hablar con un asesor <ArrowRight size={16} />
            </a>
            <a href="#simulador"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "16px 32px", borderRadius: 50, fontSize: 14, fontWeight: 400, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", backdropFilter: "blur(8px)", whiteSpace: "nowrap" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)" }}
            >
              Simular inversión
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.15em", zIndex: 2 }}
        >
          <span style={{ textTransform: "uppercase" }}>Explorar</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)" }} />
        </motion.div>
      </section>

      {/* ══ INFO CARDS ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.08 } } }} style={{ textAlign: "center", marginBottom: 64 }}>
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>El proyecto</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 16 }}>
              Un desarrollo pensado<br /><em>para el futuro</em>
            </motion.h2>
            <motion.div variants={fadeUp} custom={2} className="gold-divider" style={{ marginTop: 24 }} />
          </motion.div>
          <div className="info-cards-grid">
            {infoCards.map((item, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.1)" }}
                style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 20, padding: "32px 24px", transition: "box-shadow 0.3s" }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", marginBottom: 20 }}>{item.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINANCIACIÓN ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.09 } } }} style={{ marginBottom: 72 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 0 }} className="financ-header-grid">
              <style>{`@media (min-width: 769px) { .financ-header-grid { grid-template-columns: 1fr 1fr !important; gap: 64px !important; align-items: end !important; } }`}</style>
              <div>
                <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Financiación propia</motion.p>
                <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                  Invertí sin necesitar<br /><em style={{ color: "var(--gold-light)" }}>un banco</em>
                </motion.h2>
                <motion.div variants={fadeUp} custom={2} style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, var(--gold), transparent)", marginBottom: 24 }} />
                <motion.p variants={fadeUp} custom={3} style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px,1.8vw,16px)", lineHeight: 1.8, maxWidth: 440 }}>
                  Contamos con planes de financiación directa, sin intermediarios bancarios. Cuotas accesibles en pesos o dólares, adaptadas a tu capacidad de pago. Comprás tu lote hoy y empezás a construir tu patrimonio de inmediato.
                </motion.p>
              </div>
              <motion.div variants={fadeUp} custom={2} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 32 }}>
                <div style={{ borderLeft: "1px solid rgba(201,169,110,0.25)", paddingLeft: 32 }}>
                  <div className="font-display" style={{ fontSize: "clamp(52px,7vw,88px)", fontWeight: 300, color: "var(--gold)", lineHeight: 0.9 }}>0%</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 10 }}>Interés para las primeras cuotas</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {financCards.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.15)", borderRadius: 16, padding: "28px 24px", transition: "border-color 0.3s, background 0.3s" }}
                whileHover={{ borderColor: "rgba(201,169,110,0.4)", background: "rgba(201,169,110,0.06)" }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(201,169,110,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 500, marginBottom: 8, letterSpacing: "0.02em" }}>{item.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.42)", fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ marginTop: 48, padding: "28px 32px", borderRadius: 14, border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}
          >
            <div>
              <p style={{ color: "#fff", fontSize: "clamp(14px,2vw,16px)", fontWeight: 500, marginBottom: 4 }}>¿Querés conocer tu plan de cuotas?</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Un asesor te arma una propuesta personalizada sin compromiso.</p>
            </div>
            <a href={whatsappLink} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "#fff", padding: "14px 28px", borderRadius: 50, fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 6px 24px rgba(201,169,110,0.35)", whiteSpace: "nowrap", flexShrink: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(201,169,110,0.5)" }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(201,169,110,0.35)" }}
            >
              Consultar financiación <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section ref={statsRef} className="section-pad" style={{ padding: "80px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(201,169,110,0.04) 0%, transparent 60%)" }} />
        <div className="section-inner" style={{ position: "relative", zIndex: 1 }}>
          <div className="stats-grid">
            {stats.map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="font-display" style={{ fontSize: "clamp(36px,4vw,64px)", fontWeight: 300, color: "var(--gold-light)", lineHeight: 1 }}>
                  {statsInView && <CountUp end={s.n} duration={2} />}{s.suffix}
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ MAPA ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} style={{ textAlign: "center", marginBottom: 56 }}>
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Ubicación</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Encontranos en <em>Córdoba</em></motion.h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}
          >
            <div className="map-wrap" style={{ height: 480 }}>
              <Map mapboxAccessToken={mapboxToken} initialViewState={{ longitude, latitude, zoom: 15 }} mapStyle="mapbox://styles/mapbox/satellite-streets-v12" style={{ width: "100%", height: "100%" }}>
                <Marker longitude={longitude} latitude={latitude} anchor="bottom">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ background: "var(--gold)", color: "#fff", padding: "8px 16px", borderRadius: 40, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(201,169,110,0.5)", fontFamily: "'Jost',sans-serif", letterSpacing: "0.04em" }}>La Feliza</div>
                    <div style={{ width: 2, height: 12, background: "var(--gold)" }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--gold)" }} />
                  </motion.div>
                </Marker>
              </Map>
            </div>
          </motion.div>
          <div className="map-tags" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
            {[
              { icon: <MapPin size={13} />, text: "Camino a San Carlos, Córdoba" },
              { icon: <Waves size={13} />, text: "A 10 min del centro" },
              { icon: <TreePine size={13} />, text: "Zona de alto crecimiento" },
            ].map((tag, i) => (
              <span key={i} className="map-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,169,110,0.1)", border: "1px solid var(--border)", borderRadius: 40, padding: "8px 14px", fontSize: 12, color: "var(--gold-dark)", fontWeight: 500, whiteSpace: "nowrap" }}>
                {tag.icon} {tag.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RENDERS ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "#fff", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} style={{ textAlign: "center", marginBottom: 48 }}>
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Renders</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Visualización del <em>proyecto</em></motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ color: "var(--muted)", fontSize: 13, marginTop: 12 }}>
              Clic en cualquier imagen para verla en detalle · Flechas del teclado para navegar
            </motion.p>
          </motion.div>
          <RenderGallery renders={renders} />
        </div>
      </section>

      {/* ══ VIDEO GALLERY ══ */}
      <VideoGallery />

      {/* ══ SIMULADOR ══ */}
      <section id="simulador" className="section-pad" style={{ padding: "100px 0", background: "var(--cream)" }}>
        <div className="section-inner" style={{ maxWidth: 900 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ visible: { transition: { staggerChildren: 0.1 } } }} style={{ textAlign: "center", marginBottom: 56 }}>
            <motion.p variants={fadeUp} custom={0} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>Calculadora</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display" style={{ fontSize: "clamp(28px,4vw,52px)", fontWeight: 400 }}>Simulador de <em>inversión</em></motion.h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="sim-box"
            style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 28, padding: "48px 40px", boxShadow: "0 30px 80px rgba(0,0,0,0.07)", width: "100%" }}
          >
            <div className="sim-controls-grid">
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Capital inicial</span>
                  <span className="font-display" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>USD {investment.toLocaleString()}</span>
                </div>
                <input type="range" min={minInv} max={maxInv} step={5000} value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="premium-range" style={{ "--val": `${rangeVal}%` } as React.CSSProperties} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                  <span>USD 100K</span><span>USD 500K</span>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, gap: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", whiteSpace: "nowrap" }}>Horizonte</span>
                  <span className="font-display" style={{ fontSize: "clamp(15px,3.5vw,22px)", fontWeight: 600, color: "var(--dark)" }}>{years} {years === 1 ? "año" : "años"}</span>
                </div>
                <input type="range" min={1} max={10} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="premium-range" style={{ "--val": `${((years - 1) / 9) * 100}%` } as React.CSSProperties} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
                  <span>1 año</span><span>10 años</span>
                </div>
              </div>
            </div>
            <div className="sim-results-grid" style={{ background: "rgba(201,169,110,0.06)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 20px", marginBottom: 40 }}>
              {[
                { label: "Inversión inicial", value: `USD ${investment.toLocaleString()}`, color: "var(--dark)" },
                { label: "Ganancia estimada", value: `+USD ${gain.toLocaleString()}`, color: "#16a34a" },
                { label: `Valor en ${years} años`, value: `USD ${finalValue.toLocaleString()}`, color: "var(--gold-dark)" },
              ].map((r, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{r.label}</div>
                  <div className="font-display" style={{ fontSize: "clamp(14px,3vw,20px)", fontWeight: 600, color: r.color, wordBreak: "break-word" }}>{r.value}</div>
                </div>
              ))}
            </div>
            <div style={{ width: "100%", overflow: "hidden" }}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="año" tick={{ fontSize: 10, fontFamily: "'Jost',sans-serif", fill: "var(--muted)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fontFamily: "'Jost',sans-serif", fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} width={40} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="valor" stroke="var(--gold)" strokeWidth={2.5} fill="url(#goldGrad)" dot={{ fill: "var(--gold)", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "var(--gold)", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 16, letterSpacing: "0.05em" }}>
              * Proyección basada en una tasa de valorización anual estimada del 8%. No constituye asesoramiento financiero.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══ EXPERIENCIA ══ */}
      <section className="section-pad" style={{ padding: "100px 0", background: "var(--dark)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 60%)" }} />
        <div className="section-inner" style={{ maxWidth: 900, position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Por qué elegirnos</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-display" style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 60 }}>
            La experiencia<br /><em style={{ color: "var(--gold-light)" }}>La Feliza</em>
          </motion.h2>
          <div style={{ display: "grid", gap: 2 }}>
            {expRows.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="exp-row" style={{ borderBottom: i < expRows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
              >
                <span className="font-display exp-num" style={{ fontWeight: 300, color: "rgba(201,169,110,0.3)", lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{item.num}</span>
                <div style={{ textAlign: "left", minWidth: 0 }}>
                  <h3 style={{ color: "#fff", fontSize: "clamp(14px,2.5vw,17px)", fontWeight: 500, marginBottom: 8, letterSpacing: "0.02em" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(13px,2vw,14px)", lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ background: "#1f1f1f", padding: "100px 0 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ borderRadius: 28, overflow: "hidden", position: "relative", minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,24,20,0.80), rgba(26,24,20,0.55))" }} />
            <div className="cta-inner" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "60px 32px", width: "100%" }}>
              <p style={{ color: "var(--gold)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>Tu próximo paso</p>
              <h2 className="font-display" style={{ fontSize: "clamp(32px,5vw,64px)", fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: 20 }}>
                Invertí en<br /><em style={{ color: "var(--gold-light)" }}>La Feliza</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "clamp(14px,2vw,16px)", maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.7 }}>
                Una oportunidad única para participar en uno de los desarrollos con mayor proyección de Córdoba.
              </p>
              <a href={whatsappLink} target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--gold)", color: "#fff", padding: "18px 40px", borderRadius: 50, fontSize: 14, fontWeight: 500, letterSpacing: "0.07em", textDecoration: "none", transition: "all 0.25s", boxShadow: "0 8px 40px rgba(201,169,110,0.45)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 50px rgba(201,169,110,0.55)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 40px rgba(201,169,110,0.45)" }}
              >
                Contactar un asesor <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
        <div style={{ height: 64, background: "#1f1f1f" }} />
      </section>
    </div>
  )
}

export default Proyectos