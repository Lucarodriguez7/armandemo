import { useEffect, useState, useRef } from "react"
import { supabase } from "../../lib/supabaseClient"
import { Mail, Phone, User, ArrowLeft, Star } from "lucide-react"
import { Link } from "react-router-dom"

export default function Leads(){

const [leads,setLeads] = useState<any[]>([])
const [loading,setLoading] = useState(true)

const [search,setSearch] = useState("")
const [statusFilter,setStatusFilter] = useState("todos")

const [page,setPage] = useState(1)
const leadsPerPage = 20

/* reloj interno */

const [,setNow] = useState(Date.now())

useEffect(()=>{

const interval = setInterval(()=>{
setNow(Date.now())
},5000)

return ()=>clearInterval(interval)

},[])

/* NUEVOS LEADS */

const [newLeadIds,setNewLeadIds] = useState<number[]>(()=>{

const saved = localStorage.getItem("newLeads")
return saved ? JSON.parse(saved) : []

})

const topRef = useRef<HTMLTableSectionElement | null>(null)

/* SONIDO */

const notificationSound = useRef<HTMLAudioElement | null>(null)

useEffect(()=>{
notificationSound.current = new Audio("/notification.mp3")
},[])

/* PERMISO NOTIFICACIONES */

useEffect(()=>{
if(Notification.permission !== "granted"){
Notification.requestPermission()
}
},[])

/* NOTIFICACION */

const showNotification = (lead:any)=>{

notificationSound.current?.play().catch(()=>{})

if(Notification.permission === "granted"){

const notification = new Notification("Nuevo lead recibido 🔔",{
body:`${lead.name} consultó por ${lead.properties?.title || "una propiedad"}`
})

notification.onclick = () => {
window.focus()
}

}

}

/* GUARDAR NUEVOS */

useEffect(()=>{
localStorage.setItem("newLeads",JSON.stringify(newLeadIds))
},[newLeadIds])

/* LOAD LEADS */

useEffect(()=>{

async function loadLeads(){

const { data,error } = await supabase
.from("leads")
.select(`
id,
name,
email,
phone,
important,
status,
created_at,
properties(title)
`)
.order("created_at",{ascending:false})

if(!error){
setLeads(data || [])
}

setLoading(false)

}

loadLeads()

/* REALTIME */

const channel = supabase
.channel("realtime-leads")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"leads"
},
(payload)=>{

const newLead = payload.new

showNotification(newLead)

setLeads(prev => {

if(prev.find(l => l.id === newLead.id)) return prev
return [newLead,...prev]

})

setNewLeadIds(prev => {

if(prev.includes(newLead.id)) return prev
return [...prev,newLead.id]

})

setTimeout(()=>{
topRef.current?.scrollIntoView({behavior:"smooth"})
},200)

}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])

/* UPDATE STATUS */

const updateStatus = async(id:number,status:string)=>{

setLeads(leads.map(l =>
l.id === id ? {...l,status} : l
))

await supabase
.from("leads")
.update({status})
.eq("id",id)

}

/* IMPORTANTE */

const toggleImportant = async(id:number,important:boolean)=>{

setLeads(leads.map(l =>
l.id === id ? {...l,important:!important} : l
))

await supabase
.from("leads")
.update({important:!important})
.eq("id",id)

}

/* WHATSAPP */

const openWhatsApp = (lead:any)=>{

const phone = lead.phone.replace(/\D/g,"")

const message = `Hola ${lead.name}! Te contacto por tu consulta sobre la propiedad "${lead.properties?.title || ""}".`

const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

window.open(url,"_blank")

}

/* COLORES ESTADO */

const statusColors:any = {

pendiente:"bg-yellow-100 text-yellow-700 border-yellow-200",
contactado:"bg-blue-100 text-blue-700 border-blue-200",
cerrado:"bg-green-100 text-green-700 border-green-200",
muerto:"bg-red-100 text-red-700 border-red-200"

}

/* TIME AGO CORRECTO */

const timeAgo = (date:string)=>{

const diff = Date.now() - new Date(date).getTime()

if(diff <= 0) return "Ahora"

const seconds = Math.floor(diff / 1000)

if(seconds < 60) return "Ahora"

const minutes = Math.floor(seconds / 60)
if(minutes < 60) return `${minutes} min`

const hours = Math.floor(minutes / 60)
if(hours < 24) return `${hours} h`

const days = Math.floor(hours / 24)
return `${days} d`

}

/* MARCAR COMO VISTO */

const markAsSeen = (id:number)=>{
setNewLeadIds(prev => prev.filter(leadId => leadId !== id))
}

