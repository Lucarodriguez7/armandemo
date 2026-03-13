import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import { Star, ArrowLeft, Search } from "lucide-react"

export default function PropertiesManager(){

const [properties,setProperties] = useState<any[]>([])
const [dragIndex,setDragIndex] = useState<number | null>(null)
const [search,setSearch] = useState("")

const navigate = useNavigate()

useEffect(()=>{
loadProperties()
},[])

const loadProperties = async ()=>{

const { data } = await supabase
.from("properties")
.select("*")
.order("display_order",{ascending:true})

if(data) setProperties(data)

}


// ===============================
// FORMATEAR PRECIO
// ===============================

const formatPrice = (price:number)=>{

if(!price) return ""

return new Intl.NumberFormat("es-AR").format(price)

}


// ===============================
// OBTENER IMÁGENES
// ===============================

const getImages = (images:any)=>{

if(!images) return []

try{
return JSON.parse(images)
}catch{
return images.split(",")
}

}


// ===============================
// URL IMAGEN
// ===============================

const getImageUrl = (path:string)=>{

if(!path) return "https://images.unsplash.com/photo-1560518883-ce09059eeffa"

if(path.startsWith("http")) return path

const { data } = supabase
.storage
.from("properties")
.getPublicUrl(path)

return data.publicUrl

}


// ===============================
// DRAG ORDER
// ===============================

const handleDragStart = (index:number)=>{
setDragIndex(index)
}

const handleDrop = async (index:number)=>{

if(dragIndex===null) return

const newList=[...filteredProperties]

const dragged=newList[dragIndex]

newList.splice(dragIndex,1)
newList.splice(index,0,dragged)

setProperties(newList)

setDragIndex(null)

saveOrder(newList)

}

const saveOrder = async(list:any[])=>{

for(let i=0;i<list.length;i++){

await supabase
.from("properties")
.update({display_order:i})
.eq("id",list[i].id)

}

}


// ===============================
// FEATURED
// ===============================

const toggleFeatured = async(property:any)=>{

const featuredCount = properties.filter(p=>p.featured).length

if(!property.featured && featuredCount>=5){

alert("Solo podés tener 5 propiedades destacadas")
return

}

await supabase
.from("properties")
.update({featured:!property.featured})
.eq("id",property.id)

loadProperties()

}

const featuredCount = properties.filter(p=>p.featured).length

const filteredProperties = properties.filter((p)=>
p.title?.toLowerCase().includes(search.toLowerCase())
)


// ===============================
// UI
// ===============================

return(

<div className="min-h-screen bg-gray-50">

{/* HEADER */}

<div className="bg-white border-b">

<div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">

<div className="flex items-center gap-6">

<button
onClick={()=>navigate("/admin/dashboard")}
className="flex items-center gap-2 text-gray-500 hover:text-black transition"
>
<ArrowLeft size={18}/>
Dashboard
</button>

<div className="h-6 w-px bg-gray-300"/>

<h1 className="text-2xl font-semibold">
Gestión de Propiedades
</h1>

</div>

<div className="text-sm bg-black text-white px-4 py-2 rounded-full">
Destacadas {featuredCount}/5
</div>

</div>

</div>


{/* SEARCH */}

<div className="max-w-7xl mx-auto px-8 pt-8">

<div className="relative w-full md:w-96">

<Search
size={18}
className="absolute left-3 top-3 text-gray-400"
/>

<input
type="text"
placeholder="Buscar propiedad..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
/>

</div>

</div>


{/* LISTADO */}

<div className="max-w-7xl mx-auto px-8 py-8">

<div className="space-y-4">

{filteredProperties.map((p,index)=>{

const imgs = getImages(p.images)

return(

<div
key={p.id}
draggable
onDragStart={()=>handleDragStart(index)}
onDragOver={(e)=>e.preventDefault()}
onDrop={()=>handleDrop(index)}
className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-move border border-gray-100"
>

{/* INFO */}

<div className="flex items-center gap-5">

{/* MINIATURAS */}

<div className="flex gap-2">

{imgs.slice(0,3).map((img:any,i:number)=>(
<img
key={i}
src={getImageUrl(img)}
className="w-20 h-16 object-cover rounded"
/>
))}

{imgs.length===0 && (

<img
src="https://images.unsplash.com/photo-1560518883-ce09059eeffa"
className="w-20 h-16 object-cover rounded"
/>

)}

</div>


{/* TEXTO */}

<div>

<p className="font-semibold text-lg">
{p.title}
</p>

<div className="flex items-center gap-3 mt-1 text-sm text-gray-500">

<span className="bg-gray-100 px-2 py-1 rounded">
{p.operation}
</span>

<span>
{p.type}
</span>

<span>
{p.city}
</span>

</div>

<p className="text-black font-semibold mt-1">
$ {formatPrice(p.price)}
</p>

</div>

</div>


{/* ACCIONES */}

<div className="flex items-center gap-3">

<button
onClick={()=>toggleFeatured(p)}
className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
p.featured
? "bg-yellow-400 text-black"
: "bg-gray-100 hover:bg-gray-200"
}`}
>

<Star size={16}/>
Destacar

</button>

<button
onClick={()=>navigate(`/admin/edit/${p.id}`)}
className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition"
>

Editar

</button>

</div>

</div>

)

})}


{filteredProperties.length === 0 && (

<div className="text-center text-gray-500 py-20">
No se encontraron propiedades
</div>

)}

</div>

</div>

</div>

)

}