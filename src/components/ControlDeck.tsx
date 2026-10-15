/**
 * Panel de Control de la Simulación
 * Botones de ambientes, cambio de tonalidades/temas e intervenciones
 * Con botón para alternar entre Modo Claro y Modo Oscuro y adaptación total de letra/superficie
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

  return (
    <div className="space-y-4">
      {/* 1. Selector de Ambientes e Interactividad por Botones */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <span
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: theme.textSecondary }}
            >
              Selección de Ambientes Escolares
            </span>
          </div>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Colegio Orlando Fals Borda
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
                  <div
                    className="text-[11px] leading-relaxed line-clamp-2"
                    style={{ color: theme.textSecondary }}
                  >
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

      {/* 2. Selector de Tonalidades y Botón de Modo Oscuro / Claro */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <span
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: theme.textSecondary }}
            >
              Tonalidades Suaves y Modo de Iluminación
            </span>
          </div>

          {/* Botón interactivo para cambiar el ambiente de oscuro a claro */}
          <button
            onClick={onToggleColorMode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-sm self-start sm:self-auto hover:opacity-90"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.accentPrimary,
              color: theme.textPrimary,
            }}
            title={colorMode === 'oscuro' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {colorMode === 'oscuro' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Cambiar a Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-600" />
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

      {/* 3. Barra de Control de Reproducción y Tiempo Continuo */}
      <div
        className="p-4 rounded-2xl border transition-colors space-y-3 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Botones de Play / Pause / Reset */}
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

            {/* Velocidad */}
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

          {/* Reloj horario digital */}
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

        {/* Línea de Tiempo Deslizante */}
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
            <span>06:00 (Entrada)</span>
            <span>09:45 (Recreo)</span>
            <span>12:15 (Cambio Jornada)</span>
            <span>15:30 (Recreo Tarde)</span>
            <span>18:00 (Cierre)</span>
          </div>
        </div>
      </div>

      {/* 4. Ajustes Paramétricos de Variables Matemáticas */}
      <div
        className="p-4 rounded-2xl border transition-colors space-y-3 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <span
              className="text-xs font-semibold tracking-wide uppercase"
              style={{ color: theme.textSecondary }}
            >
              Variables Matemáticas del Modelo
            </span>
          </div>
          <span className="text-xs font-mono" style={{ color: theme.textSecondary }}>
            Colegio Fals Borda (~1,600 est.)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Estudiantes */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span style={{ color: theme.textSecondary }}>Población escolar activa (N):</span>
              <span className="font-mono font-medium" style={{ color: theme.textPrimary }}>
                {params.studentCount} estudiantes
              </span>
            </div>
            <input
              type="range"
              min={800}
              max={2800}
              step={100}
              value={params.studentCount}
              onChange={(e) =>
                onParamsChange((prev) => ({ ...prev, studentCount: parseInt(e.target.value) }))
              }
              className="w-full cursor-pointer accent-emerald-600 h-1.5"
            />
          </div>

          {/* Tasa de generación por estudiante */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span style={{ color: theme.textSecondary }}>Generación por estudiante (g_e):</span>
              <span className="font-mono font-medium" style={{ color: theme.textPrimary }}>
                {params.generationRatePerStudent} g/est-h
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={70}
              step={5}
              value={params.generationRatePerStudent}
              onChange={(e) =>
                onParamsChange((prev) => ({
                  ...prev,
                  generationRatePerStudent: parseInt(e.target.value),
                }))
              }
              className="w-full cursor-pointer accent-emerald-600 h-1.5"
            />
          </div>

          {/* Número de Contenedores */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span style={{ color: theme.textSecondary }}>Puntos de disposición (N_c):</span>
              <span className="font-mono font-medium" style={{ color: theme.textPrimary }}>
                {params.activeBins} contenedores ({params.activeBins * params.binCapacityLiters}L)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={6}
              step={1}
              value={params.activeBins}
              onChange={(e) =>
                onParamsChange((prev) => ({ ...prev, activeBins: parseInt(e.target.value) }))
              }
              className="w-full cursor-pointer accent-emerald-600 h-1.5"
            />
          </div>

          {/* Puestos de Comercio Informal */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span style={{ color: theme.textSecondary }}>Puestos comercio informal (P_inf):</span>
              <span className="font-mono font-medium" style={{ color: theme.textPrimary }}>
                {params.informalStalls} puestos
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={params.informalStalls}
              onChange={(e) =>
                onParamsChange((prev) => ({ ...prev, informalStalls: parseInt(e.target.value) }))
              }
              className="w-full cursor-pointer accent-emerald-600 h-1.5"
            />
          </div>
        </div>
      </div>

      {/* 5. Intervenciones Estratégicas y Mitigación (What-If) */}
      <div
        className="p-4 rounded-2xl border transition-colors space-y-2.5 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4" style={{ color: theme.accentPrimary }} />
          <span
            className="text-xs font-semibold tracking-wide uppercase"
            style={{ color: theme.textSecondary }}
          >
            Intervenciones de Mitigación Activas (What-If)
          </span>
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
                Vaciado programado justo al cierre del cambio de jornada.
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
                Sustitución de icopor y acopio conjunto con comerciantes.
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
