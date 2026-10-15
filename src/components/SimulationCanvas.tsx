/**
 * Lienzo de Simulación Gráfica Interactiva 2D
 * Colegio Orlando Fals Borda
 * Adaptativo a Modo Claro y Modo Oscuro
 */

import React, { useEffect, useRef, useState } from 'react';
import { ColorMode, EnvironmentId, SimulationParams, SimulationTimeStep, ThemeId } from '../types';
import { getTheme } from '../utils/themeConfig';

interface SimulationCanvasProps {
  currentStep: SimulationTimeStep;
  currentHour: number;
  environmentId: EnvironmentId;
  themeId: ThemeId;
  colorMode: ColorMode;
  params: SimulationParams;
  isPlaying: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  type: 'litter' | 'leaf' | 'student';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  currentStep,
  currentHour,
  environmentId,
  themeId,
  colorMode,
  params,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = getTheme(themeId, colorMode);

  // Partículas y peatones dinámicos
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Inicialización de partículas peatonales según flujo
  useEffect(() => {
    const pCount = Math.min(28, Math.max(4, Math.floor(currentStep.pedestrianRate / 45)));
    const newParticles: Particle[] = [];
    const colors =
      colorMode === 'oscuro'
        ? themeId === 'termico'
          ? ['#D6B5E8', '#F5BCB0', '#C3A9C7', '#E5A695']
          : themeId === 'ecologico'
          ? ['#82B596', '#9FD1B2', '#CBB19F', '#7CA488']
          : ['#9FB8A7', '#B4CCBE', '#E2B8A4', '#9AB0BC']
        : themeId === 'termico'
        ? ['#BA96C7', '#E8A598', '#A288A6', '#D68C7A']
        : themeId === 'ecologico'
        ? ['#4D725D', '#6E987E', '#A1826D', '#3B5947']
        : ['#5E7767', '#768F7E', '#C49782', '#6B7A82'];

    for (let i = 0; i < pCount; i++) {
      newParticles.push({
        x: Math.random() * 800,
        y: 220 + Math.random() * 110,
        vx: (Math.random() - 0.45) * 1.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: colors[i % colors.length],
        size: 5 + Math.random() * 3,
        type: 'student',
      });
    }
    particlesRef.current = newParticles;
  }, [environmentId, currentStep.pedestrianRate, themeId, colorMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTruckPos = -120;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Limpieza con color de fondo del tema
      ctx.fillStyle = theme.canvasGround;
      ctx.fillRect(0, 0, width, height);

      // 2. Fondo arquitectónico del colegio según el ambiente
      drawEnvironmentScenery(ctx, width, height, environmentId, theme, currentHour, colorMode);

      // 3. Mapa de calor suave si el tema es térmico
      if (themeId === 'termico') {
        drawPastelHeatmap(ctx, width, height, currentStep.binSaturationPct, currentStep.overflowGroundKg, colorMode);
      }

      // 4. Puestos de comercio informal
      drawInformalStalls(ctx, params.informalStalls, environmentId, theme, colorMode);

      // 5. Peatones / Estudiantes animados
      ctx.save();
      for (const p of particlesRef.current) {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 30) p.x = width - 40;
          if (p.x > width - 30) p.x = 40;
          if (p.y < 210) p.vy = Math.abs(p.vy);
          if (p.y > 340) p.vy = -Math.abs(p.vy);
        }

        // Dibujar silueta estilizada de estudiante
        ctx.fillStyle = p.color;
        // Cabeza
        ctx.beginPath();
        ctx.arc(p.x, p.y - 12, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        // Cuerpo / uniforme
        ctx.beginPath();
        ctx.roundRect(p.x - p.size * 0.6, p.y - 8, p.size * 1.2, p.size * 1.5, 3);
        ctx.fill();
        // Morral escolar
        ctx.fillStyle = theme.borderColor;
        ctx.beginPath();
        ctx.roundRect(p.x - p.size * 0.9, p.y - 6, p.size * 0.45, p.size * 1.1, 2);
        ctx.fill();
      }
      ctx.restore();

      // 6. Contenedores de residuos (físicos)
      drawWasteContainers(
        ctx,
        params.activeBins,
        params.binCapacityLiters,
        currentStep.binSaturationPct,
        currentStep.overflowGroundKg,
        theme,
        environmentId,
        colorMode
      );

      // 7. Residuos en suelo si hay desborde
      if (currentStep.overflowGroundKg > 0.1) {
        drawGroundLitter(ctx, currentStep.overflowGroundKg, theme, environmentId, colorMode);
      }

      // 8. Animación del Camión de Aseo si es hora de recolección
      if (currentStep.recollectionHappened) {
        localTruckPos += 3.5;
        drawCollectionTruck(ctx, localTruckPos, height - 70, theme, colorMode);
      }

      // 9. Overlay informativo en esquina superior
      drawCanvasHUD(ctx, currentHour, currentStep, environmentId, theme, colorMode);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentStep, currentHour, environmentId, themeId, colorMode, params, isPlaying, theme]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border transition-colors shadow-sm"
      style={{ borderColor: theme.borderColor, backgroundColor: theme.bgSurface }}
    >
      <canvas
        ref={canvasRef}
        width={860}
        height={380}
        className="w-full h-auto block select-none"
      />

