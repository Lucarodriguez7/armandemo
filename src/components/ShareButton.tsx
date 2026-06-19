import React, { useState } from "react"
import { Share2, Check, Copy } from "lucide-react"

interface ShareButtonProps {
  propertyId: string | number
  propertyTitle?: string
}

export default function ShareButton({ propertyId, propertyTitle }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = `https://armanpropiedades.com/preview/${propertyId}.html`
  const title = propertyTitle || "Propiedad en Venta | Arman Propiedades"

  const handleShareClick = async () => {
    // Si la API de compartir nativa está disponible (principalmente en dispositivos móviles)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Mirá esta propiedad de Arman Propiedades:`,
          url: url,
        })
        return
      } catch (err) {
        // Si el usuario cancela o hay un error, mostramos el menú alternativo (dropdown)
        console.log("Error al compartir nativamente o cancelado, mostrando menú...", err)
      }
    }
    // En desktop o si no tiene soporte de share nativo, abrimos el menú
    setIsOpen(!isOpen)
  }

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setIsOpen(false)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("No se pudo copiar el enlace:", err)
    }
  }

  const handleWhatsAppShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    // Mensaje premium con formato para WhatsApp. 
    // Es clave que el link sea lo último para que WhatsApp cargue la previsualización correctamente.
    const text = `Mirá esta excelente propiedad de Arman Propiedades: ${title}\n\n👉 ${url}`
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waUrl, "_blank")
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShareClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200
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

      {/* Clic fuera para cerrar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 cursor-default" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Premium */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <svg 
              className="w-4 h-4 text-[#25D366]" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.76.459 3.475 1.332 4.992L2 22l5.176-1.358c1.477.806 3.137 1.23 4.825 1.23 5.506 0 9.988-4.482 9.988-9.988C22 6.482 17.518 2 12.012 2zm6.273 14.156c-.258.726-1.503 1.328-2.068 1.41-.497.072-1.144.129-3.232-.738-2.67-1.107-4.398-3.826-4.53-4.004-.133-.178-1.077-1.431-1.077-2.732 0-1.301.68-1.942.923-2.203.243-.26.531-.326.709-.326.177 0 .354.004.509.011.162.007.38-.063.593.45.222.535.756 1.848.823 1.984.066.137.111.296.022.474-.089.178-.133.31-.266.466-.133.156-.279.347-.398.466-.133.133-.272.278-.118.544.155.266.69 1.134 1.478 1.834.997.887 1.835 1.16 2.093 1.293.258.133.409.111.564-.066.155-.178.665-.776.843-1.039.178-.263.354-.222.597-.133.243.089 1.55.731 1.816.864.266.133.443.2.509.31.066.11.066.643-.192 1.369z"/>
            </svg>
            <span className="font-medium text-gray-800">Compartir por WhatsApp</span>
          </button>
          
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
          >
            <Copy size={16} className="text-gray-400" />
            <span className="font-medium text-gray-800">Copiar enlace de vista previa</span>
          </button>
        </div>
      )}
    </div>
  )
}
