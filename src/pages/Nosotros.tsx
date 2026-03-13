import React from 'react';
import { Shield, Users, Target, Award } from 'lucide-react';

const Nosotros = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="order-2 lg:order-1" data-aos="fade-right">
            <img
              src="https://picsum.photos/seed/office/800/1000?grayscale"
              alt="Nuestra Oficina"
              className="rounded-3xl shadow-2xl opacity-80"
            />
          </div>
          <div className="order-1 lg:order-2" data-aos="fade-left">
            <span className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-2 block">Nuestra Historia</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-6 leading-tight">
              Compromiso y <span className="text-brand-primary/40">transparencia</span> en cada paso
            </h1>
            <div className="space-y-6 text-brand-secondary leading-relaxed">
              <p>
                Arman Propiedades nace con la visión de transformar la experiencia inmobiliaria en Córdoba, poniendo el foco en lo más importante: la confianza de las personas.
              </p>
              <p>
                Somos un equipo de profesionales apasionados por la gestión inmobiliaria responsable. Entendemos que detrás de cada operación hay sueños, ahorros y proyectos de vida, por eso trabajamos con la máxima seriedad y dedicación.
              </p>
              <p>
                Nuestra trayectoria se construye día a día a través de la satisfacción de nuestros clientes y el cumplimiento estricto de nuestra palabra.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 rounded-[3rem] p-12 md:p-20 mb-24" data-aos="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-brand-primary mb-4">Nuestros Valores</h2>
            <p className="text-brand-secondary">Lo que nos define y guía nuestro accionar diario.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Shield, title: 'Confianza', desc: 'Construimos vínculos sólidos basados en la honestidad.' },
              { icon: Users, title: 'Cercanía', desc: 'Trato personalizado y humano en cada consulta.' },
              { icon: Target, title: 'Eficacia', desc: 'Resultados concretos para tus necesidades.' },
              { icon: Award, title: 'Excelencia', desc: 'Buscamos la máxima calidad en nuestro servicio.' }
            ].map((value, idx) => (
              <div key={idx} className="text-center space-y-4" data-aos="fade-up" data-aos-delay={idx * 100}>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-brand-accent shadow-sm">
                  <value.icon size={32} />
                </div>
                <h3 className="text-xl font-display font-bold text-brand-primary">{value.title}</h3>
                <p className="text-sm text-brand-secondary leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission / Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-brand-primary text-white p-12 rounded-3xl" data-aos="fade-right">
            <h3 className="text-2xl font-display font-bold mb-6">Nuestra Misión</h3>
            <p className="text-white/70 leading-relaxed">
              Brindar soluciones inmobiliarias integrales y profesionales, garantizando seguridad jurídica y transparencia en todas las operaciones, para que nuestros clientes alcancen sus objetivos con total tranquilidad.
            </p>
          </div>
          <div className="bg-brand-primary/10 text-brand-primary p-12 rounded-3xl" data-aos="fade-left">
            <h3 className="text-2xl font-display font-bold mb-6">Nuestra Visión</h3>
            <p className="text-brand-primary/70 leading-relaxed">
              Ser la inmobiliaria referente en Córdoba por nuestra integridad, innovación en procesos y calidad humana, consolidando relaciones de largo plazo con nuestra comunidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
