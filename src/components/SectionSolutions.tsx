/**
 * Sección 3: Soluciones Estratégicas y Mitigación Viable
 * Corto, Mediano y Largo Plazo - Colegio Orlando Fals Borda
 * Adaptativo a Modo Claro y Modo Oscuro con alta legibilidad
 */

import React from 'react';
import { ColorMode, ThemeId } from '../types';
import { getTheme } from '../utils/themeConfig';
import { Zap, CalendarCheck, Landmark } from 'lucide-react';

interface SectionSolutionsProps {
  themeId: ThemeId;
  colorMode: ColorMode;
}

export const SectionSolutions: React.FC<SectionSolutionsProps> = ({ themeId, colorMode }) => {
  const theme = getTheme(themeId, colorMode);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Encabezado */}
      <div
        className="p-6 rounded-2xl border transition-colors shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-semibold tracking-wider uppercase font-mono px-2 py-0.5 rounded"
            style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
          >
            Sección 3 · Soluciones Estratégicas
          </span>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Plan de Mitigación Integral y Participativo (IAP)
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
          Propuestas de Mitigación Viables a Corto, Mediano y Largo Plazo
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
          Honrando el legado de Orlando Fals Borda y la Investigación Acción Participativa (IAP), la resolución de esta problemática no depende únicamente de instalar más canecas, sino de articular soluciones pedagógicas, logísticas e institucionales donde los estudiantes y vecinos sean sujetos activos de la transformación de su territorio.
        </p>
      </div>

      {/* Matriz Temporal de Soluciones */}
      <div className="space-y-4">
        {/* 1. Corto Plazo */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm"
          style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm" style={{ color: theme.textPrimary }}>
              Fase 1: Corto Plazo (1 a 3 meses) · Medidas Logísticas y de Choque Inmediato
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Ajuste de Microrruta UAESP (13:15 p.m.)
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Radicar solicitud formal ante la UAESP para incorporar un pase de vaciado y barrido mecánico exactamente al término del cambio de jornada, evitando que los residuos pasen la tarde expuestos en la acera.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Impacto: -75% desborde vespertino
              </span>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Puntos Ecológicos de Alto Caudal
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Sustituir las canastillas unipersonales por baterías modulares triples con tapas basculantes codificadas (Blanco: aprovechables; Verde: orgánicos; Negro: no aprovechables), ubicadas estratégicamente en las líneas de deseo peatonal del acceso.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Capacidad: +300% volumen
              </span>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Brigada "Centinelas Falsbordianos"
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Estudiantes de grados 10° y 11° que cumplen servicio social obligatorio realizan jornadas de sensibilización lúdica y vigilancia comunitaria en las puertas durante los 35 minutos pico de entrada y salida.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Cultura: +40% desvío selectivo
              </span>
            </div>
          </div>
        </div>

        {/* 2. Mediano Plazo */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm"
          style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
        >
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm" style={{ color: theme.textPrimary }}>
              Fase 2: Mediano Plazo (3 a 12 meses) · Pedagogía Comunitaria y Economía Circular
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Pacto con Vendedores Ambulantes
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Mesas de concertación mediadas por la Alcaldía Local de Usme: entrega de canastillas uniformes con recipiente de acopio propio, sustitución de icopor por empaques de papel kraft o fécula de maíz.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Generación informal: -60% volumen
              </span>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Ruta Escolar de Reciclaje con ASOREC
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Articulación directa con la Asociación de Recicladores de Oficio de la localidad. Se establecen horarios fijos de retiro del material aprovechable (PET, cartón, plegadiza) directamente desde el colegio.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Aprovechamiento: ~45 kg/día
              </span>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  PRAE en Metodología IAP
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Transformación del currículo de Ciencias Naturales y Sociales para que los estudiantes mapeen los focos de basura perimetrales y formulen murales ecológicos disuasorios en las paredes exteriores.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Apropiación territorial activa
              </span>
            </div>
          </div>
        </div>

        {/* 3. Largo Plazo */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm"
          style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-5 h-5 text-sky-500" />
            <h3 className="font-bold text-sm" style={{ color: theme.textPrimary }}>
              Fase 3: Largo Plazo (1 a 3 años) · Transformación Urbanística e Infraestructura Inteligente
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Contenedores Soterrados Inteligentes
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Instalación de buzones subterráneos de gran capacidad (3,000 litros) herméticos y libres de olores, equipados con sensores ultrasónicos de nivel IoT que alertan a la central del operador cuando alcanzan el 80% de volumen.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Eliminación de vectores y olores
              </span>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Zona Escolar Segura y Biorretentores
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Intervención urbanística que ensancha aceras peatonales e incorpora jardines de biorretención y mobiliario antivandálico, desincentivando el parqueo desordenado y el depósito clandestino de escombros en el perímetro.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Espacio público digno y caminable
              </span>
            </div>

            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Certificación "Colegio Basura Cero"
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Compostaje in situ del 100% de los residuos orgánicos de la cafetería escolar para alimentar la huerta pedagógica del colegio y reducir a menos de 10% los residuos enviados al Relleno Sanitario Doña Juana.
                </p>
              </div>
              <span className="mt-3 text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                Cierre total de ciclo de nutrientes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
