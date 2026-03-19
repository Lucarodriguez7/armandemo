import React from 'react';
import { Shield, Users, Target, Award } from 'lucide-react';

const Nosotros = () => {

const team = [
{
name:"Juan Cruz Mansur",
role:"Director de Operaciones",
desc:"Responsable de la coordinación operativa y estratégica de Arman Propiedades, asegurando eficiencia en cada proceso inmobiliario.",
img:"https://imgur.com/tiVRhj8.jpg"
},
{
name:"Rolando Argarate",
role:"Director",
desc:"Con una amplia trayectoria en el sector inmobiliario, lidera la visión y el crecimiento de la empresa.",
img:"https://imgur.com/zFJKNyJ.jpg"
},
{
name:"Ignacio Faraco Tey",
role:"Ejecutivo Comercial · Responsable en Publicidad",
desc:"Especialista en marketing inmobiliario y posicionamiento digital de propiedades.",
img:"https://imgur.com/Gi0ibwv.jpg"
},
{
name:"Eduardo Alejandro Mansur",
role:"Ejecutivo Comercial · Dpto Legal e Impuestos",
desc:"Brinda respaldo jurídico y asesoramiento fiscal para garantizar operaciones seguras y transparentes.",
img:"https://imgur.com/6mcX8Xj.jpg"
}
]

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">

          <div className="order-2 lg:order-1">
            <img
              src="https://i.imgur.com/F0E2ktZ.jpg"
              alt="Nuestra Oficina"
              className="rounded-3xl shadow-2xl opacity-90 w-full object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">

            <span className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-2 block">
              Nuestra Historia
            </span>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-primary mb-6 leading-tight">
              Compromiso y <span className="text-brand-primary/40">transparencia</span> en cada paso
            </h1>

            <div className="space-y-6 text-brand-secondary leading-relaxed">

              <p>
                Arman Propiedades nace con la visión de transformar la experiencia inmobiliaria en Córdoba, poniendo el foco en lo más importante: la confianza de las personas.
              </p>

              <p>
                Somos un equipo de profesionales apasionados por la gestión inmobiliaria responsable. Entendemos que detrás de cada operación hay sueños, ahorros y proyectos de vida.
              </p>

              <p>
                Nuestra trayectoria se construye día a día a través de la satisfacción de nuestros clientes y el cumplimiento estricto de nuestra palabra.
              </p>

            </div>

          </div>

        </div>


        {/* EQUIPO */}

        <div className="mb-28">

          <div className="text-center mb-16">

            <h2 className="text-3xl font-display font-bold text-brand-primary mb-4">
              Nuestro Equipo
            </h2>

            <p className="text-brand-secondary max-w-2xl mx-auto">
              Un grupo de profesionales comprometidos con brindar el mejor servicio inmobiliario.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {team.map((member,idx)=>(

              <div
              key={idx}
              className="group relative rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl aspect-[3/4]"
              >

                <img
                src={member.img}
                alt={member.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradiente inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Texto sobre la imagen */}
                <div className="absolute bottom-0 left-0 right-0 p-6">

                  <h3 className="text-base font-bold text-white leading-snug">
                    {member.name}
                  </h3>

                  <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1 mb-2 leading-tight">
                    {member.role}
                  </p>

                  <p className="text-xs text-white/60 leading-relaxed">
                    {member.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* VALUES */}

        <div className="bg-gray-50 rounded-[3rem] p-12 md:p-20 mb-24">

          <div className="text-center mb-16">

            <h2 className="text-3xl font-display font-bold text-brand-primary mb-4">
              Nuestros Valores
            </h2>

            <p className="text-brand-secondary">
              Lo que nos define y guía nuestro accionar diario.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {[
              { icon: Shield, title: 'Confianza', desc: 'Construimos vínculos sólidos basados en la honestidad.' },
              { icon: Users, title: 'Cercanía', desc: 'Trato personalizado y humano en cada consulta.' },
              { icon: Target, title: 'Eficacia', desc: 'Resultados concretos para tus necesidades.' },
              { icon: Award, title: 'Excelencia', desc: 'Buscamos la máxima calidad en nuestro servicio.' }
            ].map((value, idx) => (

              <div key={idx} className="text-center space-y-4">

                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-brand-accent shadow-sm">
                  <value.icon size={32} />
                </div>

                <h3 className="text-xl font-display font-bold text-brand-primary">
                  {value.title}
                </h3>

                <p className="text-sm text-brand-secondary leading-relaxed">
                  {value.desc}
                </p>

              </div>

            ))}

          </div>

        </div>


        {/* MISION / VISION */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="bg-brand-primary text-white p-12 rounded-3xl">

            <h3 className="text-2xl font-display font-bold mb-6">
              Nuestra Misión
            </h3>

            <p className="text-white/70 leading-relaxed">
              Brindar soluciones inmobiliarias integrales y profesionales, garantizando seguridad jurídica y transparencia en todas las operaciones.
            </p>

          </div>

          <div className="bg-brand-primary/10 text-brand-primary p-12 rounded-3xl">

            <h3 className="text-2xl font-display font-bold mb-6">
              Nuestra Visión
            </h3>

            <p className="text-brand-primary/70 leading-relaxed">
              Ser la inmobiliaria referente en Córdoba por nuestra integridad, innovación en procesos y calidad humana.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Nosotros;