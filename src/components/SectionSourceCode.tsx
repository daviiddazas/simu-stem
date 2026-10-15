/**
 * Sección 4: Entorno de Simulación Interactiva (Código Frontend Autónomo)
 * Vista interactiva del prototipo sin botones de copia ni descarga.
 */

import React, { useState } from 'react';
import { ColorMode, ThemeId } from '../types';
import { getTheme } from '../utils/themeConfig';
import { STANDALONE_SIMULATION_HTML } from '../utils/standaloneCode';
import { Eye, Code2 } from 'lucide-react';

interface SectionSourceCodeProps {
  themeId: ThemeId;
  colorMode: ColorMode;
}

export const SectionSourceCode: React.FC<SectionSourceCodeProps> = ({ themeId, colorMode }) => {
  const theme = getTheme(themeId, colorMode);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

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
            Sección 4 · Entorno del Prototipo
          </span>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            Solución Autónoma en Bloque Único (HTML / CSS / JS)
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: theme.textPrimary }}>
          Prototipo Funcional de Simulación en Entorno Seguro
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
          A continuación se presenta el prototipo interactivo autosuficiente integrado en un bloque HTML limpio. Cuenta con su propio panel de selección de ambientes escolares, selector de modos suaves y motor numérico de balance de masa $dS/dt$, visualizable directamente en el navegador.
        </p>

        {/* Selector de Vista: Previa o Código */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: theme.borderColor }}>
          <div
            className="flex items-center gap-1 p-0.5 rounded-xl border text-xs"
            style={{ borderColor: theme.borderColor, backgroundColor: theme.bgPanel }}
          >
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-medium ${
                viewMode === 'preview' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: viewMode === 'preview' ? theme.bgSurface : 'transparent',
                color: viewMode === 'preview' ? theme.textPrimary : theme.textSecondary,
              }}
            >
              <Eye className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
              Vista Previa Integrada
            </button>

            <button
              onClick={() => setViewMode('code')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-medium ${
                viewMode === 'code' ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: viewMode === 'code' ? theme.bgSurface : 'transparent',
                color: viewMode === 'code' ? theme.textPrimary : theme.textSecondary,
              }}
            >
              <Code2 className="w-3.5 h-3.5" style={{ color: theme.accentPrimary }} />
              Estructura del Código Fuente
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor de Vista Previa o Código (sin botones de copiar ni descargar) */}
      {viewMode === 'preview' ? (
        <div
          className="rounded-2xl border overflow-hidden shadow-sm"
          style={{ borderColor: theme.borderColor, backgroundColor: theme.bgSurface }}
        >
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono"
            style={{ borderColor: theme.borderColor, backgroundColor: theme.bgPanel, color: theme.textSecondary }}
          >
            <span>Ejecución del sandbox autónomo</span>
            <span style={{ color: theme.accentPrimary }} className="font-semibold">
              ● Simulación en vivo
            </span>
          </div>
          <iframe
            title="Prototipo Autónomo"
            srcDoc={STANDALONE_SIMULATION_HTML}
            className="w-full h-[620px] border-0 block"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden shadow-sm"
          style={{
            borderColor: theme.borderColor,
            backgroundColor: colorMode === 'oscuro' ? '#121714' : '#1E242B',
          }}
        >
          <div
            className="px-4 py-2.5 border-b border-slate-700/60 flex items-center justify-between text-xs font-mono text-slate-300"
            style={{ backgroundColor: colorMode === 'oscuro' ? '#171E19' : '#14181E' }}
          >
            <span>index.html (HTML5 + CSS3 + Canvas JavaScript)</span>
            <span className="opacity-75">{STANDALONE_SIMULATION_HTML.length} caracteres</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[580px] leading-relaxed selection:bg-emerald-900/60">
            <code>{STANDALONE_SIMULATION_HTML}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
