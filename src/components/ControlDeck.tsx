/**
 * Panel de Control Interactivo y Pedagógico de la Simulación
 * Colegio Orlando Fals Borda
 * 1. Entrada directa de valores numéricos personalizados por parte del estudiante (con botones +/- y sliders).
 * 2. Simulación en vivo del hecho concreto en cada una de las 4 soluciones estratégicas.
 * 3. Explicación clara de "El Problema", "La Solución" y "El Impacto Matemático".
 * 4. Presets rápidos de experimentación académica.
 */

import React from 'react';
import { ColorMode, EnvironmentId, SimulationParams, ThemeId, SolutionEventId } from '../types';
import { ENVIRONMENTS_DATA } from '../utils/mathModel';
import { getTheme, THEMES_BY_MODE } from '../utils/themeConfig';
import { soundManager } from '../utils/audioEffects';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Sun,
  Moon,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Trash2,
  Users,
  Store,
  Recycle,
  Sparkle,
  Truck,
  GraduationCap,
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
  activeSolutionSim?: SolutionEventId | null;
  onTriggerSolutionSim?: (solutionId: SolutionEventId) => void;
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
  activeSolutionSim,
  onTriggerSolutionSim,
}) => {
  const theme = getTheme(themeId, colorMode);
  const activeThemesGroup = THEMES_BY_MODE[colorMode];

  // Alternador de checkbox de intervención
  const handleInterventionToggle = (key: keyof SimulationParams['interventions']) => {
    onParamsChange((prev) => ({
      ...prev,
      interventions: {
        ...prev.interventions,
        [key]: !prev.interventions[key],
      },
    }));
  };

  // Simulación directa del hecho en cada solución
  const simulateSolutionEvent = (solutionKey: SolutionEventId) => {
    if (solutionKey === 'allSolutions') {
      onParamsChange((prev) => ({
        ...prev,
        civicCultureFactor: 0.85,
        interventions: {
          synchronizedCollection: true,
          ecologicalIslands: true,
          informalVendorAgreement: true,
          studentBrigade: true,
        },
      }));
      onHourChange(12.2);
      soundManager.playSuccessChime();
      if (onTriggerSolutionSim) onTriggerSolutionSim('allSolutions');
      return;
    }

    onParamsChange((prev) => ({
      ...prev,
      interventions: {
        ...prev.interventions,
        [solutionKey]: true,
      },
    }));

    if (solutionKey === 'synchronizedCollection') {
      onHourChange(13.15); // Salto a las 1:09 PM para ver llegar el camión a las 13:15
      soundManager.playTruckHonk();
    } else if (solutionKey === 'informalVendorAgreement') {
      onHourChange(12.3); // Almuerzo con puestos activos
      soundManager.playSuccessChime();
    } else if (solutionKey === 'ecologicalIslands') {
      onHourChange(9.75); // Recreo de la mañana
      soundManager.playSuccessChime();
    } else if (solutionKey === 'studentBrigade') {
      onHourChange(12.2); // Cambio de jornada
      soundManager.playSchoolBell();
    }

    if (onTriggerSolutionSim) {
      onTriggerSolutionSim(solutionKey);
    }
  };

  // Presets de escenarios para estudiantes
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
      onHourChange(11.0);
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
      onHourChange(9.5);
    } else {
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
      onHourChange(12.2);
      soundManager.playSuccessChime();
    }
  };

  // Formato horario
  const formatTime = (hourDecimal: number) => {
    const h = Math.floor(hourDecimal);
    const m = Math.floor((hourDecimal - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* 1. SELECCIÓN DE PUNTOS CRÍTICOS DEL COLEGIO */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm space-y-3"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.accentPrimary }} />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Puntos Críticos del Colegio Fals Borda
            </h3>
          </div>
          <span className="text-[11px]" style={{ color: theme.textSecondary }}>
            Selecciona el entorno para simular
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(Object.keys(ENVIRONMENTS_DATA) as EnvironmentId[]).map((envKey) => {
            const env = ENVIRONMENTS_DATA[envKey];
            const isSelected = environmentId === envKey;
            return (
              <button
                key={envKey}
                onClick={() => onEnvironmentChange(envKey)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected ? 'ring-2 shadow-xs' : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.bgPanel : theme.bgSurface,
                  borderColor: isSelected ? theme.accentPrimary : theme.borderColor,
                  color: theme.textPrimary,
                }}
              >
                <div className="font-semibold text-xs leading-snug">{env.name}</div>
                <div className="text-[11px] mt-1 line-clamp-2" style={{ color: theme.textSecondary }}>
                  {env.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CONTROL DEL TIEMPO Y REPRODUCCIÓN */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm space-y-3"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Reloj y Control del Tiempo Escolar
            </h3>
          </div>
          <div className="text-base font-bold font-mono" style={{ color: theme.accentPrimary }}>
            {formatTime(currentHour)}
          </div>
        </div>

        {/* Barra deslizadora de tiempo */}
        <input
          type="range"
          min="6.0"
          max="18.0"
          step="0.05"
          value={currentHour}
          onChange={(e) => onHourChange(parseFloat(e.target.value))}
          className="w-full cursor-pointer accent-emerald-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
        />

        <div className="flex items-center justify-between text-[11px]" style={{ color: theme.textSecondary }}>
          <span>06:00 (Entrada Mañana)</span>
          <span>12:15 (Cambio Jornada)</span>
          <span>18:00 (Salida Tarde)</span>
        </div>

        {/* Botones de Reproducción */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 text-white transition-transform active:scale-95 shadow-xs"
              style={{ backgroundColor: theme.accentPrimary }}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Reanudar</span>
                </>
              )}
            </button>

            <button
              onClick={onReset}
              className="p-1.5 rounded-xl border hover:opacity-80 transition-colors"
              style={{ borderColor: theme.borderColor, color: theme.textPrimary }}
              title="Reiniciar a las 06:00 a.m."
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Velocidad */}
          <div className="flex items-center gap-1">
            {[1, 2, 4].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                  playbackSpeed === speed ? 'bg-emerald-600 text-white' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  borderColor: theme.borderColor,
                }}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. SIMULACIÓN DIRECTA DEL HECHO EN CADA SOLUCIÓN (Pedagógico e Interactivo) */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm space-y-3.5"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sparkle className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Simula el Hecho en Cada Solución
            </h3>
          </div>
          <span className="text-[11px] font-medium" style={{ color: theme.accentPrimary }}>
            Haz clic para ver el evento en vivo en la pantalla
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Solución 1: Recolección Sincronizada UAESP */}
          <div
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              activeSolutionSim === 'synchronizedCollection' ? 'ring-2 ring-emerald-500 shadow-sm' : ''
            }`}
            style={{
              backgroundColor: params.interventions.synchronizedCollection ? theme.bgPanel : theme.bgSurface,
              borderColor: params.interventions.synchronizedCollection ? theme.accentPrimary : theme.borderColor,
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
                  <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Recolección Sincronizada UAESP</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed mt-1" style={{ color: theme.textSecondary }}>
                <strong>El Problema:</strong> El camión pasaba a las 11:30 AM, dejando 6 horas de acumulación en el cambio de jornada.
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>La Solución:</strong> Desplazar la microrruta a las 13:15 PM para evacuar los residuos justo al terminar el cruce masivo.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t" style={{ borderColor: theme.borderColor }}>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.interventions.synchronizedCollection}
                  onChange={() => handleInterventionToggle('synchronizedCollection')}
                  className="rounded text-emerald-600"
                />
                <span style={{ color: theme.textPrimary }}>Activa</span>
              </label>

              <button
                onClick={() => simulateSolutionEvent('synchronizedCollection')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white shadow-xs transition-transform active:scale-95"
                style={{ backgroundColor: theme.accentPrimary }}
              >
                🎬 Ver Camión en Acción
              </button>
            </div>
          </div>

          {/* Solución 2: Batería Modular de 3 Colores (Islas Ecológicas) */}
          <div
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              activeSolutionSim === 'ecologicalIslands' ? 'ring-2 ring-emerald-500 shadow-sm' : ''
            }`}
            style={{
              backgroundColor: params.interventions.ecologicalIslands ? theme.bgPanel : theme.bgSurface,
              borderColor: params.interventions.ecologicalIslands ? theme.accentPrimary : theme.borderColor,
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
                  <Recycle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>2. Islas Ecológicas (Res. 2184)</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed mt-1" style={{ color: theme.textSecondary }}>
                <strong>El Problema:</strong> Mezcla de residuos en canecas únicas que inutiliza plásticos y genera lixiviados con mal olor.
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>La Solución:</strong> Módulos triples (Blanco: PET/Papel; Verde: Orgánicos; Negro: No aprovechables) con recicladores de Usme.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t" style={{ borderColor: theme.borderColor }}>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.interventions.ecologicalIslands}
                  onChange={() => handleInterventionToggle('ecologicalIslands')}
                  className="rounded text-emerald-600"
                />
                <span style={{ color: theme.textPrimary }}>Activa</span>
              </label>

              <button
                onClick={() => simulateSolutionEvent('ecologicalIslands')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white shadow-xs transition-transform active:scale-95"
                style={{ backgroundColor: theme.accentPrimary }}
              >
                🎬 Ver Separación y Carreta
              </button>
            </div>
          </div>

          {/* Solución 3: Pacto con Vendedores Ambulantes */}
          <div
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              activeSolutionSim === 'informalVendorAgreement' ? 'ring-2 ring-emerald-500 shadow-sm' : ''
            }`}
            style={{
              backgroundColor: params.interventions.informalVendorAgreement ? theme.bgPanel : theme.bgSurface,
              borderColor: params.interventions.informalVendorAgreement ? theme.accentPrimary : theme.borderColor,
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
                  <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>3. Pacto con Vendedores Ambulantes</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed mt-1" style={{ color: theme.textSecondary }}>
                <strong>El Problema:</strong> Venta de alimentos en icopor desechable y sin tachos propios, sobrecargando las canastas del colegio.
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>La Solución:</strong> Empaques biodegradables de papel kraft y canecas individuales de acopio en cada puesto.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t" style={{ borderColor: theme.borderColor }}>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.interventions.informalVendorAgreement}
                  onChange={() => handleInterventionToggle('informalVendorAgreement')}
                  className="rounded text-emerald-600"
                />
                <span style={{ color: theme.textPrimary }}>Activa</span>
              </label>

              <button
                onClick={() => simulateSolutionEvent('informalVendorAgreement')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white shadow-xs transition-transform active:scale-95"
                style={{ backgroundColor: theme.accentPrimary }}
              >
                🎬 Ver Puestos Limpios
              </button>
            </div>
          </div>

          {/* Solución 4: Brigada Estudiantil IAP "Centinelas Falsbordianos" */}
          <div
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              activeSolutionSim === 'studentBrigade' ? 'ring-2 ring-emerald-500 shadow-sm' : ''
            }`}
            style={{
              backgroundColor: params.interventions.studentBrigade ? theme.bgPanel : theme.bgSurface,
              borderColor: params.interventions.studentBrigade ? theme.accentPrimary : theme.borderColor,
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs flex items-center gap-1.5" style={{ color: theme.textPrimary }}>
                  <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>4. Brigada "Centinelas Falsbordianos"</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed mt-1" style={{ color: theme.textSecondary }}>
                <strong>El Problema:</strong> Falta de cultura ciudadana y arrojo impulsivo en las aceras por desidia o rapidez.
              </p>
              <p className="text-[11px] leading-relaxed mt-0.5" style={{ color: theme.textSecondary }}>
                <strong>La Solución:</strong> Jóvenes de servicio social con chalecos y megáfonos guiando en las puertas durante las horas pico.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2 border-t" style={{ borderColor: theme.borderColor }}>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={params.interventions.studentBrigade}
                  onChange={() => handleInterventionToggle('studentBrigade')}
                  className="rounded text-emerald-600"
                />
                <span style={{ color: theme.textPrimary }}>Activa</span>
              </label>

              <button
                onClick={() => simulateSolutionEvent('studentBrigade')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white shadow-xs transition-transform active:scale-95"
                style={{ backgroundColor: theme.accentPrimary }}
              >
                🎬 Ver Brigada en Puerta
              </button>
            </div>
          </div>
        </div>

        {/* Botón Maestro: Simular Todas las Soluciones */}
        <button
          onClick={() => simulateSolutionEvent('allSolutions')}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.99]"
          style={{ backgroundColor: '#2D6646' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>🌟 Simular Todas las Soluciones en Conjunto (Territorio Limpio 100%)</span>
        </button>
      </div>

      {/* 4. MODIFICACIÓN DIRECTA DE VALORES MATEMÁTICOS (El estudiante puede poner números exactos) */}
      <div
        className="p-4 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <h3 className="text-xs font-semibold tracking-wide uppercase" style={{ color: theme.textPrimary }}>
              Ingresa tus Propios Valores Numéricos
            </h3>
          </div>
          <span className="text-[11px]" style={{ color: theme.textSecondary }}>
            Escribe en las casillas o presiona (+ / -)
          </span>
        </div>

        {/* Presets Rápidos de Exploración */}
        <div className="flex flex-wrap items-center gap-2 pb-1 border-b" style={{ borderColor: theme.borderColor }}>
          <span className="text-[11px] font-semibold" style={{ color: theme.textSecondary }}>
            Escenarios Rápidos:
          </span>
          <button
            onClick={() => applyScenario('crisis')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900 hover:opacity-90"
          >
            🚨 Crisis Real (Sin Gestión)
          </button>
          <button
            onClick={() => applyScenario('habitual')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900 hover:opacity-90"
          >
            🏫 Día Habitual Fals Borda
          </button>
          <button
            onClick={() => applyScenario('solucion')}
            className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900 hover:opacity-90"
          >
            🌱 Plan Sostenible IAP
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* 1. Estudiantes Matriculados */}
          <div
            className="p-3 rounded-xl border space-y-2 transition-colors"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1" style={{ color: theme.textPrimary }}>
                <span>Estudiantes en Tránsito</span>
                <span>(<span className="font-serif italic font-normal">N</span>):</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      studentCount: Math.max(200, prev.studentCount - 100),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                  title="Restar 100 estudiantes"
                >
                  <Minus className="w-3 h-3" />
                </button>

                <input
                  type="number"
                  min={200}
                  max={3500}
                  step={50}
                  value={params.studentCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onParamsChange((prev) => ({ ...prev, studentCount: Math.max(0, val) }));
                  }}
                  className="w-20 px-2 py-1 text-center font-mono font-bold text-xs rounded border"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderColor,
                    color: theme.textPrimary,
                  }}
                />

                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      studentCount: Math.min(3500, prev.studentCount + 100),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                  title="Sumar 100 estudiantes"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-[10.5px] leading-tight" style={{ color: theme.textSecondary }}>
              <strong>El Problema:</strong> Generan residuos en los cambios de jornada (6:45 AM, 12:15 PM y 17:30 PM).
            </p>
          </div>

          {/* 2. Generación por Estudiante */}
          <div
            className="p-3 rounded-xl border space-y-2 transition-colors"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1" style={{ color: theme.textPrimary }}>
                <span>Generación per Cápita</span>
                <span>(<span className="font-serif italic font-normal">g<sub>e</sub></span>):</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      generationRatePerStudent: Math.max(5, prev.generationRatePerStudent - 5),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                >
                  <Minus className="w-3 h-3" />
                </button>

                <input
                  type="number"
                  min={5}
                  max={120}
                  step={5}
                  value={params.generationRatePerStudent}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onParamsChange((prev) => ({
                      ...prev,
                      generationRatePerStudent: Math.max(0, val),
                    }));
                  }}
                  className="w-16 px-2 py-1 text-center font-mono font-bold text-xs rounded border"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderColor,
                    color: theme.textPrimary,
                  }}
                />
                <span className="text-[10px] font-mono opacity-80">g/est</span>

                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      generationRatePerStudent: Math.min(120, prev.generationRatePerStudent + 5),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-[10.5px] leading-tight" style={{ color: theme.textSecondary }}>
              <strong>La Tasa:</strong> En colegios públicos de Bogotá oscila entre 20g y 45g por alumno al día.
            </p>
          </div>

          {/* 3. Puntos de Disposición (Canastillas) */}
          <div
            className="p-3 rounded-xl border space-y-2 transition-colors"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1" style={{ color: theme.textPrimary }}>
                <span>Canastillas Físicas</span>
                <span>(<span className="font-serif italic font-normal">N<sub>c</sub></span>):</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      activeBins: Math.max(1, prev.activeBins - 1),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                >
                  <Minus className="w-3 h-3" />
                </button>

                <input
                  type="number"
                  min={1}
                  max={8}
                  step={1}
                  value={params.activeBins}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    onParamsChange((prev) => ({
                      ...prev,
                      activeBins: Math.min(8, Math.max(1, val)),
                    }));
                  }}
                  className="w-14 px-2 py-1 text-center font-mono font-bold text-xs rounded border"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderColor,
                    color: theme.textPrimary,
                  }}
                />

                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      activeBins: Math.min(8, prev.activeBins + 1),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-[10.5px] leading-tight" style={{ color: theme.textSecondary }}>
              <strong>La Capacidad <span className="font-serif italic font-normal">C</span><sub>max</sub>:</strong> {params.activeBins} canecas × {params.binCapacityLiters}L = {(params.activeBins * params.binCapacityLiters * 0.135).toFixed(1)} kg límite.
            </p>
          </div>

          {/* 4. Puestos de Comercio Ambulante */}
          <div
            className="p-3 rounded-xl border space-y-2 transition-colors"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1" style={{ color: theme.textPrimary }}>
                <span>Puestos Ambulantes</span>
                <span>(<span className="font-serif italic font-normal">P<sub>inf</sub></span>):</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      informalStalls: Math.max(0, prev.informalStalls - 1),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                >
                  <Minus className="w-3 h-3" />
                </button>

                <input
                  type="number"
                  min={0}
                  max={12}
                  step={1}
                  value={params.informalStalls}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    onParamsChange((prev) => ({
                      ...prev,
                      informalStalls: Math.min(12, Math.max(0, val)),
                    }));
                  }}
                  className="w-14 px-2 py-1 text-center font-mono font-bold text-xs rounded border"
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.borderColor,
                    color: theme.textPrimary,
                  }}
                />

                <button
                  onClick={() =>
                    onParamsChange((prev) => ({
                      ...prev,
                      informalStalls: Math.min(12, prev.informalStalls + 1),
                    }))
                  }
                  className="p-1 rounded border hover:opacity-80"
                  style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-[10.5px] leading-tight" style={{ color: theme.textSecondary }}>
              <strong>El Impacto:</strong> Cada puesto genera ~2.8 kg/día de icopor y vasos descartables.
            </p>
          </div>

          {/* 5. Nivel de Cultura y Separación en la Fuente */}
          <div
            className="p-3 rounded-xl border space-y-2 transition-colors md:col-span-2"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold flex items-center gap-1" style={{ color: theme.textPrimary }}>
                <span>Cultura y Separación en la Fuente</span>
                <span>(<span className="font-serif italic font-normal">η<sub>cult</sub></span>):</span>
                <span>{Math.round(params.civicCultureFactor * 100)}%</span>
              </span>
              <div className="flex items-center gap-1.5">
                {[20, 50, 85].map((pct) => (
                  <button
                    key={pct}
                    onClick={() =>
                      onParamsChange((prev) => ({
                        ...prev,
                        civicCultureFactor: pct / 100,
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                      Math.abs(params.civicCultureFactor * 100 - pct) < 10
                        ? 'font-bold ring-1 shadow-xs'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: theme.bgSurface,
                      borderColor: theme.borderColor,
                      color: theme.textPrimary,
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.95}
              step={0.05}
              value={params.civicCultureFactor}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onParamsChange((prev) => ({ ...prev, civicCultureFactor: val }));
              }}
              className="w-full cursor-pointer accent-emerald-600 h-1.5"
            />
            <p className="text-[10.5px] leading-tight" style={{ color: theme.textSecondary }}>
              <strong>La Solución:</strong> Desvía hasta el 45% de material reciclable hacia los recuperadores ambientales de Usme.
            </p>
          </div>
        </div>

        {/* Resumen Analítico de tus Valores */}
        <div
          className="p-3.5 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <div>
            <span className="text-[10.5px] opacity-75 block" style={{ color: theme.textSecondary }}>
              Generación Total
            </span>
            <span className="font-mono font-bold text-sm" style={{ color: theme.textPrimary }}>
              {((params.studentCount * params.generationRatePerStudent) / 1000 + params.informalStalls * params.stallGenerationKgDay).toFixed(1)} kg/día
            </span>
          </div>

          <div>
            <span className="text-[10.5px] opacity-75 block" style={{ color: theme.textSecondary }}>
              Capacidad Instalada
            </span>
            <span className="font-mono font-bold text-sm" style={{ color: theme.textPrimary }}>
              {(params.activeBins * params.binCapacityLiters * 0.135).toFixed(1)} kg
            </span>
          </div>

          <div>
            <span className="text-[10.5px] opacity-75 block" style={{ color: theme.textSecondary }}>
              Separación Limpia
            </span>
            <span className="font-mono font-bold text-sm" style={{ color: '#2D6646' }}>
              {Math.round(params.civicCultureFactor * 45)}% desviado
            </span>
          </div>

          <div>
            <span className="text-[10.5px] opacity-75 block" style={{ color: theme.textSecondary }}>
              Camión Recolector
            </span>
            <span className="font-mono font-bold text-sm" style={{ color: theme.accentPrimary }}>
              {formatTime(params.interventions.synchronizedCollection ? 13.25 : 11.5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
