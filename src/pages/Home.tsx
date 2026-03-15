import React, { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Search,
  Instagram
} from "lucide-react"

import { motion } from "framer-motion"

import PropertyCard from "../components/PropertyCard"
import { supabase } from "../lib/supabaseClient"
import { Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"


function RatingBar({ label, value, visible }) {
  return (
    <div>

      <div className="flex justify-between text-sm mb-2 text-gray-700">
        <span>{label}</span>
        <span>{(value / 20).toFixed(1)}/5</span>
      </div>

      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">

        <motion.div
          initial={{ width: 0 }}
          animate={visible ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
        />

      </div>

    </div>
  )
}


const Home = () => {

  const navigate = useNavigate()

  const ref = useRef(null)

  const [visible, setVisible] = useState(false)

  const [featuredProperties, setFeaturedProperties] = useState([])

  const [filters, setFilters] = useState({
    operacion: "Venta",
    tipo: "Departamento",
    zona: "Todas"
  })

  const locations = [
    {
      name: "MANANTIALES",
      filter: "manantiales",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070"
    },
    {
      name: "NUEVA CÓRDOBA",
      filter: "nueva-cordoba",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2070"
    },
    {
      name: "ZONA SUR",
      filter: "zona-sur",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070"
    },
    {
      name: "ZONA NORTE",
      filter: "zona-norte",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb3?q=80&w=2070"
    }
  ]


  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.4 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()

  }, [])


  useEffect(() => {

    const loadFeatured = async () => {

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .limit(5)

      if (data) setFeaturedProperties(data)

    }

    loadFeatured()

  }, [])


  const goToLocation = (zone) => {
    navigate(`/propiedades?zona=${zone}`)
  }

  const handleChange = (e) => {

    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })

  }

  const handleSearch = (e) => {

    e.preventDefault()

    const params = new URLSearchParams()

    if (filters.operacion) params.append("operacion", filters.operacion)
    if (filters.tipo) params.append("tipo", filters.tipo)
    if (filters.zona) params.append("zona", filters.zona)

    navigate(`/propiedades?${params.toString()}`)

  }


  return (
    <div className="overflow-hidden">
{/* Hero Section */}
<section className="relative min-h-[105vh] md:min-h-[90vh] pt-32 md:pt-20 pb-20 md:pb-12 flex items-center justify-center overflow-hidden">

  {/* Background */}
  <div className="absolute inset-0">

    <video
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
 <div className="w-full h-full object-cover scale-110"></div>
    <div className="absolute inset-0 bg-black/40"></div>

    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60"></div>

  </div>


  {/* CONTENT */}
<div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-6 md:pt-0">

    <h1
      data-aos="fade-up"
      className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
    >
      Transformando la experiencia <br/>
      <span className="text-white/80">inmobiliaria</span>
    </h1>

    <p
      data-aos="fade-up"
      data-aos-delay="100"
      className="text-white/80 text-base md:text-lg mt-4 max-w-xl mx-auto"
    >
      Encontrá la propiedad ideal con un servicio profesional,
      transparente y enfocado en resultados.
    </p>


    {/* SEARCH BAR */}
    <div
      data-aos="fade-up"
      data-aos-delay="200"
      className="mt-12 md:mt-10"
    >

      <div
        className="
        backdrop-blur-xl
        bg-white/10
        border border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        rounded-2xl md:rounded-full
        p-3 md:p-2
        max-w-4xl
        mx-auto
        "
      >

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 items-center"
        >

          {/* OPERACION */}
          <div className="px-5 py-3 text-left">

            <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider block mb-1">
              Operación
            </label>

            <select
              name="operacion"
              value={filters.operacion}
              onChange={handleChange}
              className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
            >
              <option className="text-black">Venta</option>
              <option className="text-black">Alquiler</option>
            </select>

          </div>


          {/* TIPO */}
          <div className="px-5 py-3 border-t md:border-t-0 md:border-l border-white/20 text-left">

            <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider block mb-1">
              Tipo
            </label>

            <select
              name="tipo"
              value={filters.tipo}
              onChange={handleChange}
              className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
            >
              <option className="text-black">Departamento</option>
              <option className="text-black">Casa</option>
              <option className="text-black">Terreno</option>
              <option className="text-black">Local</option>
            </select>

          </div>


          {/* ZONA */}
          <div className="px-5 py-3 border-t md:border-t-0 md:border-l border-white/20 text-left">

            <label className="text-white/60 text-[10px] font-semibold uppercase tracking-wider block mb-1">
              Ubicación
            </label>

            <select
              name="zona"
              value={filters.zona}
              onChange={handleChange}
              className="w-full bg-transparent text-white text-sm outline-none cursor-pointer"
            >
              <option className="text-black">Todas</option>
              <option className="text-black">Nueva Córdoba</option>
              <option className="text-black">Centro</option>
              <option className="text-black">Valle Escondido</option>
            </select>

          </div>


          {/* BOTON */}
          <div className="p-2">

            <button
              type="submit"
              className="
              w-full
              rounded-full
              bg-gradient-to-b
              from-gray-200
              to-gray-300
              text-gray-800
              font-semibold
              py-3
              flex items-center
              justify-center
              gap-2
              shadow-[0_10px_30px_rgba(0,0,0,0.25)]
              border border-white/40
              hover:scale-[1.02]
              hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)]
              transition-all
              "
            >
              <Search size={18}/>
              Buscar
            </button>

          </div>

        </form>

      </div>

    </div>

  </div>

