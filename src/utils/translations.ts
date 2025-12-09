/**
 * Traducciones para la aplicación del cliente
 * Soporta: Español, Inglés, Portugués, Ruso, Alemán, Francés, Italiano, Chino
 */

export type Language = 'es' | 'en' | 'pt' | 'ru' | 'de' | 'fr' | 'it' | 'zh';

export const LANGUAGES: Record<Language, { name: string; flag: string }> = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
  pt: { name: 'Português', flag: '🇵🇹' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  fr: { name: 'Français', flag: '🇫🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  zh: { name: '中文', flag: '🇨🇳' },
};

export const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header
    'header.menu': 'Menú',
    'header.profile': 'Perfil',
    'header.table': 'Mesa',
    
    // Categories
    'category.all': '🍽️ Todos',
    'category.entradas': '🥗 Entradas',
    'category.principales': '🍖 Principales',
    'category.bebidas': '🥤 Bebidas',
    'category.postres': '🍰 Postres',
    
    // Menu items
    'menu.noItems': 'No hay platillos disponibles en esta categoría.',
    'menu.emptyState': 'No hay platillos disponibles',
    
    // Button
    'button.callWaiter': 'Llamar Mesero',
    'button.waiterNotified': 'Mesero Notificado',
    'button.backToMenu': '← Volver al Menú',
    
    // Error messages
    'error.invalidToken': 'Token QR inválido',
    'error.tableNotFound': 'Mesa no encontrada',
    'error.loadingMenu': 'Error al cargar el menú',
    'error.loading': 'Cargando...',
    
    // Profile
    'profile.restaurant': 'Restaurante',
    'profile.language': 'Idioma',
    'profile.selectLanguage': 'Seleccionar idioma',
    'profile.tableInfo': 'Información de tu Mesa',
    'profile.tableNumber': 'Número de Mesa',
    'profile.token': 'Token',
    'profile.about': 'Acerca de',
    'profile.welcome': 'Bienvenido a nuestra plataforma de pedidos digital. Aquí puedes ver el menú, realizar pedidos y comunicarte con nuestro equipo.',
  },
  en: {
    // Header
    'header.menu': 'Menu',
    'header.profile': 'Profile',
    'header.table': 'Table',
    
    // Categories
    'category.all': '🍽️ All',
    'category.entradas': '🥗 Appetizers',
    'category.principales': '🍖 Main Courses',
    'category.bebidas': '🥤 Drinks',
    'category.postres': '🍰 Desserts',
    
    // Menu items
    'menu.noItems': 'No dishes available in this category.',
    'menu.emptyState': 'No dishes available',
    
    // Button
    'button.callWaiter': 'Call Waiter',
    'button.waiterNotified': 'Waiter Notified',
    'button.backToMenu': '← Back to Menu',
    
    // Error messages
    'error.invalidToken': 'Invalid QR token',
    'error.tableNotFound': 'Table not found',
    'error.loadingMenu': 'Error loading menu',
    'error.loading': 'Loading...',
    
    // Profile
    'profile.restaurant': 'Restaurant',
    'profile.language': 'Language',
    'profile.selectLanguage': 'Select language',
    'profile.tableInfo': 'Your Table Information',
    'profile.tableNumber': 'Table Number',
    'profile.token': 'Token',
    'profile.about': 'About',
    'profile.welcome': 'Welcome to our digital ordering platform. Here you can view the menu, place orders and communicate with our team.',
  },
  pt: {
    // Header
    'header.menu': 'Cardápio',
    'header.profile': 'Perfil',
    'header.table': 'Mesa',
    
    // Categories
    'category.all': '🍽️ Todos',
    'category.entradas': '🥗 Entradas',
    'category.principais': '🍖 Pratos Principais',
    'category.bebidas': '🥤 Bebidas',
    'category.postres': '🍰 Sobremesas',
    
    // Menu items
    'menu.noItems': 'Nenhum prato disponível nesta categoria.',
    'menu.emptyState': 'Nenhum prato disponível',
    
    // Button
    'button.callWaiter': 'Chamar Garçom',
    'button.waiterNotified': 'Garçom Notificado',
    'button.backToMenu': '← Voltar ao Cardápio',
    
    // Error messages
    'error.invalidToken': 'Token QR inválido',
    'error.tableNotFound': 'Mesa não encontrada',
    'error.loadingMenu': 'Erro ao carregar cardápio',
    'error.loading': 'Carregando...',
    
    // Profile
    'profile.restaurant': 'Restaurante',
    'profile.language': 'Idioma',
    'profile.selectLanguage': 'Selecionar idioma',
    'profile.tableInfo': 'Informações de sua Mesa',
    'profile.tableNumber': 'Número da Mesa',
    'profile.token': 'Token',
    'profile.about': 'Sobre',
    'profile.welcome': 'Bem-vindo à nossa plataforma de pedidos digital. Aqui você pode visualizar o cardápio, fazer pedidos e se comunicar com nossa equipe.',
  },
  ru: {
    // Header
    'header.menu': 'Меню',
    'header.profile': 'Профиль',
    'header.table': 'Стол',
    
    // Categories
    'category.all': '🍽️ Все',
    'category.entradas': '🥗 Закуски',
    'category.principales': '🍖 Основные блюда',
    'category.bebidas': '🥤 Напитки',
    'category.postres': '🍰 Десерты',
    
    // Menu items
    'menu.noItems': 'В этой категории нет блюд.',
    'menu.emptyState': 'Блюда недоступны',
    
    // Button
    'button.callWaiter': 'Позвать официанта',
    'button.waiterNotified': 'Официант уведомлен',
    'button.backToMenu': '← Вернуться в меню',
    
    // Error messages
    'error.invalidToken': 'Недействительный QR-токен',
    'error.tableNotFound': 'Стол не найден',
    'error.loadingMenu': 'Ошибка при загрузке меню',
    'error.loading': 'Загрузка...',
    
    // Profile
    'profile.restaurant': 'Ресторан',
    'profile.language': 'Язык',
    'profile.selectLanguage': 'Выбрать язык',
    'profile.tableInfo': 'Информация о вашем столе',
    'profile.tableNumber': 'Номер стола',
    'profile.token': 'Токен',
    'profile.about': 'О',
    'profile.welcome': 'Добро пожаловать на нашу платформу цифровых заказов. Здесь вы можете просмотреть меню, разместить заказы и связаться с нашей командой.',
  },
  de: {
    // Header
    'header.menu': 'Menü',
    'header.profile': 'Profil',
    'header.table': 'Tisch',
    
    // Categories
    'category.all': '🍽️ Alle',
    'category.entradas': '🥗 Vorspeisen',
    'category.principales': '🍖 Hauptgänge',
    'category.bebidas': '🥤 Getränke',
    'category.postres': '🍰 Desserts',
    
    // Menu items
    'menu.noItems': 'Keine Gerichte in dieser Kategorie verfügbar.',
    'menu.emptyState': 'Keine Gerichte verfügbar',
    
    // Button
    'button.callWaiter': 'Kellner rufen',
    'button.waiterNotified': 'Kellner benachrichtigt',
    'button.backToMenu': '← Zurück zum Menü',
    
    // Error messages
    'error.invalidToken': 'Ungültiger QR-Token',
    'error.tableNotFound': 'Tisch nicht gefunden',
    'error.loadingMenu': 'Fehler beim Laden des Menüs',
    'error.loading': 'Wird geladen...',
    
    // Profile
    'profile.restaurant': 'Restaurant',
    'profile.language': 'Sprache',
    'profile.selectLanguage': 'Sprache wählen',
    'profile.tableInfo': 'Informationen zu Ihrem Tisch',
    'profile.tableNumber': 'Tischnummer',
    'profile.token': 'Token',
    'profile.about': 'Über',
    'profile.welcome': 'Willkommen auf unserer digitalen Bestellplattform. Hier können Sie das Menü anzeigen, Bestellungen aufgeben und mit unserem Team kommunizieren.',
  },
  fr: {
    // Header
    'header.menu': 'Menu',
    'header.profile': 'Profil',
    'header.table': 'Table',
    
    // Categories
    'category.all': '🍽️ Tous',
    'category.entradas': '🥗 Entrées',
    'category.principales': '🍖 Plats Principaux',
    'category.bebidas': '🥤 Boissons',
    'category.postres': '🍰 Desserts',
    
    // Menu items
    'menu.noItems': 'Aucun plat disponible dans cette catégorie.',
    'menu.emptyState': 'Aucun plat disponible',
    
    // Button
    'button.callWaiter': 'Appeler le Serveur',
    'button.waiterNotified': 'Serveur Notifié',
    'button.backToMenu': '← Retour au Menu',
    
    // Error messages
    'error.invalidToken': 'Jeton QR invalide',
    'error.tableNotFound': 'Table non trouvée',
    'error.loadingMenu': 'Erreur lors du chargement du menu',
    'error.loading': 'Chargement...',
    
    // Profile
    'profile.restaurant': 'Restaurant',
    'profile.language': 'Langue',
    'profile.selectLanguage': 'Sélectionner la langue',
    'profile.tableInfo': 'Informations sur votre table',
    'profile.tableNumber': 'Numéro de table',
    'profile.token': 'Jeton',
    'profile.about': 'À propos',
    'profile.welcome': 'Bienvenue sur notre plateforme de commande numérique. Ici, vous pouvez consulter le menu, passer des commandes et communiquer avec notre équipe.',
  },
  it: {
    // Header
    'header.menu': 'Menu',
    'header.profile': 'Profilo',
    'header.table': 'Tavolo',
    
    // Categories
    'category.all': '🍽️ Tutti',
    'category.entradas': '🥗 Antipasti',
    'category.principales': '🍖 Piatti Principali',
    'category.bebidas': '🥤 Bevande',
    'category.postres': '🍰 Dolci',
    
    // Menu items
    'menu.noItems': 'Nessun piatto disponibile in questa categoria.',
    'menu.emptyState': 'Nessun piatto disponibile',
    
    // Button
    'button.callWaiter': 'Chiama Cameriere',
    'button.waiterNotified': 'Cameriere Notificato',
    'button.backToMenu': '← Torna al Menu',
    
    // Error messages
    'error.invalidToken': 'Token QR non valido',
    'error.tableNotFound': 'Tavolo non trovato',
    'error.loadingMenu': 'Errore nel caricamento del menu',
    'error.loading': 'Caricamento...',
    
    // Profile
    'profile.restaurant': 'Ristorante',
    'profile.language': 'Lingua',
    'profile.selectLanguage': 'Seleziona lingua',
    'profile.tableInfo': 'Informazioni del tuo tavolo',
    'profile.tableNumber': 'Numero tavolo',
    'profile.token': 'Token',
    'profile.about': 'Chi siamo',
    'profile.welcome': 'Benvenuto sulla nostra piattaforma di ordinazione digitale. Qui puoi visualizzare il menu, effettuare ordini e comunicare con il nostro team.',
  },
  zh: {
    // Header
    'header.menu': '菜单',
    'header.profile': '个人资料',
    'header.table': '餐桌',
    
    // Categories
    'category.all': '🍽️ 全部',
    'category.entradas': '🥗 开胃菜',
    'category.principales': '🍖 主菜',
    'category.bebidas': '🥤 饮料',
    'category.postres': '🍰 甜点',
    
    // Menu items
    'menu.noItems': '此类别中没有可用的菜肴。',
    'menu.emptyState': '没有可用菜肴',
    
    // Button
    'button.callWaiter': '呼叫服务员',
    'button.waiterNotified': '服务员已通知',
    'button.backToMenu': '← 返回菜单',
    
    // Error messages
    'error.invalidToken': '无效的二维码令牌',
    'error.tableNotFound': '找不到餐桌',
    'error.loadingMenu': '加载菜单出错',
    'error.loading': '加载中...',
    
    // Profile
    'profile.restaurant': '餐厅',
    'profile.language': '语言',
    'profile.selectLanguage': '选择语言',
    'profile.tableInfo': '您的餐桌信息',
    'profile.tableNumber': '桌号',
    'profile.token': '令牌',
    'profile.about': '关于',
    'profile.welcome': '欢迎来到我们的数字订购平台。在这里，您可以查看菜单、下订单并与我们的团队交流。',
  },
};

/**
 * Obtiene una traducción
 */
export const t = (key: string, language: Language): string => {
  return translations[language]?.[key] || translations.es[key] || key;
};

/**
 * Obtiene el idioma almacenado o usa el del navegador
 */
export const getDefaultLanguage = (): Language => {
  const stored = localStorage.getItem('language') as Language;
  if (stored && Object.keys(LANGUAGES).includes(stored)) {
    return stored;
  }
  
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs = Object.keys(LANGUAGES) as Language[];
  return (supportedLangs.includes(browserLang as Language) ? browserLang : 'es') as Language;
};

/**
 * Guarda el idioma en localStorage
 */
export const setLanguage = (lang: Language): void => {
  localStorage.setItem('language', lang);
};
