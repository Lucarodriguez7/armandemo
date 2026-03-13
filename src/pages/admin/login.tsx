import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Login() {

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const navigate = useNavigate()

const handleLogin = async (e:any) => {

e.preventDefault()

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

if(error){
alert("Error al iniciar sesión")
}else{
navigate("/admin/dashboard")
}

}

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-xl w-[380px]">

<h2 className="text-2xl font-bold mb-6">Panel Admin</h2>

<input
type="email"
placeholder="Email"
className="w-full border p-3 rounded mb-4"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full border p-3 rounded mb-4"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="w-full bg-black text-white p-3 rounded">
Ingresar
</button>

</form>

</div>

)

}