</section>
<section className="py-24 bg-gray-100">

<div className="max-w-7xl mx-auto px-6">

<h2
data-aos="fade-up"
className="text-3xl md:text-4xl font-bold text-center mb-16 text-brand-primary"
>
¿Dónde te gustaría vivir?
</h2>

{/* DESKTOP GRID */}

<div className="hidden md:grid grid-cols-2 gap-6">

{locations.map((loc,i)=>(

<div
key={i}
data-aos="fade-up"
data-aos-delay={i*100}
onClick={()=>goToLocation(loc.filter)}
className="relative h-[260px] rounded-2xl overflow-hidden cursor-pointer group"
>

{/* image */}

<img
src={loc.image}
className="
absolute inset-0 w-full h-full object-cover
transition-transform duration-700
group-hover:scale-110
"
/>

{/* overlay */}

<div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"/>

{/* text */}

<div
className="
absolute inset-0
flex items-center justify-center
text-center
transition-all duration-500
group-hover:-translate-y-2
"
>

<h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
{loc.name}
</h3>

</div>

</div>

))}

</div>

{/* MOBILE SWIPER */}

<div className="md:hidden">

<Swiper
spaceBetween={20}
slidesPerView={1.2}
grabCursor={true}
>

{locations.map((loc,i)=>(

<SwiperSlide key={i}>

<div
onClick={()=>goToLocation(loc.filter)}
className="relative h-[220px] rounded-2xl overflow-hidden cursor-pointer"
>

<img
src={loc.image}
className="absolute inset-0 w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-black/30"/>

<div className="absolute inset-0 flex items-center justify-center">

<h3 className="text-white text-xl font-bold text-center">
{loc.name}
</h3>

</div>

</div>

</SwiperSlide>

))}

</Swiper>

</div>

</div>

</section>



     {/* Featured Properties */}

<section className="py-24 bg-white overflow-hidden">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div
      className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
      data-aos="fade-up"
    >

      <div>

        <span className="text-brand-primary/40 font-bold uppercase tracking-widest text-xs mb-2 block">
          Oportunidades
        </span>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-primary">
          Propiedades Destacadas
        </h2>

      </div>

      <Link
        to="/propiedades"
        className="text-brand-primary font-semibold flex items-center gap-2 hover:underline"
      >
        Ver todo el catálogo <ArrowRight size={18} />
      </Link>

    </div>

    {/* SWIPER */}

<Swiper
    spaceBetween={24}
  slidesPerView={1.15}
  grabCursor={true}
  breakpoints={{
    640: {
      slidesPerView: 1.2
    },
    768: {
      slidesPerView: 2
    },
    1024: {
      slidesPerView: 3
    }
  }}
      className="!overflow-visible"
    >

      {featuredProperties.map((property) => (

        <SwiperSlide key={property.id}>

          <div data-aos="fade-up">

            <PropertyCard property={property} />

          </div>

        </SwiperSlide>

      ))}

    </Swiper>

  </div>

</section>

      {/* Process Section */}

<section className="py-24 bg-gray-50">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="text-center mb-16" data-aos="fade-up">

      <span className="text-brand-primary/40 font-bold uppercase tracking-widest text-xs mb-2 block">
        Nuestro proceso
      </span>

      <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-primary">
        Una experiencia inmobiliaria clara
      </h2>

    </div>

    <div className="grid md:grid-cols-3 gap-12">

      <div className="text-center" data-aos="fade-up">
        <div className="mb-6 flex justify-center">
          <Search size={40} className="text-brand-primary"/>
        </div>

        <h3 className="text-xl font-semibold mb-3">Búsqueda</h3>

        <p className="text-brand-secondary text-sm leading-relaxed">
          Analizamos tus necesidades y seleccionamos propiedades que realmente se adapten a tu proyecto.
        </p>
      </div>

      <div className="text-center" data-aos="fade-up" data-aos-delay="100">
        <div className="mb-6 flex justify-center">
          <Star size={40} className="text-brand-primary"/>
        </div>

        <h3 className="text-xl font-semibold mb-3">Selección</h3>

        <p className="text-brand-secondary text-sm leading-relaxed">
          Te acompañamos en cada visita brindando información clara y asesoramiento profesional.
        </p>
      </div>

      <div className="text-center" data-aos="fade-up" data-aos-delay="200">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 size={40} className="text-brand-primary"/>
        </div>

        <h3 className="text-xl font-semibold mb-3">Concreción</h3>

        <p className="text-brand-secondary text-sm leading-relaxed">
          Nos encargamos de todo el proceso legal y administrativo hasta concretar la operación.
        </p>
      </div>

    </div>

  </div>

