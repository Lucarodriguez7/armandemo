import React from 'react';
import { ClipboardCheck, TrendingUp, ShieldCheck, Clock } from 'lucide-react';

const Tasaciones = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div data-aos="fade-right">
            <span className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-2 block">Servicios Profesionales</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-6 leading-tight">
              Tasamos tu propiedad con <span className="text-brand-primary/40">precisión</span> y seriedad
            </h1>
            <p className="text-lg text-brand-secondary leading-relaxed mb-8">
              Conocer el valor real de mercado es el primer paso para una operación exitosa. En Arman Propiedades realizamos informes técnicos detallados basados en datos reales y tendencias actuales.
            </p>
            <div className="space-y-4">
              {[
                'Análisis comparativo de mercado',
                'Evaluación técnica del inmueble',
                'Informe de valor sugerido',
                'Asesoramiento para la venta/alquiler'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-brand-primary font-medium">
                  <ShieldCheck size={20} className="text-brand-primary/40" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative" data-aos="fade-left">
            <img
              src="https://picsum.photos/seed/appraisal/800/1000?grayscale"
              alt="Tasaciones"
              className="rounded-3xl shadow-2xl opacity-80"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hidden md:block" data-aos="zoom-in" data-aos-delay="400">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-brand-primary">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-primary">100%</div>
                  <div className="text-xs text-brand-secondary font-bold uppercase tracking-wider">Precisión de Mercado</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="mb-24">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-display font-bold text-brand-primary mb-4">Nuestro Proceso de Tasación</h2>
            <p className="text-brand-secondary max-w-2xl mx-auto">Un camino claro y profesional para determinar el valor de tu inmueble.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Contacto', desc: 'Solicitás la tasación a través de nuestros canales.' },
              { step: '02', title: 'Visita', desc: 'Coordinamos una visita técnica a la propiedad.' },
              { step: '03', title: 'Análisis', desc: 'Estudiamos el mercado y las características del bien.' },
              { step: '04', title: 'Entrega', desc: 'Te entregamos el informe con el valor profesional.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl relative overflow-hidden group hover:bg-brand-primary hover:text-white transition-all duration-300" data-aos="fade-up" data-aos-delay={idx * 100}>
                <span className="text-5xl font-display font-bold opacity-10 absolute -top-2 -right-2 group-hover:opacity-20">{item.step}</span>
                <h3 className="text-xl font-display font-bold mb-3 relative z-10">{item.title}</h3>
                <p className="text-sm opacity-70 relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden" data-aos="zoom-in">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 bg-brand-primary p-12 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-display font-bold mb-6">Solicitá tu tasación hoy</h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  Completá el formulario y un asesor se pondrá en contacto con vos en menos de 24 horas hábiles.
                </p>
              </div>
              <div className="space-y-4 pt-8">
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={18} className="text-brand-accent" />
                  <span>Respuesta rápida</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ClipboardCheck size={18} className="text-brand-accent" />
                  <span>Informe detallado</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-3 p-12">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Nombre</label>
                    <input type="text" className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-accent transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Teléfono</label>
                    <input type="tel" className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-accent transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Ubicación de la Propiedad</label>
                  <input type="text" className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-accent transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Tipo de Inmueble</label>
                  <select className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-accent transition-colors bg-transparent">
                    <option>Casa</option>
                    <option>Departamento</option>
                    <option>Terreno</option>
                    <option>Local/Oficina</option>
                  </select>
                </div>
                <button className="w-full bg-brand-primary text-white py-4 rounded-lg font-bold hover:bg-black transition-all shadow-lg shadow-black/10">
                  Enviar Solicitud
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasaciones;
