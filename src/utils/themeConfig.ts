/**
 * Paleta de colores pastel y configuraciones temáticas (Modo Claro y Modo Oscuro)
 * Cumple con la restricción de colores suaves y legibilidad óptima WCAG AA:
 * tierras suaves, verdes salvia, cremas, lavandas y azules apagados,
 * adaptando los colores de superficie y letra para lectura sin fatiga.
 */

import { ColorMode, ThemeId } from '../types';

export interface ThemeColors {
  id: ThemeId;
  mode: ColorMode;
  name: string;
  tagline: string;
  bgMain: string;
  bgSurface: string;
  bgPanel: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accentPrimary: string;
  accentHover: string;
  badgeBg: string;
  badgeText: string;
  chartLine: string;
  chartFill: string;
  overflowFill: string;
  canvasGround: string;
  canvasWall: string;
  canvasPath: string;
  canvasAccent: string;
}

export const THEMES_BY_MODE: Record<ColorMode, Record<ThemeId, ThemeColors>> = {
  claro: {
    dia: {
      id: 'dia',
      mode: 'claro',
      name: 'Día Suave',
      tagline: 'Tonalidades crema, verde salvia y pizarra apagada',
      bgMain: '#FBF9F5',
      bgSurface: '#FFFFFF',
      bgPanel: '#F5F0E8',
      borderColor: '#E8E1D5',
      textPrimary: '#28332D',
      textSecondary: '#5A6961',
      textMuted: '#7E8E85',
      accentPrimary: '#648870', // Verde salvia suave
      accentHover: '#51735C',
      badgeBg: '#EDF3EE',
      badgeText: '#375743',
      chartLine: '#648870',
      chartFill: 'rgba(100, 136, 112, 0.18)',
      overflowFill: 'rgba(214, 137, 114, 0.28)',
      canvasGround: '#EFE9DF',
      canvasWall: '#E4DDD0',
      canvasPath: '#F7F4EE',
      canvasAccent: '#648870',
    },
    termico: {
      id: 'termico',
      mode: 'claro',
      name: 'Análisis Térmico Suave',
      tagline: 'Mapa de calor pastel: melocotón, lavanda y cuarzo',
      bgMain: '#F8F6F9',
      bgSurface: '#FFFFFF',
      bgPanel: '#F0EAF5',
      borderColor: '#E2D9EA',
      textPrimary: '#302638',
      textSecondary: '#625470',
      textMuted: '#847594',
      accentPrimary: '#8D73A6', // Lavanda suave
      accentHover: '#775D8F',
      badgeBg: '#F3EDF7',
      badgeText: '#5E4479',
      chartLine: '#D27979',
      chartFill: 'rgba(210, 121, 121, 0.2)',
      overflowFill: 'rgba(224, 112, 112, 0.35)',
      canvasGround: '#EFE7F2',
      canvasWall: '#E2D5E8',
      canvasPath: '#FAF6FC',
      canvasAccent: '#D27979',
    },
    ecologico: {
      id: 'ecologico',
      mode: 'claro',
      name: 'Ecológico Sostenible',
      tagline: 'Eucalipto, arcilla cocida y tierra vegetal',
      bgMain: '#F4F7F4',
      bgSurface: '#FFFFFF',
      bgPanel: '#E8EFE8',
      borderColor: '#D4E2D5',
      textPrimary: '#1E3326',
      textSecondary: '#4A6655',
      textMuted: '#718C7B',
      accentPrimary: '#4D7B61', // Eucalipto
      accentHover: '#3C644E',
      badgeBg: '#E7F2EB',
      badgeText: '#2B533C',
      chartLine: '#4D7B61',
      chartFill: 'rgba(77, 123, 97, 0.2)',
      overflowFill: 'rgba(196, 129, 97, 0.3)',
      canvasGround: '#E3ECE4',
      canvasWall: '#D1DFD3',
      canvasPath: '#F2F7F3',
      canvasAccent: '#4D7B61',
    },
  },
  oscuro: {
    dia: {
      id: 'dia',
      mode: 'oscuro',
      name: 'Día Suave (Noche)',
      tagline: 'Pizarra profunda, salvia claro y carbón vegetal',
      bgMain: '#19201C',
      bgSurface: '#222A25',
      bgPanel: '#2A342E',
      borderColor: '#39463F',
      textPrimary: '#F2F6F3',
      textSecondary: '#B9C7BF',
      textMuted: '#8E9E95',
      accentPrimary: '#8BB097', // Salvia iluminado legible
      accentHover: '#A1C2AC',
      badgeBg: '#2A3930',
      badgeText: '#B8DAC4',
      chartLine: '#8BB097',
      chartFill: 'rgba(139, 176, 151, 0.25)',
      overflowFill: 'rgba(224, 142, 120, 0.35)',
      canvasGround: '#252F29',
      canvasWall: '#313D36',
      canvasPath: '#2C3731',
      canvasAccent: '#8BB097',
    },
    termico: {
      id: 'termico',
      mode: 'oscuro',
      name: 'Análisis Térmico (Noche)',
      tagline: 'Fondo amatista suave, lavanda iluminado y coral térmico',
      bgMain: '#1C1822',
      bgSurface: '#26212D',
      bgPanel: '#312A3A',
      borderColor: '#433A4E',
      textPrimary: '#F4EFF7',
      textSecondary: '#CBC0D5',
      textMuted: '#9B8FA6',
      accentPrimary: '#B59CC9',
      accentHover: '#C7B1DB',
      badgeBg: '#362D42',
      badgeText: '#D6C4E7',
      chartLine: '#E28B8B',
      chartFill: 'rgba(226, 139, 139, 0.25)',
      overflowFill: 'rgba(235, 128, 128, 0.4)',
      canvasGround: '#292231',
      canvasWall: '#372E42',
      canvasPath: '#30283A',
      canvasAccent: '#E28B8B',
    },
    ecologico: {
      id: 'ecologico',
      mode: 'oscuro',
      name: 'Ecológico (Noche)',
      tagline: 'Bosque andino profundo, menta suave y arcilla clara',
      bgMain: '#16211A',
      bgSurface: '#1E2C23',
      bgPanel: '#26372D',
      borderColor: '#364D3F',
      textPrimary: '#EDF5EF',
      textSecondary: '#B7CEBF',
      textMuted: '#8CA595',
      accentPrimary: '#78A98E',
      accentHover: '#8EBFA3',
      badgeBg: '#283D31',
      badgeText: '#AEE1C2',
      chartLine: '#78A98E',
      chartFill: 'rgba(120, 169, 142, 0.25)',
      overflowFill: 'rgba(214, 145, 114, 0.35)',
      canvasGround: '#213027',
      canvasWall: '#2C3E32',
      canvasPath: '#27382E',
      canvasAccent: '#78A98E',
    },
  },
};

/**
 * Obtiene la configuración de colores del tema y modo seleccionados
 */
export function getTheme(themeId: ThemeId, mode: ColorMode): ThemeColors {
  const modeGroup = THEMES_BY_MODE[mode] || THEMES_BY_MODE.claro;
  return modeGroup[themeId] || modeGroup.dia;
}

// Compatibilidad directa por defecto
export const THEMES = THEMES_BY_MODE.claro;
