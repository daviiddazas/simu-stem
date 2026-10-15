/**
 * Modelos Matemáticos y Ecuaciones Dinámicas de Acumulación de Residuos
 * Colegio Orlando Fals Borda IED - Bogotá D.C.
 */

import { EnvironmentId, SimulationParams, SimulationTimeStep, WasteComposition } from '../types';

export const ENVIRONMENTS_DATA = {
  entrada: {
    id: 'entrada' as EnvironmentId,
    name: 'Entrada Principal en Hora Pico',
    tagline: 'Acceso peatonal principal sobre vía secundaria (Jornadas Mañana y Tarde)',
    description:
      'Zona de mayor congestión peatonal del colegio. Registra ingresos masivos de estudiantes (6:15 - 7:00 a.m. y 12:00 - 1:00 p.m.) con alto consumo de refrigerios, bebidas embotelladas y folletería de paso.',
    defaultPedestrianFlux: 1850,
    defaultInformalStalls: 4,
    defaultBinCount: 3,
    defaultBinCapacity: 720, // Litros totales (3 x 240L)
    litterRiskFactor: 0.38,
    peakHours: [
      { start: 6.25, end: 7.25, label: 'Entrada Mañana' },
      { start: 11.75, end: 13.0, label: 'Cambio de Jornada' },
      { start: 17.0, end: 18.0, label: 'Salida Tarde' },
    ],
  },
  cafeteria: {
    id: 'cafeteria' as EnvironmentId,
    name: 'Zona de Cafetería y Comercios Informales',
    tagline: 'Perímetro exterior colindante con puestos de venta ambulante y tienda escolar',
    description:
      'Sector con alta generación de empaques desechables de un solo uso (plásticos, icopor, servilletas y grasas orgánicas). Las compras en recreos y horas de salida saturan rápidamente las cestas.',
    defaultPedestrianFlux: 1200,
    defaultInformalStalls: 7,
    defaultBinCount: 2,
    defaultBinCapacity: 480, // Litros totales (2 x 240L)
    litterRiskFactor: 0.52,
    peakHours: [
      { start: 9.25, end: 10.25, label: 'Recreo Mañana' },
      { start: 12.0, end: 13.5, label: 'Almuerzo / Venta Callejera' },
      { start: 15.0, end: 16.0, label: 'Recreo Tarde' },
    ],
  },
  parqueadero: {
    id: 'parqueadero' as EnvironmentId,
    name: 'Parqueadero y Perímetro Periférico',
    tagline: 'Costado posterior y cerramiento perimetral de baja iluminación',
    description:
      'Área periférica con baja afluencia peatonal continua pero propensa a vertimientos clandestinos nocturnos, escombros menores y dispersión por caninos callejeros y vientos de la sabana.',
    defaultPedestrianFlux: 350,
    defaultInformalStalls: 1,
    defaultBinCount: 2,
    defaultBinCapacity: 480, // Litros totales
    litterRiskFactor: 0.65,
    peakHours: [
      { start: 6.5, end: 7.5, label: 'Llegada Rutas Escolares' },
      { start: 16.5, end: 17.75, label: 'Salida Docentes / Rutas' },
    ],
  },
};

// Densidad promedio de residuos sólidos escolares no compactados (kg/m3) -> kg/Litro
export const WASTE_DENSITY_KG_L = 0.135; // 135 kg/m³ = 0.135 kg/L

/**
 * Función gaussiana normalizada para modelar picos de flujo
 */
function gaussianPeak(hour: number, center: number, sigma: number, amplitude: number): number {
  return amplitude * Math.exp(-Math.pow(hour - center, 2) / (2 * Math.pow(sigma, 2)));
}

/**
 * Calcula el flujo peatonal en función de la hora del día y del ambiente
 */
