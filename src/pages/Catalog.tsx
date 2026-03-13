import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import  PropertyCard  from "../components/PropertyCard"
import { supabase } from '../lib/supabaseClient';

const Catalog = () => {

  const [properties, setProperties] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    operation: 'Todos',
    type: 'Todos',
    location: 'Todos'
  });

  useEffect(() => {

    async function loadProperties() {

     const { data, error } = await supabase
  .from("properties")
  .select("*");

console.log("SUPABASE DATA:", data);
console.log("SUPABASE ERROR:", error);
      if (error) {
        console.log(error);
      } else {
        setProperties(data || []);
      }

    }

    loadProperties();

  }, []);

  const filteredProperties = properties.filter(p => {
    const opMatch = filters.operation === 'Todos' || p.operation === filters.operation;
    const typeMatch = filters.type === 'Todos' || p.type === filters.type;
    return opMatch && typeMatch;
  });

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-display font-bold text-brand-primary mb-4">
            Catálogo de Propiedades
          </h1>
          <p className="text-brand-secondary">
            Encontrá el hogar que estás buscando entre nuestras opciones seleccionadas.
          </p>
        </div>

        {/* Filters Bar */}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12" data-aos="fade-up" data-aos-delay="100">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-2">
                Operación
              </label>

              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                value={filters.operation}
                onChange={(e) => setFilters({ ...filters, operation: e.target.value })}
              >
                <option>Todos</option>
                <option>Venta</option>
                <option>Alquiler</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-2">
                Tipo de Propiedad
              </label>

              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option>Todos</option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Terreno</option>
                <option>Local</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-secondary mb-2">
                Ubicación
              </label>

              <select
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option>Todas las zonas</option>
                <option>Nueva Córdoba</option>
                <option>Centro</option>
                <option>Valle Escondido</option>
                <option>Manantiales</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-brand-primary text-white rounded-lg px-4 py-3 text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                <Search size={18} />
                Buscar
              </button>
            </div>

          </div>
        </div>

        {/* Results Grid */}

        {filteredProperties.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProperties.map((property, idx) => (
              <div key={property.id} data-aos="fade-up" data-aos-delay={idx * 50}>
                <PropertyCard property={property} />
              </div>
            ))}

          </div>

        ) : (

          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">

            <div className="text-gray-400 mb-4 flex justify-center">
              <SlidersHorizontal size={48} />
            </div>

            <h3 className="text-xl font-display font-bold text-brand-primary">
              No se encontraron propiedades
            </h3>

            <p className="text-brand-secondary mt-2">
              Intentá ajustando los filtros de búsqueda.
            </p>

          </div>

        )}

      </div>
    </div>
  );
};

export default Catalog;