import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"
import { ArrowLeft, Trash2, Star, Upload } from "lucide-react"

import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

import "mapbox-gl/dist/mapbox-gl.css"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string

export default function EditProperty(){

const navigate = useNavigate()
const { id } = useParams()

const [title,setTitle] = useState("")
const [price,setPrice] = useState("")
const [city,setCity] = useState("")
const [type,setType] = useState("")
const [operation,setOperation] = useState("Venta")
const [description,setDescription] = useState("")
const [bedrooms,setBedrooms] = useState("")
const [bathrooms,setBathrooms] = useState("")
const [area,setArea] = useState("")
const [featured,setFeatured] = useState(false)

const [images,setImages] = useState<string[]>([])
const [uploading,setUploading] = useState(false)
const [dragIndex,setDragIndex] = useState<number | null>(null)

const [latitude,setLatitude] = useState<number | null>(null)
const [longitude,setLongitude] = useState<number | null>(null)

const mapContainer = useRef<HTMLDivElement | null>(null)
const mapRef = useRef<mapboxgl.Map | null>(null)
const markerRef = useRef<mapboxgl.Marker | null>(null)

const fileInputRef = useRef<HTMLInputElement | null>(null)


// ===============================
// GET IMAGE URL
// ===============================

const getImageUrl = (path:string)=>{

if(!path){
return "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
}

if(path.startsWith("http")){
return path
}

const { data } = supabase
.storage
.from("properties")
.getPublicUrl(path)

return data.publicUrl

}


// ===============================
// CARGAR PROPIEDAD
// ===============================

useEffect(()=>{

const fetchProperty = async()=>{

const { data,error } = await supabase
.from("properties")
.select("*")
.eq("id",id)
.single()

if(error){
console.error(error)
alert("Error cargando propiedad")
return
}

setTitle(data.title || "")
setPrice(data.price?.toString() || "")
setCity(data.city || "")
setType(data.type || "")
setOperation(data.operation || "Venta")
setDescription(data.description || "")
setBedrooms(data.bedrooms?.toString() || "")
setBathrooms(data.bathrooms?.toString() || "")
setArea(data.area?.toString() || "")
setFeatured(data.featured || false)

setLatitude(data.latitude)
setLongitude(data.longitude)

if(data.images){

try{
const parsed = JSON.parse(data.images)
setImages(parsed)
}catch{
setImages(data.images.split(","))
}

}

}

fetchProperty()

},[id])


// ===============================
// MAPA
// ===============================

useEffect(()=>{

if(!mapContainer.current) return
if(latitude === null || longitude === null) return
if(mapRef.current) return

mapRef.current = new mapboxgl.Map({

container: mapContainer.current,
style: "mapbox://styles/mapbox/streets-v12",
center: [longitude,latitude],
zoom: 14

})

markerRef.current = new mapboxgl.Marker({draggable:true})
.setLngLat([longitude,latitude])
.addTo(mapRef.current)

const geocoder = new MapboxGeocoder({

accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl,
marker:false,
placeholder:"Buscar dirección...",
language:"es"

})

mapRef.current.addControl(geocoder)

geocoder.on("result",(e)=>{

const coords = e.result.geometry.coordinates

setLongitude(coords[0])
setLatitude(coords[1])

markerRef.current!.setLngLat(coords)

mapRef.current!.flyTo({

center:coords,
zoom:16

})

})

markerRef.current.on("dragend",()=>{

const lngLat = markerRef.current!.getLngLat()

setLatitude(lngLat.lat)
setLongitude(lngLat.lng)

})

mapRef.current.on("click",(e)=>{

setLatitude(e.lngLat.lat)
setLongitude(e.lngLat.lng)

markerRef.current!.setLngLat([e.lngLat.lng,e.lngLat.lat])

})

},[latitude,longitude])


// ===============================
// IMÁGENES
// ===============================

const removeImage = (index:number)=>{
setImages(prev => prev.filter((_,i)=>i!==index))
}

const setMainImage = (index:number)=>{

const newImages = [...images]
const selected = newImages.splice(index,1)[0]
newImages.unshift(selected)

setImages(newImages)

}

const handleDragStart = (index:number)=>{
setDragIndex(index)
}

const handleDropImage = (index:number)=>{

if(dragIndex === null) return

const newImages = [...images]
const dragged = newImages[dragIndex]

newImages.splice(dragIndex,1)
newImages.splice(index,0,dragged)

setImages(newImages)
setDragIndex(null)

}


// ===============================
// SUBIR IMÁGENES
// ===============================

const uploadImages = async(files:FileList)=>{

setUploading(true)

const uploaded:string[] = []

for(let file of Array.from(files)){

const fileName = `${Date.now()}-${file.name}`

const { error } = await supabase.storage
.from("properties")
.upload(fileName,file)

if(error){
alert(error.message)
continue
}

uploaded.push(fileName)

}

setImages(prev => [...prev,...uploaded])
setUploading(false)

}

const handleDrop = (e:React.DragEvent<HTMLDivElement>)=>{

e.preventDefault()

if(e.dataTransfer.files){
uploadImages(e.dataTransfer.files)
}

}

const handleFileSelect = (e:React.ChangeEvent<HTMLInputElement>)=>{
if(e.target.files){
uploadImages(e.target.files)
}
}


// ===============================
// GUARDAR
// ===============================

const handleSubmit = async (e:React.FormEvent)=>{

e.preventDefault()

const propertyData = {

title,
price:Number(price),
city,
type,
operation,
description,
bedrooms:Number(bedrooms),
bathrooms:Number(bathrooms),
area:Number(area),
featured,
latitude,
longitude,
images: JSON.stringify(images)

}

const { error } = await supabase
.from("properties")
.update(propertyData)
.eq("id",id)

if(error){

console.error(error)
alert("Error actualizando propiedad")

}else{

alert("Propiedad actualizada")
navigate("/admin/dashboard")

}

}


// ===============================
// UI
// ===============================

return(

<div className="min-h-screen bg-gray-100 p-10">

<div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow relative">

<button
onClick={()=>navigate("/admin/dashboard")}
className="absolute top-6 right-6 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
>
<ArrowLeft size={16}/>
Volver
</button>

<h1 className="text-2xl font-bold mb-8 text-center">
Editar Propiedad
</h1>

<form onSubmit={handleSubmit} className="space-y-5">

<input
value={title}
onChange={(e)=>setTitle(e.target.value)}
placeholder="Título"
className="w-full border p-3 rounded"
/>

<input
value={price}
onChange={(e)=>setPrice(e.target.value)}
placeholder="Precio"
className="w-full border p-3 rounded"
/>

<input
value={city}
onChange={(e)=>setCity(e.target.value)}
placeholder="Ciudad"
className="w-full border p-3 rounded"
/>

<textarea
value={description}
onChange={(e)=>setDescription(e.target.value)}
placeholder="Descripción"
className="w-full border p-3 rounded h-32"
/>


{/* MAPA */}

<div>

<p className="font-semibold mb-2">
Buscar dirección o mover marcador
</p>

<div
ref={mapContainer}
className="w-full h-80 rounded border"
/>

</div>


{/* SUBIR IMAGENES */}

<div className="flex justify-between items-center">

<h3 className="font-semibold">
Imágenes
</h3>

<button
type="button"
onClick={()=>fileInputRef.current?.click()}
className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
>
<Upload size={16}/>
Subir imágenes
</button>

<input
type="file"
multiple
hidden
ref={fileInputRef}
onChange={handleFileSelect}
/>

</div>


{/* DROPZONE */}

<div
className="border-2 border-dashed border-gray-400 rounded p-6 text-center"
onDrop={handleDrop}
onDragOver={(e)=>e.preventDefault()}
>

Arrastrá imágenes aquí

{uploading && (
<p className="text-sm mt-2">
Subiendo...
</p>
)}

</div>


{/* PREVIEW */}

<div className="grid grid-cols-4 gap-3">

{images.map((img,i)=>(

<div
key={i}
draggable
onDragStart={()=>handleDragStart(i)}
onDragOver={(e)=>e.preventDefault()}
onDrop={()=>handleDropImage(i)}
className="relative group cursor-move"
>

<img
src={getImageUrl(img)}
className="h-24 w-full object-cover rounded"
/>

{i===0 && (
<div className="absolute top-1 left-1 bg-yellow-400 text-xs px-2 py-1 rounded">
Principal
</div>
)}

<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 rounded">

<button
type="button"
onClick={()=>setMainImage(i)}
className="bg-white p-2 rounded-full"
>
<Star size={16}/>
</button>

<button
type="button"
onClick={()=>removeImage(i)}
className="bg-white p-2 rounded-full"
>
<Trash2 size={16}/>
</button>

</div>

</div>

))}

</div>


<label className="flex items-center gap-2">

<input
type="checkbox"
checked={featured}
onChange={(e)=>setFeatured(e.target.checked)}
/>

Propiedad destacada

</label>

<button className="w-full bg-black text-white p-3 rounded-lg">
Guardar cambios
</button>

</form>

</div>

</div>

)

}