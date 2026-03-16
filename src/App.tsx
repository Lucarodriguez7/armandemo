import React, { useEffect, useState, ReactNode } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import "mapbox-gl/dist/mapbox-gl.css";
import { Navbar, Footer, WhatsAppButton } from './components/Layout'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import PropertyDetail from './pages/PropertyDetail'
import Tasaciones from './pages/Tasaciones'
import Proyectos from './pages/Proyectos'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'

import Login from './pages/admin/login'
import Dashboard from './pages/admin/dashboard'
import NewProperty from './pages/admin/NewProperty'
import Leads from "./pages/admin/Leads"
import Insights from "./pages/admin/Insights"
import EditProperty from "./pages/admin/EditProperty"
import PropertiesManager from "./pages/admin/PropertiesManager"

import 'swiper/css'
import { supabase } from "./lib/supabaseClient"



/* =========================
   PROTECTED ROUTE ADMIN
========================= */

function ProtectedRoute({ children }: { children: ReactNode }) {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {

    const checkUser = async () => {

      const { data } = await supabase.auth.getUser()

      setUser(data.user)
      setLoading(false)

    }

    checkUser()

  }, [])

  if (loading) return null

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>

}



/* =========================
   PRELOADER
========================= */

function Preloader() {

  return (

    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">

      <img
        src="/logo.png"
        alt="logo"
        className="
        w-[240px]
        sm:w-[300px]
        md:w-[380px]
        lg:w-[440px]
        animate-[logoFloat_2.5s_ease-in-out_infinite]
        "
      />

    </div>

  )

}



/* =========================
   TRACK VISITAS DEL SITIO
========================= */

function TrackVisit() {

  useEffect(() => {

    const sendVisit = async () => {

      const { error } = await supabase
        .from("events")
        .insert({ event_type: "site_visit" })

      if (error) {
        console.error("Error guardando visita:", error)
      }

    }

    sendVisit()

  }, [])

  return null

}



/* =========================
   SCROLL TOP
========================= */

const ScrollToTop = () => {

  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null

}



/* =========================
   LAYOUT PUBLICO
========================= */

function PublicLayout() {

  return (

    <div className="flex flex-col min-h-screen">

      <TrackVisit />

      <Navbar />

      <main className="flex-grow">

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/propiedades" element={<Catalog />} />
          <Route path="/propiedades/:id" element={<PropertyDetail />} />
          <Route path="/tasaciones" element={<Tasaciones />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />

        </Routes>

      </main>

      <Footer />

      <WhatsAppButton />

    </div>

  )

}



/* =========================
   APP PRINCIPAL
========================= */

export default function App() {

  const [loading, setLoading] = useState(true)



  /* PRELOADER TIMER */

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)

  }, [])



  /* AOS SOLO CUANDO TERMINA EL PRELOADER */

  useEffect(() => {

    if (!loading) {

      AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-out-cubic'
      })

    }

  }, [loading])



  return (

    <>

      {loading && <Preloader />}

      <Router>

        <ScrollToTop />

        <Routes>

          {/* WEB NORMAL */}
          <Route path="/*" element={<PublicLayout />} />



          {/* ADMIN */}

          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/new"
            element={
              <ProtectedRoute>
                <NewProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute>
                <Leads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute>
                <EditProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute>
                <PropertiesManager />
              </ProtectedRoute>
            }
          />

        </Routes>

      </Router>

    </>

  )

}