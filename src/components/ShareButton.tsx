import { useState } from "react"
import { Share2, Check } from "lucide-react"

interface ShareButtonProps {
  propertyId: string | number
}

export default function ShareButton({ propertyId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    // Generamos el link de vista previa optimizada para compartir
    const url = `https://armanpropiedades.com/preview/${propertyId}.html`
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      
      // Volver a estado normal después de 2 segundos
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("No se pudo copiar el enlace:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors duration-200
        ${copied 
          ? "text-emerald-600 bg-emerald-50/50" 
          : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"
        }`}
      title="Compartir propiedad"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      <span className="font-medium">
        {copied ? "Copiado" : "Compartir"}
      </span>
    </button>
  )
}
