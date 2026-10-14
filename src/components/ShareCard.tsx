import React, { useEffect, useState } from 'react';

/**
 * Renders a finished card SVG. The SVG is shown through a blob URL
 * rather than inlined, so the preview is byte-for-byte the same
 * document that gets exported, and its embedded @font-face rules
 * cannot leak into the app.
 */
export const ShareCard: React.FC<{ svg: string; width: number; height: number; alt?: string }> = ({
  svg,
  width,
  height,
  alt = 'Shareable card',
}) => {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    if (!svg) return;
    const u = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [svg]);

  if (!url) return <div style={{ width, height }} aria-hidden="true" />;
  return <img src={url} width={width} height={height} alt={alt} style={{ display: 'block' }} />;
};
