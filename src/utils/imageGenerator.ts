/**
 * Generate image URLs for menu items based on their names and categories
 * Uses emoji + gradient backgrounds as placeholder images
 */

export const getMenuItemImage = (name: string, category: string): string => {
  const emoji = getEmojiForFood(name, category);
  const color = getColorForCategory(category);
  
  // Create a simple SVG-based image with emoji and background
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color.from};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color.to};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad)"/>
      <text x="200" y="150" font-size="120" text-anchor="middle" dominant-baseline="central">${emoji}</text>
    </svg>
  `;
  
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
};

const getEmojiForFood = (name: string, category: string): string => {
  const lowerName = name.toLowerCase();
  
  // Category-based emojis
  if (category === 'entradas') {
    if (lowerName.includes('ensalada')) return '🥗';
    if (lowerName.includes('sopa')) return '🍲';
    if (lowerName.includes('tabla')) return '🍽️';
    if (lowerName.includes('queso')) return '🧀';
    if (lowerName.includes('camarones')) return '🦐';
    if (lowerName.includes('pan')) return '🥖';
    return '🥙';
  }
  
  if (category === 'principales') {
    if (lowerName.includes('pollo')) return '🍗';
    if (lowerName.includes('carne')) return '🥩';
    if (lowerName.includes('pescado') || lowerName.includes('pez')) return '🐟';
    if (lowerName.includes('pasta')) return '🍝';
    if (lowerName.includes('arroz')) return '🍚';
    if (lowerName.includes('tacos')) return '🌮';
    if (lowerName.includes('hamburguesa')) return '🍔';
    if (lowerName.includes('filete')) return '🥓';
    return '🍖';
  }
  
  if (category === 'bebidas') {
    if (lowerName.includes('vino')) return '🍷';
    if (lowerName.includes('cerveza')) return '🍺';
    if (lowerName.includes('cocktail') || lowerName.includes('cóctel')) return '🍸';
    if (lowerName.includes('agua')) return '💧';
    if (lowerName.includes('jugo') || lowerName.includes('zumo')) return '🧃';
    if (lowerName.includes('café')) return '☕';
    if (lowerName.includes('té')) return '🫖';
    if (lowerName.includes('refrescos')) return '🥤';
    return '🥤';
  }
  
  if (category === 'postres') {
    if (lowerName.includes('chocolate')) return '🍫';
    if (lowerName.includes('flan') || lowerName.includes('pudin')) return '🍮';
    if (lowerName.includes('helado')) return '🍦';
    if (lowerName.includes('pastel')) return '🎂';
    if (lowerName.includes('fresas')) return '🍓';
    if (lowerName.includes('plátano')) return '🍌';
    if (lowerName.includes('manzana')) return '🍎';
    return '🍰';
  }
  
  return '🍽️';
};

const getColorForCategory = (category: string): { from: string; to: string } => {
  const colors: Record<string, { from: string; to: string }> = {
    'entradas': { from: '#10b981', to: '#059669' },        // Green
    'principales': { from: '#ef4444', to: '#dc2626' },     // Red
    'bebidas': { from: '#3b82f6', to: '#1d4ed8' },         // Blue
    'postres': { from: '#f43f5e', to: '#e11d48' },         // Pink
  };
  
  return colors[category] || { from: '#8b5cf6', to: '#6d28d9' }; // Purple fallback
};

/**
 * Alternative: Use external image API (like Lorem Picsum or custom)
 * This would require a backend that generates or stores images
 */
export const getMenuItemImageURL = (itemId: string): string => {
  // If we have a backend endpoint, use it
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  return `${API_URL}/menu/${itemId}/image`;
};

/**
 * Fallback to a color gradient or pattern
 */
export const getPlaceholderColor = (category: string): string => {
  const colors: Record<string, string> = {
    'entradas': '#10b98166',
    'principales': '#ef444466',
    'bebidas': '#3b82f666',
    'postres': '#f43f5e66',
  };
  
  return colors[category] || '#8b5cf666';
};
