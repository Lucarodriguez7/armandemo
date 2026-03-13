import { supabase } from "./supabaseClient"

export async function trackEvent(
event_type: string,
property_id?: number
){

try{

await supabase
.from("events")
.insert([
{
event_type,
property_id
}
])

}catch(error){

console.error("Tracking error",error)

}

}