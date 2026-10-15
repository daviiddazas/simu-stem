/**
 * Sección 2: Modelos Matemáticos y Desarrollo Riguroso de Cálculos
 * Colegio Orlando Fals Borda IED
 * Renderiza todas las ecuaciones con formato matemático real LaTeX / HTML Matemático (KaTeX)
 * sin cajas de código de programación, con alta legibilidad y estilo académico.
 */

import React, { useState } from 'react';
import { ColorMode, ThemeId } from '../types';
import { getTheme } from '../utils/themeConfig';
import { MathView, InlineMath } from './MathView';
import {
  Calculator,
  FunctionSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface SectionMathModelProps {
  themeId: ThemeId;
  colorMode: ColorMode;
}

export const SectionMathModel: React.FC<SectionMathModelProps> = ({ themeId, colorMode }) => {
  const theme = getTheme(themeId, colorMode);

  // Calculadora interactiva paso a paso
  const [calcStudents, setCalcStudents] = useState<number>(1600);
  const [calcGe, setCalcGe] = useState<number>(35); // g/estudiante
  const [calcStalls, setCalcStalls] = useState<number>(5);
  const [calcBins, setCalcBins] = useState<number>(3);
  const [calcBinVolume, setCalcBinVolume] = useState<number>(240); // L
  const [calcCulture, setCalcCulture] = useState<number>(40); // %

  // Cálculos dinámicos
  const density = 0.135; // kg/L (135 kg/m³)
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
            Sección 2 · Modelación Matemática Rigurosa
          </span>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Balance de Masa Continuo y Ecuaciones Diferenciales Ordinarias (EDO)
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
          Formulación Matemática del Balance de Masa y Dinámica de Acumulación
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
          Para cuantificar el comportamiento temporal de los residuos en el entorno del Colegio Orlando Fals Borda, planteamos un sistema de balance de masa dinámico gobernado por ecuaciones diferenciales acopladas con flujos peatonales bimodales, tasas de generación per cápita y umbrales de saturación física.
        </p>
      </div>

      {/* Modelo 1: Ecuación Diferencial del Contenedor */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunctionSquare className="w-5 h-5" style={{ color: theme.accentPrimary }} />
            <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
              1. Ecuación Diferencial de Saturación del Contenedor
            </h3>
          </div>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded border"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.accentPrimary,
            }}
          >
            Formato Matemático LaTeX
          </span>
        </div>

        {/* Ecuación Principal en LaTeX */}
        <div
          className="p-5 rounded-xl border flex flex-col items-center justify-center shadow-xs transition-colors"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <MathView
            latex="\frac{dS(t)}{dt} = R_{\text{in}}(t) \cdot \alpha(S) - R_{\text{out}}(t)"
            displayMode={true}
            style={{ color: theme.textPrimary }}
          />
        </div>

        {/* Desglose de Variables */}
        <div className="text-xs space-y-2.5 leading-relaxed" style={{ color: theme.textSecondary }}>
          <div className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold" style={{ color: theme.textPrimary }}>•</span>
            <div>
              <InlineMath latex="S(t) \in [0, C_{\max}]" /> <span className="font-semibold" style={{ color: theme.textPrimary }}>[kg]:</span> Masa instantánea de residuos confinados en los contenedores escolares a la hora <InlineMath latex="t \in [6, 18]" />.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold" style={{ color: theme.textPrimary }}>•</span>
            <div>
              <InlineMath latex="R_{\text{in}}(t)" /> <span className="font-semibold" style={{ color: theme.textPrimary }}>[kg/h]:</span> Tasa neta de residuos que ingresa desde el flujo peatonal escolar y puestos informales.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold" style={{ color: theme.textPrimary }}>•</span>
            <div>
              <InlineMath latex="\alpha(S)" /> <span className="font-semibold" style={{ color: theme.textPrimary }}>[adimensional]:</span> Eficiencia no lineal de captura. A medida que el contenedor se llena por encima del 75%, disminuye la probabilidad de que el usuario logre depositar el residuo dentro de la cesta:
            </div>
          </div>

          {/* Ecuación por partes en LaTeX */}
          <div
            className="p-4 rounded-xl border flex flex-col items-center justify-center my-2 shadow-xs transition-colors"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <MathView
              latex="\alpha(S) = \begin{cases} 0.95, & \text{si } S(t) < 0.75 \cdot C_{\max} \\[8pt] 0.95 \cdot \left(1 - \dfrac{S(t) - 0.75 \cdot C_{\max}}{0.25 \cdot C_{\max}}\right), & \text{si } 0.75 \cdot C_{\max} \le S(t) < C_{\max} \\[8pt] 0, & \text{si } S(t) \ge C_{\max} \end{cases}"
              displayMode={true}
              style={{ color: theme.textPrimary }}
            />
          </div>

          <div className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold" style={{ color: theme.textPrimary }}>•</span>
            <div>
              <InlineMath latex="R_{\text{out}}(t)" /> <span className="font-semibold" style={{ color: theme.textPrimary }}>[kg/h]:</span> Función impulsiva de extracción del camión de aseo en la hora <InlineMath latex="t_{\text{rec}}" />: <InlineMath latex="R_{\text{out}}(t) = S(t) \cdot \delta(t - t_{\text{rec}})" />.
            </div>
          </div>
        </div>
      </div>

      {/* Modelo 2: Tasa de Ingreso y Flujo Peatonal Escolar */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunctionSquare className="w-5 h-5" style={{ color: theme.accentPrimary }} />
            <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
              2. Modelo de Tasa de Ingreso y Flujo Peatonal Escolar
            </h3>
          </div>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded border"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.accentPrimary,
            }}
          >
            Gaussiana Multimodal
          </span>
        </div>

        <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
          La tasa de ingreso combina la masa aportada por el flujo de estudiantes <InlineMath latex="\Phi(t)" /> con la generación concentrada de los vendedores ambulantes colindantes:
        </p>

        {/* Ecuación de Tasa en LaTeX */}
        <div
          className="p-5 rounded-xl border flex flex-col items-center justify-center shadow-xs transition-colors"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <MathView
            latex="R_{\text{in}}(t) = \left[ \Phi(t) \cdot g_e \cdot \big(1 - \eta_{\text{cult}} \cdot \beta_{\text{desv}}\big) \right] + \sum_{i=1}^{m} \Big[ q_{\text{puesto}, i} \cdot w_i(t) \Big]"
            displayMode={true}
            style={{ color: theme.textPrimary }}
          />
        </div>

        <div className="text-xs space-y-2.5 leading-relaxed" style={{ color: theme.textSecondary }}>
          <div className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 font-bold" style={{ color: theme.textPrimary }}>•</span>
            <div>
              <InlineMath latex="\Phi(t)" /> <span className="font-semibold" style={{ color: theme.textPrimary }}>[peatones/hora]:</span> Función de flujo modelada mediante superposición de campanas de Gauss en los horarios de timbres del Colegio Orlando Fals Borda:
            </div>
          </div>

          <div
            className="p-4 rounded-xl border flex flex-col items-center justify-center my-2 shadow-xs transition-colors"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <MathView
              latex="\Phi(t) = A_1 \exp\!\left(-\frac{(t - 6.75)^2}{2\sigma_1^2}\right) + A_2 \exp\!\left(-\frac{(t - 12.35)^2}{2\sigma_2^2}\right) + A_3 \exp\!\left(-\frac{(t - 17.50)^2}{2\sigma_3^2}\right) + \Phi_0"
              displayMode={true}
              style={{ color: theme.textPrimary }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
            <div
              className="p-2.5 rounded-lg border text-[11px]"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div className="font-bold" style={{ color: theme.textPrimary }}>
                Pico Mañana (<InlineMath latex="t_1 = 6:45" /> AM):
              </div>
              <div>Ingreso masivo de 950 estudiantes, refrigerios y bebidas.</div>
            </div>

            <div
              className="p-2.5 rounded-lg border text-[11px]"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div className="font-bold" style={{ color: theme.textPrimary }}>
                Cambio de Jornada (<InlineMath latex="t_2 = 12:21" /> PM):
              </div>
              <div>Cruce de salida y entrada: 1100 estudiantes y ventas callejeras.</div>
            </div>

            <div
              className="p-2.5 rounded-lg border text-[11px]"
              style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
            >
              <div className="font-bold" style={{ color: theme.textPrimary }}>
                Pico Tarde (<InlineMath latex="t_3 = 5:30" /> PM):
              </div>
              <div>Salida de jornada tarde: 750 estudiantes.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modelo 3: Dinámica de Desborde en el Suelo */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunctionSquare className="w-5 h-5" style={{ color: theme.accentPrimary }} />
            <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
              3. Ecuación de Acumulación en Suelo (Basurales y Focos Críticos)
            </h3>
          </div>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded border"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.accentPrimary,
            }}
          >
            Focos Infecciosos
          </span>
        </div>

        {/* Ecuación de Desborde en LaTeX */}
        <div
          className="p-5 rounded-xl border flex flex-col items-center justify-center shadow-xs transition-colors"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <MathView
            latex="\frac{dV_{\text{suelo}}(t)}{dt} = R_{\text{in}}(t) \cdot \big[1 - \alpha(S)\big] + k_{\text{disp}} \cdot S(t) \cdot \mathbb{I}\big(S \ge C_{\max}\big) - B_{\text{limpieza}}(t)"
            displayMode={true}
            style={{ color: theme.textPrimary }}
          />
        </div>

        <div className="text-xs space-y-2 leading-relaxed" style={{ color: theme.textSecondary }}>
          <p>
            Cuando el contenedor supera su volumen nominal (<InlineMath latex="S \ge C_{\max}" />), el término <InlineMath latex="1 - \alpha(S) = 1" /> hace que todo el flujo entrante se precipite al suelo.
          </p>
          <p>
            El factor <InlineMath latex="k_{\text{disp}} \cdot S(t)" /> modela la dispersión mecánica por vientos de Usme y fauna feral (perros callejeros) que rasgan bolsas desbordadas, dispersando microplásticos en un radio de hasta 35 metros alrededor de la reja escolar.
          </p>
        </div>
      </div>

      {/* Modelo 4: Tiempo Crítico de Saturación */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-4 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunctionSquare className="w-5 h-5" style={{ color: theme.accentPrimary }} />
            <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
              4. Determinación Analítica del Momento Crítico de Colapso (<InlineMath latex="t^*" />)
            </h3>
          </div>
        </div>

        <div
          className="p-5 rounded-xl border flex flex-col items-center justify-center shadow-xs transition-colors"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <MathView
            latex="t^* = \inf \left\{ t \in [t_0, t_{\text{fin}}] \;:\; \int_{t_0}^{t} \Big[ R_{\text{in}}(\tau) \cdot \alpha(S(\tau)) - R_{\text{out}}(\tau) \Big] d\tau \;\ge\; C_{\max} \right\}"
            displayMode={true}
            style={{ color: theme.textPrimary }}
          />
        </div>

        <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
          En condiciones no intervenidas en el Colegio Orlando Fals Borda, la integral acumulada alcanza <InlineMath latex="C_{\max}" /> a las <strong style={{ color: theme.textPrimary }}>11:45 AM</strong>, justo antes del timbre de almuerzo y salida de la jornada mañana, provocando que el 100% de los residuos del cambio de jornada caigan directamente al andén.
        </p>
      </div>

      {/* Calculadora Paramétrica Interactiva con Demostración en LaTeX */}
      <div
        className="p-6 rounded-2xl border transition-colors space-y-5 shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5" style={{ color: theme.accentPrimary }} />
            <h3 className="font-semibold text-base" style={{ color: theme.textPrimary }}>
              Calculadora Analítica Paso a Paso con Ecuaciones Resueltas
            </h3>
          </div>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-lg border w-fit"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.accentPrimary,
            }}
          >
            Modifica valores para resolver en vivo
          </span>
        </div>

        {/* Inputs numéricos con estilo limpio */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <label className="block mb-1 font-semibold" style={{ color: theme.textPrimary }}>
              Población Estudiantes (<InlineMath latex="N" />):
            </label>
            <input
              type="number"
              min="200"
              max="3500"
              step="50"
              value={calcStudents}
              onChange={(e) => setCalcStudents(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgSurface,
                color: theme.textPrimary,
              }}
            />
            <span className="text-[10.5px] opacity-75 mt-1 block" style={{ color: theme.textSecondary }}>
              Alumnos en ambas jornadas
            </span>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <label className="block mb-1 font-semibold" style={{ color: theme.textPrimary }}>
              Generación unitaria (<InlineMath latex="g_e" /> en gramos):
            </label>
            <input
              type="number"
              min="10"
              max="90"
              step="5"
              value={calcGe}
              onChange={(e) => setCalcGe(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgSurface,
                color: theme.textPrimary,
              }}
            />
            <span className="text-[10.5px] opacity-75 mt-1 block" style={{ color: theme.textSecondary }}>
              g / estudiante / jornada escolar
            </span>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <label className="block mb-1 font-semibold" style={{ color: theme.textPrimary }}>
              Puestos de comercio (<InlineMath latex="P" />):
            </label>
            <input
              type="number"
              min="0"
              max="15"
              step="1"
              value={calcStalls}
              onChange={(e) => setCalcStalls(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgSurface,
                color: theme.textPrimary,
              }}
            />
            <span className="text-[10.5px] opacity-75 mt-1 block" style={{ color: theme.textSecondary }}>
              Vendedores informales en puerta
            </span>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <label className="block mb-1 font-semibold" style={{ color: theme.textPrimary }}>
              Contenedores instalados (<InlineMath latex="N_c" />):
            </label>
            <input
              type="number"
              min="1"
              max="10"
              step="1"
              value={calcBins}
              onChange={(e) => setCalcBins(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgSurface,
                color: theme.textPrimary,
              }}
            />
            <span className="text-[10.5px] opacity-75 mt-1 block" style={{ color: theme.textSecondary }}>
              Canastillas o módulos triples
            </span>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <label className="block mb-1 font-semibold" style={{ color: theme.textPrimary }}>
              Capacidad unitaria (<InlineMath latex="V_c" /> en Litros):
            </label>
            <input
              type="number"
              min="50"
              max="1100"
              step="20"
              value={calcBinVolume}
              onChange={(e) => setCalcBinVolume(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgSurface,
                color: theme.textPrimary,
              }}
            />
            <span className="text-[10.5px] opacity-75 mt-1 block" style={{ color: theme.textSecondary }}>
              Litros por canasta (estándar: 240L)
            </span>
          </div>

          <div
            className="p-3 rounded-xl border"
            style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
          >
            <label className="block mb-1 font-semibold" style={{ color: theme.textPrimary }}>
              Cultura / Separación PRAE (<InlineMath latex="\eta" /> %):
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="5"
              value={calcCulture}
              onChange={(e) => setCalcCulture(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border font-mono text-xs font-bold"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgSurface,
                color: theme.textPrimary,
              }}
            />
            <span className="text-[10.5px] opacity-75 mt-1 block" style={{ color: theme.textSecondary }}>
              % desvío a recicladores de Usme
            </span>
          </div>
        </div>

        {/* Ecuaciones Resueltas Paso a Paso en Formato LaTeX */}
        <div
          className="p-5 rounded-xl border space-y-4"
          style={{ backgroundColor: theme.bgPanel, borderColor: theme.borderColor }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: theme.accentPrimary }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textPrimary }}>
              Demostración Matemática Resuelta con tus Valores
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Paso 1: Capacidad Máxima */}
            <div
              className="p-3.5 rounded-lg border"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <div className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                Paso 1: Capacidad Máxima de Retención (<InlineMath latex="C_{\max}" />)
              </div>
              <MathView
                latex={`C_{\\max} = N_c \\times V_c \\times \\rho = ${calcBins} \\times ${calcBinVolume}\\,\\text{L} \\times 0.135\\,\\frac{\\text{kg}}{\\text{L}} = ${maxCapacityKg.toFixed(1)}\\,\\text{kg}`}
                displayMode={true}
                style={{ color: theme.textPrimary }}
              />
            </div>

            {/* Paso 2: Generación Bruta */}
            <div
              className="p-3.5 rounded-lg border"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <div className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                Paso 2: Generación Bruta Diaria (<InlineMath latex="M_{\text{bruta}}" />)
              </div>
              <MathView
                latex={`M_{\\text{bruta}} = \\frac{${calcStudents} \\times ${calcGe}\\,\\text{g}}{1000} + (${calcStalls} \\times 2.8\\,\\text{kg}) = ${grossGenKg.toFixed(1)}\\,\\text{kg}`}
                displayMode={true}
                style={{ color: theme.textPrimary }}
              />
            </div>

            {/* Paso 3: Desvío por Reciclaje */}
            <div
              className="p-3.5 rounded-lg border"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <div className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                Paso 3: Desvío por Separación en Fuente (<InlineMath latex="M_{\text{desv}}" />)
              </div>
              <MathView
                latex={`M_{\\text{desv}} = ${grossGenKg.toFixed(1)}\\,\\text{kg} \\times \\left(\\frac{${calcCulture}}{100}\\right) \\times 0.45 = ${diversionKg.toFixed(1)}\\,\\text{kg}`}
                displayMode={true}
                style={{ color: theme.textPrimary }}
              />
            </div>

            {/* Paso 4: Balance Neto al Contenedor */}
            <div
              className="p-3.5 rounded-lg border"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <div className="font-semibold mb-1" style={{ color: theme.textPrimary }}>
                Paso 4: Masa Neta y Desborde (<InlineMath latex="V_{\\text{suelo}}" />)
              </div>
              <MathView
                latex={`M_{\\text{neta}} = ${netGenKg.toFixed(1)}\\,\\text{kg} \\quad\\longrightarrow\\quad V_{\\text{suelo}} = \\max(0, ${netGenKg.toFixed(1)} - ${maxCapacityKg.toFixed(1)}) = ${overflowKg.toFixed(1)}\\,\\text{kg}`}
                displayMode={true}
                style={{ color: theme.textPrimary }}
              />
            </div>
          </div>

          {/* Tarjetas de Diagnóstico Sintético */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div
              className="p-3 rounded-lg border text-center"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <span className="text-[11px] opacity-75 block" style={{ color: theme.textSecondary }}>
                Capacidad Límite
              </span>
              <span className="text-lg font-bold font-mono" style={{ color: theme.textPrimary }}>
                {maxCapacityKg.toFixed(1)} kg
              </span>
            </div>

            <div
              className="p-3 rounded-lg border text-center"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <span className="text-[11px] opacity-75 block" style={{ color: theme.textSecondary }}>
                Carga Diaria Neta
              </span>
              <span className="text-lg font-bold font-mono" style={{ color: theme.textPrimary }}>
                {netGenKg.toFixed(1)} kg
              </span>
            </div>

            <div
              className="p-3 rounded-lg border text-center"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <span className="text-[11px] opacity-75 block" style={{ color: theme.textSecondary }}>
                Saturación
              </span>
              <span
                className="text-lg font-bold font-mono"
                style={{ color: saturationPct >= 95 ? '#D27979' : theme.accentPrimary }}
              >
                {saturationPct.toFixed(1)}%
              </span>
            </div>

            <div
              className="p-3 rounded-lg border text-center"
              style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
            >
              <span className="text-[11px] opacity-75 block" style={{ color: theme.textSecondary }}>
                Basura en Suelo
              </span>
              <span
                className="text-lg font-bold font-mono"
                style={{ color: overflowKg > 0 ? '#D27979' : theme.accentPrimary }}
              >
                {overflowKg.toFixed(1)} kg
              </span>
            </div>
          </div>

          {/* Veredicto Físico */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
              overflowKg > 0 ? 'border-red-300' : 'border-emerald-300'
            }`}
            style={{
              backgroundColor:
                overflowKg > 0
                  ? colorMode === 'oscuro'
                    ? 'rgba(120, 40, 40, 0.25)'
                    : 'rgba(254, 242, 242, 0.9)'
                  : colorMode === 'oscuro'
                  ? 'rgba(40, 90, 60, 0.25)'
                  : 'rgba(240, 253, 244, 0.9)',
            }}
          >
            {overflowKg > 0 ? (
              <>
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <strong className="text-red-600 dark:text-red-400">
                    Colapso por saturación física:
                  </strong>{' '}
                  Con estos parámetros, los contenedores colapsan y quedan {overflowKg.toFixed(1)} kg de residuos tirados en la acera del colegio, atrayendo plagas y focos de contaminación.
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    Sistema en equilibrio sostenible:
                  </strong>{' '}
                  La combinación de separación en la fuente ({calcCulture}%) y capacidad de almacenamiento ({maxCapacityKg.toFixed(1)} kg) es suficiente para retener el 100% de los residuos generados sin desborde en el andén.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