      {/* Floating Status Bar inside canvas */}
      <div
        className="absolute bottom-3 left-3 right-3 px-3.5 py-2.5 rounded-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs border transition-colors"
        style={{
          backgroundColor: colorMode === 'oscuro' ? 'rgba(30, 38, 33, 0.92)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: theme.borderColor,
          color: theme.textPrimary,
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: currentStep.binSaturationPct > 85 ? '#D27979' : theme.accentPrimary }}
          />
          <span className="font-semibold">
            {environmentId === 'entrada'
              ? 'Acceso Peatonal Principal'
              : environmentId === 'cafeteria'
              ? 'Zona Cafetería & Comercios'
              : 'Perímetro Posterior'}
          </span>
          <span className="opacity-40">·</span>
          <span className="tabular-nums font-mono opacity-90" style={{ color: theme.textSecondary }}>
            {currentStep.pedestrianRate} peatones/h
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span style={{ color: theme.textSecondary }}>Llenado:</span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: currentStep.binSaturationPct >= 90 ? '#E28B8B' : theme.textPrimary }}
            >
              {currentStep.binSaturationPct}%
            </span>
          </div>

          <span className="opacity-30">|</span>

          <div className="flex items-center gap-1.5">
            <span style={{ color: theme.textSecondary }}>En Suelo:</span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: currentStep.overflowGroundKg > 2 ? '#E28B8B' : theme.textPrimary }}
            >
              {currentStep.overflowGroundKg} kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function drawEnvironmentScenery(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  envId: EnvironmentId,
  theme: any,
  hour: number,
  colorMode: ColorMode
) {
  // Cielo diurno o crepúsculo según modo
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 180);
  if (colorMode === 'oscuro') {
    skyGrad.addColorStop(0, '#171E1A');
    skyGrad.addColorStop(1, '#212A24');
  } else {
    if (hour < 7.5) {
      skyGrad.addColorStop(0, '#EFE4D6');
      skyGrad.addColorStop(1, '#F7EFE6');
    } else if (hour > 16.5) {
      skyGrad.addColorStop(0, '#E6D7CE');
      skyGrad.addColorStop(1, '#F3EAE4');
    } else {
      skyGrad.addColorStop(0, '#EAF0EB');
      skyGrad.addColorStop(1, '#F5F8F5');
    }
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, 180);

  // Cerros de Usme al fondo
  ctx.fillStyle = theme.canvasWall;
  ctx.beginPath();
  ctx.moveTo(0, 160);
  ctx.bezierCurveTo(180, 80, 320, 130, 480, 95);
  ctx.bezierCurveTo(640, 65, 750, 110, w, 130);
  ctx.lineTo(w, 180);
  ctx.lineTo(0, 180);
  ctx.closePath();
  ctx.fill();

  // Edificación del Colegio
  ctx.fillStyle = colorMode === 'oscuro' ? '#2A342E' : '#FFFFFF';
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 1.5;

  if (envId === 'entrada') {
    ctx.fillRect(60, 60, 480, 120);
    ctx.strokeRect(60, 60, 480, 120);

    // Ventanales
    ctx.fillStyle = colorMode === 'oscuro' ? '#37463E' : theme.canvasPath;
    for (let c = 0; c < 5; c++) {
      ctx.fillRect(90 + c * 85, 80, 50, 40);
      ctx.strokeRect(90 + c * 85, 80, 50, 40);
    }

    // Rótulo del Colegio
    ctx.fillStyle = theme.accentPrimary;
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('COLEGIO ORLANDO FALS BORDA I.E.D.', 140, 75);

    // Portal de acceso
    ctx.fillStyle = theme.canvasWall;
    ctx.fillRect(220, 130, 110, 50);
    ctx.strokeRect(220, 130, 110, 50);

    // Acera y calzada
    ctx.fillStyle = theme.canvasPath;
    ctx.fillRect(0, 180, w, 80);
    ctx.strokeRect(0, 180, w, 80);

    // Calzada vehicular
    ctx.fillStyle = colorMode === 'oscuro' ? '#1D2520' : '#E8E2D8';
    ctx.fillRect(0, 260, w, 120);

    ctx.strokeStyle = colorMode === 'oscuro' ? '#4A5B51' : '#FFFFFF';
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(0, 320);
    ctx.lineTo(w, 320);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (envId === 'cafeteria') {
    ctx.fillRect(40, 50, 420, 130);
    ctx.strokeRect(40, 50, 420, 130);

    ctx.fillStyle = theme.accentPrimary;
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('COMEDOR ESCOLAR Y PATIO CENTRAL', 120, 72);

    ctx.fillStyle = theme.canvasPath;
    ctx.fillRect(0, 180, w, 200);

    for (let m = 0; m < 3; m++) {
      const mx = 80 + m * 240;
      const my = 220;
      ctx.fillStyle = colorMode === 'oscuro' ? '#323E37' : '#D9CEBF';
      ctx.beginPath();
      ctx.roundRect(mx, my, 70, 32, 4);
      ctx.fill();
      ctx.strokeStyle = theme.borderColor;
      ctx.stroke();

      ctx.fillStyle = colorMode === 'oscuro' ? '#2A342E' : '#CFC3B2';
      ctx.fillRect(mx - 10, my + 8, 8, 16);
      ctx.fillRect(mx + 72, my + 8, 8, 16);
    }
  } else {
    ctx.fillRect(0, 120, w, 60);
    ctx.strokeStyle = colorMode === 'oscuro' ? '#44554B' : '#C8BFB2';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 120);
      ctx.lineTo(x + 10, 180);
      ctx.stroke();
    }

    ctx.fillStyle = colorMode === 'oscuro' ? '#1D2520' : '#E4DDD2';
    ctx.fillRect(0, 180, w, 200);

    ctx.strokeStyle = colorMode === 'oscuro' ? '#39463F' : '#FFFFFF';
    ctx.setLineDash([8, 6]);
    for (let p = 0; p < 4; p++) {
      ctx.strokeRect(60 + p * 190, 200, 160, 90);
    }
    ctx.setLineDash([]);
  }
}

