import React from 'react';
import { Phone, Mail, MapPin, Instagram, Clock } from 'lucide-react';

const Contacto = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16" data-aos="fade-up">
          <h1 className="text-4xl font-display font-bold text-brand-primary mb-4">Contacto</h1>
          <p className="text-brand-secondary">Estamos aquí para asesorarte. Elegí el canal que prefieras.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8" data-aos="fade-right">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-primary">Dirección</h3>
                  <p className="text-brand-secondary text-sm">9 de Julio 37, Córdoba, Argentina</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-primary">Teléfono / WhatsApp</h3>
                  <p className="text-brand-secondary text-sm">+54 9 351 505 2474</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-primary">Email</h3>
                  <p className="text-brand-secondary text-sm break-all">armangrupoinmobiliario@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Instagram size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-primary">Instagram</h3>
                  <p className="text-brand-secondary text-sm">@arman.propiedades</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-brand-primary/40 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-primary">Horarios</h3>
                  <p className="text-brand-secondary text-sm">Lunes a Viernes: 9:00 a 18:00 hs</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-primary p-8 rounded-2xl text-white">
              <h3 className="font-display font-bold mb-4">Atención Inmediata</h3>
              <p className="text-white/60 text-sm mb-6">¿Necesitás una respuesta urgente? Escribinos por WhatsApp ahora mismo.</p>
              <a
                href="https://wa.me/5493515052474"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                <Phone size={18} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2" data-aos="fade-left">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-display font-bold text-brand-primary mb-8">Envianos un mensaje</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Nombre</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Email</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Teléfono</label>
                  <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Asunto</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none">
                    <option>Consulta General</option>
                    <option>Venta de Propiedad</option>
                    <option>Alquiler de Propiedad</option>
                    <option>Tasación</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Mensaje</label>
                  <textarea rows={6} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none resize-none"></textarea>
                </div>
                <div className="md:col-span-2">
                  <button className="w-full md:w-auto bg-brand-primary text-white px-12 py-4 rounded-lg font-bold hover:bg-black transition-colors">
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-12">
              <div className="bg-gray-100 rounded-3xl h-[400px] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-2 opacity-20" />
                  <p>Mapa de Ubicación (Placeholder)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
