/**
 * generate-previews.mjs
 * =====================
 * Modos de uso:
 *
 *   node scripts/generate-previews.mjs
 *     → Obtiene propiedades de Supabase, genera HTMLs en /public/preview
 *       y los copia a /dist/preview si la carpeta dist ya existe.
 *
 *   node scripts/generate-previews.mjs --copy-to-dist
 *     → Solo copia los HTMLs existentes de /public/preview → /dist/preview.
 *       Se usa como paso `postbuild` (después de que vite build crea /dist).
 *
 * Scripts de npm:
 *   prebuild  → node scripts/generate-previews.mjs
 *   build     → vite build
 *   postbuild → node scripts/generate-previews.mjs --copy-to-dist
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ─── Configuración ────────────────────────────────────────────────────────────

const SUPABASE_URL = 'https://nnybfkvrruukkfprjzew.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueWJma3ZycnV1a2tmcHJqemV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDkzMTIsImV4cCI6MjA4ODM4NTMxMn0.jeq9Vul3ENr9Rx8fuY3v_dZkOe4Kg6ShjW56Eqbg5dU'
const STORAGE_URL  = 'https://nnybfkvrruukkfprjzew.supabase.co/storage/v1/object/public/properties/'
const SITE_URL     = process.env.SITE_URL || 'https://armanpropiedades.com'

// ─── Rutas ────────────────────────────────────────────────────────────────────

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR    = path.resolve(__dirname, '..')
const PUBLIC_PREVIEW_DIR = path.join(ROOT_DIR, 'public', 'preview')
const DIST_PREVIEW_DIR   = path.join(ROOT_DIR, 'dist', 'preview')

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMainImageUrl(imagesField) {
  if (!imagesField) return null
  let imgs = []
  try {
    if (Array.isArray(imagesField))        imgs = imagesField
    else if (typeof imagesField === 'string') imgs = JSON.parse(imagesField)
  } catch {
    imgs = [imagesField]
  }
  if (!imgs.length) return null
  const first = imgs[0]
  if (first.startsWith('http')) return first
  return `${STORAGE_URL}${encodeURIComponent(first)}`
}

function buildDescription(property) {
  if (property.description && property.description.trim().length > 10) {
    return property.description.trim().slice(0, 160).replace(/\r?\n/g, ' ')
  }
  const parts = []
  if (property.operation) parts.push(property.operation)
  if (property.type)      parts.push(property.type)
  if (property.area)      parts.push(`${property.area} m²`)
  if (property.bedrooms)  parts.push(`${property.bedrooms} hab.`)
  if (property.bathrooms) parts.push(`${property.bathrooms} baños`)
  if (property.city)      parts.push(`en ${property.city}`)
  return parts.join(' · ') || 'Propiedad en Arman Propiedades'
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/"/g,  '&quot;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
}

function buildHTML(property) {
  const id          = property.id
  const title       = property.title || `Propiedad #${id}`
  const description = buildDescription(property)
  // ⚠️ Imagen fija para máxima compatibilidad con WhatsApp:
  // Las URLs dinámicas de Supabase Storage pueden fallar por headers,
  // redirects o formatos no soportados por el crawler de WhatsApp.
  const imageUrl    = `${SITE_URL}/og-default.jpg`
  const pageUrl     = `${SITE_URL}/propiedades/${id}`
  const previewUrl  = `${SITE_URL}/preview/${id}.html`
  const currency    = property.operation?.toLowerCase() === 'alquiler' ? 'ARS' : 'USD'
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
  <meta property="og:type"              content="article" />
  <meta property="og:site_name"         content="Arman Propiedades" />
  <meta property="og:url"               content="${escapeHtml(previewUrl)}" />
  <meta property="og:title"             content="${escapeHtml(fullTitle)}" />
  <meta property="og:description"       content="${escapeHtml(description)}" />
  <meta property="og:image"             content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:secure_url"  content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:type"        content="image/jpeg" />
  <meta property="og:image:width"       content="1200" />
  <meta property="og:image:height"      content="630" />
  <meta property="og:image:alt"         content="${escapeHtml(fullTitle)}" />
  <meta property="og:locale"            content="es_AR" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${escapeHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image"       content="${escapeHtml(imageUrl)}" />

  <!-- SEO -->
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(pageUrl)}" />

  <!-- Redirección para navegadores humanos (crawlers no ejecutan JS) -->
  <script>window.location.replace("${pageUrl}");</script>
  <noscript><meta http-equiv="refresh" content="0; url=${pageUrl}" /></noscript>

  <style>
    body{font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#e2e8f0;
      display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
    .card{text-align:center;max-width:480px;padding:2rem}
    .spinner{width:40px;height:40px;border:4px solid #334155;border-top-color:#f59e0b;
      border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 1.5rem}
    @keyframes spin{to{transform:rotate(360deg)}}
    a{color:#f59e0b}
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <p>Redirigiendo a la propiedad…</p>
    <p><a href="${pageUrl}">Hacer clic aquí si no fuiste redirigido/a.</a></p>
  </div>
</body>
</html>
`
}

// ─── Función: copiar public/preview → dist/preview ───────────────────────────

function copyToDistPreview() {
  const sep = '─'.repeat(55)
  console.log()
  console.log('📦  Copiando previews a /dist/preview…')
  console.log(sep)

  // Verificar que public/preview existe y tiene archivos
  if (!fs.existsSync(PUBLIC_PREVIEW_DIR)) {
    console.warn('⚠️   /public/preview no existe. Ejecutá primero: npm run generate-previews')
    return 0
  }

  const htmlFiles = fs.readdirSync(PUBLIC_PREVIEW_DIR).filter(f => f.endsWith('.html'))

  if (htmlFiles.length === 0) {
    console.warn('⚠️   No hay archivos .html en /public/preview para copiar.')
    return 0
  }

  // Verificar que dist existe (lo crea vite build)
  if (!fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
    console.warn('⚠️   La carpeta /dist no existe. Ejecutá primero: npm run build')
    return 0
  }

  // Crear dist/preview
  fs.mkdirSync(DIST_PREVIEW_DIR, { recursive: true })

  let copied = 0
  let errors = 0

  for (const file of htmlFiles) {
    try {
      const src  = path.join(PUBLIC_PREVIEW_DIR, file)
      const dest = path.join(DIST_PREVIEW_DIR, file)
      fs.copyFileSync(src, dest)
      copied++
    } catch (err) {
      console.error(`  ✗  Error copiando ${file}:`, err.message)
      errors++
    }
  }

  console.log(`  ✓  ${copied} archivos copiados a: ${DIST_PREVIEW_DIR}`)
  if (errors) console.warn(`  ⚠️  ${errors} errores durante la copia.`)
  console.log(sep)
  console.log(`🎉  /dist/preview listo con ${copied} HTMLs.`)
  console.log()
  console.log('🌐  URLs públicas para WhatsApp/Facebook:')
  console.log(`    ${SITE_URL}/preview/<id>.html`)
  console.log()

  return copied
}

// ─── Script principal ─────────────────────────────────────────────────────────

async function main() {
  const args       = process.argv.slice(2)
  const copyOnly   = args.includes('--copy-to-dist')
  const sep        = '─'.repeat(55)

  // ── MODO: solo copiar (postbuild) ────────────────────────────────────────
  if (copyOnly) {
    console.log('📋  Arman Propiedades — Postbuild: copia previews a /dist')
    copyToDistPreview()
    return
  }

  // ── MODO: generación completa (prebuild / manual) ─────────────────────────
  console.log('🏠  Arman Propiedades — Generador de previews Open Graph')
  console.log(sep)

  // Crear public/preview
  fs.mkdirSync(PUBLIC_PREVIEW_DIR, { recursive: true })

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

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
  console.log(`📁  Generando en: ${PUBLIC_PREVIEW_DIR}`)
  console.log(sep)

  let generated = 0
  let errors    = 0

  for (const property of properties) {
    try {
      const html     = buildHTML(property)
      const filePath = path.join(PUBLIC_PREVIEW_DIR, `${property.id}.html`)
      fs.writeFileSync(filePath, html, 'utf-8')
      console.log(`  ✓  /preview/${property.id}.html  →  "${property.title || 'Sin título'}"`)
      generated++
    } catch (err) {
      console.error(`  ✗  Error en id=${property.id}:`, err.message)
      errors++
    }
  }

  console.log(sep)
  console.log(`🎉  ${generated} archivos generados en /public/preview${errors ? `, ${errors} errores` : ''}.`)

  // Intentar copiar a dist/ si ya existe (ej: ejecución manual post-build)
  if (fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
    copyToDistPreview()
  } else {
    console.log()
    console.log('ℹ️   /dist aún no existe — los archivos serán incluidos por Vite')
    console.log('    durante el build y copiados explícitamente en el postbuild.')
    console.log()
  }
}

main()
