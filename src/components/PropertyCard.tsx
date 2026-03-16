import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize, Star } from "lucide-react";
import { FC } from "react";

export interface Property {
  id: string;
  title: string;
  type?: string;
  operation?: string;
  price?: number;
  currency?: string;

  location?: {
    zone?: string;
    city?: string;
  };

  city?: string;
  zone?: string;

  features?: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  };

  bedrooms?: number;
  bathrooms?: number;
  area?: number;

  images?: string[] | string;
  description?: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: Property;
}

const STORAGE_URL =
  "https://nnybfkvrruukkfprjzew.supabase.co/storage/v1/object/public/properties/";

const PropertyCard: FC<PropertyCardProps> = ({ property }) => {

  const formattedPrice = new Intl.NumberFormat("es-AR").format(property.price || 0);

  /* ---------- NORMALIZAR IMÁGENES ---------- */

  let imagesArray: string[] = [];

  try {

    if (Array.isArray(property.images)) {

      imagesArray = property.images;

    } else if (typeof property.images === "string") {

      imagesArray = JSON.parse(property.images);

    }

  } catch {

    imagesArray = [];

  }

  const images =
    imagesArray.length > 0
      ? imagesArray.map((img) => encodeURI(STORAGE_URL + img))
      : ["https://via.placeholder.com/800x600?text=Sin+Imagen"];

  /* ---------- DATOS ---------- */

  const zone = property.location?.zone || property.zone || "";

  const city = property.location?.city || property.city || "";

  const bedrooms =
    property.features?.bedrooms ??
    property.bedrooms ??
    "-";

  const bathrooms =
    property.features?.bathrooms ??
    property.bathrooms ??
    "-";

  const area =
    property.features?.area ??
    property.area ??
    "-";

  return (
    <Link
      to={`/propiedades/${property.id}`}
      className="group block"
    >

      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 h-full flex flex-col">

        {/* ---------- IMAGEN ---------- */}

        <div className="relative aspect-[4/3] overflow-hidden">

          <img
            src={images[0]}
            alt={property.title}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/800x600?text=Sin+Imagen";
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* GRADIENT SOMBRA IZQUIERDA */}

          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />

          {/* LOGO */}

          <img
            src="https://imgur.com/S0y156n.jpg"
            alt="logo"
            className="absolute top-3 left-3 w-8 h-8 object-contain drop-shadow-md"
          />

          {/* BADGES */}

          <div className="absolute top-4 left-14 flex gap-2">

            {property.operation && (
              <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                {property.operation}
              </span>
            )}

            {property.type && (
              <span className="bg-white/90 backdrop-blur text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                {property.type}
              </span>
            )}

          </div>

          {/* DESTACADO */}

          {property.featured && (

            <div className="absolute top-4 right-4 bg-yellow-400 p-2 rounded-full shadow">

              <Star size={16} className="text-white"/>

            </div>

          )}

          {/* PRECIO */}

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">

            <p className="text-white font-bold text-xl tracking-tight">
              {(property.currency || (property.operation?.toLowerCase() === "alquiler" ? "ARS" : "USD"))} {formattedPrice}
            </p>

          </div>

        </div>

        {/* ---------- INFO ---------- */}

        <div className="p-5 flex flex-col flex-grow">

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-black transition">

            {property.title}

          </h3>

          <div className="flex items-center text-gray-500 text-sm mb-4">

            <MapPin size={16} className="mr-1 shrink-0"/>

            <span className="truncate">

              {[zone, city].filter(Boolean).join(", ") || "Ubicación no especificada"}

            </span>

          </div>

          {/* FEATURES */}

          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-gray-600 text-sm">

            <div className="flex items-center gap-1.5">

              <BedDouble size={18} className="text-gray-400"/>

              <span>{bedrooms}</span>

            </div>

            <div className="flex items-center gap-1.5">

              <Bath size={18} className="text-gray-400"/>

              <span>{bathrooms}</span>

            </div>

            <div className="flex items-center gap-1.5">

              <Maximize size={18} className="text-gray-400"/>

              <span>{area} m²</span>

            </div>

          </div>

        </div>

      </div>

    </Link>
  );
};

export default PropertyCard;