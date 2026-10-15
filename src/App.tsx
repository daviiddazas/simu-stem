/**
 * Aplicación Principal: Simulador Ambiental Colegio Orlando Fals Borda
 * Enfoque interdisciplinario: Ingeniería Ambiental, Modelación Matemática y UI/UX Educativa
 * Soporta alternancia completa entre Modo Claro y Modo Oscuro con adaptación cromática de letra y superficie
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ColorMode, EnvironmentId, SimulationParams, ThemeId } from './types';
import { ENVIRONMENTS_DATA, runSimulationTimeline } from './utils/mathModel';
import { getTheme } from './utils/themeConfig';
import { SimulationCanvas } from './components/SimulationCanvas';
import { SimulationCharts } from './components/SimulationCharts';
import { ControlDeck } from './components/ControlDeck';
import { SectionDiagnosis } from './components/SectionDiagnosis';
import { SectionMathModel } from './components/SectionMathModel';
import { SectionSolutions } from './components/SectionSolutions';
import { SectionSourceCode } from './components/SectionSourceCode';
import { Sun, Moon } from 'lucide-react';

export default function App() {
  // Estado de navegación
  const [activeTab, setActiveTab] = useState<
    'simulador' | 'diagnostico' | 'matematicas' | 'soluciones' | 'codigo'
  >('simulador');

  // Estado del modelo y simulación
  const [environmentId, setEnvironmentId] = useState<EnvironmentId>('entrada');
  const [themeId, setThemeId] = useState<ThemeId>('dia');
  const [colorMode, setColorMode] = useState<ColorMode>('claro');
  const [currentHour, setCurrentHour] = useState<number>(6.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Parámetros de simulación
  const [params, setParams] = useState<SimulationParams>({
    studentCount: 1600,
    generationRatePerStudent: 32, // g/estudiante
    activeBins: 3,
    binCapacityLiters: 240, // L por caneca
    informalStalls: 4,
    stallGenerationKgDay: 2.8,
    civicCultureFactor: 0.65,
    collectionHour: 11.5,
    hasSecondCollection: false,
    secondCollectionHour: 16.5,
    interventions: {
      synchronizedCollection: true,
      ecologicalIslands: true,
      informalVendorAgreement: false,
      studentBrigade: false,
    },
  });

  // Tema dinámico según themeId y colorMode (Claro / Oscuro)
  const theme = useMemo(() => {
    return getTheme(themeId, colorMode);
  }, [themeId, colorMode]);

  // Alternador de Modo Claro / Modo Oscuro
  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'claro' ? 'oscuro' : 'claro'));
  };

  // Cálculo de la línea de tiempo matemática
  const timeline = useMemo(() => {
    return runSimulationTimeline(environmentId, params);
  }, [environmentId, params]);

  // Paso actual según la hora
  const currentStep = useMemo(() => {
    const step = timeline.find((s) => Math.abs(s.hour - currentHour) < 0.25);
    return (
      step ||
      timeline[0] || {
        hour: 6.0,
        timeString: '06:00',
        pedestrianRate: 50,
        generationRateKgH: 1.2,
        binAccumulatedKg: 0,
        binSaturationPct: 0,
        overflowGroundKg: 0,
        accumulatedTotalKg: 0,
        recollectionHappened: false,
      }
    );
  }, [timeline, currentHour]);

  // Ciclo de reproducción de la simulación
  const lastTimeRef = useRef<number>(performance.now());
  useEffect(() => {
    let animId: number;
    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        const advanceRate = (1 / 5) * playbackSpeed;
        setCurrentHour((prev) => {
          const next = prev + advanceRate * delta;
          if (next > 18.0) return 6.0;
          return next;
        });
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed]);

  // Actualiza los parámetros base al cambiar de ambiente
  const handleEnvironmentChange = (newEnvId: EnvironmentId) => {
    setEnvironmentId(newEnvId);
    const newEnv = ENVIRONMENTS_DATA[newEnvId];
    setParams((prev) => ({
      ...prev,
      informalStalls: newEnv.defaultInformalStalls,
      activeBins: newEnv.defaultBinCount,
    }));
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300 font-sans flex flex-col"
      style={{ backgroundColor: theme.bgMain, color: theme.textPrimary }}
    >
      {/* 1. Header con Contrato de Barra Superior (3 zonas exactas) */}
      <header
        className="w-full px-6 py-3.5 border-b flex items-center justify-between gap-8 transition-colors shrink-0 sticky top-0 z-30 backdrop-blur-md shadow-xs"
        style={{
          borderColor: theme.borderColor,
          backgroundColor: colorMode === 'oscuro' ? 'rgba(30, 38, 33, 0.92)' : 'rgba(255, 255, 255, 0.92)',
        }}
      >
        {/* Zona 1: Título de Marca llamativo */}
        <a
          href="#simulador"
          onClick={() => setActiveTab('simulador')}
          className="text-base md:text-lg font-bold tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2.5"
          style={{ color: theme.textPrimary }}
        >
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme.accentPrimary }}
          />
          <span>EcoLab Fals Borda · Misión Territorio Limpio</span>
        </a>

        {/* Zona 2: 4-5 enlaces de navegación de una línea */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium" style={{ color: theme.textSecondary }}>
          <button
            onClick={() => setActiveTab('simulador')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'simulador' ? 'font-bold border-b-2' : 'hover:opacity-100 opacity-80'
            }`}
            style={{
              borderColor: activeTab === 'simulador' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'simulador' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            Simulador Interactivo
          </button>

          <button
            onClick={() => setActiveTab('diagnostico')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'diagnostico' ? 'font-bold border-b-2' : 'hover:opacity-100 opacity-80'
            }`}
            style={{
              borderColor: activeTab === 'diagnostico' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'diagnostico' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            1. Diagnóstico
          </button>

          <button
            onClick={() => setActiveTab('matematicas')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'matematicas' ? 'font-bold border-b-2' : 'hover:opacity-100 opacity-80'
            }`}
            style={{
              borderColor: activeTab === 'matematicas' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'matematicas' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            2. Modelos Matemáticos
          </button>

          <button
            onClick={() => setActiveTab('soluciones')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'soluciones' ? 'font-bold border-b-2' : 'hover:opacity-100 opacity-80'
            }`}
            style={{
              borderColor: activeTab === 'soluciones' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'soluciones' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            3. Soluciones
          </button>

          <button
            onClick={() => setActiveTab('codigo')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'codigo' ? 'font-bold border-b-2' : 'hover:opacity-100 opacity-80'
            }`}
            style={{
              borderColor: activeTab === 'codigo' ? theme.accentPrimary : 'transparent',
              color: activeTab === 'codigo' ? theme.textPrimary : theme.textSecondary,
            }}
          >
            4. Código Prototipo
          </button>
        </nav>

        {/* Zona 3: 1 Acción Primaria (Botón para alternar ambiente de Oscuro a Claro) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleColorMode}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: theme.bgPanel,
              borderColor: theme.borderColor,
              color: theme.textPrimary,
            }}
            title={colorMode === 'oscuro' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
          >
            {colorMode === 'oscuro' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>Modo Oscuro</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Navegación móvil compacta */}
      <div
        className="flex md:hidden items-center justify-between gap-2 px-4 py-2 border-b text-xs shrink-0 transition-colors"
        style={{ borderColor: theme.borderColor, backgroundColor: theme.bgSurface }}
      >
        <div className="flex overflow-x-auto gap-1.5 py-0.5">
          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-xs ${
              activeTab === 'simulador' ? 'font-bold shadow-xs' : 'opacity-75'
            }`}
            style={{
              backgroundColor: activeTab === 'simulador' ? theme.bgPanel : 'transparent',
              color: theme.textPrimary,
            }}
          >
            Simulador
          </button>
          <button
            onClick={() => setActiveTab('diagnostico')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-xs ${
              activeTab === 'diagnostico' ? 'font-bold shadow-xs' : 'opacity-75'
            }`}
            style={{
              backgroundColor: activeTab === 'diagnostico' ? theme.bgPanel : 'transparent',
              color: theme.textPrimary,
            }}
          >
            Diagnóstico
          </button>
          <button
            onClick={() => setActiveTab('matematicas')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-xs ${
              activeTab === 'matematicas' ? 'font-bold shadow-xs' : 'opacity-75'
            }`}
            style={{
              backgroundColor: activeTab === 'matematicas' ? theme.bgPanel : 'transparent',
              color: theme.textPrimary,
            }}
          >
            Matemáticas
          </button>
          <button
            onClick={() => setActiveTab('soluciones')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-xs ${
              activeTab === 'soluciones' ? 'font-bold shadow-xs' : 'opacity-75'
            }`}
            style={{
              backgroundColor: activeTab === 'soluciones' ? theme.bgPanel : 'transparent',
              color: theme.textPrimary,
            }}
          >
            Soluciones
          </button>
          <button
            onClick={() => setActiveTab('codigo')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap text-xs ${
              activeTab === 'codigo' ? 'font-bold shadow-xs' : 'opacity-75'
            }`}
            style={{
              backgroundColor: activeTab === 'codigo' ? theme.bgPanel : 'transparent',
              color: theme.textPrimary,
            }}
          >
            Código
          </button>
        </div>

        <button
          onClick={toggleColorMode}
          className="p-1.5 rounded-lg border shrink-0 transition-colors"
          style={{ borderColor: theme.borderColor, color: theme.textPrimary }}
        >
          {colorMode === 'oscuro' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6">
        {activeTab === 'simulador' && (
          <div className="space-y-6">
            {/* Banner Hero Contextual con colores adaptativos */}
            <div
              className="relative rounded-2xl overflow-hidden border p-5 md:p-6 transition-colors shadow-sm"
              style={{
                backgroundColor: theme.bgSurface,
                borderColor: theme.borderColor,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="font-mono font-semibold uppercase px-2 py-0.5 rounded"
                      style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                    >
                      Laboratorio Ambiental · Ciencia y Acción Participativa (IAP)
                    </span>
                    <span className="opacity-40">·</span>
                    <span style={{ color: theme.textSecondary }}>Usme, Bogotá D.C.</span>
                  </div>

                  <h1
                    className="text-xl md:text-3xl font-bold tracking-tight"
                    style={{ color: theme.textPrimary, textWrap: 'balance' }}
                  >
                    ¿Podemos Evitar el Colapso? Simula y Resuelve la Basura en Nuestro Colegio
                  </h1>

                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
                    Ponte en los zapatos de un científico ambiental: interactúa con los valores mediante los botones, descubre a qué hora exacta colapsan las canastillas del Colegio Orlando Fals Borda y activa las soluciones estratégicas para salvar nuestro espacio escolar.
                  </p>
                </div>

                <div
                  className="lg:col-span-5 rounded-xl overflow-hidden border relative h-40 md:h-44 shadow-inner"
                  style={{ borderColor: theme.borderColor }}
                >
                  <img
                    src="/src/assets/images/hero_school_fals_borda_1792100102054.jpg"
                    alt="Colegio Orlando Fals Borda en entorno andino"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                    <span className="text-[11px] text-white/95 font-medium">
                      Colegio Orlando Fals Borda · Proyecto Ambiental Escolar (PRAE)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cuadrícula de Simulación: Canvas + Control Deck */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Columna Izquierda: Canvas y Gráficos (7 columnas) */}
              <div className="xl:col-span-7 space-y-5">
                <SimulationCanvas
                  currentStep={currentStep}
                  currentHour={currentHour}
                  environmentId={environmentId}
                  themeId={themeId}
                  colorMode={colorMode}
                  params={params}
                  isPlaying={isPlaying}
                />

                <SimulationCharts
                  timeline={timeline}
                  currentHour={currentHour}
                  environmentId={environmentId}
                  themeId={themeId}
                  colorMode={colorMode}
                  params={params}
                />
              </div>

              {/* Columna Derecha: Control Deck con botones y tonalidades */}
              <div className="xl:col-span-5">
                <ControlDeck
                  currentHour={currentHour}
                  onHourChange={setCurrentHour}
                  isPlaying={isPlaying}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                  onReset={() => {
                    setCurrentHour(6.0);
                    setIsPlaying(true);
                  }}
                  playbackSpeed={playbackSpeed}
                  onSpeedChange={setPlaybackSpeed}
                  environmentId={environmentId}
                  onEnvironmentChange={handleEnvironmentChange}
                  themeId={themeId}
                  onThemeChange={setThemeId}
                  colorMode={colorMode}
                  onToggleColorMode={toggleColorMode}
                  params={params}
                  onParamsChange={setParams}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diagnostico' && (
          <SectionDiagnosis themeId={themeId} colorMode={colorMode} />
        )}

        {activeTab === 'matematicas' && (
          <SectionMathModel themeId={themeId} colorMode={colorMode} />
        )}

        {activeTab === 'soluciones' && (
          <SectionSolutions themeId={themeId} colorMode={colorMode} />
        )}

        {activeTab === 'codigo' && (
          <SectionSourceCode themeId={themeId} colorMode={colorMode} />
        )}
      </main>

      {/* Footer académico con colores adaptativos */}
      <footer
        className="w-full py-5 px-6 border-t mt-12 text-xs transition-colors shrink-0"
        style={{
          borderColor: theme.borderColor,
          backgroundColor: theme.bgSurface,
          color: theme.textSecondary,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold" style={{ color: theme.textPrimary }}>
              Colegio Orlando Fals Borda I.E.D.
            </span>
            <span className="mx-2 opacity-40">·</span>
            <span>Investigación Acción Participativa (IAP) &amp; Gestión Ambiental de Residuos</span>
          </div>

          <div className="font-mono text-[11px] opacity-75">
            Secretaría de Educación del Distrito · Bogotá D.C.
          </div>
        </div>
      </footer>
    </div>
  );
}
