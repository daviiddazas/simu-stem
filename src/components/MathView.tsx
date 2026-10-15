/**
 * Componente para renderizado de Ecuaciones Matemáticas en formato LaTeX / HTML Matemático
 * Colegio Orlando Fals Borda - EcoLab
 * Renderiza tipografía matemática real con fracciones, integrales, subíndices y signos.
 */

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  latex: string;
  displayMode?: boolean; // true = bloque centrado grande, false = inline
  className?: string;
  style?: React.CSSProperties;
}

export const MathView: React.FC<MathViewProps> = ({
  latex,
  displayMode = true,
  className = '',
  style,
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.warn('Error rendering KaTeX:', err);
      return `<span class="font-serif italic">${latex}</span>`;
    }
  }, [latex, displayMode]);

  return (
    <div
      className={`katex-math-wrapper overflow-x-auto py-1 ${className}`}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const InlineMath: React.FC<{ latex: string; className?: string }> = ({
  latex,
  className = '',
}) => {
  return <MathView latex={latex} displayMode={false} className={`inline-block ${className}`} />;
};
