/**
 * Tipos y modelos de datos para la Simulación Ambiental
 * Colegio Orlando Fals Borda IED
 */

export type EnvironmentId = 'entrada' | 'cafeteria' | 'parqueadero';

export type ThemeId = 'dia' | 'termico' | 'ecologico';

export type ColorMode = 'claro' | 'oscuro';

export interface EnvironmentConfig {
  id: EnvironmentId;
  name: string;
  tagline: string;
  description: string;
  defaultPedestrianFlux: number; // personas / hora pico
  defaultInformalStalls: number; // puestos de comercio
  defaultBinCount: number; // número de contenedores
  defaultBinCapacity: number; // litros totales
  litterRiskFactor: number; // propensión a arrojo al suelo (0-1)
  peakHours: { start: number; end: number; label: string }[];
}

export interface SimulationParams {
  studentCount: number; // Estudiantes totales matriculados
  generationRatePerStudent: number; // g / estudiante por jornada escolar
  activeBins: number; // Número de puntos de disposición
  binCapacityLiters: number; // Capacidad unitaria (L)
  informalStalls: number; // Puestos de venta informal en inmediaciones
  stallGenerationKgDay: number; // Generación kg por puesto
  civicCultureFactor: number; // Cultura ciudadana / separación (0 a 1)
  collectionHour: number; // Hora del camión de aseo (decimal, ej. 11.5 = 11:30 AM)
  hasSecondCollection: boolean; // Si hay segundo pase de recolección
  secondCollectionHour: number; // Hora del 2do pase (ej. 16.5 = 4:30 PM)
  interventions: {
    synchronizedCollection: boolean; // UAESP sincronizada con cambio de jornada
    ecologicalIslands: boolean; // Separación en la fuente con 3 fracciones
    informalVendorAgreement: boolean; // Vendedores usan empaques biodegradables y acopio
    studentBrigade: boolean; // Brigada escolar IAP Fals Borda
  };
}

export interface SimulationTimeStep {
  hour: number; // 6 a 18
  timeString: string;
  pedestrianRate: number; // personas / h
  generationRateKgH: number; // kg / h que ingresan
  binAccumulatedKg: number; // kg dentro del contenedor
  binSaturationPct: number; // % de llenado del contenedor
  overflowGroundKg: number; // kg desbordados en el suelo
  accumulatedTotalKg: number; // kg acumulados netos
  recollectionHappened: boolean;
}

export interface WasteComposition {
  plastics: number; // % plásticos de un solo uso
  organics: number; // % residuos orgánicos alimenticios
  paperCardboard: number; // % papel y cartón
  others: number; // % no aprovechables / barrido
}
