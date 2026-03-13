import React from 'react';
import { PROJECTS } from '../data';

const Proyectos = () => {
  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto" data-aos="fade-up">
          <h1 className="text-4xl font-display font-bold text-brand-primary mb-4">Nuestros Proyectos</h1>
          <p className="text-brand-secondary">
            Desarrollos inmobiliarios pensados para el futuro. Calidad constructiva y ubicaciones estratégicas para tu próxima inversión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {PROJECTS.map((project, idx) => (
            <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-sm group border border-gray-100" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="aspect-[16/9] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-brand-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-display font-bold text-brand-primary mb-4">{project.title}</h3>
                <p className="text-brand-secondary leading-relaxed mb-8">
                  {project.description}
                </p>
                <button className="text-brand-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Ver detalles del proyecto
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-brand-primary rounded-3xl p-12 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-4">¿Buscás invertir en pozo?</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Contamos con planes de financiación a medida y asesoramiento especializado para inversores.
          </p>
          <button className="bg-white text-brand-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
            Consultar Oportunidades
          </button>
        </div>
      </div>
    </div>
  );
};

export default Proyectos;