export function calculatePedestrianFlux(hour: number, envId: EnvironmentId, totalStudents: number): number {
  const env = ENVIRONMENTS_DATA[envId];
  const ratio = totalStudents / 1600; // factor de escala respecto a colegio base

  if (envId === 'entrada') {
    // Picos en 6:45, 12:15 y 17:30
    const morning = gaussianPeak(hour, 6.75, 0.45, 950 * ratio);
    const noon = gaussianPeak(hour, 12.35, 0.55, 1100 * ratio);
    const evening = gaussianPeak(hour, 17.5, 0.45, 750 * ratio);
    const base = 40 * ratio;
    return Math.max(0, Math.round(morning + noon + evening + base));
  } else if (envId === 'cafeteria') {
    // Picos en recreos y salidas
    const recMorning = gaussianPeak(hour, 9.75, 0.4, 650 * ratio);
    const lunchStalls = gaussianPeak(hour, 12.5, 0.65, 880 * ratio);
    const recAfternoon = gaussianPeak(hour, 15.35, 0.4, 520 * ratio);
    const dismissal = gaussianPeak(hour, 17.3, 0.45, 410 * ratio);
    const base = 25 * ratio;
    return Math.max(0, Math.round(recMorning + lunchStalls + recAfternoon + dismissal + base));
  } else {
    // Parqueadero y perímetro
    const morningBus = gaussianPeak(hour, 6.8, 0.5, 280 * ratio);
    const noonDelivery = gaussianPeak(hour, 12.2, 0.6, 210 * ratio);
    const afternoonBus = gaussianPeak(hour, 17.2, 0.5, 320 * ratio);
    const base = 15 * ratio;
    return Math.max(0, Math.round(morningBus + noonDelivery + afternoonBus + base));
  }
}

/**
 * Tasa de generación de residuos Rin(t) en kg/h
 */
export function calculateGenerationRate(
  hour: number,
  envId: EnvironmentId,
  params: SimulationParams,
  pedestrians: number
): number {
  // Generación directa de peatones (g/persona convertida a kg)
  // Base g_e por hora de tránsito: ~22 g / persona-evento de paso
  const perPersonGrams = params.generationRatePerStudent; 
  let studentKgH = (pedestrians * (perPersonGrams / 1000));

  // Generación por puestos de comercio informal
  // Cada puesto genera entre 1.8 y 3.5 kg/día, concentrados en horas pico
  const activeStallFraction = gaussianPeak(hour, 12.3, 2.5, 1.0);
  const stallKgH = params.informalStalls * (params.stallGenerationKgDay / 6) * activeStallFraction;

  // Modificador por cultura ciudadana e intervenciones:
  let culturalMitigation = 1.0;

  if (params.interventions.ecologicalIslands) {
    // Desvío de reciclables reduce carga directa al contenedor mixto en 32%
    culturalMitigation -= 0.32 * params.civicCultureFactor;
  }
  if (params.interventions.informalVendorAgreement) {
    // Menos empaques desechables voluminosos
    culturalMitigation -= 0.22;
  }
  if (params.interventions.studentBrigade) {
    // Sensibilización IAP directa en horas pico
    culturalMitigation -= 0.15 * params.civicCultureFactor;
  }

  culturalMitigation = Math.max(0.35, culturalMitigation);

  return Math.max(0, (studentKgH + stallKgH) * culturalMitigation);
}

/**
 * Eficiencia de captura del contenedor según su nivel de saturación actual.
 * Ley de decaimiento: cuando S > 80% de Cmax, la gente arroja al suelo o sobre la tapa.
 */
export function getContainerCaptureEfficiency(currentKg: number, maxKg: number): number {
  if (maxKg <= 0) return 0;
  const saturation = currentKg / maxKg;
  if (saturation < 0.75) {
    return 0.96; // 96% de captura efectiva en el contenedor
  } else if (saturation < 1.0) {
    // Decae linealmente de 96% a 15%
    const progress = (saturation - 0.75) / 0.25;
    return 0.96 - progress * (0.96 - 0.15);
  } else {
    // Contenedor lleno: 0% entra al contenedor, 100% va al suelo
    return 0.0;
  }
}

/**
 * Ejecuta la simulación numérica horaria continua de 6:00 a 18:00
 * con paso dt = 0.1 horas (6 minutos) para alta precisión
 */
