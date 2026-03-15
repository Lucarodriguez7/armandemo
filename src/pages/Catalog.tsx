import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import PropertyCard from "../components/PropertyCard";
import { supabase } from "../lib/supabaseClient";

const Catalog = () => {

const [properties,setProperties] = useState<any[]>([])
const [search,setSearch] = useState("")
const [mobileFilters,setMobileFilters] = useState(false)

const [filters,setFilters] = useState({
operation:"Todos",
type:"Todos",
location:"Todos"
})

const sortOptions = ["recent","priceAsc","priceDesc","alpha"]
const [sortIndex,setSortIndex] = useState(0)

const sort = sortOptions[sortIndex]

const sortLabels:any = {
recent:"Más recientes",
priceAsc:"Precio menor",
priceDesc:"Precio mayor",
alpha:"A-Z"
}

/* VALOR DOLAR PARA COMPARACIÓN */
const USD_RATE = 1200

/* FUNCIÓN PARA COMPARAR PRECIOS */
const getComparablePrice = (property:any) => {

const price = Number(property.price) || 0

// alquiler está en pesos → convertir a USD
if(property.operation === "Alquiler"){
return price / USD_RATE
}

// venta está en dólares
return price

}

useEffect(()=>{

async function loadProperties(){

const {data,error} = await supabase
.from("properties")
.select("*")

if(error){
console.log(error)
}else{
setProperties(data || [])
}

}

loadProperties()

},[])

/* SEARCH + FILTER */

let filteredProperties = properties.filter(p=>{

const searchMatch =
p.title?.toLowerCase().includes(search.toLowerCase()) ||
p.city?.toLowerCase().includes(search.toLowerCase()) ||
p.zone?.toLowerCase().includes(search.toLowerCase())

const opMatch =
filters.operation === "Todos" ||
p.operation === filters.operation

const typeMatch =
filters.type === "Todos" ||
p.type === filters.type

const locationMatch =
filters.location === "Todos" ||
p.zone === filters.location

return searchMatch && opMatch && typeMatch && locationMatch

})

/* SORT */

filteredProperties = [...filteredProperties].sort((a,b)=>{

if(sort === "priceAsc"){
return getComparablePrice(a) - getComparablePrice(b)
}

if(sort === "priceDesc"){
return getComparablePrice(b) - getComparablePrice(a)
}

if(sort === "alpha"){
return (a.title || "").localeCompare(b.title || "")
}

return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()

})

const cycleSort = ()=>{
setSortIndex((prev)=>(prev+1)%sortOptions.length)
}

return (

<div className="pt-32 pb-24 bg-gray-50 min-h-screen">

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

{/* HEADER */}

<div className="mb-10">

<h1 className="text-4xl font-bold text-gray-900 mb-3">
Catálogo de Propiedades
</h1>

<p className="text-gray-500">
Encontrá el hogar ideal entre nuestras propiedades seleccionadas.
</p>

</div>

{/* SEARCH */}

<div className="flex gap-3 mb-8">

<div className="relative flex-1">

<Search className="absolute left-4 top-3.5 text-gray-400" size={18}/>

<input
type="text"
placeholder="Buscar por zona, ciudad o propiedad..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full bg-white pl-11 pr-4 py-3 rounded-xl text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200"
/>

</div>

<button
onClick={()=>setMobileFilters(true)}
className="md:hidden bg-white px-4 rounded-xl shadow-md flex items-center justify-center"
>

<SlidersHorizontal size={18}/>

</button>

</div>

{/* DESKTOP FILTERS */}

<div className="hidden md:grid grid-cols-3 gap-6 bg-white p-6 rounded-2xl shadow-md mb-6">

<div>

<label className="text-xs font-semibold text-gray-500 mb-2 block">
Operación
</label>

<select
value={filters.operation}
onChange={(e)=>setFilters({...filters,operation:e.target.value})}
className="w-full bg-gray-50 px-4 py-3 rounded-lg text-sm shadow-sm"
>

<option value="Todos">Tipo de operación</option>
<option>Venta</option>
<option>Alquiler</option>

</select>

</div>

<div>

<label className="text-xs font-semibold text-gray-500 mb-2 block">
Tipo de inmueble
</label>

<select
value={filters.type}
onChange={(e)=>setFilters({...filters,type:e.target.value})}
className="w-full bg-gray-50 px-4 py-3 rounded-lg text-sm shadow-sm"
>

<option value="Todos">Tipo de inmueble</option>
<option>Casa</option>
<option>Departamento</option>
<option>Dúplex</option>
<option>Oficina</option>
<option>Terreno</option>
<option>Local Comercial</option>

</select>

</div>

<div>

<label className="text-xs font-semibold text-gray-500 mb-2 block">
Zona
</label>

<select
value={filters.location}
onChange={(e)=>setFilters({...filters,location:e.target.value})}
className="w-full bg-gray-50 px-4 py-3 rounded-lg text-sm shadow-sm"
>

<option value="Todos">Todas las zonas</option>
<option>Nueva Córdoba</option>
<option>Centro</option>
<option>Valle Escondido</option>
<option>Manantiales</option>

</select>

</div>

</div>

{/* RESULTS BAR */}

<div className="flex justify-between items-center mb-8 text-sm text-gray-500">

<span>
{filteredProperties.length} propiedades encontradas
</span>

<button
onClick={cycleSort}
className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow transition"
>

<ArrowUpDown size={16}/>

<span className="text-gray-600">
Ordenar: {sortLabels[sort]}
</span>

</button>

</div>

{/* GRID */}

{filteredProperties.length > 0 ? (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

{filteredProperties.map(property=>(
<div key={property.id}>
<PropertyCard property={property}/>
</div>
))}

</div>

):(


<div className="text-center py-20 bg-white rounded-2xl shadow-sm">

<h3 className="text-xl font-semibold text-gray-900">
No se encontraron propiedades
</h3>

<p className="text-gray-500 mt-2">
Intentá cambiando los filtros o la búsqueda
</p>

</div>

)}

</div>


{/* MOBILE FILTER PANEL */}

{mobileFilters && (

<div className="fixed inset-0 z-50 flex">

<div
className="absolute inset-0 bg-black/40 backdrop-blur-sm"
onClick={()=>setMobileFilters(false)}
/>

<div className="ml-auto w-80 bg-white h-full shadow-xl p-6 overflow-y-auto">

<div className="flex justify-between items-center mb-6">

<h3 className="font-semibold text-lg">
Filtros
</h3>

<button onClick={()=>setMobileFilters(false)}>
<X/>
</button>

</div>

<div className="space-y-5">

<div>

<label className="text-xs font-semibold text-gray-500 block mb-2">
Operación
</label>

<select
value={filters.operation}
onChange={(e)=>setFilters({...filters,operation:e.target.value})}
className="w-full bg-gray-50 px-4 py-3 rounded-lg shadow-sm"
>

<option value="Todos">Tipo de operación</option>
<option>Venta</option>
<option>Alquiler</option>

</select>

</div>

<div>

<label className="text-xs font-semibold text-gray-500 block mb-2">
Tipo
</label>

<select
value={filters.type}
onChange={(e)=>setFilters({...filters,type:e.target.value})}
className="w-full bg-gray-50 px-4 py-3 rounded-lg shadow-sm"
>

<option value="Todos">Tipo de inmueble</option>
<option>Casa</option>
<option>Departamento</option>
<option>Dúplex</option>
<option>Oficina</option>
<option>Terreno</option>
<option>Local Comercial</option>

</select>

</div>

</div>

</div>

</div>

)}

</div>

)

}

export default Catalog