/**
 * Gráficos Matemáticos e Indicadores de Simulación
 * Curvas de saturación S(t), Tasa dS/dt y Composición Gravimétrica
 * Adaptativo a Modo Claro y Modo Oscuro con alta legibilidad
 */

import React from 'react';
import { ColorMode, EnvironmentId, SimulationParams, SimulationTimeStep, ThemeId } from '../types';
import { getWasteComposition } from '../utils/mathModel';
import { getTheme } from '../utils/themeConfig';

interface SimulationChartsProps {
  timeline: SimulationTimeStep[];
  currentHour: number;
  environmentId: EnvironmentId;
  themeId: ThemeId;
  colorMode: ColorMode;
  params: SimulationParams;
}

export const SimulationCharts: React.FC<SimulationChartsProps> = ({
  timeline,
  currentHour,
  environmentId,
  themeId,
  colorMode,
  params,
}) => {
  const theme = getTheme(themeId, colorMode);
  const composition = getWasteComposition(environmentId);

  // Capacidad máxima de masa
  const totalVolumeLiters = params.activeBins * params.binCapacityLiters;
  const maxCapacityKg = totalVolumeLiters * 0.135; // densidad promedio

  // Encuentra la hora de primer desborde (si existe)
  const saturationStep = timeline.find((s) => s.binSaturationPct >= 95);

  // Coordenadas para SVG Chart 1: Curva S(t) vs Límite
  const chartWidth = 540;
  const chartHeight = 150;
  const padding = { top: 16, right: 16, bottom: 24, left: 38 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  // Escala Y máxima
  const maxY = Math.max(
    maxCapacityKg * 1.35,
    ...timeline.map((s) => s.binAccumulatedKg + s.overflowGroundKg),
    10
  );

  const getX = (hour: number) => padding.left + ((hour - 6) / 12) * innerW;
  const getY = (val: number) => padding.top + innerH - (val / maxY) * innerH;

  const binPoints = timeline.map((s) => `${getX(s.hour)},${getY(s.binAccumulatedKg)}`).join(' ');
  const totalPoints = timeline
    .map((s) => `${getX(s.hour)},${getY(s.binAccumulatedKg + s.overflowGroundKg)}`)
    .join(' ');

  const cMaxY = getY(maxCapacityKg);
  const currentCursorX = getX(currentHour);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Tarjeta 1: Curva de Saturación S(t) */}
      <div
        className="p-4 rounded-2xl border transition-colors shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
              Dinámica de Saturación del Contenedor S(t)
            </h3>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Masa contenida vs. Umbral de Capacidad (C_max = {maxCapacityKg.toFixed(1)} kg)
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1" style={{ color: theme.textSecondary }}>
              <span className="w-2.5 h-0.5 inline-block" style={{ backgroundColor: theme.chartLine }} />
              En contenedor
            </span>
            <span className="flex items-center gap-1 text-rose-500 font-medium">
              <span className="w-2.5 h-0.5 inline-block bg-rose-400" />
              Desborde
            </span>
          </div>
        </div>

        {/* SVG Sparkline / Curva Dinámica */}
        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto select-none">
            {/* Grid horizontal */}
            <line
              x1={padding.left}
              y1={getY(0)}
              x2={chartWidth - padding.right}
              y2={getY(0)}
              stroke={theme.borderColor}
              strokeWidth="1"
            />
            <line
              x1={padding.left}
              y1={cMaxY}
              x2={chartWidth - padding.right}
              y2={cMaxY}
              stroke="#D27979"
              strokeDasharray="4,4"
              strokeWidth="1.5"
            />
            <text
              x={chartWidth - padding.right - 4}
              y={cMaxY - 4}
              fill="#D27979"
              fontSize="9"
              fontWeight="600"
              textAnchor="end"
              fontFamily="JetBrains Mono, monospace"
            >
              C_max: {maxCapacityKg.toFixed(1)} kg
            </text>

            {/* Eje X marcadores */}
            {[6, 8, 10, 12, 14, 16, 18].map((h) => (
              <g key={h}>
                <line
                  x1={getX(h)}
                  y1={getY(0)}
                  x2={getX(h)}
                  y2={getY(0) + 4}
                  stroke={theme.borderColor}
                />
                <text
                  x={getX(h)}
                  y={getY(0) + 14}
                  fill={theme.textSecondary}
                  fontSize="8.5"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {h}:00
                </text>
              </g>
            ))}

            {/* Área sombreada de desborde en suelo si existe */}
            {timeline.some((s) => s.overflowGroundKg > 0.05) && (
              <polygon
                points={`${getX(6)},${getY(0)} ${totalPoints} ${getX(18)},${getY(0)}`}
                fill={theme.overflowFill}
              />
            )}

            {/* Curva de masa en contenedor */}
            <polyline
              fill="none"
              stroke={theme.chartLine}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={binPoints}
            />

            {/* Línea indicadora de hora actual */}
            <line
              x1={currentCursorX}
              y1={padding.top}
              x2={currentCursorX}
              y2={getY(0)}
              stroke={theme.accentPrimary}
              strokeWidth="1.5"
              strokeDasharray="2,2"
            />
            <circle
              cx={currentCursorX}
              cy={getY(
                timeline.find((s) => Math.abs(s.hour - currentHour) < 0.25)?.binAccumulatedKg || 0
              )}
              r="4"
              fill={theme.accentPrimary}
              stroke={theme.bgSurface}
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Resumen del cálculo de saturación */}
        <div
          className="mt-2 pt-2 border-t flex items-center justify-between text-xs"
          style={{ borderColor: theme.borderColor }}
        >
          <span style={{ color: theme.textSecondary }}>Primer umbral de saturación:</span>
          <span
            className="font-mono font-medium"
            style={{ color: saturationStep ? '#E28B8B' : theme.accentPrimary }}
          >
            {saturationStep ? `Saturado a las ${saturationStep.timeString}` : 'No se satura en la jornada'}
          </span>
        </div>
      </div>

      {/* Tarjeta 2: Tasa de Generación Rin(t) y Flujo Peatonal */}
      <div
        className="p-4 rounded-2xl border transition-colors flex flex-col justify-between shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
                Tasa de Ingreso R_in(t) y Flujo Peatonal Φ(t)
              </h3>
              <p className="text-xs" style={{ color: theme.textSecondary }}>
                Generación horaria asociada a picos escolares y comercio informal
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-md font-mono"
              style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
            >
              g_e = {params.generationRatePerStudent} g/est
            </span>
          </div>

          {/* Mini Gráfico de Barras Horarias */}
          <div
            className="h-28 flex items-end gap-1.5 pt-3 pb-1 border-b"
            style={{ borderColor: theme.borderColor }}
          >
            {timeline
              .filter((_, idx) => idx % 2 === 0)
              .map((step) => {
                const maxRate = Math.max(1, ...timeline.map((s) => s.generationRateKgH));
                const barHeightPct = Math.min(100, (step.generationRateKgH / maxRate) * 100);
                const isCurrent = Math.abs(step.hour - currentHour) < 0.5;

                return (
                  <div key={step.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${barHeightPct}%`,
                        backgroundColor: isCurrent ? theme.accentPrimary : theme.borderColor,
                      }}
                    />
                    <span
                      className="text-[9px] font-mono"
                      style={{ color: isCurrent ? theme.textPrimary : theme.textSecondary }}
                    >
                      {Math.round(step.hour)}h
                    </span>

                    {/* Tooltip on hover */}
                    <div
                      className="absolute -top-7 hidden group-hover:block px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap shadow-sm border"
                      style={{
                        backgroundColor: theme.bgSurface,
                        borderColor: theme.borderColor,
                        color: theme.textPrimary,
                      }}
                    >
                      {step.generationRateKgH} kg/h
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Desglose gravimétrico de residuos */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium" style={{ color: theme.textPrimary }}>
              Caracterización Física Estimada
            </span>
            <span className="text-[11px]" style={{ color: theme.textSecondary }}>
              Resolución 2184/2019
            </span>
          </div>

          <div className="h-3 w-full rounded-full overflow-hidden flex opacity-90">
            <div
              className="h-full bg-amber-400/85 transition-all"
              style={{ width: `${composition.plastics}%` }}
              title={`Plásticos: ${composition.plastics}%`}
            />
            <div
              className="h-full bg-emerald-500/80 transition-all"
              style={{ width: `${composition.organics}%` }}
              title={`Orgánicos: ${composition.organics}%`}
            />
            <div
              className="h-full bg-sky-400/80 transition-all"
              style={{ width: `${composition.paperCardboard}%` }}
              title={`Papel/Cartón: ${composition.paperCardboard}%`}
            />
            <div
              className="h-full bg-stone-400 transition-all"
              style={{ width: `${composition.others}%` }}
              title={`Otros/Ordinarios: ${composition.others}%`}
            />
          </div>

          <div
            className="grid grid-cols-4 gap-1 text-[10px] mt-1.5 text-center font-mono font-medium"
            style={{ color: theme.textSecondary }}
          >
            <div>Plást. {composition.plastics}%</div>
            <div>Org. {composition.organics}%</div>
            <div>Papel {composition.paperCardboard}%</div>
            <div>Otros {composition.others}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};
