import React, { useState } from "react"
import {
MapPin,
TrendingUp,
ArrowRight,
ChevronLeft,
ChevronRight,
ShieldCheck,
TreePalm,
X
} from "lucide-react"

import { motion } from "framer-motion"
import CountUp from "react-countup"
import { useInView } from "react-intersection-observer"

import Map,{
Marker,
Source,
Layer
} from "react-map-gl/mapbox"

import type { FeatureCollection, Polygon } from "geojson"

const Proyectos = () => {

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN

const [activeRender,setActiveRender] = useState(0)
const [selectedLot,setSelectedLot] = useState<any>(null)
const [investment,setInvestment] = useState(45000)

const whatsappLink="https://wa.me/5493515052474"

const renders=[
"https://imgur.com/2IaGZZB.jpg",
"https://imgur.com/bPeK5g9.jpg",
"https://imgur.com/CcbDbEO.jpg"
]

const latitude=-31.509285
const longitude=-64.179648

const nextRender=()=>setActiveRender(p=>(p+1)%renders.length)
const prevRender=()=>setActiveRender(p=>(p-1+renders.length)%renders.length)

const estimatedValue=Math.round(investment*1.15*3)

const lotSize=0.00022

const generateLots=():FeatureCollection<Polygon>=>{

const features=[]

let id=1

for(let x=0;x<5;x++){
for(let y=0;y<4;y++){

const lng=longitude+(x*lotSize)
const lat=latitude+(y*lotSize)

features.push({
type:"Feature",
properties:{
id:`Lote ${id}`,
estado:["Disponible","Reservado","Vendido"][Math.floor(Math.random()*3)],
precio:40000+id*1500
},
geometry:{
type:"Polygon",
coordinates:[[
[lng,lat],
[lng+lotSize,lat],
[lng+lotSize,lat+lotSize],
[lng,lat+lotSize],
[lng,lat]
]]
}
})

id++

}
}

return{
type:"FeatureCollection",
features
}

}

const lotes=generateLots()

const {ref,inView}=useInView({triggerOnce:true,threshold:0.4})

return(

<div className="bg-white overflow-x-hidden">

{/* HERO */}

<section className="pt-32 pb-20">

<div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">

<div>

<h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
La Feliza
</h1>

<p className="text-gray-600 mb-8 text-lg leading-relaxed">
Un desarrollo inmobiliario premium pensado para quienes buscan combinar calidad de vida, naturaleza y una inversión con proyección.
</p>

<a
href={whatsappLink}
target="_blank"
className="bg-black text-white px-8 py-4 rounded-xl inline-flex items-center gap-3 hover:scale-105 transition"
>
Hablar con un asesor
<ArrowRight size={18}/>
</a>

</div>

<img
src="https://i.imgur.com/LvxkY54.jpg"
className="rounded-3xl shadow-2xl w-full h-[340px] md:h-[420px] object-cover"
/>

</div>

</section>


{/* INFO */}

<section className="py-24 bg-gray-50">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-4xl md:text-5xl font-semibold text-center mb-16 tracking-tight">
Un desarrollo pensado para el futuro
</h2>

<div className="grid md:grid-cols-2 gap-8">

{[
"Ubicado estratégicamente en la zona sur de Córdoba con acceso directo desde Camino a San Carlos.",
"Lotes residenciales desde 700 m² hasta más de 1.700 m² con privacidad y vistas abiertas.",
"Infraestructura completa con calles adoquinadas, iluminación y servicios subterráneos.",
"Masterplan con plaza central, SUM, espacios verdes y sector housing."
].map((t,i)=>(

<motion.div
key={i}
initial={{opacity:0,y:20}}
whileInView={{opacity:1,y:0}}
viewport={{once:true}}
transition={{duration:0.5,delay:i*0.1}}
className="bg-white p-8 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
>

<p className="text-gray-700 leading-relaxed">
{t}
</p>

</motion.div>

))}

</div>

</div>

</section>


{/* BENEFICIOS */}

<section className="py-24">

<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

{[
{icon:<MapPin/>,title:"Ubicación estratégica",desc:"Acceso inmediato a las principales arterias."},
{icon:<TrendingUp/>,title:"Alta valorización",desc:"Zona con crecimiento urbano sostenido."},
{icon:<ShieldCheck/>,title:"Inversión segura",desc:"Infraestructura completa."},
{icon:<TreePalm/>,title:"Entorno natural",desc:"Espacios verdes diseñados para bienestar."}
].map((b,i)=>(

<motion.div
key={i}
whileHover={{y:-6}}
className="p-8 rounded-2xl bg-white shadow-[0_15px_50px_rgba(0,0,0,0.08)]"
>

<div className="mb-4">{b.icon}</div>

<h3 className="font-semibold mb-2">
{b.title}
</h3>

<p className="text-gray-500 text-sm">
{b.desc}
</p>

</motion.div>

))}

</div>

</section>


{/* STATS */}

<section ref={ref} className="py-20 bg-gray-50">

<div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-10">

{[
{n:120,t:"Lotes"},
{n:15,t:"ROI anual"},
{n:5,t:"Min del centro"},
{n:2026,t:"Año lanzamiento"}
].map((s,i)=>(

<div key={i}>

<h3 className="text-4xl font-semibold">
{inView && <CountUp end={s.n} duration={2}/>}
</h3>

<p className="text-gray-600 text-sm">
{s.t}
</p>

</div>

))}

</div>

</section>


{/* MAPA INTERACTIVO */}

<section className="py-24">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-4xl font-semibold text-center mb-16">
Masterplan interactivo
</h2>

<div className="relative rounded-3xl overflow-hidden shadow-xl">

<Map
mapboxAccessToken={mapboxToken}
initialViewState={{
longitude,
latitude,
zoom:16
}}
mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
style={{width:"100%",height:"520px"}}
interactiveLayerIds={["lotes-fill"]}
onClick={(e)=>{

const feature=e.features?.[0]

if(feature){
setSelectedLot(feature.properties)
}

}}
>

<Source id="lotes" type="geojson" data={lotes}>

<Layer
id="lotes-fill"
type="fill"
paint={{
"fill-color":[
"match",
["get","estado"],
"Disponible","#22c55e",
"Reservado","#eab308",
"Vendido","#ef4444",
"#ccc"
],
"fill-opacity":0.7
}}
/>

</Source>

</Map>


{selectedLot && (

<div className="absolute bottom-6 left-6 bg-white p-6 rounded-2xl shadow-2xl w-[260px]">

<div className="flex justify-between items-center mb-3">

<h3 className="font-semibold">
{selectedLot.id}
</h3>

<button onClick={()=>setSelectedLot(null)}>
<X size={16}/>
</button>

</div>

<p className="text-sm text-gray-500 mb-2">
Estado: {selectedLot.estado}
</p>

<p className="font-semibold mb-4">
USD {selectedLot.precio}
</p>

<a
href={whatsappLink}
target="_blank"
className="bg-black text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2"
>
Consultar
<ArrowRight size={14}/>
</a>

</div>

)}

</div>

</div>

</section>


{/* RENDERS RESPONSIVE */}

<section className="py-24 bg-gray-50">

<div className="max-w-5xl mx-auto px-6 text-center">

<h2 className="text-4xl font-semibold mb-12">
Visualización del proyecto
</h2>

<div className="relative">

<motion.img
key={renders[activeRender]}
src={renders[activeRender]}
initial={{opacity:0,scale:0.95}}
animate={{opacity:1,scale:1}}
transition={{duration:0.4}}
className="w-full rounded-3xl shadow-xl object-cover aspect-[16/9]"
/>

<div className="flex justify-center gap-6 mt-6">

<button
onClick={prevRender}
className="bg-white p-3 rounded-xl shadow hover:scale-110"
>
<ChevronLeft/>
</button>

<button
onClick={nextRender}
className="bg-white p-3 rounded-xl shadow hover:scale-110"
>
<ChevronRight/>
</button>

</div>

</div>

</div>

</section>


{/* SIMULADOR */}

<section className="py-24">

<div className="max-w-3xl mx-auto px-6 text-center bg-gray-100 p-10 rounded-3xl shadow-lg">

<h2 className="text-3xl font-semibold mb-8">
Simulador de inversión
</h2>

<input
type="range"
min="40000"
max="80000"
value={investment}
onChange={(e)=>setInvestment(Number(e.target.value))}
className="w-full mb-6"
/>

<p className="text-lg mb-2">
Inversión: <strong>${investment}</strong>
</p>

<p className="text-2xl font-semibold">
Valor estimado en 3 años: ${estimatedValue}
</p>

</div>

</section>


{/* CTA */}

<section className="py-28">

<div className="max-w-6xl mx-auto px-6">

<div
className="rounded-3xl p-16 md:p-20 text-center text-white shadow-2xl"
style={{
backgroundImage:"url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070')",
backgroundSize:"cover",
backgroundPosition:"center"
}}
>

<h2 className="text-4xl font-semibold mb-6">
Invertí en La Feliza
</h2>

<p className="mb-10 text-white/90 max-w-xl mx-auto">
Una oportunidad única para participar en uno de los desarrollos con mayor proyección.
</p>

<a
href={whatsappLink}
target="_blank"
className="bg-white text-black px-10 py-4 rounded-xl inline-flex items-center gap-3 hover:scale-105 transition"
>
Contactar asesor
<ArrowRight/>
</a>

</div>

</div>

</section>

</div>

)

}

export default Proyectos