/**
 * Lienzo de Simulación Gráfica Interactiva 2D Dinámica
 * Colegio Orlando Fals Borda - Bogotá D.C.
 * Permite simular el hecho exacto en cada solución:
 * 1. Llegada del camión recolector UAESP con operarios y vaciado en vivo.
 * 2. Isla Ecológica de 3 fracciones con reciclador de oficio de Usme en carreta.
 * 3. Pacto con vendedores ambulantes (toldos verdes, empaques kraft y cero icopor).
 * 4. Brigada Estudiantil IAP "Centinelas Falsbordianos" con chalecos y megáfonos.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ColorMode, EnvironmentId, SimulationParams, SimulationTimeStep, ThemeId, SolutionEventId } from '../types';
import { getTheme } from '../utils/themeConfig';
import { soundManager } from '../utils/audioEffects';
import { Volume2, VolumeX, Sparkles, CheckCircle2, AlertTriangle, Truck, Recycle, Users, Store, X } from 'lucide-react';

interface SimulationCanvasProps {
  currentStep: SimulationTimeStep;
  currentHour: number;
  environmentId: EnvironmentId;
  themeId: ThemeId;
  colorMode: ColorMode;
  params: SimulationParams;
  isPlaying: boolean;
  activeSolutionSim?: SolutionEventId | null;
  onClearSolutionSim?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  type: 'student' | 'litter' | 'leaf';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  currentStep,
  currentHour,
  environmentId,
  themeId,
  colorMode,
  params,
  isPlaying,
  activeSolutionSim,
  onClearSolutionSim,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = getTheme(themeId, colorMode);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  // Animaciones persistentes
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const truckPosRef = useRef<number>(-140);
  const recyclerPosRef = useRef<number>(880);
  const brigadeAnimRef = useRef<number>(0);
  const lastHourRef = useRef<number>(currentHour);

  // Toggle de sonido
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) {
      soundManager.playSuccessChime();
    }
  };

  // Sonidos según eventos del colegio
  useEffect(() => {
    if (!soundEnabled) return;
    const prev = lastHourRef.current;
    lastHourRef.current = currentHour;

    // Timbres escolares en picos
    if ((prev < 6.75 && currentHour >= 6.75) || (prev < 12.25 && currentHour >= 12.25) || (prev < 17.5 && currentHour >= 17.5)) {
      soundManager.playSchoolBell();
    }

    // Llegada del camión
    if (currentStep.recollectionHappened && Math.abs(currentHour - params.collectionHour) < 0.1) {
      soundManager.playTruckHonk();
    }
  }, [currentHour, soundEnabled, currentStep.recollectionHappened, params.collectionHour]);

  // Inicialización de estudiantes según flujo peatonal
  useEffect(() => {
    const pCount = Math.min(36, Math.max(6, Math.floor(currentStep.pedestrianRate / 35)));
    const newParticles: Particle[] = [];
    const colors =
      colorMode === 'oscuro'
        ? ['#82B596', '#9FD1B2', '#CBB19F', '#7CA488', '#E2B8A4']
        : ['#4D725D', '#6E987E', '#A1826D', '#3B5947', '#C49782'];

    for (let i = 0; i < pCount; i++) {
      newParticles.push({
        x: Math.random() * 860,
        y: 220 + Math.random() * 115,
        vx: (Math.random() - 0.48) * 1.6,
        vy: (Math.random() - 0.5) * 0.35,
        color: colors[i % colors.length],
        size: 5 + Math.random() * 3,
        type: 'student',
      });
    }
    particlesRef.current = newParticles;
  }, [environmentId, currentStep.pedestrianRate, colorMode]);

  // Render loop continuo en Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      brigadeAnimRef.current += 0.025;

      // 1. Limpieza con tono de suelo
      ctx.fillStyle = theme.canvasGround;
      ctx.fillRect(0, 0, width, height);

      // 2. Cielo y Paisaje Arquitectónico del Colegio Fals Borda
      drawEnvironmentScenery(ctx, width, height, environmentId, theme, currentHour, colorMode);

      // 3. Mapa térmico suave si está en tema térmico
      if (themeId === 'termico') {
        drawPastelHeatmap(ctx, width, height, currentStep.binSaturationPct, currentStep.overflowGroundKg, colorMode);
      }

      // 4. Puestos de Comercio Ambulante
      drawInformalStalls(
        ctx,
        params.informalStalls,
        environmentId,
        theme,
        colorMode,
        params.interventions.informalVendorAgreement,
        activeSolutionSim === 'informalVendorAgreement'
      );

      // 5. Estudiantes en movimiento
      ctx.save();
      for (const p of particlesRef.current) {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 20) p.x = width - 30;
          if (p.x > width - 20) p.x = 30;
          if (p.y < 210) p.vy = Math.abs(p.vy);
          if (p.y > 340) p.vy = -Math.abs(p.vy);
        }

        // Estudiante estilizado (silueta suave con uniforme)
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y - 12, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(p.x - p.size * 0.6, p.y - 8, p.size * 1.2, p.size * 1.5, 3);
        ctx.fill();
        // Morral escolar
        ctx.fillStyle = colorMode === 'oscuro' ? '#1F2923' : '#738276';
        ctx.beginPath();
        ctx.roundRect(p.x - p.size * 0.85, p.y - 6, p.size * 0.45, p.size * 1.1, 2);
        ctx.fill();
      }
      ctx.restore();

      // 6. Contenedores de Residuos (Convencional vs. Isla Ecológica Res. 2184)
      drawWasteContainers(
        ctx,
        params.activeBins,
        params.binCapacityLiters,
        currentStep.binSaturationPct,
        currentStep.overflowGroundKg,
        theme,
        environmentId,
        colorMode,
        params.interventions.ecologicalIslands,
        activeSolutionSim === 'ecologicalIslands'
      );

      // 7. Simulación de la Carreta del Reciclador de Oficio (si hay Islas Ecológicas)
      if (params.interventions.ecologicalIslands || activeSolutionSim === 'ecologicalIslands') {
        if (isPlaying && recyclerPosRef.current > 540) {
          recyclerPosRef.current -= 1.2;
        }
        drawRecyclerCart(ctx, recyclerPosRef.current, 240, theme, colorMode, activeSolutionSim === 'ecologicalIslands');
      } else {
        recyclerPosRef.current = 880;
      }

      // 8. Brigada Estudiantil IAP "Centinelas Falsbordianos"
      if (params.interventions.studentBrigade || activeSolutionSim === 'studentBrigade') {
        drawStudentBrigade(
          ctx,
          environmentId,
          theme,
          colorMode,
          brigadeAnimRef.current,
          activeSolutionSim === 'studentBrigade'
        );
      }

      // 9. Residuos en el Suelo (Desborde en andén)
      if (currentStep.overflowGroundKg > 0.05) {
        drawGroundLitter(
          ctx,
          currentStep.overflowGroundKg,
          theme,
          environmentId,
          colorMode,
          params.interventions.informalVendorAgreement
        );
      }

      // 10. Simulación del Camión de Aseo UAESP en Vivo
      const isCollectionActive = currentStep.recollectionHappened || activeSolutionSim === 'synchronizedCollection';
      if (isCollectionActive) {
        if (truckPosRef.current < 320) {
          truckPosRef.current += 3.2; // Avanza hasta el contenedor
        } else if (truckPosRef.current >= 320 && truckPosRef.current < 330) {
          // Pausa activa en el contenedor para vaciar
          truckPosRef.current += 0.08;
        } else if (truckPosRef.current < width + 150) {
          truckPosRef.current += 3.5; // Sale después de vaciar
        }
        drawCollectionTruck(
          ctx,
          truckPosRef.current,
          height - 80,
          theme,
          colorMode,
          params.interventions.synchronizedCollection,
          truckPosRef.current >= 315 && truckPosRef.current <= 335
        );
      } else {
        truckPosRef.current = -140;
      }

      // 11. HUD Superior Integrado en Canvas
      drawCanvasHUD(ctx, currentHour, currentStep, environmentId, theme, colorMode, params);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentStep, currentHour, environmentId, themeId, colorMode, params, isPlaying, theme, activeSolutionSim]);

  // Horario escolar formateado
  const getSchoolPeriodName = (h: number) => {
    if (h >= 6.25 && h <= 7.25) return '🔔 Ingreso Jornada Mañana (Pico Máximo)';
    if (h >= 9.25 && h <= 10.25) return '🥪 Recreo Mañana (Consumo de refrigerios)';
    if (h >= 11.75 && h <= 13.25) return '⚡ Cambio de Jornada Crítico (Salida/Entrada)';
    if (h >= 15.0 && h <= 16.0) return '🥪 Recreo Tarde';
    if (h >= 17.0 && h <= 18.0) return '🔔 Salida General Jornada Tarde';
    return 'Clases académicas en aulas';
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border transition-colors shadow-sm select-none"
      style={{ borderColor: theme.borderColor, backgroundColor: theme.bgSurface }}
    >
      {/* Banner flotante de Solución en Acción Activa */}
      {activeSolutionSim && (
        <div
          className="absolute top-3 left-3 right-3 z-20 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-md flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300"
          style={{
            backgroundColor: colorMode === 'oscuro' ? 'rgba(32, 45, 38, 0.95)' : 'rgba(240, 253, 244, 0.95)',
            borderColor: '#529671',
            color: theme.textPrimary,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold flex items-center gap-2">
                <span>
                  {activeSolutionSim === 'synchronizedCollection' && '🎬 Hecho Simulado: Llegada del Camión de Aseo UAESP (13:15 PM)'}
                  {activeSolutionSim === 'ecologicalIslands' && '🎬 Hecho Simulado: Batería de 3 Colores + Recicladores de Usme'}
                  {activeSolutionSim === 'informalVendorAgreement' && '🎬 Hecho Simulado: Pacto Cero Icopor con Vendedores Ambulantes'}
                  {activeSolutionSim === 'studentBrigade' && '🎬 Hecho Simulado: Brigada Estudiantil IAP "Centinelas Falsbordianos"'}
                  {activeSolutionSim === 'allSolutions' && '🌟 Misión Cumplida: Entorno Fals Borda 100% Sostenible y Limpio'}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                  En Vivo
                </span>
              </div>
              <p className="text-[11px] opacity-85 leading-tight mt-0.5" style={{ color: theme.textSecondary }}>
                {activeSolutionSim === 'synchronizedCollection' &&
                  'El camión llega sincronizado tras el cambio de jornada. Los operarios vacían el contenedor y se previenen 45 kg de desborde.'}
                {activeSolutionSim === 'ecologicalIslands' &&
                  'Los estudiantes separan empaques en la caneca blanca y la Asociación de Recicladores retira el material limpio.'}
                {activeSolutionSim === 'informalVendorAgreement' &&
                  'Los puestos cambiaron a empaques de papel kraft y colocaron sus propios botes de basura. Acera limpia.'}
                {activeSolutionSim === 'studentBrigade' &&
                  'Estudiantes de grado 11° orientan a sus compañeros en la entrada. El 85% deposita correctamente sus residuos.'}
                {activeSolutionSim === 'allSolutions' &&
                  'Todas las medidas articuladas: cero desborde en el suelo, 48 kg reciclados y andenes limpios.'}
              </p>
            </div>
          </div>

          {onClearSolutionSim && (
            <button
              onClick={onClearSolutionSim}
              className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-xs transition-colors shrink-0"
              title="Cerrar demostración"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Canvas Principal */}
      <canvas ref={canvasRef} width={860} height={380} className="w-full h-auto block" />

      {/* Barra de Estado Dinámica Inferior */}
      <div
        className="px-4 py-2.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs transition-colors"
        style={{
          borderColor: theme.borderColor,
          backgroundColor: colorMode === 'oscuro' ? '#1E2621' : '#FFFFFF',
          color: theme.textPrimary,
        }}
      >
        {/* Momento Escolar */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold">{getSchoolPeriodName(currentHour)}</span>
          <span className="text-xs opacity-50">·</span>
          <span style={{ color: theme.textSecondary }}>
            Flujo: <strong>{currentStep.pedestrianRate}</strong> personas/h
          </span>
        </div>

        {/* Saturación y Desborde */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span style={{ color: theme.textSecondary }}>Llenado Contenedor:</span>
            <span
              className="font-mono font-bold"
              style={{
                color:
                  currentStep.binSaturationPct >= 95
                    ? '#D27979'
                    : currentStep.binSaturationPct >= 75
                    ? '#E5A65D'
                    : theme.accentPrimary,
              }}
            >
              {Math.round(currentStep.binSaturationPct)}% ({currentStep.binAccumulatedKg.toFixed(1)} kg)
            </span>
          </div>

          {currentStep.overflowGroundKg > 0.05 && (
            <div className="flex items-center gap-1 text-red-500 font-bold bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{currentStep.overflowGroundKg.toFixed(1)} kg en andén</span>
            </div>
          )}

          {/* Botón de Sonido */}
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border hover:opacity-90 transition-all font-medium text-[11px]"
            style={{
              borderColor: theme.borderColor,
              backgroundColor: soundEnabled ? theme.badgeBg : theme.bgSurface,
              color: soundEnabled ? theme.badgeText : theme.textSecondary,
            }}
            title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar timbres y sonidos escolares'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Audio OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Dibuja el escenario arquitectónico del colegio con gradiente solar
 */
function drawEnvironmentScenery(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  envId: EnvironmentId,
  theme: any,
  hour: number,
  colorMode: ColorMode
) {
  // Gradiente de cielo según hora del día
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 190);
  if (colorMode === 'oscuro') {
    if (hour < 7.0 || hour > 17.5) {
      skyGrad.addColorStop(0, '#151D19');
      skyGrad.addColorStop(1, '#232D27');
    } else {
      skyGrad.addColorStop(0, '#1E2822');
      skyGrad.addColorStop(1, '#2D3B33');
    }
  } else {
    if (hour < 7.0) {
      // Amanecer dorado Usme
      skyGrad.addColorStop(0, '#F5E4D5');
      skyGrad.addColorStop(1, '#EAE1D3');
    } else if (hour > 17.0) {
      // Atardecer andino
      skyGrad.addColorStop(0, '#EAD9C8');
      skyGrad.addColorStop(1, '#DFD8CC');
    } else {
      // Día despejado
      skyGrad.addColorStop(0, '#EAF0EB');
      skyGrad.addColorStop(1, '#DFE6E0');
    }
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, 195);

  // Silueta de los cerros orientales de Bogotá (Usme)
  ctx.fillStyle = colorMode === 'oscuro' ? '#212A24' : '#C7D3C9';
  ctx.beginPath();
  ctx.moveTo(0, 140);
  ctx.bezierCurveTo(150, 105, 300, 130, 480, 95);
  ctx.bezierCurveTo(650, 70, 750, 115, width, 85);
  ctx.lineTo(width, 195);
  ctx.lineTo(0, 195);
  ctx.fill();

  // Edificio Escolar Colegio Orlando Fals Borda
  ctx.fillStyle = colorMode === 'oscuro' ? '#2D3830' : '#D4DDD5';
  ctx.fillRect(60, 70, 310, 125);
  ctx.strokeStyle = colorMode === 'oscuro' ? '#3B483F' : '#B8C5BA';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 70, 310, 125);

  // Ventanas del colegio
  ctx.fillStyle = colorMode === 'oscuro' ? '#1B241E' : '#B2C4B7';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 6; col++) {
      ctx.fillRect(85 + col * 46, 85 + row * 34, 28, 20);
    }
  }

  // Fachada con letrero institucional
  ctx.fillStyle = colorMode === 'oscuro' ? '#222B25' : '#E5ECE6';
  ctx.fillRect(90, 48, 250, 24);
  ctx.strokeStyle = theme.borderColor;
  ctx.strokeRect(90, 48, 250, 24);
  ctx.fillStyle = theme.accentPrimary;
  ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('COLEGIO ORLANDO FALS BORDA I.E.D.', 102, 64);

  // Reja perimetral y puerta principal
  ctx.strokeStyle = colorMode === 'oscuro' ? '#3D4C42' : '#8A9E8F';
  ctx.lineWidth = 1.8;
  for (let x = 0; x < width; x += 14) {
    if (x > 380 && x < 490) continue; // Vano de la puerta peatonal
    ctx.beginPath();
    ctx.moveTo(x, 155);
    ctx.lineTo(x, 205);
    ctx.stroke();
  }

  // Andén y Calzada Peatonal
  ctx.fillStyle = colorMode === 'oscuro' ? '#27312A' : '#C7CFC9';
  ctx.fillRect(0, 195, width, 30);
  ctx.fillStyle = colorMode === 'oscuro' ? '#1F2722' : '#B0B8B2';
  ctx.fillRect(0, 225, width, 155);

  // Línea de borde del andén
  ctx.strokeStyle = colorMode === 'oscuro' ? '#3C4940' : '#9EAAA0';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 225);
  ctx.lineTo(width, 225);
  ctx.stroke();
}

/**
 * Dibuja los contenedores de residuos o Isla Ecológica
 */
function drawWasteContainers(
  ctx: CanvasRenderingContext2D,
  binCount: number,
  capacityLiters: number,
  saturationPct: number,
  overflowKg: number,
  theme: any,
  envId: EnvironmentId,
  colorMode: ColorMode,
  hasEcologicalIslands: boolean,
  isEventActive: boolean
) {
  const baseX = 415;
  const baseY = 198;

  if (hasEcologicalIslands || isEventActive) {
    // Batería Modular de 3 Colores (Resolución 2184/2019 de Colombia)
    const binsConfig = [
      { color: '#FFFFFF', border: '#9E9EA8', label: 'BLANCO', sub: 'Aprovechable', fill: saturationPct * 0.65 },
      { color: '#4E8062', border: '#335641', label: 'VERDE', sub: 'Orgánico', fill: saturationPct * 0.8 },
      { color: '#272B2E', border: '#151719', label: 'NEGRO', sub: 'No Aprovech.', fill: saturationPct * 0.95 },
    ];

    binsConfig.forEach((b, idx) => {
      const bx = baseX + idx * 38;
      const by = baseY;
      const bw = 30;
      const bh = 50;

      // Cuerpo
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, [4, 4, 3, 3]);
      ctx.fill();
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Nivel de llenado
      const fillHeight = Math.min(bh - 8, ((bh - 8) * Math.min(100, b.fill)) / 100);
      ctx.fillStyle = theme.chartLine;
      ctx.beginPath();
      ctx.roundRect(bx + 3, by + bh - 3 - fillHeight, bw - 6, fillHeight, 2);
      ctx.fill();

      // Tapa basculante
      ctx.fillStyle = '#39423D';
      ctx.fillRect(bx - 2, by - 4, bw + 4, 5);

      // Texto de fracción
      ctx.fillStyle = idx === 0 ? '#222222' : '#FFFFFF';
      ctx.font = '700 7px sans-serif';
      ctx.fillText(b.label, bx + 2.5, by + 12);
    });

    // Letrero superior de Isla Ecológica
    ctx.fillStyle = '#2D6646';
    ctx.font = '700 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ISLA ECOLÓGICA RES. 2184 ♻', baseX - 12, baseY - 10);
  } else {
    // Canastillas unipersonales tradicionales
    const count = Math.min(binCount, 4);
    for (let i = 0; i < count; i++) {
      const bx = baseX + i * 36;
      const by = baseY;
      const bw = 25;
      const bh = 44;

      ctx.fillStyle = i === 0 ? '#4E7259' : '#6E8276';
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, [3, 3, 4, 4]);
      ctx.fill();
      ctx.strokeStyle = theme.borderColor;
      ctx.stroke();

      // Llenado
      const fillFraction = Math.min(1.0, saturationPct / 100);
      const fillHeight = (bh - 6) * fillFraction;
      ctx.fillStyle = saturationPct >= 85 ? '#E28B8B' : theme.chartLine;
      ctx.fillRect(bx + 2, by + bh - 2 - fillHeight, bw - 4, fillHeight);

      // Tapa
      ctx.fillStyle = '#333D37';
      ctx.fillRect(bx - 3, by - 5, bw + 6, 6);

      if (i === 0) {
        ctx.fillStyle = saturationPct >= 85 ? '#D27979' : theme.textPrimary;
        ctx.font = '700 9px "JetBrains Mono", monospace';
        ctx.fillText(`${Math.round(saturationPct)}%`, bx - 2, by - 8);
      }
    }
  }
}

