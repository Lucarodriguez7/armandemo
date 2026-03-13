export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'Casa' | 'Departamento' | 'Terreno' | 'Local';
  operation: 'Venta' | 'Alquiler';
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  description: string;
  images: string[];
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'En pozo' | 'En construcción' | 'Finalizado';
}

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Casa Moderna en Valle Escondido',
    price: 'USD 250.000',
    location: 'Valle Escondido, Córdoba',
    type: 'Casa',
    operation: 'Venta',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    description: 'Hermosa propiedad de diseño moderno con amplios espacios luminosos, jardín parquizado y cochera doble.',
    images: ['https://picsum.photos/seed/house1/800/600', 'https://picsum.photos/seed/house1-2/800/600'],
    featured: true
  },
  {
    id: '2',
    title: 'Departamento Céntrico 1 Dormitorio',
    price: '$ 350.000',
    location: 'Nueva Córdoba, Córdoba',
    type: 'Departamento',
    operation: 'Alquiler',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    description: 'Excelente ubicación, balcón al frente, cocina separada y bajas expensas. Ideal estudiantes.',
    images: ['https://picsum.photos/seed/apt1/800/600'],
    featured: true
  },
  {
    id: '3',
    title: 'Lote en Barrio Cerrado',
    price: 'USD 45.000',
    location: 'Manantiales, Córdoba',
    type: 'Terreno',
    operation: 'Venta',
    area: 360,
    description: 'Terreno plano, excelente ubicación dentro del barrio, seguridad 24hs y todos los servicios.',
    images: ['https://picsum.photos/seed/land1/800/600'],
    featured: false
  },
  {
    id: '4',
    title: 'Local Comercial en Galería',
    price: '$ 120.000',
    location: 'Centro, Córdoba',
    type: 'Local',
    operation: 'Alquiler',
    area: 30,
    description: 'Local en planta baja, gran vidriera, zona de alto tránsito peatonal.',
    images: ['https://picsum.photos/seed/shop1/800/600'],
    featured: false
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Edificio Arman I',
    description: 'Complejo residencial de alta gama con amenities de primer nivel en el corazón de la ciudad.',
    image: 'https://picsum.photos/seed/proj1/800/600',
    status: 'En construcción'
  },
  {
    id: 'p2',
    title: 'Barrio Privado Las Acacias',
    description: 'Loteo exclusivo con entorno natural y seguridad permanente.',
    image: 'https://picsum.photos/seed/proj2/800/600',
    status: 'En pozo'
  }
];
