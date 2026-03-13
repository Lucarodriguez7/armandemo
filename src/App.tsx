import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

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
      } else {
        console.log("Visita guardada")
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

  useEffect(()=>{
    window.scrollTo(0,0)
  },[pathname])

  return null

}



/* =========================
   LAYOUT PUBLICO
========================= */

function PublicLayout(){

  return(

    <div className="flex flex-col min-h-screen">

      <TrackVisit/>

      <Navbar/>

      <main className="flex-grow">

        <Routes>

          <Route path="/" element={<Home/>} />
          <Route path="/propiedades" element={<Catalog/>} />
          <Route path="/propiedades/:id" element={<PropertyDetail/>} />
          <Route path="/tasaciones" element={<Tasaciones/>} />
          <Route path="/proyectos" element={<Proyectos/>} />
          <Route path="/nosotros" element={<Nosotros/>} />
          <Route path="/contacto" element={<Contacto/>} />

        </Routes>

      </main>

      <Footer/>

      <WhatsAppButton/>

    </div>

  )

}



/* =========================
   APP PRINCIPAL
========================= */

export default function App(){

  const [loading,setLoading] = useState(true)



  /* PRELOADER TIMER */

  useEffect(()=>{

    const timer = setTimeout(()=>{
      setLoading(false)
    },3000)

    return ()=> clearTimeout(timer)

  },[])



  /* AOS SOLO CUANDO TERMINA EL PRELOADER */

  useEffect(()=>{

    if(!loading){

      AOS.init({
        duration:1000,
        once:true,
        easing:'ease-out-cubic'
      })

    }

  },[loading])



  return(

    <>

      {/* PRELOADER ENCIMA DE TODO */}
      {loading && <Preloader/>}

      <Router>

        <ScrollToTop/>

        <Routes>

          {/* WEB NORMAL */}
          <Route path="/*" element={<PublicLayout/>} />

          {/* ADMIN (SIN NAVBAR NI FOOTER) */}

          <Route path="/admin/login" element={<Login/>} />
          <Route path="/admin/dashboard" element={<Dashboard/>} />
          <Route path="/admin/new" element={<NewProperty/>} />
          <Route path="/admin/leads" element={<Leads/>} />
          <Route path="/admin/insights" element={<Insights/>} />
          <Route path="/admin/edit/:id" element={<EditProperty />} />
          <Route path="/admin/properties" element={<PropertiesManager />} />

        </Routes>

      </Router>

    </>

  )

}