/**
 * Dibuja la carreta del reciclador de oficio
 */
function drawRecyclerCart(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  theme: any,
  colorMode: ColorMode,
  isEventActive: boolean
) {
  ctx.save();
  // Carro verde de reciclador de Usme
  ctx.fillStyle = '#3E664E';
  ctx.beginPath();
  ctx.roundRect(rx, ry, 65, 30, 4);
  ctx.fill();
  ctx.strokeStyle = '#274232';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Sacos blancos con PET y cartón recolectado
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(rx + 18, ry - 6, 12, 0, Math.PI * 2);
  ctx.arc(rx + 42, ry - 6, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#BBB';
  ctx.stroke();

  // Ruedas del carro
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(rx + 15, ry + 30, 8, 0, Math.PI * 2);
  ctx.arc(rx + 50, ry + 30, 8, 0, Math.PI * 2);
  ctx.fill();

  // Reciclador empujando
  ctx.fillStyle = '#D9A07A';
  ctx.beginPath();
  ctx.arc(rx + 78, ry - 4, 5.5, 0, Math.PI * 2); // cabeza
  ctx.fill();
  ctx.fillStyle = '#2D4A36';
  ctx.beginPath();
  ctx.roundRect(rx + 72, ry + 2, 12, 22, 2); // cuerpo
  ctx.fill();

  // Letrero en carreta
  ctx.fillStyle = '#FFF';
  ctx.font = '700 6.5px sans-serif';
  ctx.fillText('RECICLADOR USME', rx + 4, ry + 18);

  // Globo de diálogo si el evento está activo
  if (isEventActive) {
    ctx.fillStyle = colorMode === 'oscuro' ? '#26332A' : '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(rx - 30, ry - 42, 125, 20, 5);
    ctx.fill();
    ctx.strokeStyle = '#4D7B61';
    ctx.stroke();
    ctx.fillStyle = colorMode === 'oscuro' ? '#A3D4B5' : '#2D593E';
    ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('¡45% PET recuperado! ♻', rx - 24, ry - 28);
  }
  ctx.restore();
}

/**
 * Dibuja los puestos de comercio ambulante
 */
function drawInformalStalls(
  ctx: CanvasRenderingContext2D,
  stallCount: number,
  envId: EnvironmentId,
  theme: any,
  colorMode: ColorMode,
  hasVendorAgreement: boolean,
  isEventActive: boolean
) {
  const count = Math.min(stallCount, 6);
  for (let i = 0; i < count; i++) {
    const sx = 40 + i * 55;
    const sy = 220;

    // Toldo: Verde ecológico si hay pacto, rayado común si no hay pacto
    ctx.fillStyle = hasVendorAgreement || isEventActive ? '#4D8062' : i % 2 === 0 ? '#C47E62' : '#C2A368';
    ctx.beginPath();
    ctx.moveTo(sx - 18, sy);
    ctx.lineTo(sx + 18, sy);
    ctx.lineTo(sx + 12, sy - 18);
    ctx.lineTo(sx - 12, sy - 18);
    ctx.closePath();
    ctx.fill();

    // Mostrador del carrito
    ctx.fillStyle = colorMode === 'oscuro' ? '#333D36' : '#E8ECE8';
    ctx.fillRect(sx - 15, sy, 30, 22);
    ctx.strokeStyle = theme.borderColor;
    ctx.strokeRect(sx - 15, sy, 30, 22);

    // Rueda del carrito
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(sx, sy + 22, 5, 0, Math.PI * 2);
    ctx.fill();

    // Vendedor
    ctx.fillStyle = '#CFA182';
    ctx.beginPath();
    ctx.arc(sx + 12, sy - 6, 4, 0, Math.PI * 2);
    ctx.fill();

    // Si tiene pacto: canasta propia al lado del puesto
    if (hasVendorAgreement || isEventActive) {
      ctx.fillStyle = '#4D8062';
      ctx.fillRect(sx + 16, sy + 6, 8, 14);
      ctx.fillStyle = '#FFF';
      ctx.font = '600 6px sans-serif';
      ctx.fillText('♻', sx + 17.5, sy + 16);
    }
  }

  // Si el evento está activo, cartel de pacto
  if (isEventActive) {
    ctx.fillStyle = colorMode === 'oscuro' ? '#223328' : '#F0FDF4';
    ctx.beginPath();
    ctx.roundRect(40, 185, 200, 20, 5);
    ctx.fill();
    ctx.strokeStyle = '#529671';
    ctx.stroke();
    ctx.fillStyle = '#2D6646';
    ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PAserverTO COMERCIAL: CERO ICOPOR · KRAFT ☕', 48, 198);
  }
}

/**
 * Dibuja la Brigada Estudiantil IAP "Centinelas Falsbordianos"
 */
function drawStudentBrigade(
  ctx: CanvasRenderingContext2D,
  envId: EnvironmentId,
  theme: any,
  colorMode: ColorMode,
  animTime: number,
  isEventActive: boolean
) {
  const bx = 385;
  const by = 222;

  // 3 Estudiantes de servicio social con chaleco verde y brazalete IAP
  for (let s = 0; s < 3; s++) {
    const sx = bx + s * 22;
    const sy = by + (s % 2) * 5;

    // Cabeza
    ctx.fillStyle = colorMode === 'oscuro' ? '#F2E8DC' : '#5A4638';
    ctx.beginPath();
    ctx.arc(sx, sy - 14, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Gorra verde IAP
    ctx.fillStyle = '#3E664E';
    ctx.fillRect(sx - 4.5, sy - 17, 9, 3.5);

    // Chaleco institucional
    ctx.fillStyle = '#2D593E';
    ctx.fillRect(sx - 4, sy - 9, 8, 15);

    // Banda reflectiva amarilla
    ctx.fillStyle = '#F5DE5D';
    ctx.fillRect(sx - 4, sy - 3, 8, 2.5);
  }

  // Globo pedagógico animado
  const bob = Math.sin(animTime * 3) * 2;
  ctx.fillStyle = colorMode === 'oscuro' ? '#26332A' : '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(bx - 30, by - 48 + bob, 120, 22, 6);
  ctx.fill();
  ctx.strokeStyle = '#3E664E';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.fillStyle = colorMode === 'oscuro' ? '#A7DBB9' : '#1F4730';
  ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('¡Centinelas Falsbordianos! 🎒♻', bx - 22, by - 34 + bob);
}

/**
 * Residuos en el suelo
 */
function drawGroundLitter(
  ctx: CanvasRenderingContext2D,
  overflowKg: number,
  theme: any,
  envId: EnvironmentId,
  colorMode: ColorMode,
  hasVendorAgreement: boolean
) {
  const baseX = 455;
  const baseY = 248;
  const count = Math.min(40, Math.floor(overflowKg * 4));

  ctx.save();
  for (let i = 0; i < count; i++) {
    const rx = baseX + Math.sin(i * 1.8) * 48 + (i % 5) * 6;
    const ry = baseY + Math.cos(i * 2.1) * 16 + (i % 3) * 5;
    ctx.fillStyle = i % 3 === 0 ? '#E28B8B' : i % 2 === 0 ? '#E2CF9B' : '#8CAEA0';
    ctx.beginPath();
    ctx.ellipse(rx, ry, 3.5, 2, Math.PI * (i / 10), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#D27979';
  ctx.font = '700 10.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`▲ Desborde en andén: ${overflowKg.toFixed(1)} kg`, baseX - 25, baseY + 35);
  ctx.restore();
}

/**
 * Camión recolector de aseo UAESP
 */
function drawCollectionTruck(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  theme: any,
  colorMode: ColorMode,
  isSync: boolean,
  isDumping: boolean
) {
  ctx.save();
  // Caja compactadora
  ctx.fillStyle = colorMode === 'oscuro' ? '#27342C' : '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(tx, ty, 110, 42, 4);
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.stroke();

  // Cabina del camión
  ctx.fillStyle = '#3E664E';
  ctx.beginPath();
  ctx.roundRect(tx + 82, ty + 6, 28, 36, [0, 5, 5, 0]);
  ctx.fill();

  // Rótulo oficial UAESP
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 9px sans-serif';
  ctx.fillText('UAESP', tx + 85, ty + 24);

  // Luz estroboscópica ámbar en el techo
  ctx.fillStyle = '#F5A623';
  ctx.beginPath();
  ctx.arc(tx + 95, ty + 3, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Ruedas
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.arc(tx + 24, ty + 42, 8, 0, Math.PI * 2);
  ctx.arc(tx + 86, ty + 42, 8, 0, Math.PI * 2);
  ctx.fill();

  // Si está vaciando en el contenedor: animación de operarios
  if (isDumping) {
    // 2 Operarios en chaleco naranja
    ctx.fillStyle = '#E86C32';
    ctx.fillRect(tx - 14, ty + 10, 8, 22);
    ctx.fillRect(tx - 26, ty + 12, 8, 20);
    ctx.fillStyle = '#333';
    ctx.font = '700 7px sans-serif';
    ctx.fillText('¡Vaciando!', tx - 30, ty + 4);
  }
  ctx.restore();
}

/**
 * Mapa térmico suave
 */
function drawPastelHeatmap(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  saturationPct: number,
  overflowKg: number,
  colorMode: ColorMode
) {
  const intensity = Math.min(1.0, (saturationPct / 100) * 0.7 + (overflowKg > 0 ? 0.3 : 0));
  const grad = ctx.createRadialGradient(450, 220, 10, 450, 220, 180);
  if (colorMode === 'oscuro') {
    grad.addColorStop(0, `rgba(226, 139, 139, ${0.45 * intensity})`);
    grad.addColorStop(0.5, `rgba(232, 178, 142, ${0.25 * intensity})`);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
  } else {
    grad.addColorStop(0, `rgba(210, 121, 121, ${0.4 * intensity})`);
    grad.addColorStop(0.5, `rgba(229, 166, 93, ${0.2 * intensity})`);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 180, width, height - 180);
}

/**
 * HUD superior en Canvas
 */
function drawCanvasHUD(
  ctx: CanvasRenderingContext2D,
  hour: number,
  step: SimulationTimeStep,
  envId: EnvironmentId,
  theme: any,
  colorMode: ColorMode,
  params: SimulationParams
) {
  // Reloj digital escolar
  ctx.fillStyle = colorMode === 'oscuro' ? 'rgba(30, 38, 33, 0.92)' : 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.roundRect(14, 14, 155, 34, 8);
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = theme.textPrimary;
  ctx.font = '700 14px "JetBrains Mono", monospace';
  ctx.fillText(`🕒 ${step.timeString}`, 24, 36);

  ctx.fillStyle = theme.textSecondary;
  ctx.font = '500 9px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('HORA ESCOLAR', 100, 35);
}
