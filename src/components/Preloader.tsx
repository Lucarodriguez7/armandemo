import { useEffect, useState } from "react";

export default function Preloader({ onFinish }) {

  const [progress, setProgress] = useState(0);

  useEffect(() => {

    let value = 0;

    const interval = setInterval(() => {

      value += 2;
      setProgress(value);

      if (value >= 100) {

        clearInterval(interval);

        setTimeout(() => {
          if (onFinish) onFinish();
        }, 300);

      }

    }, 60);

    return () => clearInterval(interval);

  }, [onFinish]);



  return (

    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">

      <div className="flex flex-col items-center gap-10">

        {/* LOGO */}
        <div className="relative w-40 h-40 flex items-center justify-center">

          {/* Logo gris */}
          <img
            src="/logo.png"
            alt="logo"
            className="w-40 opacity-20"
          />

          {/* Animación de llenado */}
          <div
            className="absolute bottom-0 left-0 w-full bg-gray-400 transition-all duration-200"
            style={{
              height: `${progress}%`,
              maskImage: "url(/logo.png)",
              WebkitMaskImage: "url(/logo.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center"
            }}
          />

        </div>


        {/* Barra progreso */}
        <div className="w-48 h-[2px] bg-gray-200 overflow-hidden rounded">

          <div
            className="h-full bg-gray-500 transition-all"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

    </div>

  );

}