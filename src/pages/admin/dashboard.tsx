import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { Link, NavLink } from "react-router-dom"
import {
Plus,
LogOut,
BedDouble,
Bath,
Maximize,
Trash2,
Eye,
Mail,
LayoutDashboard,
Building2,
BarChart3,
Edit,
Copy
} from "lucide-react"

export default function Dashboard(){

const [properties,setProperties] = useState([])
const [totalVisits,setTotalVisits] = useState(0)
const [totalLeads,setTotalLeads] = useState(0)
const [conversion,setConversion] = useState(0)

const [hasNewLeads,setHasNewLeads] = useState(false)
const [loading,setLoading] = useState(true)

const [showDeleteModal,setShowDeleteModal] = useState(false)
const [propertyToDelete,setPropertyToDelete] = useState(null)


/* ---------- GET IMAGE URL FROM SUPABASE ---------- */

const getImageUrl = (path)=>{

if(!path){
return "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
}

const { data } = supabase
.storage
.from("properties")
.getPublicUrl(path)

return data.publicUrl

}


/* ---------- GET FIRST IMAGE ---------- */

const getFirstImage = (property)=>{

try{

if(!property.images) return null

const parsed = JSON.parse(property.images)

if(Array.isArray(parsed) && parsed.length > 0){
return parsed[0]
}

return null

}catch{
return null
}

}


/* ---------- LOAD DATA ---------- */

const loadData = async(firstLoad=false)=>{

if(firstLoad) setLoading(true)

const { data:propertiesData } = await supabase
.from("properties")
.select("*")
.order("id",{ascending:false})

setProperties(propertiesData || [])

const { data: visits } = await supabase
.from("events")
.select("device_id")
.eq("event_type","site_visit")

const uniqueVisits = new Set(
(visits || []).map(v => v.device_id)
).size

setTotalVisits(uniqueVisits)

const { count:leadsCount } = await supabase
.from("leads")
.select("*",{count:"exact",head:true})

if(totalLeads !== 0 && leadsCount > totalLeads){
setHasNewLeads(true)
}

setTotalLeads(leadsCount || 0)

if(uniqueVisits > 0){
setConversion(Math.round((leadsCount / uniqueVisits) * 100))
}

setLoading(false)

}


/* ---------- EFFECTS ---------- */

useEffect(()=>{

loadData(true)

const interval = setInterval(()=>{
loadData()
},5000)

return()=>clearInterval(interval)

},[])


useEffect(()=>{

const channel = supabase
.channel("realtime-leads")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"leads"
},
()=>{
setHasNewLeads(true)
setTotalLeads(prev=>prev+1)
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])


/* ---------- LOGOUT ---------- */

const handleLogout = async()=>{
await supabase.auth.signOut()
window.location.href="/admin/login"
}


/* ---------- DELETE ---------- */

const openDeleteModal = (property)=>{
setPropertyToDelete(property)
setShowDeleteModal(true)
}

const confirmDelete = async () => {

if(!propertyToDelete) return

await supabase
.from("events")
.delete()
.eq("property_id", propertyToDelete.id)

const { error } = await supabase
.from("properties")
.delete()
.eq("id", propertyToDelete.id)

if(error){
alert("No se pudo borrar la propiedad")
return
}

setProperties(prev =>
prev.filter(p => p.id !== propertyToDelete.id)
)

setShowDeleteModal(false)
setPropertyToDelete(null)

}


/* ---------- DUPLICATE ---------- */

const duplicateProperty = async(property)=>{

const { id,created_at,...rest } = property

const { data } = await supabase
.from("properties")
.insert([
{
...rest,
title: property.title + " (copia)"
}
])
.select()

if(data){
setProperties(prev => [data[0],...prev])
}

}


/* ---------- UI ---------- */

return(

<div className="flex min-h-screen bg-gray-50">


{/* SIDEBAR */}

<div className="w-64 bg-white border-r flex flex-col justify-between">

<div>

<div className="p-6 text-xl font-bold border-b flex items-center gap-2">
🏢 CRM Inmobiliario
</div>

<nav className="p-4 space-y-1">

<NavLink
to="/admin/dashboard"
className={({isActive}) =>
`flex items-center gap-3 p-3 rounded-lg text-sm transition ${
isActive
? "bg-black text-white shadow"
: "text-gray-600 hover:bg-gray-100"
}`
}
>
<LayoutDashboard size={18}/>
Dashboard
</NavLink>

<Link
to="/admin/new"
className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
>
<Plus size={18}/>
Nueva propiedad
</Link>

<Link
to="/admin/properties"
className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
>
<Building2 size={18}/>
Propiedades
</Link>

<Link
to="/admin/leads"
onClick={()=>setHasNewLeads(false)}
className="flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
>

<div className="flex items-center gap-3">
<Mail size={18}/>
Leads
</div>

<div className="flex items-center gap-2">

{totalLeads > 0 && (
<span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
{totalLeads}
</span>
)}

{hasNewLeads && (
<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
)}

</div>

</Link>

<Link
to="/admin/insights"
className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
>
<BarChart3 size={18}/>
Insights
</Link>

</nav>

</div>

<button
onClick={handleLogout}
className="flex items-center gap-3 p-4 border-t text-gray-600 hover:bg-gray-100 transition"
>
<LogOut size={18}/>
Cerrar sesión
</button>

</div>


{/* CONTENT */}

<div className="flex-1 p-10">


{/* HEADER */}

<div className="flex justify-between items-center mb-10">

<h1 className="text-3xl font-bold">
Dashboard
</h1>

<Link
to="/admin/new"
className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:scale-105 transition"
>
<Plus size={16}/>
Nueva propiedad
</Link>

</div>


{/* METRICS */}

<div className="grid grid-cols-4 gap-6 mb-10">

<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
<div className="text-sm opacity-80">Propiedades</div>
<div className="text-3xl font-bold mt-1">{properties.length}</div>
</div>

<div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
<div className="text-sm opacity-80">Visitas únicas</div>
<div className="text-3xl font-bold mt-1">{totalVisits}</div>
</div>

<div className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
<div className="text-sm opacity-80">Leads</div>
<div className="text-3xl font-bold mt-1">{totalLeads}</div>
</div>

<div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
<div className="text-sm opacity-80">Conversión</div>
<div className="text-3xl font-bold mt-1">{conversion}%</div>
</div>

</div>


{/* TABLE */}

<div className="bg-white rounded-2xl shadow-lg overflow-hidden">

<table className="w-full">

<thead className="bg-gray-50 text-gray-500 text-sm">
<tr>

<th className="text-left px-6 py-4">Propiedad</th>
<th className="text-left px-6">Precio</th>
<th className="text-left px-6">Dorm</th>
<th className="text-left px-6">Baños</th>
<th className="text-left px-6">m²</th>
<th className="text-right px-6">Acciones</th>

</tr>
</thead>

<tbody className="text-sm">

{properties.map(property=>{

const rawImage = getFirstImage(property)
const image = getImageUrl(rawImage)

return(

<tr
key={property.id}
className="border-t hover:bg-gray-50 transition"
>

<td className="px-6 py-4">

<div className="flex items-center gap-4">

<img
src={image}
className="w-20 h-14 object-cover rounded-lg shadow-sm"
/>

<div>

<div className="font-semibold text-gray-800">
{property.title}
</div>

<div className="text-xs text-gray-500">
{property.city}
</div>

</div>

</div>

</td>


<td className="px-6 font-semibold text-gray-800">
${Number(property.price).toLocaleString()}
</td>


<td className="px-6">
<div className="flex items-center gap-2 text-gray-600">
<BedDouble size={16}/>
{property.bedrooms}
</div>
</td>


<td className="px-6">
<div className="flex items-center gap-2 text-gray-600">
<Bath size={16}/>
{property.bathrooms}
</div>
</td>


<td className="px-6">
<div className="flex items-center gap-2 text-gray-600">
<Maximize size={16}/>
{property.area}
</div>
</td>


<td className="px-6">

<div className="flex justify-end gap-2">

<a
href={`/propiedades/${property.id}`}
target="_blank"
className="p-2 hover:bg-gray-100 rounded-lg transition"
>
<Eye size={18}/>
</a>

<Link
to={`/admin/edit/${property.id}`}
className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
>
<Edit size={18}/>
</Link>

<button
onClick={()=>duplicateProperty(property)}
className="p-2 hover:bg-gray-100 rounded-lg transition"
>
<Copy size={18}/>
</button>

<button
onClick={()=>openDeleteModal(property)}
className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
>
<Trash2 size={18}/>
</button>

</div>

</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>


{/* DELETE MODAL */}

{showDeleteModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-8 rounded-xl w-[420px] shadow-2xl">

<h2 className="text-xl font-semibold mb-2">
Eliminar propiedad
</h2>

<p className="text-gray-500 mb-6">
Esta acción no se puede deshacer
</p>

<div className="flex justify-end gap-3">

<button
onClick={()=>setShowDeleteModal(false)}
className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
>
Cancelar
</button>

<button
onClick={confirmDelete}
className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
>
Borrar
</button>

</div>

</div>

</div>

)}

</div>

)
}