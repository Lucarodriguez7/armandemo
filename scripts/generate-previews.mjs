/**
 * generate-previews.mjs
 * =====================
 * Obtiene todas las propiedades publicadas de Supabase y genera
 * archivos HTML estáticos en /public/preview/<id>.html con meta
 * tags Open Graph correctas.
 *
 * Uso:
 *   npm run generate-previews
 *
 * Se ejecuta automáticamente antes del build si usas:
 *   npm run build
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ─── Configuración ────────────────────────────────────────────────────────────

// Estos valores son los mismos que usa supabaseClient.ts
const SUPABASE_URL  = 'https://nnybfkvrruukkfprjzew.supabase.co'
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueWJma3ZycnV1a2tmcHJqemV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDkzMTIsImV4cCI6MjA4ODM4NTMxMn0.jeq9Vul3ENr9Rx8fuY3v_dZkOe4Kg6ShjW56Eqbg5dU'

// URL de almacenamiento de imágenes en Supabase Storage
const STORAGE_URL   = 'https://nnybfkvrruukkfprjzew.supabase.co/storage/v1/object/public/properties/'

// Dominio público del sitio — cámbialo por tu dominio de producción
// Puedes también leerlo de una variable de entorno: process.env.SITE_URL
const SITE_URL = process.env.SITE_URL || 'https://armanpropiedades.com'

// ─── Rutas de archivos ────────────────────────────────────────────────────────

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR    = path.resolve(__dirname, '..')
const PREVIEW_DIR = path.join(ROOT_DIR, 'public', 'preview')

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Devuelve la URL de la imagen principal de una propiedad.
 * Soporta: array JSON, string JSON, string simple.
 */
function getMainImageUrl(imagesField) {
  if (!imagesField) return null

  let imgs = []
  try {
    if (Array.isArray(imagesField)) {
      imgs = imagesField
    } else if (typeof imagesField === 'string') {
      imgs = JSON.parse(imagesField)
    }
  } catch {
    // Si no es JSON válido, tratarlo como nombre de archivo directo
    imgs = [imagesField]
  }

  if (!imgs.length) return null

  const first = imgs[0]
  // Si ya es una URL completa, devolverla tal cual
  if (first.startsWith('http')) return first

  return `${STORAGE_URL}${encodeURIComponent(first)}`
}

/**
 * Genera texto para og:description a partir de los datos de la propiedad.
 * Usa la descripción real o crea una automática basada en características.
 */
function buildDescription(property) {
  if (property.description && property.description.trim().length > 10) {
    // Limitar a 160 caracteres para las previews
    return property.description.trim().slice(0, 160).replace(/\r?\n/g, ' ')
  }

  // Descripción automática
  const parts = []
  if (property.operation) parts.push(property.operation)
  if (property.type)      parts.push(property.type)
  if (property.area)      parts.push(`${property.area} m²`)
  if (property.bedrooms)  parts.push(`${property.bedrooms} hab.`)
  if (property.bathrooms) parts.push(`${property.bathrooms} baños`)
  if (property.city)      parts.push(`en ${property.city}`)

  const desc = parts.join(' · ')
  return desc || 'Propiedad en Arman Propiedades'
}

/**
 * Genera el HTML estático de la página de preview.
 */
function buildHTML(property) {
  const id          = property.id
  const title       = property.title || `Propiedad #${id}`
  const description = buildDescription(property)
  const imageUrl    = getMainImageUrl(property.images) || `${SITE_URL}/og-default.jpg`
  const pageUrl     = `${SITE_URL}/propiedades/${id}`
  const previewUrl  = `${SITE_URL}/preview/${id}.html`

  // Precio formateado
  const currency    = property.currency || (property.operation?.toLowerCase() === 'alquiler' ? 'ARS' : 'USD')
  const price       = property.price
    ? `${currency} ${new Intl.NumberFormat('es-AR').format(property.price)}`
    : ''
  const fullTitle   = price ? `${title} · ${price}` : title

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(fullTitle)}</title>

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type"        content="article" />
  <meta property="og:site_name"   content="Arman Propiedades" />
  <meta property="og:url"         content="${escapeHtml(previewUrl)}" />
  <meta property="og:title"       content="${escapeHtml(fullTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image"       content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale"      content="es_AR" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image"       content="${escapeHtml(imageUrl)}" />

  <!-- SEO básico -->
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(pageUrl)}" />

  <!-- Redirección inmediata para navegadores humanos -->
  <script>
    // Los crawlers de redes sociales NO ejecutan JavaScript.
    // Este script solo se ejecuta en navegadores reales,
    // redirigiendo al usuario a la SPA de React.
    window.location.replace("${pageUrl}");
  </script>

  <!-- Fallback: meta refresh por si el JS está bloqueado -->
  <noscript>
    <meta http-equiv="refresh" content="0; url=${pageUrl}" />
  </noscript>

  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      text-align: center;
      max-width: 480px;
      padding: 2rem;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #334155;
      border-top-color: #f59e0b;
      border-radius: 50%;
      animation: spin .8s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    a { color: #f59e0b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <p>Redirigiendo a la propiedad…</p>
    <p><a href="${pageUrl}">Hacer clic aquí si no se redirige automáticamente.</a></p>
  </div>
</body>
</html>
`
}

/** Escapa caracteres HTML peligrosos en atributos */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/"/g,  '&quot;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
}

// ─── Script principal ─────────────────────────────────────────────────────────

async function main() {
  console.log('🏠  Arman Propiedades — Generador de previews Open Graph')
  console.log('─'.repeat(55))

  // Crear el directorio de salida si no existe
  fs.mkdirSync(PREVIEW_DIR, { recursive: true })

  // Inicializar cliente Supabase (solo lectura, clave anon pública)
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

  // Obtener todas las propiedades con los campos necesarios
  console.log('📡  Obteniendo propiedades desde Supabase…')

  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, description, images, price, operation, type, area, bedrooms, bathrooms, city, zone')
    .order('id', { ascending: true })

  if (error) {
    console.error('❌  Error al obtener propiedades:', error.message)
    process.exit(1)
  }

  if (!properties || properties.length === 0) {
    console.warn('⚠️   No se encontraron propiedades en la base de datos.')
    process.exit(0)
  }

  console.log(`✅  ${properties.length} propiedades encontradas.`)
  console.log(`📁  Directorio de salida: ${PREVIEW_DIR}`)
  console.log('─'.repeat(55))

  let generated = 0
  let errors    = 0

  for (const property of properties) {
    try {
      const html     = buildHTML(property)
      const filePath = path.join(PREVIEW_DIR, `${property.id}.html`)
      fs.writeFileSync(filePath, html, 'utf-8')
      console.log(`  ✓  /preview/${property.id}.html  →  "${property.title || 'Sin título'}"`)
      generated++
    } catch (err) {
      console.error(`  ✗  Error generando preview para id=${property.id}:`, err.message)
      errors++
    }
  }

  console.log('─'.repeat(55))
  console.log(`🎉  Listo: ${generated} archivos generados${errors ? `, ${errors} errores` : ''}.`)
  console.log()
  console.log('💡  Para compartir en WhatsApp/Facebook usa URLs tipo:')
  console.log(`    ${SITE_URL}/preview/<id>.html`)
  console.log()
}

main()
