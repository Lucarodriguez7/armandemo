import { useEffect,useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import {
ResponsiveContainer,
LineChart,
Line,
CartesianGrid,
XAxis,
YAxis,
Tooltip,
PieChart,
Pie,
Cell,
BarChart,
Bar
} from "recharts"

export default function Insights(){

const [leads,setLeads]=useState<any[]>([])
const [properties,setProperties]=useState<any[]>([])
const [events,setEvents]=useState<any[]>([])
const [loading,setLoading]=useState(true)

const [startDate,setStartDate]=useState("")
const [endDate,setEndDate]=useState("")

useEffect(()=>{

async function load(){

const {data:leadsData}=await supabase
.from("leads")
.select(`*,properties(title,city)`)

const {data:propertiesData}=await supabase
.from("properties")
.select("*")

const {data:eventsData}=await supabase
.from("events")
.select("*")

setLeads(leadsData||[])
setProperties(propertiesData||[])
setEvents(eventsData||[])
setLoading(false)

}

load()

},[])

if(loading){
return <div className="p-10">Cargando insights...</div>
}

////////////////////////////////////////////////
//// FILTRO FECHA DINAMICO
////////////////////////////////////////////////

const filterDate=(date:string)=>{

const d=new Date(date)

if(startDate && d < new Date(startDate)){
return false
}

if(endDate && d > new Date(endDate)){
return false
}

return true

}

const filteredLeads=leads.filter(l=>filterDate(l.created_at))
const filteredEvents=events.filter(e=>filterDate(e.created_at))

////////////////////////////////////////////////
//// MAP PROPERTIES
////////////////////////////////////////////////

const propertyMap = Object.fromEntries(
properties.map(p=>[p.id,p])
)

////////////////////////////////////////////////
//// METRICAS
////////////////////////////////////////////////

const totalLeads=filteredLeads.length

const newLeads=filteredLeads.filter(
l=>l.status==="nuevo"
).length

const closedLeads=filteredLeads.filter(
l=>l.status==="cerrado"
).length

const conversionRate=totalLeads
? ((closedLeads/totalLeads)*100).toFixed(1)
:0

const totalVisits=filteredEvents.filter(
e=>e.event_type==="property_view"
).length

const whatsappClicks=filteredEvents.filter(
e=>e.event_type==="whatsapp_click"
).length

////////////////////////////////////////////////
//// TRAFICO DIARIO
////////////////////////////////////////////////

const eventsPerDay:any={}

filteredEvents
.filter(e=>e.event_type==="property_view")
.forEach(e=>{

const day=new Date(e.created_at).toLocaleDateString()

if(!eventsPerDay[day]){
eventsPerDay[day]=0
}

eventsPerDay[day]++

})

const trafficData = Object.entries(eventsPerDay)
.map(([day,value])=>({
day,
visits:value
}))
.slice(-14)

////////////////////////////////////////////////
//// ESTADOS
////////////////////////////////////////////////

const statusData=[

{name:"Nuevo",value:filteredLeads.filter(l=>l.status==="nuevo").length},
{name:"Contactado",value:filteredLeads.filter(l=>l.status==="contactado").length},
{name:"Espera",value:filteredLeads.filter(l=>l.status==="espera").length},
{name:"Cerrado",value:filteredLeads.filter(l=>l.status==="cerrado").length},
{name:"Muerto",value:filteredLeads.filter(l=>l.status==="muerto").length}

]

const COLORS=["#2563eb","#eab308","#9333ea","#16a34a","#ef4444"]

////////////////////////////////////////////////
//// LEADS POR PROPIEDAD
////////////////////////////////////////////////

const propertyLeadMap:any={}

filteredLeads.forEach(l=>{

const title=l.properties?.title

if(!title)return

if(!propertyLeadMap[title]){
propertyLeadMap[title]=0
}

propertyLeadMap[title]++

})

const leadsPerProperty=Object.entries(propertyLeadMap)
.map(([name,value])=>({
name,
leads:value
}))
.sort((a:any,b:any)=>b.leads-a.leads)
.slice(0,5)

////////////////////////////////////////////////
//// VIEWS POR PROPIEDAD
////////////////////////////////////////////////

const viewsMap:any={}

filteredEvents
.filter(e=>e.event_type==="property_view")
.forEach(e=>{

const title = propertyMap[e.property_id]?.title

if(!title) return

if(!viewsMap[title]){
viewsMap[title]=0
}

viewsMap[title]++

})

const viewsPerProperty = Object.entries(viewsMap)
.map(([name,value])=>({
name,
views:value
}))
.sort((a:any,b:any)=>b.views-a.views)
.slice(0,5)

////////////////////////////////////////////////
//// WHATSAPP POR PROPIEDAD
////////////////////////////////////////////////

const whatsappMap:any={}

filteredEvents
.filter(e=>e.event_type==="whatsapp_click")
.forEach(e=>{

const title = propertyMap[e.property_id]?.title

if(!title) return

if(!whatsappMap[title]){
whatsappMap[title]=0
}

whatsappMap[title]++

})

const whatsappPerProperty = Object.entries(whatsappMap)
.map(([name,value])=>({
name,
clicks:value
}))
.sort((a:any,b:any)=>b.clicks-a.clicks)
.slice(0,5)

////////////////////////////////////////////////
//// FUNNEL
////////////////////////////////////////////////

const funnelData=[

{
stage:"Visitas",
value:filteredEvents.filter(e=>e.event_type==="property_view").length
},

{
stage:"WhatsApp",
value:filteredEvents.filter(e=>e.event_type==="whatsapp_click").length
},

{
stage:"Leads",
value:filteredEvents.filter(e=>e.event_type==="lead_submit").length
},

{
stage:"Ventas",
value:filteredLeads.filter(l=>l.status==="cerrado").length
}

]

////////////////////////////////////////////////
//// ACTIVIDAD RECIENTE
////////////////////////////////////////////////

const recentActivity=[

...filteredLeads.map(l=>({
text:`Nuevo lead de ${l.name}`,
date:l.created_at
})),

...filteredEvents.map(e=>({
text:e.event_type.replace("_"," "),
date:e.created_at
}))

]
.sort((a:any,b:any)=>new Date(b.date).getTime()-new Date(a.date).getTime())
.slice(0,8)

////////////////////////////////////////////////

return(

<div className="p-10 bg-gray-100 min-h-screen">

<Link
to="/admin/dashboard"
className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
>
<ArrowLeft size={18}/>
Volver al Dashboard
</Link>

<h1 className="text-3xl font-bold mb-8">
Insights
</h1>

{/* FILTRO FECHA */}

<div className="flex gap-4 mb-10">

<input
type="date"
value={startDate}
onChange={(e)=>setStartDate(e.target.value)}
className="border p-2 rounded"
/>

<input
type="date"
value={endDate}
onChange={(e)=>setEndDate(e.target.value)}
className="border p-2 rounded"
/>

</div>

<div className="grid grid-cols-6 gap-6 mb-12">

<KPI title="Leads" value={totalLeads}/>
<KPI title="Leads nuevos" value={newLeads}/>
<KPI title="Conversión" value={`${conversionRate}%`}/>
<KPI title="Visitas" value={totalVisits}/>
<KPI title="Clicks WhatsApp" value={whatsappClicks}/>
<KPI title="Propiedades" value={properties.length}/>

</div>

<div className="grid grid-cols-2 gap-8 mb-12">

<Card title="Tráfico diario">

<LineChart data={trafficData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="day"/>
<YAxis/>
<Tooltip/>
<Line type="monotone" dataKey="visits" stroke="#000" strokeWidth={3}/>
</LineChart>

</Card>

<Card title="Estados de leads">

<PieChart>

<Pie data={statusData} dataKey="value" outerRadius={110}>
{statusData.map((e,i)=>(<Cell key={i} fill={COLORS[i]}/>))}
</Pie>

<Tooltip/>

</PieChart>

</Card>

</div>

<Card title="Embudo de conversión" className="mb-12">

<BarChart data={funnelData}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="stage"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="value" fill="#000"/>
</BarChart>

</Card>

<div className="grid grid-cols-3 gap-8 mb-12">

<ListCard title="Propiedades más vistas" data={viewsPerProperty} field="views"/>

<ListCard title="Propiedades con más leads" data={leadsPerProperty} field="leads"/>

<ListCard title="Propiedades con más WhatsApp" data={whatsappPerProperty} field="clicks"/>

</div>

<div className="bg-white p-8 rounded-xl shadow">

<h2 className="font-semibold mb-6">
Actividad reciente
</h2>

{recentActivity.map((a,index)=>(

<div
key={index}
className="flex justify-between py-3 border-b last:border-none"
>

<div>{a.text}</div>

<div className="text-sm text-gray-500">
{new Date(a.date).toLocaleDateString()}
</div>

</div>

))}

</div>

</div>

)

}

////////////////////////////////////////////////
//// COMPONENTES
////////////////////////////////////////////////

function KPI({title,value}:any){

return(

<div className="bg-white p-6 rounded-xl shadow-md">

<div className="text-sm text-gray-500">
{title}
</div>

<div className="text-3xl font-bold">
{value}
</div>

</div>

)

}

function Card({title,children,className}:any){

return(

<div className={`bg-white p-8 rounded-xl shadow ${className||""}`}>

<h2 className="font-semibold mb-6">
{title}
</h2>

<div style={{height:300}}>
<ResponsiveContainer>
{children}
</ResponsiveContainer>
</div>

</div>

)

}

function ListCard({title,data,field}:any){

return(

<div className="bg-white p-8 rounded-xl shadow">

<h2 className="font-semibold mb-6">
{title}
</h2>

{data.map((p:any,index:number)=>(

<div key={index} className="flex justify-between py-3 border-b">

<div>{p.name}</div>
<div className="font-semibold">{p[field]}</div>

</div>

))}

</div>

)

}