export function runSimulationTimeline(
  envId: EnvironmentId,
  params: SimulationParams
): SimulationTimeStep[] {
  const steps: SimulationTimeStep[] = [];
  const startHour = 6.0;
  const endHour = 18.0;
  const dt = 0.1; // 6 minutos por sub-paso

  // Capacidad máxima de masa de los contenedores
  const totalVolumeLiters = params.activeBins * params.binCapacityLiters;
  const maxCapacityKg = totalVolumeLiters * WASTE_DENSITY_KG_L;

  let currentBinKg = 0;
  let currentOverflowKg = 0;
  let totalGeneratedKg = 0;

  // Horas efectivas de recolección (considerando sincronización)
  let effectiveCollection1 = params.collectionHour;
  let effectiveCollection2 = params.hasSecondCollection ? params.secondCollectionHour : -1;

  if (params.interventions.synchronizedCollection) {
    // Se sincroniza exactamente después del cambio de jornada (13:15)
    effectiveCollection1 = 13.25;
  }

  for (let t = startHour; t <= endHour + 0.001; t += dt) {
    const pedestrians = calculatePedestrianFlux(t, envId, params.studentCount);
    const genRate = calculateGenerationRate(t, envId, params, pedestrians);

    // Entrada neta en este intervalo de tiempo
    const deltaGenerated = genRate * dt;
    totalGeneratedKg += deltaGenerated;

    // Verificamos si en este intervalo ocurre vaciado del camión de basura
    const isCollectionWindow1 = Math.abs(t - effectiveCollection1) < dt / 1.8;
    const isCollectionWindow2 =
      effectiveCollection2 > 0 && Math.abs(t - effectiveCollection2) < dt / 1.8;
    const recollectionHappened = isCollectionWindow1 || isCollectionWindow2;

    if (recollectionHappened) {
      // El operador vacía el contenedor
      currentBinKg = 0;
      // Si hay brigada estudiantil o barrido UAESP, limpian también el 85% del suelo acumulado
      if (params.interventions.studentBrigade || params.interventions.synchronizedCollection) {
        currentOverflowKg *= 0.15;
      } else {
        currentOverflowKg *= 0.45; // barrido básico deja residuos dispersos
      }
    }

    // Distribución al contenedor vs al suelo
    const captureEff = getContainerCaptureEfficiency(currentBinKg, maxCapacityKg);
    const toBin = deltaGenerated * captureEff;
    const toGround = deltaGenerated * (1 - captureEff);

    // Actualización de estado
    if (currentBinKg + toBin <= maxCapacityKg) {
      currentBinKg += toBin;
      currentOverflowKg += toGround;
    } else {
      const room = Math.max(0, maxCapacityKg - currentBinKg);
      currentBinKg = maxCapacityKg;
      currentOverflowKg += toGround + (toBin - room);
    }

    // Registramos en cada hora entera o cada 0.5h para la tabla y gráficos
    const roundedT = Math.round(t * 10) / 10;
    if (Math.abs(roundedT - Math.round(roundedT)) < 0.01 || Math.abs(roundedT - (Math.floor(roundedT) + 0.5)) < 0.01) {
      const hInt = Math.floor(roundedT);
      const mInt = Math.round((roundedT - hInt) * 60);
      const timeString = `${hInt.toString().padStart(2, '0')}:${mInt.toString().padStart(2, '0')}`;

      steps.push({
        hour: roundedT,
        timeString,
        pedestrianRate: pedestrians,
        generationRateKgH: Number(genRate.toFixed(2)),
        binAccumulatedKg: Number(currentBinKg.toFixed(2)),
        binSaturationPct: Number(Math.min(100, (currentBinKg / maxCapacityKg) * 100).toFixed(1)),
        overflowGroundKg: Number(currentOverflowKg.toFixed(2)),
        accumulatedTotalKg: Number(totalGeneratedKg.toFixed(2)),
        recollectionHappened,
      });
    }
  }

  return steps;
}

/**
 * Caracterización física y gravimétrica de los residuos
 * para el Colegio Orlando Fals Borda (estudio tipo UAESP / PRAE)
 */
export function getWasteComposition(envId: EnvironmentId): WasteComposition {
  if (envId === 'cafeteria') {
    return {
      plastics: 42, // Bolsas de empanadas, botellas PET, vasos desechables
      organics: 36, // Sobras de frutas, cáscaras, restos de comida
      paperCardboard: 14, // Servilletas, bolsas de papel
      others: 8, // Empaques metalizados, pitillos, servilletas sucias
    };
  } else if (envId === 'entrada') {
    return {
      plastics: 48, // Envases de bebidas, envoltorios de golosinas
      organics: 22, // Restos de frutas del desayuno
      paperCardboard: 20, // Folletos, fotocopias arrugadas, recibos
      others: 10, // Chicles, colillas, empaques multicapa
    };
  } else {
    // Parqueadero y perímetro
    return {
      plastics: 30, // Botellas, plásticos soplados por viento
      organics: 25, // Residuos de poda y materia orgánica
      paperCardboard: 15, // Cajas y cartones
      others: 30, // Escombros menores, textiles, polvo de barrido
    };
  }
}
