import React, { useState } from "react";
import { Phone, Mail, MapPin, Instagram, Clock } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const Contacto = () => {

const [lead,setLead] = useState({
name:"",
email:"",
phone:"",
subject:"",
message:""
})

async function submitLead(e:any){

e.preventDefault()

await supabase.from("leads").insert({
name:lead.name,
email:lead.email,
phone:lead.phone,
message:`${lead.subject} - ${lead.message}`,
source:"contacto"
})

setLead({
name:"",
email:"",
phone:"",
subject:"",
message:""
})

alert("Mensaje enviado correctamente")

}

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <h1 className="text-4xl font-display font-bold text-brand-primary mb-4">
            Contacto
          </h1>
          <p className="text-brand-secondary">
            Estamos aquí para asesorarte. Elegí el canal que prefieras.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* CONTACT INFO */}

          <div className="lg:col-span-1 space-y-8">

            <div className="space-y-6">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <MapPin size={24}/>
                </div>

                <div>
                  <h3 className="font-display font-bold text-brand-primary">
                    Dirección
                  </h3>

                  <p className="text-brand-secondary text-sm">
                    9 de Julio 37, Córdoba, Argentina
                  </p>

                </div>

              </div>


              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Phone size={24}/>
                </div>

                <div>
                  <h3 className="font-display font-bold text-brand-primary">
                    Teléfono / WhatsApp
                  </h3>

                  <p className="text-brand-secondary text-sm">
                    +54 9 351 505 2474
                  </p>
                </div>

              </div>


              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Mail size={24}/>
                </div>

                <div>
                  <h3 className="font-display font-bold text-brand-primary">
                    Email
                  </h3>

                  <p className="text-brand-secondary text-sm break-all">
                    armangrupoinmobiliario@gmail.com
                  </p>
                </div>

              </div>


              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Instagram size={24}/>
                </div>

                <div>
                  <h3 className="font-display font-bold text-brand-primary">
                    Instagram
                  </h3>

                  <p className="text-brand-secondary text-sm">
                    @arman.propiedades
                  </p>

                </div>

              </div>


              <div className="flex items-start gap-4">

                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Clock size={24}/>
                </div>

                <div>

                  <h3 className="font-display font-bold text-brand-primary">
                    Horarios
                  </h3>

                  <p className="text-brand-secondary text-sm">
                    Lunes a Viernes: 9:00 a 18:00 hs
                  </p>

                </div>

              </div>

            </div>


            {/* WHATSAPP */}

            <div className="bg-brand-primary p-8 rounded-2xl text-white">

              <h3 className="font-display font-bold mb-4">
                Atención Inmediata
              </h3>

              <p className="text-white/60 text-sm mb-6">
                ¿Necesitás una respuesta urgente? Escribinos por WhatsApp ahora mismo.
              </p>

              <a
                href="https://wa.me/5493515052474"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >

                <Phone size={18}/>
                WhatsApp

              </a>

            </div>

          </div>


          {/* FORM */}

          <div className="lg:col-span-2">

            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">

              <h3 className="text-2xl font-display font-bold text-brand-primary mb-8">
                Envianos un mensaje
              </h3>

              <form onSubmit={submitLead} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <input
                  required
                  placeholder="Nombre"
                  value={lead.name}
                  onChange={(e)=>setLead({...lead,name:e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />

                <input
                  required
                  placeholder="Email"
                  value={lead.email}
                  onChange={(e)=>setLead({...lead,email:e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />

                <input
                  placeholder="Teléfono"
                  value={lead.phone}
                  onChange={(e)=>setLead({...lead,phone:e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />

                <select
                  value={lead.subject}
                  onChange={(e)=>setLead({...lead,subject:e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm"
                >

                  <option>Consulta General</option>
                  <option>Venta de Propiedad</option>
                  <option>Alquiler de Propiedad</option>
                  <option>Tasación</option>
                  <option>Otro</option>

                </select>

                <textarea
                  rows={6}
                  placeholder="Mensaje"
                  value={lead.message}
                  onChange={(e)=>setLead({...lead,message:e.target.value})}
                  className="md:col-span-2 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />

                <button className="md:col-span-2 bg-brand-primary text-white px-12 py-4 rounded-lg font-bold hover:bg-black transition-colors">

                  Enviar Mensaje

                </button>

              </form>

            </div>


            {/* MAPA REAL */}

            <div className="mt-12">

              <iframe
                className="w-full h-[400px] rounded-3xl"
                loading="lazy"
                src="https://www.google.com/maps?q=9%20de%20Julio%2037%20Cordoba%20Argentina&z=16&output=embed"
              />

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contacto;