function drawInformalStalls(
  ctx: CanvasRenderingContext2D,
  stalls: number,
  envId: EnvironmentId,
  theme: any,
  colorMode: ColorMode
) {
  if (stalls <= 0) return;
  const count = Math.min(stalls, 5);
  const startX = envId === 'cafeteria' ? 490 : envId === 'entrada' ? 580 : 640;

  for (let i = 0; i < count; i++) {
    const sx = startX + (i % 3) * 85;
    const sy = envId === 'cafeteria' ? 240 + Math.floor(i / 3) * 60 : 220 + (i % 2) * 55;

    ctx.fillStyle = i % 2 === 0 ? '#D69E8C' : '#9EB5A0';
    ctx.beginPath();
    ctx.moveTo(sx - 25, sy);
    ctx.lineTo(sx + 25, sy);
    ctx.lineTo(sx + 32, sy + 18);
    ctx.lineTo(sx - 32, sy + 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = theme.borderColor;
    ctx.stroke();

    ctx.fillStyle = colorMode === 'oscuro' ? '#2A342E' : '#F5ECE1';
    ctx.fillRect(sx - 22, sy + 18, 44, 25);
    ctx.strokeRect(sx - 22, sy + 18, 44, 25);

    ctx.fillStyle = theme.textSecondary;
    ctx.font = '500 8px sans-serif';
    ctx.fillText('Puesto', sx - 13, sy + 32);
  }
}

function drawWasteContainers(
  ctx: CanvasRenderingContext2D,
  binCount: number,
  capacityLiters: number,
  saturationPct: number,
  overflowKg: number,
  theme: any,
  envId: EnvironmentId,
  colorMode: ColorMode
) {
  const count = Math.min(binCount, 4);
  const baseX = envId === 'cafeteria' ? 360 : envId === 'entrada' ? 440 : 420;
  const baseY = 210;

  for (let i = 0; i < count; i++) {
    const bx = baseX + i * 36;
    const by = baseY;
    const bw = 24;
    const bh = 42;

    const binColor =
      i === 0 ? '#547B62' : i === 1 ? '#8E9C93' : i === 2 ? '#343E38' : '#6A7D71';
    ctx.fillStyle = binColor;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [2, 2, 4, 4]);
    ctx.fill();
    ctx.strokeStyle = theme.borderColor;
    ctx.stroke();

    const fillFraction = Math.min(1.0, saturationPct / 100);
    const fillHeight = (bh - 6) * fillFraction;

    ctx.fillStyle = theme.chartLine;
    ctx.beginPath();
    ctx.fillRect(bx + 2, by + bh - 2 - fillHeight, bw - 4, fillHeight);

    ctx.fillStyle = colorMode === 'oscuro' ? '#171E1A' : '#48554F';
    ctx.beginPath();
    ctx.roundRect(bx - 3, by - 5, bw + 6, 6, 2);
    ctx.fill();

    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(bx + 4, by + bh + 1, 3, 0, Math.PI * 2);
    ctx.arc(bx + bw - 4, by + bh + 1, 3, 0, Math.PI * 2);
    ctx.fill();

    if (i === 0) {
      ctx.fillStyle = saturationPct > 85 ? '#E28B8B' : theme.textPrimary;
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillText(`${Math.round(saturationPct)}%`, bx - 2, by - 9);
    }
  }
}

