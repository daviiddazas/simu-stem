/**
 * Panel de Control Interactivo y Pedagógico de la Simulación
 * Permite a los estudiantes interactuar directamente mediante botones con los valores,
 * con explicaciones claras de la problemática ambiental y de las soluciones en cada punto.
 */

import React from 'react';
import { ColorMode, EnvironmentId, SimulationParams, ThemeId } from '../types';
import { ENVIRONMENTS_DATA } from '../utils/mathModel';
import { getTheme, THEMES_BY_MODE } from '../utils/themeConfig';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  Sun,
  Moon,
  Plus,
  Minus,
  HelpCircle,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface ControlDeckProps {
  currentHour: number;
  onHourChange: (hour: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  environmentId: EnvironmentId;
  onEnvironmentChange: (envId: EnvironmentId) => void;
  themeId: ThemeId;
  onThemeChange: (themeId: ThemeId) => void;
  colorMode: ColorMode;
  onToggleColorMode: () => void;
  params: SimulationParams;
  onParamsChange: (updater: (prev: SimulationParams) => SimulationParams) => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  currentHour,
  onHourChange,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  onSpeedChange,
  environmentId,
  onEnvironmentChange,
  themeId,
  onThemeChange,
  colorMode,
  onToggleColorMode,
  params,
  onParamsChange,
}) => {
  const theme = getTheme(themeId, colorMode);
  const activeThemesGroup = THEMES_BY_MODE[colorMode];

  const handleInterventionToggle = (key: keyof SimulationParams['interventions']) => {
    onParamsChange((prev) => ({
      ...prev,
      interventions: {
        ...prev.interventions,
        [key]: !prev.interventions[key],
      },
    }));
  };

  // Botones de Escenarios Rápidos de Prueba (Casos de Estudio para Estudiantes)
  const applyScenario = (type: 'crisis' | 'habitual' | 'solucion') => {
    if (type === 'crisis') {
      onParamsChange((prev) => ({
        ...prev,
        studentCount: 2200,
        activeBins: 2,
        informalStalls: 7,
        generationRatePerStudent: 45,
        civicCultureFactor: 0.2,
        interventions: {
          synchronizedCollection: false,
          ecologicalIslands: false,
          informalVendorAgreement: false,
          studentBrigade: false,
        },
      }));
    } else if (type === 'habitual') {
      onParamsChange((prev) => ({
        ...prev,
        studentCount: 1600,
        activeBins: 3,
        informalStalls: 4,
        generationRatePerStudent: 32,
        civicCultureFactor: 0.5,
        interventions: {
          synchronizedCollection: false,
          ecologicalIslands: true,
          informalVendorAgreement: false,
          studentBrigade: false,
        },
      }));
    } else {
      // Solución Integral Fals Borda
      onParamsChange((prev) => ({
        ...prev,
        studentCount: 1600,
        activeBins: 4,
        informalStalls: 3,
        generationRatePerStudent: 25,
        civicCultureFactor: 0.85,
        interventions: {
          synchronizedCollection: true,
          ecologicalIslands: true,
          informalVendorAgreement: true,
          studentBrigade: true,
        },
      }));
    }
  };

  // Ajustadores rápidos de valores (+ / -)
  const adjustStudents = (delta: number) => {
    onParamsChange((prev) => ({
      ...prev,
      studentCount: Math.min(2800, Math.max(800, prev.studentCount + delta)),
    }));
  };

  const adjustBins = (delta: number) => {
    onParamsChange((prev) => ({
      ...prev,
      activeBins: Math.min(6, Math.max(1, prev.activeBins + delta)),
    }));
  };

  const adjustStalls = (delta: number) => {
    onParamsChange((prev) => ({
      ...prev,
      informalStalls: Math.min(10, Math.max(0, prev.informalStalls + delta)),
    }));
  };

  const setCulturePreset = (val: number) => {
    onParamsChange((prev) => ({
      ...prev,
      civicCultureFactor: val,
    }));
  };

  return (
    <div className="space-y-4">
      {/* 1. Selección de Ambientes Escolares (Sin numeración mecánica) */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Puntos Críticos del Colegio Fals Borda
            </h3>
          </div>
          <span className="text-[11px]" style={{ color: theme.textSecondary }}>
            Elige la zona que deseas investigar
          </span>
        </div>

        {/* Panel de Botones de Ambientes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(Object.keys(ENVIRONMENTS_DATA) as EnvironmentId[]).map((id) => {
            const env = ENVIRONMENTS_DATA[id];
            const isSelected = environmentId === id;
            return (
              <button
                key={id}
                onClick={() => onEnvironmentChange(id)}
                className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                  isSelected ? 'shadow-sm font-medium ring-1' : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.bgPanel : theme.bgSurface,
                  borderColor: isSelected ? theme.accentPrimary : theme.borderColor,
                  color: theme.textPrimary,
                }}
              >
                <div>
                  <div className="font-semibold text-[13px] mb-1">{env.name}</div>
                  <div className="text-[11px] leading-relaxed line-clamp-2" style={{ color: theme.textSecondary }}>
                    {env.tagline}
                  </div>
                </div>

                <div
                  className="mt-2.5 pt-2 border-t flex items-center justify-between text-[10.5px] font-mono"
                  style={{ borderColor: theme.borderColor, color: theme.textSecondary }}
                >
                  <span>Puestos: {env.defaultInformalStalls}</span>
                  <span>{env.defaultBinCapacity}L dispuestos</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Modos de Visualización y Alternador de Luz (Sin numeración mecánica) */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Modo de Visualización
            </h3>
          </div>

          {/* Botón para alternar ambiente de Oscuro a Claro con texto adaptable */}
          <button
            onClick={onToggleColorMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-xs self-start sm:self-auto hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.accentPrimary,
              color: theme.textPrimary,
            }}
          >
            {colorMode === 'oscuro' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Cambiar a Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>Cambiar a Modo Oscuro</span>
              </>
            )}
          </button>
        </div>

        {/* Botones de tonalidades adaptativas con ajuste de color de letra */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(Object.keys(activeThemesGroup) as ThemeId[]).map((tId) => {
            const t = activeThemesGroup[tId];
            const isCurrent = themeId === tId;
            return (
              <button
                key={tId}
                onClick={() => onThemeChange(tId)}
                className={`px-3.5 py-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  isCurrent ? 'ring-1 shadow-sm font-semibold' : 'opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isCurrent ? t.bgPanel : t.bgSurface,
                  borderColor: isCurrent ? t.accentPrimary : t.borderColor,
                  color: t.textPrimary,
                }}
              >
                <div>
                  <div className="font-semibold text-xs">{t.name}</div>
                  <div className="text-[10.5px]" style={{ color: t.textSecondary }}>
                    {t.tagline}
                  </div>
                </div>

                <div className="flex gap-1 shrink-0 ml-2">
                  <span
                    className="w-3 h-3 rounded-full border border-black/15"
                    style={{ backgroundColor: t.bgMain }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/15"
                    style={{ backgroundColor: t.accentPrimary }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/15"
                    style={{ backgroundColor: t.chartLine }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Escenarios Rápidos de Prueba (Casos de Estudio con Botones Directos) */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm space-y-2.5"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Prueba Rápida: ¿Qué Pasa si Cambiamos las Condiciones?
            </h3>
          </div>
          <span className="text-[11px]" style={{ color: theme.textSecondary }}>
            1 clic para simular
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Botón Crisis */}
          <button
            onClick={() => applyScenario('crisis')}
            className="p-2.5 rounded-xl border text-left transition-all hover:opacity-90 active:scale-98 flex flex-col justify-between"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: '#D27979',
              color: theme.textPrimary,
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-500">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Crisis: Sin Control</span>
              </div>
              <p className="text-[10.5px] mt-1 leading-snug" style={{ color: theme.textSecondary }}>
                <strong>Problema:</strong> 2,200 alumnos, 7 puestos ambulantes y solo 2 canecas. La basura colapsa a las 11:30 AM.
              </p>
            </div>
          </button>

          {/* Botón Día Habitual */}
          <button
            onClick={() => applyScenario('habitual')}
            className="p-2.5 rounded-xl border text-left transition-all hover:opacity-90 active:scale-98 flex flex-col justify-between"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Día Habitual</span>
              </div>
              <p className="text-[10.5px] mt-1 leading-snug" style={{ color: theme.textSecondary }}>
                <strong>Problema:</strong> Sin recolección diurna de la UAESP. Se llena a la 1:30 PM y desborda en la tarde.
              </p>
            </div>
          </button>

          {/* Botón Solución IAP */}
          <button
            onClick={() => applyScenario('solucion')}
            className="p-2.5 rounded-xl border text-left transition-all hover:opacity-90 active:scale-98 flex flex-col justify-between"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.accentPrimary,
              color: theme.textPrimary,
            }}
          >
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solución Fals Borda</span>
              </div>
              <p className="text-[10.5px] mt-1 leading-snug" style={{ color: theme.textSecondary }}>
                <strong>Solución:</strong> Camión a la 1:15 PM, islas de 3 colores, pacto de vendedores y brigada estudiantil.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Barra de Tiempo y Reproducción */}
      <div
        className="p-4 rounded-2xl border transition-colors space-y-3 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: theme.accentPrimary }}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pausar' : 'Simular'}</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 rounded-xl border hover:opacity-80 text-xs transition-colors"
              style={{ borderColor: theme.borderColor, color: theme.textSecondary }}
              title="Reiniciar a las 6:00 AM"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div
              className="flex items-center gap-1 p-0.5 rounded-lg border text-xs"
              style={{ borderColor: theme.borderColor }}
            >
              {[1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-black/15 font-bold shadow-xs'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ color: theme.textPrimary }}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 opacity-70" style={{ color: theme.textSecondary }} />
            <span
              className="font-mono text-sm font-semibold tabular-nums"
              style={{ color: theme.textPrimary }}
            >
              {Math.floor(currentHour).toString().padStart(2, '0')}:
              {Math.round((currentHour - Math.floor(currentHour)) * 60)
                .toString()
                .padStart(2, '0')}{' '}
              {currentHour < 12 ? 'AM' : 'PM'}
            </span>
          </div>
        </div>

        <div>
          <input
            type="range"
            min={6.0}
            max={18.0}
            step={0.1}
            value={currentHour}
            onChange={(e) => onHourChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 rounded-lg"
          />
          <div
            className="flex justify-between text-[10px] font-mono mt-1"
            style={{ color: theme.textSecondary }}
          >
            <span>06:00 (Entrada Mañana)</span>
            <span>09:45 (Recreo)</span>
            <span>12:15 (Cambio Jornada)</span>
            <span>15:30 (Recreo Tarde)</span>
            <span>18:00 (Cierre)</span>
          </div>
        </div>
      </div>

      {/* 5. Botones Interactivos para Modificar Valores con Explicación de Problema y Solución */}
      <div
        className="p-4 rounded-2xl border transition-colors space-y-3.5 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Interacción Directa con los Valores del Modelo
            </h3>
          </div>
          <span className="text-[11px]" style={{ color: theme.textSecondary }}>
            Haz clic en los botones para experimentar
          </span>
        </div>

        {/* Variable 1: Estudiantes Activos */}
        <div
          className="p-3 rounded-xl border transition-colors space-y-2"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                Población Escolar Activa: {params.studentCount} estudiantes
              </span>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>¿El Problema?:</strong> A mayor cantidad de estudiantes transitando en horas punta, mayor es la generación repentina de empaques de refrigerio y botellas.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => adjustStudents(-200)}
                className="p-1.5 rounded-lg border hover:opacity-80 text-xs font-semibold flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
                title="Reducir 200 estudiantes"
              >
                <Minus className="w-3 h-3" />
                <span>200</span>
              </button>

              <button
                onClick={() => adjustStudents(200)}
                className="p-1.5 rounded-lg border hover:opacity-80 text-xs font-semibold flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
                title="Aumentar 200 estudiantes"
              >
                <Plus className="w-3 h-3" />
                <span>200</span>
              </button>

              <button
                onClick={() => onParamsChange((prev) => ({ ...prev, studentCount: 2400 }))}
                className="px-2 py-1 rounded-lg border text-[11px] font-mono hover:opacity-90"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
              >
                Día de Evento (2,400)
              </button>
            </div>
          </div>
        </div>

        {/* Variable 2: Canastillas y Capacidad */}
        <div
          className="p-3 rounded-xl border transition-colors space-y-2"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                Puntos de Disposición: {params.activeBins} canecas ({params.activeBins * params.binCapacityLiters} Litros)
              </span>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>¿La Solución?:</strong> Instalar más canecas amplía el límite físico $C_{'{max}'}$ y posterga la hora crítica de desborde hacia el andén.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => adjustBins(-1)}
                className="p-1.5 rounded-lg border hover:opacity-80 text-xs font-semibold flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
                title="Quitar 1 canastilla"
              >
                <Minus className="w-3 h-3" />
                <span>1 Caneca</span>
              </button>

              <button
                onClick={() => adjustBins(1)}
                className="p-1.5 rounded-lg border hover:opacity-80 text-xs font-semibold flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
                title="Agregar 1 canastilla"
              >
                <Plus className="w-3 h-3" />
                <span>1 Caneca</span>
              </button>

              <button
                onClick={() => onParamsChange((prev) => ({ ...prev, activeBins: 4 }))}
                className="px-2 py-1 rounded-lg border text-[11px] font-mono hover:opacity-90"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
              >
                Batería Óptima (4)
              </button>
            </div>
          </div>
        </div>

        {/* Variable 3: Puestos de Comercio Ambulante */}
        <div
          className="p-3 rounded-xl border transition-colors space-y-2"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                Puestos de Comercio Informal: {params.informalStalls} puestos
              </span>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>¿El Problema?:</strong> Cada puesto entrega icopor y plástico de un solo uso que ocupan hasta el 40% del volumen de las canastillas del colegio.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => adjustStalls(-1)}
                className="p-1.5 rounded-lg border hover:opacity-80 text-xs font-semibold flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
                title="Reducir 1 puesto"
              >
                <Minus className="w-3 h-3" />
                <span>1 Puesto</span>
              </button>

              <button
                onClick={() => adjustStalls(1)}
                className="p-1.5 rounded-lg border hover:opacity-80 text-xs font-semibold flex items-center gap-1 shadow-xs"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
                title="Aumentar 1 puesto"
              >
                <Plus className="w-3 h-3" />
                <span>1 Puesto</span>
              </button>

              <button
                onClick={() => onParamsChange((prev) => ({ ...prev, informalStalls: 0 }))}
                className="px-2 py-1 rounded-lg border text-[11px] font-mono hover:opacity-90"
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
              >
                Cero Ambulantes (0)
              </button>
            </div>
          </div>
        </div>

        {/* Variable 4: Cultura Ciudadana y Separación en la Fuente */}
        <div
          className="p-3 rounded-xl border transition-colors space-y-2"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                Cultura y Separación en la Fuente: {Math.round(params.civicCultureFactor * 100)}%
              </span>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>¿La Solución?:</strong> Cuando los estudiantes separan botellas y cartón, hasta el 45% de los residuos no entra al contenedor ordinario y se recicla.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCulturePreset(0.25)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                  params.civicCultureFactor <= 0.35 ? 'font-bold ring-1 shadow-xs' : 'opacity-80'
                }`}
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
              >
                Baja (25%)
              </button>

              <button
                onClick={() => setCulturePreset(0.6)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                  params.civicCultureFactor > 0.35 && params.civicCultureFactor < 0.75
                    ? 'font-bold ring-1 shadow-xs'
                    : 'opacity-80'
                }`}
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
              >
                Media (60%)
              </button>

              <button
                onClick={() => setCulturePreset(0.9)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                  params.civicCultureFactor >= 0.75 ? 'font-bold ring-1 shadow-xs' : 'opacity-80'
                }`}
                style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor, color: theme.textPrimary }}
              >
                Alta IAP (90%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Intervenciones Estratégicas y Mitigación */}
      <div
        className="p-4 rounded-2xl border transition-colors space-y-2.5 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4" style={{ color: theme.accentPrimary }} />
          <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
            Activa o Desactiva las Soluciones Estratégicas
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <label
            className="flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer hover:opacity-90 transition-colors"
            style={{ borderColor: theme.borderColor, backgroundColor: theme.bgPanel }}
          >
            <input
              type="checkbox"
              checked={params.interventions.synchronizedCollection}
              onChange={() => handleInterventionToggle('synchronizedCollection')}
              className="mt-0.5 rounded text-emerald-600"
            />
            <div>
              <div className="font-medium" style={{ color: theme.textPrimary }}>
                Recolección Sincronizada UAESP (13:15)
              </div>
              <div className="text-[11px] leading-tight" style={{ color: theme.textSecondary }}>
                Vaciado del camión justo al terminar el cambio de jornada escolar.
              </div>
            </div>
          </label>

          <label
            className="flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer hover:opacity-90 transition-colors"
            style={{ borderColor: theme.borderColor, backgroundColor: theme.bgPanel }}
          >
            <input
              type="checkbox"
              checked={params.interventions.ecologicalIslands}
              onChange={() => handleInterventionToggle('ecologicalIslands')}
              className="mt-0.5 rounded text-emerald-600"
            />
            <div>
              <div className="font-medium" style={{ color: theme.textPrimary }}>
                Islas Ecológicas Pedagógicas
              </div>
              <div className="text-[11px] leading-tight" style={{ color: theme.textSecondary }}>
                Separación 3 colores: blanco, verde y negro (Res. 2184/2019).
              </div>
            </div>
          </label>

          <label
            className="flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer hover:opacity-90 transition-colors"
            style={{ borderColor: theme.borderColor, backgroundColor: theme.bgPanel }}
          >
            <input
              type="checkbox"
              checked={params.interventions.informalVendorAgreement}
              onChange={() => handleInterventionToggle('informalVendorAgreement')}
              className="mt-0.5 rounded text-emerald-600"
            />
            <div>
              <div className="font-medium" style={{ color: theme.textPrimary }}>
                Pacto con Vendedores Ambulantes
              </div>
              <div className="text-[11px] leading-tight" style={{ color: theme.textSecondary }}>
                Sustitución de icopor y acopio propio con comerciantes.
              </div>
            </div>
          </label>

          <label
            className="flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer hover:opacity-90 transition-colors"
            style={{ borderColor: theme.borderColor, backgroundColor: theme.bgPanel }}
          >
            <input
              type="checkbox"
              checked={params.interventions.studentBrigade}
              onChange={() => handleInterventionToggle('studentBrigade')}
              className="mt-0.5 rounded text-emerald-600"
            />
            <div>
              <div className="font-medium" style={{ color: theme.textPrimary }}>
                Brigada IAP "Centinelas Falsbordianos"
              </div>
              <div className="text-[11px] leading-tight" style={{ color: theme.textSecondary }}>
                Vigilancia estudiantil y sensibilización participativa in situ.
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
