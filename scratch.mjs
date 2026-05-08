import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nnybfkvrruukkfprjzew.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueWJma3ZycnV1a2tmcHJqemV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDkzMTIsImV4cCI6MjA4ODM4NTMxMn0.jeq9Vul3ENr9Rx8fuY3v_dZkOe4Kg6ShjW56Eqbg5dU'

const STORAGE_URL  = 'https://nnybfkvrruukkfprjzew.supabase.co/storage/v1/render/image/public/properties/'

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
  let first = imgs[0]
  if (first.startsWith('http')) {
    try {
      const parsed = new URL(first)
      parsed.pathname = parsed.pathname
        .split('/')
        .map(segment => encodeURIComponent(decodeURIComponent(segment)))
        .join('/')
      first = parsed.toString()
    } catch {
      first = first.replace(/ /g, '%20')
    }
    if (first.includes('/storage/v1/object/public/')) {
      first = first.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
      return `${first}${first.includes('?') ? '&' : '?'}width=600&height=315&resize=contain`
    }
    if (first.includes('/storage/v1/render/image/public/') && !first.includes('width=')) {
      return `${first}${first.includes('?') ? '&' : '?'}width=600&height=315&resize=contain`
    }
    return first
  }
  return `${STORAGE_URL}${encodeURIComponent(first)}?width=600&height=315&resize=contain`
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function main() {
  const { data: properties, error } = await supabase
    .from('properties')
    .select('id, title, description, images, price, operation, type, area, bedrooms, bathrooms, city, zone')

  if (error) {
    console.error('Error:', error)
    return
  }

  const targets = [
    "Casa en Venta de 2 dormitorios en Las Piedras",
    "Departamento 2 Dormitorios en Condominio Pacífico",
    "El Collado"
  ]

  for (const p of properties) {
    for (const t of targets) {
      if (p.title && p.title.toLowerCase().includes(t.toLowerCase())) {
        console.log(`\nFound: ${p.title} (ID: ${p.id})`)
        console.log(`Generated Image URL:`, getMainImageUrl(p.images))
      }
    }
  }
}

main()
