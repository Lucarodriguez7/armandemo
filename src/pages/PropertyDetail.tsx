import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

import {
MapPin,
BedDouble,
Bath,
Maximize,
ArrowLeft,
ChevronLeft,
ChevronRight,
X,
ExternalLink,
Phone
} from "lucide-react"

import PropertyCard from "../components/PropertyCard"
import ShareButton from "../components/ShareButton"

const STORAGE_URL =
"https://nnybfkvrruukkfprjzew.supabase.co/storage/v1/object/public/properties/"

export default function PropertyDetail(){

const { id } = useParams()

const [property,setProperty] = useState<any>(null)
const [images,setImages] = useState<string[]>([])
const [activeImage,setActiveImage] = useState(0)
const [galleryOpen,setGalleryOpen] = useState(false)

const [similar,setSimilar] = useState<any[]>([])

const [lead,setLead] = useState({
name:"",
email:"",
phone:"",
message:""
})

useEffect(()=>{

async function fetchProperty(){

const { data } = await supabase
.from("properties")
.select("*")
.eq("id",id)
.single()

if(!data) return

setProperty(data)

let imgs:string[]=[]

try{

if(Array.isArray(data.images)) imgs=data.images
else if(typeof data.images==="string") imgs=JSON.parse(data.images)

}catch{
imgs=[]
}

const urls = imgs.map((img:string)=>encodeURI(STORAGE_URL+img))
setImages(urls)

const { data:similarData } = await supabase
.from("properties")
.select("*")
.eq("city",data.city)
.neq("id",data.id)
.limit(3)

setSimilar(similarData||[])

}

fetchProperty()

window.scrollTo(0,0)

},[id])

if(!property){

return(
<div className="min-h-screen flex items-center justify-center">
Cargando propiedad...
</div>
)

}

function nextImage(){
setActiveImage(prev => prev===images.length-1?0:prev+1)
}

function prevImage(){
setActiveImage(prev => prev===0?images.length-1:prev-1)
}

const formattedPrice =
new Intl.NumberFormat("es-AR").format(property.price||0)

const latitude = property.latitude
const longitude = property.longitude

const locationText = [property.zone, property.city]
.filter(Boolean)
.join(", ")

async function submitLead(e:any){

e.preventDefault()

await supabase.from("leads").insert({
name:lead.name,
email:lead.email,
phone:lead.phone,
message:lead.message,
property_id:property.id,
property_title:property.title
})

setLead({
name:"",
email:"",
phone:"",
message:""
})

alert("Consulta enviada")

}

return(

<div className="bg-gray-50 min-h-screen pt-24 pb-20 overflow-x-hidden">

<div className="max-w-7xl mx-auto px-4 w-full">

<Link
to="/propiedades"
className="flex items-center text-sm text-gray-500 mb-6"
>
<ArrowLeft size={16} className="mr-2"/>
Volver
</Link>

{/* GRID */}

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

{/* CONTENIDO */}

<div className="lg:col-span-2 space-y-8">

{/* GALERIA */}

<div className="bg-white rounded-xl shadow-sm overflow-hidden w-full">

<div
className="relative aspect-[4/3] md:aspect-[16/9] cursor-pointer"
onClick={()=>setGalleryOpen(true)}
>

<img
src={images[activeImage] || "https://via.placeholder.com/1200x800"}
className="w-full h-full object-cover"
/>

</div>

<div className="flex gap-2 p-4 overflow-x-auto">

{images.map((img,i)=>(

<button
key={i}
onClick={()=>setActiveImage(i)}
className={`flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-md overflow-hidden border
${i===activeImage ? "border-black":"border-transparent"}
`}
>

<img
src={img}
className="w-full h-full object-cover"
/>

</button>

))}

</div>

</div>

{/* CARACTERISTICAS */}

<div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">

<h2 className="text-2xl font-bold mb-6">
Características
</h2>

<div className="grid grid-cols-3 gap-3">

<Feature icon={<BedDouble size={18}/>} label="Habitaciones" value={property.bedrooms}/>
<Feature icon={<Bath size={18}/>} label="Baños" value={property.bathrooms}/>
<Feature icon={<Maximize size={18}/>} label="m²" value={property.area}/>

</div>

</div>

{/* DESCRIPCION */}

<div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">

<h3 className="text-xl font-bold mb-4">
Descripción
</h3>

<p className="text-gray-600 leading-relaxed whitespace-pre-line">
{property.description}
</p>

</div>

{/* MAPA */}

{latitude && longitude &&(

<div className="bg-white p-6 rounded-xl shadow-sm w-full">

<h3 className="text-xl font-bold mb-4">
Ubicación
</h3>

<iframe
className="w-full rounded-lg"
height="320"
loading="lazy"
src={`https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
/>

<a
href={`https://www.google.com/maps?q=${latitude},${longitude}`}
target="_blank"
className="flex items-center gap-2 text-sm mt-3"
>

Abrir en Google Maps
<ExternalLink size={16}/>

</a>

</div>

)}

</div>

{/* SIDEBAR */}

<div className="lg:sticky lg:top-28 h-fit w-full">

<div className="bg-white p-6 rounded-xl shadow-sm">

<h1 className="text-2xl font-bold mb-2">
{property.title}
</h1>

<div className="flex items-center justify-between text-gray-500 mb-4 w-full">

<div className="flex items-center">
<MapPin size={16} className="mr-2"/>
{locationText}
</div>

<ShareButton propertyId={property.id} />

</div>

<div className="text-3xl font-bold mb-6">
{(property.currency || (property.operation?.toLowerCase() === "alquiler" ? "ARS" : "USD"))} {formattedPrice}
</div>

<a
href={`https://wa.me/5493515052474?text=${encodeURIComponent(
`Hola, me interesa la propiedad "${property.title}"`
)}`}
target="_blank"
className="w-full bg-green-500 text-white py-3 rounded-lg flex justify-center gap-2 mb-4 font-semibold"
>

<Phone size={18}/>
WhatsApp

</a>

<form
onSubmit={submitLead}
className="space-y-3"
>

<input
required
placeholder="Nombre"
value={lead.name}
onChange={(e)=>setLead({...lead,name:e.target.value})}
className="w-full border p-3 rounded"
/>

<input
required
placeholder="Email"
value={lead.email}
onChange={(e)=>setLead({...lead,email:e.target.value})}
className="w-full border p-3 rounded"
/>

<input
placeholder="Teléfono"
value={lead.phone}
onChange={(e)=>setLead({...lead,phone:e.target.value})}
className="w-full border p-3 rounded"
/>

<textarea
placeholder="Mensaje"
value={lead.message}
onChange={(e)=>setLead({...lead,message:e.target.value})}
className="w-full border p-3 rounded"
/>

<button className="w-full bg-black text-white py-3 rounded font-semibold">
Enviar consulta
</button>

</form>

</div>

</div>

</div>

{/* PROPIEDADES SIMILARES */}

{similar.length>0 &&(

<div className="mt-20">

<h2 className="text-2xl font-bold mb-8">
Propiedades similares
</h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{similar.map((p)=>(
<PropertyCard key={p.id} property={p}/>
))}

</div>

</div>

)}

{/* MODAL GALERIA */}

{galleryOpen &&(

<div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center overflow-hidden">

<button
onClick={()=>setGalleryOpen(false)}
className="absolute top-6 right-6 text-white"
>

<X size={36}/>

</button>

<button
onClick={prevImage}
className="absolute left-4 md:left-6 text-white"
>

<ChevronLeft size={40}/>

</button>

<img
src={images[activeImage]}
className="max-w-[90%] max-h-[85%] object-contain"
/>

<button
onClick={nextImage}
className="absolute right-4 md:right-6 text-white"
>

<ChevronRight size={40}/>

</button>

</div>

)}

</div>

<a
href={`https://wa.me/5493329615375?text=${encodeURIComponent(
`Hola, me interesa la propiedad "${property.title}"`
)}`}
target="_blank"
className="lg:hidden fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl"
>

<Phone size={24}/>

</a>

</div>

)

}

function Feature({icon,label,value}:{icon:any,label:string,value:any}){

return(

<div className="flex flex-col items-center bg-gray-50 p-3 rounded-lg w-full">

<div className="mb-1 text-gray-600">
{icon}
</div>

<span className="text-lg font-bold">
{value||"-"}
</span>

<span className="text-[10px] uppercase text-gray-500 text-center">
{label}
</span>

</div>

)

}