/**
 * Sección 1: Diagnóstico y Definición Clara del Problema
 * Colegio Orlando Fals Borda IED (Bogotá D.C.)
 * Adaptativo a Modo Claro y Modo Oscuro con alta legibilidad
 */

import React from 'react';
import { ColorMode, ThemeId } from '../types';
import { getTheme } from '../utils/themeConfig';
import { AlertTriangle, Users, MapPin, Trash2, Clock } from 'lucide-react';

interface SectionDiagnosisProps {
  themeId: ThemeId;
  colorMode: ColorMode;
}

export const SectionDiagnosis: React.FC<SectionDiagnosisProps> = ({ themeId, colorMode }) => {
  const theme = getTheme(themeId, colorMode);

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
            Sección 1 · Diagnóstico Integral
          </span>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Perspectiva de Ingeniería Ambiental y Sociología Comunitaria
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
          Diagnóstico y Definición de las Causas Raíz en el Entorno Escolar
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
          El Colegio Orlando Fals Borda IED, ubicado en una zona de alta densidad comunitaria en el sur de Bogotá (Usme), experimenta un fenómeno crítico de degradación del espacio público perimetral. La acumulación no controlada de residuos sólidos genera focos de contaminación visual y olfativa, proliferación de vectores (roedores e insectos) y un impacto adverso en la salud ambiental de la comunidad educativa.
        </p>
      </div>

      {/* Árbol del Problema / Causas Raíz */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Causa 1: Desfase Logístico */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm"
          style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: theme.bgPanel, color: theme.accentPrimary }}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: theme.textPrimary }}>
                1. Desincronización de Rutas de Recolección UAESP
              </h3>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                El operador de aseo de la zona efectúa la recolección en horario nocturno o de madrugada (ej. 22:00 a 05:00 a.m.). Sin embargo, la mayor generación de residuos del colegio ocurre en la jornada diurna escolar, alcanzando su punto crítico en el cambio de jornada (12:00 a 13:15 p.m.). Los contenedores permanecen desbordados durante más de 8 horas continuas bajo la intemperie.
              </p>
            </div>
          </div>
        </div>

        {/* Causa 2: Comercio Informal Periférico */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm"
          style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: theme.bgPanel, color: theme.accentPrimary }}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: theme.textPrimary }}>
                2. Comercio Informal y Empaques Desechables
              </h3>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                Frente a las puertas de acceso se instalan entre 5 y 10 puestos ambulantes de comida rápida y bebidas. La casi totalidad de sus insumos se entrega en icopor (poliestireno expandido), bolsas plásticas delgadas y pitillos. Al carecer de recipientes propios de acopio, transfieren el 100% de la carga de residuos a las pocas canastillas escolares perimetrales.
              </p>
            </div>
          </div>
        </div>

        {/* Causa 3: Capacidad e Infraestructura Insuficiente */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm"
          style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: theme.bgPanel, color: theme.accentPrimary }}>
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: theme.textPrimary }}>
                3. Déficit de Capacidad Volumétrica y Vandalismo
              </h3>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                Las canastillas peatonales tipo MGB (240 litros) instaladas en la acera resultan insuficientes para soportar una densidad de más de 1,600 estudiantes en tránsito. Adicionalmente, el diseño sin tapas pesadas o con aberturas estrechas propicia el estancamiento de bolsas en la boca de entrada, provocando desborde prematuro en el suelo.
              </p>
            </div>
          </div>
        </div>

        {/* Causa 4: Falta de Cultura y Separación */}
        <div
          className="p-5 rounded-2xl border transition-colors shadow-sm"
          style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl shrink-0" style={{ backgroundColor: theme.bgPanel, color: theme.accentPrimary }}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm" style={{ color: theme.textPrimary }}>
                4. Carencia de Separación en la Fuente y Efecto Ventana Rota
              </h3>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.textSecondary }}>
                No existe infraestructura de disposición selectiva (blanco, verde, negro) en el espacio exterior. Al ver residuos ya esparcidos en el suelo, los transeúntes asumen que el perímetro es un basurero tolerado ("efecto de la ventana rota"), normalizando el arrojo indiscriminado de bolsas domiciliarias por parte de habitantes aledaños.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Matriz de Actores Clave */}
      <div
        className="p-5 rounded-2xl border transition-colors shadow-sm"
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.borderColor }}
      >
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: theme.textPrimary }}>
          <MapPin className="w-4 h-4" style={{ color: theme.accentPrimary }} />
          Matriz de Actores y Responsabilidades Interinstitucionales
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: theme.borderColor, backgroundColor: theme.bgPanel }}>
                <th className="py-2.5 px-3 font-semibold" style={{ color: theme.textPrimary }}>Actor</th>
                <th className="py-2.5 px-3 font-semibold" style={{ color: theme.textPrimary }}>Rol Actual</th>
                <th className="py-2.5 px-3 font-semibold" style={{ color: theme.textPrimary }}>Falla Identificada</th>
                <th className="py-2.5 px-3 font-semibold" style={{ color: theme.textPrimary }}>Acción Requerida</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.borderColor }}>
              <tr>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.textPrimary }}>Comunidad Escolar Fals Borda</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>Generador principal en tránsito</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>Baja cultura de porte y separación fuera de aulas</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.accentPrimary }}>Articulación con PRAE y brigadas estudiantiles IAP</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.textPrimary }}>Vendedores Informales</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>Suministran alimentos en empaques desechables</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>No cuentan con sistema propio de acopio ni bolsas</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.accentPrimary }}>Pacto de corresponsabilidad y transición a empaques limpios</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.textPrimary }}>UAESP y Operador de Aseo</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>Recolección domiciliaria y barrido vial</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>Ruta nocturna no coincide con la dinámica escolar diurna</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.accentPrimary }}>Ajuste de microrruta y vaciado de refuerzo a las 13:15</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.textPrimary }}>Vecinos y Comercios Locales</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>Habitantes del perímetro barrial</td>
                <td className="py-2.5 px-3" style={{ color: theme.textSecondary }}>Disposición clandestina de bolsas en postes escolares</td>
                <td className="py-2.5 px-3 font-medium" style={{ color: theme.accentPrimary }}>Mesa barrial de vigilancia comunitaria y señalización disuasoria</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
