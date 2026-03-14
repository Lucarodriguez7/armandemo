import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"
import { ArrowLeft, Trash2, Star } from "lucide-react"

import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import "mapbox-gl/dist/mapbox-gl.css"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function NewProperty(){

const navigate = useNavigate()

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

const [address,setAddress] = useState("")
const [latitude,setLatitude] = useState("")
const [longitude,setLongitude] = useState("")

const [images,setImages] = useState<string[]>([])
const [uploading,setUploading] = useState(false)

const [dragIndex,setDragIndex] = useState<number | null>(null)

const fileInputRef = useRef<HTMLInputElement | null>(null)

const mapContainer = useRef<HTMLDivElement | null>(null)
const geocoderContainer = useRef<HTMLDivElement | null>(null)
const markerRef = useRef<mapboxgl.Marker | null>(null)
const mapRef = useRef<mapboxgl.Map | null>(null)

/* ---------------- MAPBOX ---------------- */

useEffect(()=>{

if(!mapContainer.current) return

const map = new mapboxgl.Map({
container: mapContainer.current,
style:"mapbox://styles/mapbox/streets-v12",
center:[-57.5426,-38.0055],
zoom:12
})

mapRef.current = map

const geocoder = new MapboxGeocoder({
accessToken:mapboxgl.accessToken,
mapboxgl:mapboxgl,
marker:false,
placeholder:"Buscar dirección...",
countries:"ar"
})

if(geocoderContainer.current){
geocoderContainer.current.appendChild(geocoder.onAdd(map))
}

/* -------- BUSCAR DIRECCION -------- */

geocoder.on("result",(e)=>{

const coords = e.result.geometry.coordinates
const lng = coords[0]
const lat = coords[1]

setAddress(e.result.place_name)
setLatitude(lat.toString())
setLongitude(lng.toString())

if(!markerRef.current){

markerRef.current = new mapboxgl.Marker({draggable:true})
.setLngLat([lng,lat])
.addTo(map)

}else{

markerRef.current.setLngLat([lng,lat])

}

map.flyTo({
center:[lng,lat],
zoom:15
})

markerRef.current.on("dragend",updateFromMarker)

})

/* -------- CLICK EN MAPA -------- */

map.on("click",async(e)=>{

const lng = e.lngLat.lng
const lat = e.lngLat.lat

setLatitude(lat.toString())
setLongitude(lng.toString())

if(!markerRef.current){

markerRef.current = new mapboxgl.Marker({draggable:true})
.setLngLat([lng,lat])
.addTo(map)

markerRef.current.on("dragend",updateFromMarker)

}else{

markerRef.current.setLngLat([lng,lat])

}

/* reverse geocoding */

const res = await fetch(
`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
)

const data = await res.json()

if(data.features.length>0){

setAddress(data.features[0].place_name)

}

})

/* -------- FUNCION DRAG MARKER -------- */

async function updateFromMarker(){

if(!markerRef.current) return

const pos = markerRef.current.getLngLat()

setLatitude(pos.lat.toString())
setLongitude(pos.lng.toString())

const res = await fetch(
`https://api.mapbox.com/geocoding/v5/mapbox.places/${pos.lng},${pos.lat}.json?access_token=${mapboxgl.accessToken}`
)

const data = await res.json()

if(data.features.length>0){

setAddress(data.features[0].place_name)

}

}

return ()=> map.remove()

},[])

/* ---------------- IMAGENES ---------------- */

const removeImage = (index:number)=>{
setImages(prev=>prev.filter((_,i)=>i!==index))
}

const setMainImage = (index:number)=>{

const newImages=[...images]

const selected=newImages.splice(index,1)[0]

newImages.unshift(selected)

setImages(newImages)

}

const handleDragStart = (index:number)=>{
setDragIndex(index)
}

const handleDropImage = (index:number)=>{

if(dragIndex===null) return

const newImages=[...images]

const dragged=newImages[dragIndex]

newImages.splice(dragIndex,1)

newImages.splice(index,0,dragged)

setImages(newImages)

setDragIndex(null)

}

/* ---------------- SUBIR IMAGENES ---------------- */

const uploadImages = async(files:FileList)=>{

setUploading(true)

const fileNames:string[]=[]

for(let file of Array.from(files)){

const fileName=`${Date.now()}-${file.name}`

const {error}=await supabase
.storage
.from("properties")
.upload(fileName,file)

if(error){

alert("Error subiendo imagen: "+error.message)
continue

}

fileNames.push(fileName)

}

setImages(prev=>[...prev,...fileNames])

setUploading(false)

}

/* ---------------- CLICK DROPZONE ---------------- */

const openFilePicker = ()=>{
fileInputRef.current?.click()
}

const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
if(e.target.files){
uploadImages(e.target.files)
}
}

/* ---------------- DROPZONE ---------------- */

const handleDrop=(e:React.DragEvent<HTMLDivElement>)=>{

e.preventDefault()

if(e.dataTransfer.files && e.dataTransfer.files.length>0){

uploadImages(e.dataTransfer.files)

e.dataTransfer.clearData()

}

}

/* ---------------- SUBMIT ---------------- */

const handleSubmit = async(e:React.FormEvent)=>{

e.preventDefault()

const propertyData={

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
images,
address,
latitude: latitude ? Number(latitude) : null,
longitude: longitude ? Number(longitude) : null,
status:"active"

}

const {error}=await supabase
.from("properties")
.insert([propertyData])

if(error){

console.error(error)
alert("Error al crear propiedad")

}else{

alert("Propiedad creada")
navigate("/admin/dashboard")

}

}

const STORAGE_URL="https://nnybfkvrruukkfprjzew.supabase.co/storage/v1/object/public/properties/"

return(

<div className="min-h-screen bg-gray-100 p-10">

<div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow relative">

<button
onClick={()=>navigate("/admin/dashboard")}
className="absolute top-6 right-6 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
>
<ArrowLeft size={16}/>
Volver
</button>

<h1 className="text-2xl font-bold mb-8 text-center">
Nueva Propiedad
</h1>

<form onSubmit={handleSubmit} className="space-y-5">

<input placeholder="Título" className="w-full border p-3 rounded" value={title} onChange={(e)=>setTitle(e.target.value)} required/>

<input placeholder="Precio" className="w-full border p-3 rounded" value={price} onChange={(e)=>setPrice(e.target.value)} required/>

<input placeholder="Ciudad" className="w-full border p-3 rounded" value={city} onChange={(e)=>setCity(e.target.value)} required/>

<select className="w-full border p-3 rounded" value={operation} onChange={(e)=>setOperation(e.target.value)}>
<option>Venta</option>
<option>Alquiler</option>
</select>

<input placeholder="Tipo" className="w-full border p-3 rounded" value={type} onChange={(e)=>setType(e.target.value)}/>

<textarea placeholder="Descripción" className="w-full border p-3 rounded h-32" value={description} onChange={(e)=>setDescription(e.target.value)}/>

<input placeholder="Dormitorios" className="w-full border p-3 rounded" value={bedrooms} onChange={(e)=>setBedrooms(e.target.value)}/>

<input placeholder="Baños" className="w-full border p-3 rounded" value={bathrooms} onChange={(e)=>setBathrooms(e.target.value)}/>

<input placeholder="Metros cuadrados" className="w-full border p-3 rounded" value={area} onChange={(e)=>setArea(e.target.value)}/>

{/* MAPA */}

<div className="bg-gray-50 p-5 rounded-xl space-y-4">

<h3 className="font-semibold text-sm text-gray-700">
Ubicación de la propiedad
</h3>

<div ref={geocoderContainer}/>

<div ref={mapContainer} className="w-full h-[320px] rounded-xl border"/>

<input
placeholder="Dirección"
className="w-full border p-3 rounded"
value={address}
onChange={(e)=>setAddress(e.target.value)}
/>

<div className="grid grid-cols-2 gap-3">

<input placeholder="Latitud" className="border p-3 rounded bg-gray-100" value={latitude} readOnly/>

<input placeholder="Longitud" className="border p-3 rounded bg-gray-100" value={longitude} readOnly/>

</div>

</div>

{/* DROPZONE MEJORADA */}

<div
className="border-2 border-dashed border-gray-400 rounded p-6 text-center cursor-pointer hover:bg-gray-50 transition"
onClick={openFilePicker}
onDrop={handleDrop}
onDragOver={(e)=>e.preventDefault()}
>

<input
type="file"
multiple
accept="image/*"
ref={fileInputRef}
onChange={handleFileChange}
className="hidden"
/>

<p>Arrastrá imágenes aquí o hacé click para seleccionarlas</p>

{uploading && <p className="text-sm mt-2">Subiendo...</p>}

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

<img src={STORAGE_URL+img} className="h-24 w-full object-cover rounded"/>

{i===0 && (
<div className="absolute top-1 left-1 bg-yellow-400 text-xs px-2 py-1 rounded">
Principal
</div>
)}

<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 rounded">

<button type="button" onClick={()=>setMainImage(i)} className="bg-white p-2 rounded-full">
<Star size={16}/>
</button>

<button type="button" onClick={()=>removeImage(i)} className="bg-white p-2 rounded-full">
<Trash2 size={16} className="text-red-500"/>
</button>

</div>

</div>

))}

</div>

<label className="flex items-center gap-2 mt-4">

<input type="checkbox" checked={featured} onChange={(e)=>setFeatured(e.target.checked)}/>

Propiedad destacada

</label>

<button className="w-full bg-black text-white p-3 rounded-lg hover:scale-[1.02] transition mt-4">
Crear propiedad
</button>

</form>

</div>

</div>

)

}