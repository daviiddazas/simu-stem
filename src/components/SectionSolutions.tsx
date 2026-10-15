/**
 * Sección 3: Soluciones Estratégicas y Mitigación Viable
 * Corto, Mediano y Largo Plazo - Colegio Orlando Fals Borda
 * Adaptativo a Modo Claro y Modo Oscuro con alta legibilidad
 * Incluye botones interactivos para simular cada hecho directamente en el lienzo.
 */

import React from 'react';
import { ColorMode, ThemeId, SolutionEventId } from '../types';
import { getTheme } from '../utils/themeConfig';
import { Zap, CalendarCheck, Landmark, Sparkles, Play, ArrowRight } from 'lucide-react';

interface SectionSolutionsProps {
  themeId: ThemeId;
  colorMode: ColorMode;
  onSimulateSolution?: (solId: SolutionEventId) => void;
}

export const SectionSolutions: React.FC<SectionSolutionsProps> = ({
  themeId,
  colorMode,
  onSimulateSolution,
}) => {
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

        {onSimulateSolution && (
          <div className="mt-4 pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: theme.borderColor }}>
            <span className="text-xs" style={{ color: theme.textSecondary }}>
              ¿Quieres comprobar la eficacia de estas soluciones en el modelo matemático?
            </span>
            <button
              onClick={() => onSimulateSolution('allSolutions')}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 text-white shadow-xs transition-transform active:scale-95"
              style={{ backgroundColor: '#2D6646' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simular Todas las Soluciones en Vivo</span>
            </button>
          </div>
        )}
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
            {/* Medida 1.1 */}
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
              <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
                <span className="text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                  -75% desborde
                </span>
                {onSimulateSolution && (
                  <button
                    onClick={() => onSimulateSolution('synchronizedCollection')}
                    className="px-2 py-1 rounded-lg text-[10.5px] font-semibold text-white transition-transform active:scale-95"
                    style={{ backgroundColor: theme.accentPrimary }}
                  >
                    Simular Hecho 🎬
                  </button>
                )}
              </div>
            </div>

            {/* Medida 1.2 */}
            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Islas Ecológicas de Alto Caudal
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Sustituir las canastillas unipersonales por baterías modulares triples con tapas basculantes codificadas (Blanco: aprovechables; Verde: orgánicos; Negro: no aprovechables), ubicadas estratégicamente en las líneas de deseo peatonal del acceso.
                </p>
              </div>
              <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
                <span className="text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                  +300% volumen
                </span>
                {onSimulateSolution && (
                  <button
                    onClick={() => onSimulateSolution('ecologicalIslands')}
                    className="px-2 py-1 rounded-lg text-[10.5px] font-semibold text-white transition-transform active:scale-95"
                    style={{ backgroundColor: theme.accentPrimary }}
                  >
                    Simular Hecho 🎬
                  </button>
                )}
              </div>
            </div>

            {/* Medida 1.3 */}
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
              <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
                <span className="text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                  +40% desvío
                </span>
                {onSimulateSolution && (
                  <button
                    onClick={() => onSimulateSolution('studentBrigade')}
                    className="px-2 py-1 rounded-lg text-[10.5px] font-semibold text-white transition-transform active:scale-95"
                    style={{ backgroundColor: theme.accentPrimary }}
                  >
                    Simular Hecho 🎬
                  </button>
                )}
              </div>
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
            {/* Medida 2.1 */}
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
              <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
                <span className="text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                  -60% volumen calle
                </span>
                {onSimulateSolution && (
                  <button
                    onClick={() => onSimulateSolution('informalVendorAgreement')}
                    className="px-2 py-1 rounded-lg text-[10.5px] font-semibold text-white transition-transform active:scale-95"
                    style={{ backgroundColor: theme.accentPrimary }}
                  >
                    Simular Hecho 🎬
                  </button>
                )}
              </div>
            </div>

            {/* Medida 2.2 */}
            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  Ruta Escolar con Recicladores de Usme
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Articulación directa con la Asociación de Recicladores de Oficio de la localidad. Se establecen horarios fijos de retiro del material aprovechable (PET, cartón, plegadiza) directamente desde el colegio.
                </p>
              </div>
              <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
                <span className="text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                  ~45 kg/día reciclados
                </span>
                {onSimulateSolution && (
                  <button
                    onClick={() => onSimulateSolution('ecologicalIslands')}
                    className="px-2 py-1 rounded-lg text-[10.5px] font-semibold text-white transition-transform active:scale-95"
                    style={{ backgroundColor: theme.accentPrimary }}
                  >
                    Simular Hecho 🎬
                  </button>
                )}
              </div>
            </div>

            {/* Medida 2.3 */}
            <div
              className="p-3.5 rounded-xl border flex flex-col justify-between"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div>
                <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                  PRAE en Metodología IAP Fals Borda
                </h4>
                <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                  Transformación del currículo de Ciencias Naturales y Sociales para que los estudiantes mapeen los focos de basura perimetrales y formulen murales ecológicos disuasorios en las paredes exteriores.
                </p>
              </div>
              <div className="pt-3 border-t mt-3 flex items-center justify-between" style={{ borderColor: theme.borderColor }}>
                <span className="text-[10.5px] font-mono font-semibold" style={{ color: theme.accentPrimary }}>
                  Apropiación social activa
                </span>
                {onSimulateSolution && (
                  <button
                    onClick={() => onSimulateSolution('studentBrigade')}
                    className="px-2 py-1 rounded-lg text-[10.5px] font-semibold text-white transition-transform active:scale-95"
                    style={{ backgroundColor: theme.accentPrimary }}
                  >
                    Simular Hecho 🎬
                  </button>
                )}
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div
              className="p-3.5 rounded-xl border"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                Baterías de Contenedores Soterrados Hidráulicos
              </h4>
              <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                Instalación de buzones en acera con buzones subterráneos de 3 m³ accionados hidráulicamente por los camiones de aseo. Impide el acceso de perros callejeros, elimina olores y sextuplica la capacidad de almacenamiento.
              </p>
            </div>

            <div
              className="p-3.5 rounded-xl border"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <h4 className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                Zona Libre de Plásticos de Un Solo Uso
              </h4>
              <p className="leading-relaxed" style={{ color: theme.textSecondary }}>
                Acuerdo con la Junta Administradora Local (JAL) de Usme para declarar un perímetro escolar de 100 metros como "Zona de Exclusión de Icopor y Empaques No Biodegradables", con subsidio distrital a vajillas retornables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