function drawGroundLitter(
  ctx: CanvasRenderingContext2D,
  overflowKg: number,
  theme: any,
  envId: EnvironmentId,
  colorMode: ColorMode
) {
  const baseX = envId === 'cafeteria' ? 400 : 470;
  const baseY = 245;
  const particles = Math.min(45, Math.floor(overflowKg * 5));

  ctx.save();
  for (let i = 0; i < particles; i++) {
    const rx = baseX + Math.sin(i * 1.7) * 45 + (i % 5) * 8;
    const ry = baseY + Math.cos(i * 2.3) * 18 + (i % 3) * 6;

    ctx.fillStyle = i % 3 === 0 ? '#E28B8B' : i % 2 === 0 ? '#E8CF98' : '#95B0A0';
    ctx.beginPath();
    ctx.ellipse(rx, ry, 3.5, 2, Math.PI * (i / 10), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#E28B8B';
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`▲ Foco activo: ${overflowKg.toFixed(1)} kg`, baseX - 25, baseY + 36);
  ctx.restore();
}

function drawCollectionTruck(
  ctx: CanvasRenderingContext2D,
  tx: number,
  ty: number,
  theme: any,
  colorMode: ColorMode
) {
  ctx.save();
  ctx.fillStyle = colorMode === 'oscuro' ? '#2A342E' : '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(tx, ty, 100, 38, 4);
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.stroke();

  ctx.fillStyle = theme.accentPrimary;
  ctx.beginPath();
  ctx.roundRect(tx + 75, ty + 6, 25, 32, [0, 4, 4, 0]);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 8px sans-serif';
  ctx.fillText('ASEO', tx + 78, ty + 24);

  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(tx + 22, ty + 38, 7, 0, Math.PI * 2);
  ctx.arc(tx + 82, ty + 38, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = theme.chartLine;
  ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('♻ Recolección en curso', tx, ty - 8);
  ctx.restore();
}

function drawPastelHeatmap(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  saturation: number,
  overflowKg: number,
  colorMode: ColorMode
) {
  const intensity = Math.min(1.0, (saturation / 100) * 0.6 + (overflowKg / 20) * 0.4);
  if (intensity <= 0.05) return;

  const grad = ctx.createRadialGradient(470, 240, 10, 470, 240, 160 * intensity);
  if (colorMode === 'oscuro') {
    grad.addColorStop(0, 'rgba(226, 139, 139, 0.45)');
    grad.addColorStop(0.5, 'rgba(181, 156, 201, 0.2)');
    grad.addColorStop(1, 'rgba(38, 33, 45, 0)');
  } else {
    grad.addColorStop(0, 'rgba(216, 125, 103, 0.42)');
    grad.addColorStop(0.5, 'rgba(235, 178, 155, 0.22)');
    grad.addColorStop(1, 'rgba(248, 246, 249, 0)');
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(470, 240, 160 * intensity, 0, Math.PI * 2);
  ctx.fill();
}

function drawCanvasHUD(
  ctx: CanvasRenderingContext2D,
  hour: number,
  step: SimulationTimeStep,
  envId: EnvironmentId,
  theme: any,
  colorMode: ColorMode
) {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;

  ctx.fillStyle = colorMode === 'oscuro' ? 'rgba(34, 42, 37, 0.9)' : 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.roundRect(14, 14, 140, 46, 8);
  ctx.fill();
  ctx.strokeStyle = theme.borderColor;
  ctx.stroke();

  ctx.fillStyle = theme.textSecondary;
  ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('HORA SIMULADA', 24, 28);

  ctx.fillStyle = theme.textPrimary;
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText(timeStr, 24, 48);
}