/* FILTROS */

const filteredLeads = leads.filter(lead => {

const matchesSearch =
lead.name?.toLowerCase().includes(search.toLowerCase()) ||
lead.email?.toLowerCase().includes(search.toLowerCase()) ||
lead.phone?.toLowerCase().includes(search.toLowerCase())

const matchesStatus =
statusFilter === "todos" || lead.status === statusFilter

return matchesSearch && matchesStatus

})

/* PAGINACION */

const totalPages = Math.ceil(filteredLeads.length / leadsPerPage)

const paginatedLeads = filteredLeads.slice(
(page - 1) * leadsPerPage,
page * leadsPerPage
)

return(

<div className="bg-gray-50 min-h-screen">

<div className="max-w-6xl mx-auto px-6 py-10">

<Link
to="/admin/dashboard"
className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-6"
>
<ArrowLeft size={16}/>
Volver al Dashboard
</Link>

<div className="flex items-center justify-between mb-8">

<h1 className="text-3xl font-semibold">
Leads
</h1>

<div className="text-sm bg-white border px-4 py-2 rounded-lg shadow-sm">
{filteredLeads.length} leads
</div>

</div>

<div className="flex gap-3 mb-6">

<input
type="text"
placeholder="Buscar lead..."
value={search}
onChange={(e)=>{setSearch(e.target.value);setPage(1)}}
className="border rounded-lg px-4 py-2 w-72 bg-white"
/>

<select
value={statusFilter}
onChange={(e)=>{setStatusFilter(e.target.value);setPage(1)}}
className="border rounded-lg px-4 py-2 bg-white"
>

<option value="todos">Todos</option>
<option value="pendiente">Pendientes</option>
<option value="contactado">Contactados</option>
<option value="cerrado">Cerrados</option>
<option value="muerto">Muertos</option>

</select>

</div>

<div className="bg-white rounded-xl border shadow-sm overflow-hidden">

<table className="w-full text-sm">

<thead className="border-b bg-gray-50 text-gray-500">

<tr>

<th className="p-4 w-10"></th>
<th className="text-left">Lead</th>
<th>Email</th>
<th>Teléfono</th>
<th>WhatsApp</th>
<th>Propiedad</th>
<th>Estado</th>
<th>Hace</th>

</tr>

</thead>

<tbody ref={topRef}>

{loading && (
<tr>
<td colSpan={8} className="p-10 text-center text-gray-400">
Cargando leads...
</td>
</tr>
)}

{paginatedLeads.map((lead)=>{

const isNew = newLeadIds.includes(lead.id)

return(

<tr
key={lead.id}
className={`border-b transition ${
isNew
? "bg-green-50 ring-2 ring-green-300"
: "hover:bg-gray-50"
}`}
onMouseEnter={()=>{

if(isNew){
markAsSeen(lead.id)
}

}}
>

<td className="p-4">

<button
onClick={()=>toggleImportant(lead.id,lead.important)}
>

<Star
size={18}
className={lead.important ? "text-yellow-500" : "text-gray-300"}
fill={lead.important ? "currentColor" : "none"}
/>

</button>

</td>

<td className="flex items-center gap-3 py-4">

<div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
<User size={15}/>
</div>

<div className="font-medium">
{lead.name}
</div>

{isNew && (
<span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
Nuevo
</span>
)}

</td>

<td>

<a
href={`mailto:${lead.email}`}
className="flex items-center gap-2 hover:text-black"
>
<Mail size={14}/>
{lead.email}
</a>

</td>

<td>

<a
href={`tel:${lead.phone}`}
className="flex items-center gap-2"
>
<Phone size={14}/>
{lead.phone}
</a>

</td>

<td>

<button
onClick={()=>openWhatsApp(lead)}
className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-md"
>
WhatsApp
</button>

</td>

<td>

<span className="bg-gray-100 px-2 py-1 rounded text-xs">
{lead.properties?.title || "-"}
</span>

</td>

<td>

<select
value={lead.status || "pendiente"}
onChange={(e)=>updateStatus(lead.id,e.target.value)}
className={`text-xs px-2 py-1 rounded border ${statusColors[lead.status]}`}
>

<option value="pendiente">Pendiente</option>
<option value="contactado">Contactado</option>
<option value="cerrado">Cerrado</option>
<option value="muerto">Muerto</option>

</select>

</td>

<td className="text-gray-500">

{isNew ? (
<span className="text-green-600 font-medium">
Nuevo
</span>
) : (
timeAgo(lead.created_at)
)}

</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>

</div>

)

}