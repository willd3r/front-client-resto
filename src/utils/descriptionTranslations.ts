/**
 * Traducciones de descripciones de items del menú
 * Se usa para traducir dinámicamente las descripciones según el idioma seleccionado
 */

import type { Language } from './translations';

type DescriptionMap = Record<string, Record<Language, string>>;

export const descriptionTranslations: DescriptionMap = {
  // Pollo Asado
  'Pollo jugoso a la parrilla con especias': {
    es: 'Pollo jugoso a la parrilla con especias',
    en: 'Juicy grilled chicken with spices',
    pt: 'Frango suculento grelhado com especiarias',
    ru: 'Сочная жареная курица со специями',
    de: 'Saftiges gegrilltes Hähnchen mit Gewürzen',
    fr: 'Poulet grillé savoureux avec des épices',
    it: 'Pollo succulento alla griglia con spezie',
    zh: '多汁的烤鸡配香料',
  },

  // Ensalada Mixta
  'Mezcla fresca de vegetales de temporada': {
    es: 'Mezcla fresca de vegetales de temporada',
    en: 'Fresh mix of seasonal vegetables',
    pt: 'Mistura fresca de vegetais da estação',
    ru: 'Свежая смесь сезонных овощей',
    de: 'Frische Mischung aus saisonalem Gemüse',
    fr: 'Mélange frais de légumes de saison',
    it: 'Fresco mix di verdure di stagione',
    zh: '新鲜的季节蔬菜混合',
  },

  // Pasta Carbonara
  'Pasta tradicional italiana con salsa de huevo y panceta': {
    es: 'Pasta tradicional italiana con salsa de huevo y panceta',
    en: 'Traditional Italian pasta with egg sauce and bacon',
    pt: 'Massa italiana tradicional com molho de ovo e bacon',
    ru: 'Традиционная итальянская паста с яичным соусом и беконом',
    de: 'Traditionelle italienische Pasta mit Eiersauce und Speck',
    fr: 'Pâtes italiennes traditionnelles avec sauce aux œufs et bacon',
    it: 'Pasta italiana tradizionale con salsa di uova e pancetta',
    zh: '传统意大利面配鸡蛋酱和培根',
  },

  // Ceviche
  'Pescado fresco marinado en limón con cilantro': {
    es: 'Pescado fresco marinado en limón con cilantro',
    en: 'Fresh fish marinated in lemon with cilantro',
    pt: 'Peixe fresco marinado em limão com coentro',
    ru: 'Свежая рыба, маринованная в лимоне с кориандром',
    de: 'Frischer Fisch in Zitrone mariniert mit Koriander',
    fr: 'Poisson frais mariné au citron avec coriandre',
    it: 'Pesce fresco marinato al limone con coriandolo',
    zh: '新鲜鱼类用柠檬和香菜腌制',
  },

  // Camarones al Ajillo
  'Camarones frescos cocinados con ajo y mantequilla': {
    es: 'Camarones frescos cocinados con ajo y mantequilla',
    en: 'Fresh shrimp cooked with garlic and butter',
    pt: 'Camarão fresco cozido com alho e manteiga',
    ru: 'Свежие креветки готовятся с чесноком и маслом',
    de: 'Frische Garnelen mit Knoblauch und Butter gekocht',
    fr: 'Crevettes fraîches cuites à l\'ail et au beurre',
    it: 'Gamberetti freschi cotti con aglio e burro',
    zh: '用大蒜和黄油烹制的新鲜虾',
  },

  // Lomo Saltado
  'Carne de res salteada con papas, cebolla y tomate': {
    es: 'Carne de res salteada con papas, cebolla y tomate',
    en: 'Stir-fried beef with potatoes, onion and tomato',
    pt: 'Carne refogada com batatas, cebola e tomate',
    ru: 'Обжаренная говядина с картофелем, луком и помидорами',
    de: 'Gebratenes Rindfleisch mit Kartoffeln, Zwiebeln und Tomaten',
    fr: 'Bœuf sauté avec pommes de terre, oignons et tomates',
    it: 'Manzo saltato in padella con patate, cipolla e pomodoro',
    zh: '炒牛肉配土豆、洋葱和番茄',
  },

  // Coca Cola
  'Bebida refrescante carbonatada': {
    es: 'Bebida refrescante carbonatada',
    en: 'Refreshing carbonated beverage',
    pt: 'Bebida refrescante carbonatada',
    ru: 'Освежающий газированный напиток',
    de: 'Erfrischendes kohlensäurehaltiges Getränk',
    fr: 'Boisson gazeuse rafraîchissante',
    it: 'Bevanda rinfrescante gassata',
    zh: '清爽的碳酸饮料',
  },

  // Agua
  'Agua purificada natural': {
    es: 'Agua purificada natural',
    en: 'Natural purified water',
    pt: 'Água purificada natural',
    ru: 'Натуральная очищенная вода',
    de: 'Natürlich gereinigtes Wasser',
    fr: 'Eau naturelle purifiée',
    it: 'Acqua naturale purificata',
    zh: '天然纯净水',
  },

  // Jugo Natural
  'Jugo fresco de frutas de temporada': {
    es: 'Jugo fresco de frutas de temporada',
    en: 'Fresh seasonal fruit juice',
    pt: 'Suco fresco de frutas da estação',
    ru: 'Свежий сок из сезонных фруктов',
    de: 'Frischer Saft aus saisonalem Obst',
    fr: 'Jus frais de fruits de saison',
    it: 'Succo fresco di frutta di stagione',
    zh: '新鲜的季节性果汁',
  },

  // Tiramisú
  'Postre italiano con capas de mascarpone y café': {
    es: 'Postre italiano con capas de mascarpone y café',
    en: 'Italian dessert with mascarpone and coffee layers',
    pt: 'Sobremesa italiana com camadas de mascarpone e café',
    ru: 'Итальянский десерт со слоями маскарпоне и кофе',
    de: 'Italienisches Dessert mit Mascarpone- und Kaffeeschichten',
    fr: 'Dessert italien avec couches de mascarpone et café',
    it: 'Dolce italiano con strati di mascarpone e caffè',
    zh: '意大利甜点配玛斯卡彭芝士和咖啡层',
  },

  // Flan
  'Postre cremoso de vainilla con dulce de leche': {
    es: 'Postre cremoso de vainilla con dulce de leche',
    en: 'Creamy vanilla dessert with caramel',
    pt: 'Sobremesa cremosa de baunilha com caramelo',
    ru: 'Кремовый ванильный десерт с карамелью',
    de: 'Cremiger Vanillepudding mit Karamell',
    fr: 'Dessert à la vanille crémeuse avec caramel',
    it: 'Dolce cremoso alla vaniglia con caramello',
    zh: '奶油香草甜点配焦糖',
  },

  // Brownie de Chocolate
  'Brownie casero de chocolate oscuro': {
    es: 'Brownie casero de chocolate oscuro',
    en: 'Homemade dark chocolate brownie',
    pt: 'Brownie caseiro de chocolate escuro',
    ru: 'Домашний брауни из темного шоколада',
    de: 'Selbstgebackener Brownie aus dunkler Schokolade',
    fr: 'Brownie maison au chocolat noir',
    it: 'Brownie fatto in casa al cioccolato fondente',
    zh: '自制黑巧克力布朗尼',
  },

  // Helado
  'Helado casero con sabores variados': {
    es: 'Helado casero con sabores variados',
    en: 'Homemade ice cream with varied flavors',
    pt: 'Sorvete caseiro com sabores variados',
    ru: 'Домашнее мороженое с различными вкусами',
    de: 'Selbstgemachtes Eis mit verschiedenen Geschmacksrichtungen',
    fr: 'Crème glacée maison avec saveurs variées',
    it: 'Gelato fatto in casa con gusti vari',
    zh: '自制冰淇淋配多种口味',
  },
};

/**
 * Obtiene la descripción traducida de un item
 * Si no encuentra traducción, devuelve la descripción original
 */
export const getTranslatedDescription = (
  originalDescription: string,
  language: Language
): string => {
  // Buscar si existe traducción para esta descripción
  const translations = descriptionTranslations[originalDescription];
  
  if (translations && translations[language]) {
    return translations[language];
  }
  
  // Si no hay traducción, devolver la original
  return originalDescription;
};
