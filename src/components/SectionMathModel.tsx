/**
 * Sección 2: Modelos Matemáticos y Desarrollo Riguroso de Cálculos
 * Colegio Orlando Fals Borda IED
 * Adaptativo a Modo Claro y Modo Oscuro con alta legibilidad
 */

import React, { useState } from 'react';
import { ColorMode, ThemeId } from '../types';
import { getTheme } from '../utils/themeConfig';
import { Calculator, FunctionSquare } from 'lucide-react';

interface SectionMathModelProps {
  themeId: ThemeId;
  colorMode: ColorMode;
}

export const SectionMathModel: React.FC<SectionMathModelProps> = ({ themeId, colorMode }) => {
  const theme = getTheme(themeId, colorMode);

  // Calculadora interactiva paso a paso
  const [calcStudents, setCalcStudents] = useState<number>(1600);
  const [calcGe, setCalcGe] = useState<number>(35); // g/est
  const [calcStalls, setCalcStalls] = useState<number>(5);
  const [calcBins, setCalcBins] = useState<number>(3);
  const [calcBinVolume, setCalcBinVolume] = useState<number>(240); // L
  const [calcCulture, setCalcCulture] = useState<number>(40); // %

  // Cálculos dinámicos
  const density = 0.135; // kg/L
  const maxCapacityKg = calcBins * calcBinVolume * density; // kg totales
  const totalStudentGenKg = (calcStudents * calcGe) / 1000; // kg escolares
  const stallGenKg = calcStalls * 2.8; // kg puestos (2.8 kg/puesto promedio)
  const grossGenKg = totalStudentGenKg + stallGenKg;
  const diversionKg = grossGenKg * (calcCulture / 100) * 0.45; // 45% reciclable/orgánico aprovechado
  const netGenKg = grossGenKg - diversionKg;
  const overflowKg = Math.max(0, netGenKg - maxCapacityKg);
  const saturationPct = Math.min(100, (netGenKg / maxCapacityKg) * 100);

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
            Sección 2 · Modelación Matemática
          </span>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Sistemas Dinámicos y Ecuaciones Diferenciales Ordinarias (EDO)
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
          Formulación Matemática del Balance de Masa y Dinámica de Acumulación
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
          Para cuantificar el comportamiento temporal de los residuos en el entorno del Colegio Orlando Fals Borda, se plantea un sistema de balance de masa continuo gobernado por ecuaciones diferenciales acopladas con términos de flujo peatonal no estacionario, tasas de generación per cápita y capacidades límites de retención física.
        </p>
      </div>

      {/* Modelo 1: Ecuación Diferencial del Contenedor */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center gap-2">
          <FunctionSquare className="w-5 h-5" style={{ color: theme.accentPrimary }} />
          <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
            1. Ecuación Diferencial de Saturación del Contenedor dS/dt
          </h3>
        </div>

        <div
          className="p-4 rounded-xl border font-mono text-xs md:text-sm overflow-x-auto text-center font-bold"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor, color: theme.textPrimary }}
        >
          dS(t) / dt = R_in(t) · α(S) - R_out(t)
        </div>

        <div className="text-xs space-y-2 leading-relaxed" style={{ color: theme.textSecondary }}>
          <p>
            <strong className="font-mono" style={{ color: theme.textPrimary }}>S(t) [kg]:</strong> Masa instantánea de residuos confinados dentro de los contenedores a la hora t ∈ [6, 18].
          </p>
          <p>
            <strong className="font-mono" style={{ color: theme.textPrimary }}>R_in(t) [kg/h]:</strong> Tasa neta de generación que arriba a las inmediaciones del colegio.
          </p>
          <p>
            <strong className="font-mono" style={{ color: theme.textPrimary }}>α(S) [adimensional]:</strong> Función no lineal de eficiencia de captura del contenedor. A medida que el contenedor se llena, la probabilidad de que el usuario logre introducir el residuo decrece:
          </p>
          <div
            className="p-3 rounded-lg border font-mono text-xs my-2 leading-relaxed"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor, color: theme.textPrimary }}
          >
            α(S) = 0.95 si S(t) &lt; 0.75 · C_max<br />
            α(S) = 0.95 · [1 - (S(t) - 0.75 C_max) / (0.25 C_max)] si 0.75 C_max ≤ S(t) &lt; C_max<br />
            α(S) = 0 si S(t) ≥ C_max
          </div>
          <p>
            <strong className="font-mono" style={{ color: theme.textPrimary }}>R_out(t) [kg/h]:</strong> Función de extracción y vaciado efectuada por el servicio de aseo municipal (modelada como pulso compacto en t = t_rec).
          </p>
        </div>
      </div>

      {/* Modelo 2: Tasa de Ingreso y Flujo Peatonal */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center gap-2">
          <FunctionSquare className="w-5 h-5" style={{ color: theme.accentPrimary }} />
          <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
            2. Modelación de Flujos Peatonales y Comercio Informal
          </h3>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
          La tasa de ingreso R_in(t) combina el flujo peatonal escolar Φ(t) y la actividad comercial de los puestos ambulantes Q_inf(t):
        </p>

        <div
          className="p-4 rounded-xl border font-mono text-xs md:text-sm overflow-x-auto text-center font-bold"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor, color: theme.textPrimary }}
        >
          R_in(t) = [ Φ(t) · g_e · (1 - η_cult · β_desv) ] + ∑ [ q_stall,i · w(t) ]
        </div>

        <div className="text-xs space-y-2 leading-relaxed" style={{ color: theme.textSecondary }}>
          <p>
            <strong className="font-mono" style={{ color: theme.textPrimary }}>Φ(t) [peatones/h]:</strong> Flujo bimodal modelado mediante una mezcla de gaussianas centradas en las horas punta del colegio:
          </p>
          <div
            className="p-3 rounded-lg border font-mono text-xs my-2 leading-relaxed"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor, color: theme.textPrimary }}
          >
            Φ(t) = A₁·exp(-(t - 6.75)² / (2σ₁²)) + A₂·exp(-(t - 12.35)² / (2σ₂²)) + A₃·exp(-(t - 17.50)² / (2σ₃²)) + Φ₀
          </div>
          <p>
            <strong className="font-mono" style={{ color: theme.textPrimary }}>g_e [kg/persona-h]:</strong> Tasa de descarte unitaria por estudiante en tránsito (≈ 0.035 kg/estudiante-jornada).
          </p>
          <p>
            <strong className="font-mono" style={{ color: theme.textPrimary }}>η_cult [0 a 1]:</strong> Índice de cultura ciudadana y aprovechamiento en origen impulsado por el PRAE escolar.
          </p>
        </div>
      </div>

      {/* Modelo 3: Dinámica de Desborde en el Suelo */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center gap-2">
          <FunctionSquare className="w-5 h-5" style={{ color: theme.accentPrimary }} />
          <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
            3. Ecuación de Acumulación en Suelo (Focos de Contaminación)
          </h3>
        </div>

        <div
          className="p-4 rounded-xl border font-mono text-xs md:text-sm overflow-x-auto text-center font-bold"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor, color: theme.textPrimary }}
        >
          dV_suelo(t) / dt = R_in(t) · [1 - α(S)] + k_disp · S(t) · I(S ≥ C_max) - B_limpieza(t)
        </div>

        <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
          Una vez el contenedor alcanza el umbral de capacidad C_max, todo residuo adicional (1 - α(S) = 1) se deposita directamente sobre la acera. Adicionalmente, el término k_disp · S(t) cuantifica la dispersión provocada por vientos y perros callejeros que extraen bolsas de la boca del contenedor.
        </p>
      </div>

      {/* Calculadora Paramétrica Interactiva */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5" style={{ color: theme.accentPrimary }} />
            <h3 className="font-semibold text-sm" style={{ color: theme.textPrimary }}>
              Calculadora Analítica del Colegio Fals Borda (Demostración Paso a Paso)
            </h3>
          </div>
          <span className="text-xs font-mono font-medium" style={{ color: theme.accentPrimary }}>
            Valores de Campo en Bogotá
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block mb-1 font-medium" style={{ color: theme.textSecondary }}>
              Estudiantes (N):
            </label>
            <input
              type="number"
              value={calcStudents}
              onChange={(e) => setCalcStudents(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgPanel,
                color: theme.textPrimary,
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: theme.textSecondary }}>
              Generación per cápita (g_e g):
            </label>
            <input
              type="number"
              value={calcGe}
              onChange={(e) => setCalcGe(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgPanel,
                color: theme.textPrimary,
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: theme.textSecondary }}>
              Puestos informales (P):
            </label>
            <input
              type="number"
              value={calcStalls}
              onChange={(e) => setCalcStalls(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgPanel,
                color: theme.textPrimary,
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: theme.textSecondary }}>
              Contenedores (N_c):
            </label>
            <input
              type="number"
              value={calcBins}
              onChange={(e) => setCalcBins(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgPanel,
                color: theme.textPrimary,
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: theme.textSecondary }}>
              Capacidad unitaria (L):
            </label>
            <input
              type="number"
              value={calcBinVolume}
              onChange={(e) => setCalcBinVolume(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgPanel,
                color: theme.textPrimary,
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" style={{ color: theme.textSecondary }}>
              Cultura / Separación (%):
            </label>
            <input
              type="number"
              value={calcCulture}
              onChange={(e) => setCalcCulture(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgPanel,
                color: theme.textPrimary,
              }}
            />
          </div>
        </div>

        {/* Resultados del Cálculo */}
        <div
          className="p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <div>
            <span className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
              Capacidad Total (C_max):
            </span>
            <p className="text-base font-bold font-mono mt-0.5" style={{ color: theme.textPrimary }}>
              {maxCapacityKg.toFixed(1)} kg
            </p>
            <span className="text-[10px] opacity-70" style={{ color: theme.textSecondary }}>
              ({calcBins * calcBinVolume} Litros)
            </span>
          </div>

          <div>
            <span className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
              Generación Bruta Diaria:
            </span>
            <p className="text-base font-bold font-mono mt-0.5" style={{ color: theme.textPrimary }}>
              {grossGenKg.toFixed(1)} kg
            </p>
            <span className="text-[10px] opacity-70" style={{ color: theme.textSecondary }}>
              Estudiantes + Puestos
            </span>
          </div>

          <div>
            <span className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
              Saturación del Sistema:
            </span>
            <p
              className="text-base font-bold font-mono mt-0.5"
              style={{ color: saturationPct >= 95 ? '#D27979' : theme.accentPrimary }}
            >
              {saturationPct.toFixed(1)}%
            </p>
            <span className="text-[10px] opacity-70" style={{ color: theme.textSecondary }}>
              {saturationPct >= 100 ? 'Colapso físico' : 'Capacidad suficiente'}
            </span>
          </div>

          <div>
            <span className="text-[11px] opacity-75" style={{ color: theme.textSecondary }}>
              Residuos en Suelo (Excedente):
            </span>
            <p
              className="text-base font-bold font-mono mt-0.5"
              style={{ color: overflowKg > 0 ? '#D27979' : theme.accentPrimary }}
            >
              {overflowKg.toFixed(1)} kg
            </p>
            <span className="text-[10px] opacity-70" style={{ color: theme.textSecondary }}>
              Arrojo en acera
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