</section>
{/* Why Us */}

<section className="py-24 bg-white">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      <div data-aos="fade-right">

        <span className="text-brand-primary/40 font-bold uppercase tracking-widest text-xs mb-2 block">
          Diferencial
        </span>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-primary mb-6">
          Más que una inmobiliaria
        </h2>

        <p className="text-brand-secondary leading-relaxed mb-8">
          Nuestro enfoque se basa en la transparencia, el profesionalismo y el acompañamiento personalizado en cada operación inmobiliaria.
        </p>

        <ul className="space-y-4">

          <li className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-brand-primary"/>
            <span>Asesoramiento profesional</span>
          </li>

          <li className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-brand-primary"/>
            <span>Transparencia en cada operación</span>
          </li>

          <li className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-brand-primary"/>
            <span>Amplia red de compradores</span>
          </li>

        </ul>

      </div>

      <div data-aos="fade-left">

        <img
          src="https://imgur.com/ODMH1Wz.jpg"
          className="rounded-xl shadow-xl"
        />

      </div>

    </div>

  </div>

</section>
<section
ref={ref}
className="relative py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
data-aos="fade-up"
>

{/* background glow */}

<div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-200/30 blur-3xl rounded-full"/>

<div className="max-w-6xl mx-auto px-6">

<div className="text-center mb-16">

<span className="text-xs uppercase tracking-widest text-gray-400 font-semibold block mb-3">
Reputación
</span>

<h2 className="text-3xl md:text-4xl font-bold text-gray-900">
Valoraciones de nuestros clientes
</h2>

</div>

{/* card */}

<div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-10 md:p-14">

{/* overlay premium */}

<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none"/>

<div className="relative grid md:grid-cols-2 gap-12 items-center">

{/* rating */}

<div className="text-center md:text-left">

<div className="flex items-center justify-center md:justify-start gap-3 mb-4">

<Star className="text-yellow-400 fill-yellow-400" size={34}/>

<span className="text-5xl font-bold text-gray-900">
4.9
</span>

</div>

<p className="text-gray-500 text-sm">
Calificación promedio de nuestros clientes
</p>

</div>

{/* bars */}

<div className="space-y-6">

<RatingBar
label="Atención"
value={100}
visible={visible}
/>

<RatingBar
label="Tiempo de respuesta"
value={96}
visible={visible}
/>

<RatingBar
label="Recomendación"
value={96}
visible={visible}
/>

</div>

</div>

{/* CTA */}

<div className="mt-12 flex justify-center">

<a
href="https://www.zonaprop.com.ar/inmobiliarias/arman-grupo-inmobiliario_30703053-inmuebles.html"
target="_blank"
className="group relative inline-flex items-center gap-2 bg-[#ff6a00] text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
>

<span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition rounded-xl"/>

<span className="relative">
Ver en ZonaProp
</span>

</a>

</div>

</div>

</div>

</section>
{/* Instagram */}

<section className="py-24 bg-white">

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="flex justify-between items-center mb-12">

      <h2 className="text-3xl font-display font-bold text-brand-primary">
        Seguinos en Instagram
      </h2>

      <a
        href="#"
        className="flex items-center gap-2 text-brand-primary hover:underline"
      >
        <Instagram size={18}/>
        @armanpropiedades
      </a>

    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {[1,2,3,4].map((i)=>(
        <img
          key={i}
          src={`https://picsum.photos/seed/insta${i}/400/400`}
          className="rounded-lg object-cover w-full h-full hover:opacity-80 transition"
        />
      ))}

    </div>

  </div>

</section>
{/* CTA */}

<section className="py-24 bg-brand-primary text-white">

  <div className="max-w-4xl mx-auto text-center px-6">

    <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
      ¿Querés vender o comprar una propiedad?
    </h2>

    <p className="text-white/80 mb-10">
      Nuestro equipo está listo para asesorarte y acompañarte en todo el proceso inmobiliario.
    </p>

    <Link
      to="/contacto"
      className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
    >
      Contactar ahora
    </Link>

  </div>

</section>
    </div>
  )
}

export default Home