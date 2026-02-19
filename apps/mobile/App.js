import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, SafeAreaView,
  StatusBar, Linking, LayoutAnimation, Platform, UIManager, ImageBackground, Animated,
  Share, Alert, Dimensions, Image, Keyboard
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG LINE ICON SYSTEM  (inline SVG via react-native-svg)
// Streamline-style: 1.5px stroke, round caps, no fill
// Falls back gracefully if react-native-svg not installed
// ─────────────────────────────────────────────────────────────────────────────
let Svg, Path, Circle, Line, Polyline, Polygon, Rect, G;
try {
  const rnsvg = require('react-native-svg');
  Svg = rnsvg.Svg; Path = rnsvg.Path; Circle = rnsvg.Circle;
  Line = rnsvg.Line; Polyline = rnsvg.Polyline; Polygon = rnsvg.Polygon;
  Rect = rnsvg.Rect; G = rnsvg.G;
} catch (_) {
  // react-native-svg not available — icons render as styled Text fallback
}

const ICON_DEFAULTS = { size: 20, color: '#1F1F1F', strokeWidth: 1.5 };

function Icon({ name, size = ICON_DEFAULTS.size, color = ICON_DEFAULTS.color, strokeWidth = ICON_DEFAULTS.strokeWidth }) {
  if (!Svg) {
    // Elegant text fallback
    const FALLBACK = {
      search: '⌕', location: '◎', filter: '⊟', sort: '≡', map: '◈',
      star: '★', bookmark: '♡', bookmarkFilled: '♥', share: '↗',
      back: '‹', close: '×', check: '✓', plus: '+', minus: '−',
      phone: '☎', whatsapp: 'W', web: '↗', directions: '→',
      clock: '○', payment: '$', wifi: '◉', parking: 'P',
      delivery: '⚡', wheelchair: '♿', outdoor: '◐', reservation: '◷',
      camera: '⊙', like: '↑', moon: '◑', sun: '○', bell: '◔',
      analytics: '▦', crown: '♛', verified: '✓', live: '●',
      restaurant: '⋈', medical: '+', shopping: '⊡', services: '⚙',
      tag: '⊛', fire: '▲', user: '○', checkin: '◉', save: '◈',
      portfolio: '◈', remote: '⌂', certified: '✓', flexible: '◷',
      online: '◉', appointment: '◷', professional: '▪', warning: '△',
      arrow: '→', chevronDown: '∨', chevronRight: '›', info: 'ⓘ',
      heart: '♡', heartFilled: '♥', edit: '✎', trash: '⊠',
    };
    return <Text style={{ fontSize: size * 0.8, color, lineHeight: size }}>{FALLBACK[name] || '○'}</Text>;
  }

  const s = size;
  const sw = strokeWidth;
  const c = color;
  const base = { stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };

  const icons = {
    search:    <G {...base}><Circle cx="11" cy="11" r="8"/><Line x1="21" y1="21" x2="16.65" y2="16.65"/></G>,
    location:  <G {...base}><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><Circle cx="12" cy="10" r="3"/></G>,
    filter:    <G {...base}><Polyline points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></G>,
    sort:      <G {...base}><Line x1="3" y1="6" x2="21" y2="6"/><Line x1="3" y1="12" x2="15" y2="12"/><Line x1="3" y1="18" x2="9" y2="18"/></G>,
    map:       <G {...base}><Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><Line x1="8" y1="2" x2="8" y2="18"/><Line x1="16" y1="6" x2="16" y2="22"/></G>,
    star:      <G {...base}><Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill={c}/></G>,
    starEmpty: <G {...base}><Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></G>,
    bookmark:  <G {...base}><Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></G>,
    bookmarkFilled: <G {...base}><Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill={c}/></G>,
    share:     <G {...base}><Circle cx="18" cy="5" r="3"/><Circle cx="6" cy="12" r="3"/><Circle cx="18" cy="19" r="3"/><Line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><Line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></G>,
    back:      <G {...base}><Polyline points="15 18 9 12 15 6"/></G>,
    close:     <G {...base}><Line x1="18" y1="6" x2="6" y2="18"/><Line x1="6" y1="6" x2="18" y2="18"/></G>,
    check:     <G {...base}><Polyline points="20 6 9 17 4 12"/></G>,
    phone:     <G {...base}><Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></G>,
    whatsapp:  <G {...base}><Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></G>,
    web:       <G {...base}><Circle cx="12" cy="12" r="10"/><Line x1="2" y1="12" x2="22" y2="12"/><Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></G>,
    directions:<G {...base}><Polygon points="3 11 22 2 13 21 11 13 3 11"/></G>,
    clock:     <G {...base}><Circle cx="12" cy="12" r="10"/><Polyline points="12 6 12 12 16 14"/></G>,
    payment:   <G {...base}><Rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><Line x1="1" y1="10" x2="23" y2="10"/></G>,
    wifi:      <G {...base}><Path d="M5 12.55a11 11 0 0 1 14.08 0"/><Path d="M1.42 9a16 16 0 0 1 21.16 0"/><Path d="M8.53 16.11a6 16 0 0 1 6.95 0"/><Line x1="12" y1="20" x2="12.01" y2="20"/></G>,
    parking:   <G {...base}><Rect x="3" y="3" width="18" height="18" rx="2"/><Path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></G>,
    delivery:  <G {...base}><Rect x="1" y="3" width="15" height="13"/><Polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><Circle cx="5.5" cy="18.5" r="2.5"/><Circle cx="18.5" cy="18.5" r="2.5"/></G>,
    wheelchair:<G {...base}><Circle cx="12" cy="4" r="2"/><Path d="M14 12H9l-1-4H6"/><Path d="M9 12v6"/><Path d="M14 18H9"/><Circle cx="17" cy="19" r="3"/></G>,
    outdoor:   <G {...base}><Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><Polyline points="9 22 9 12 15 12 15 22"/></G>,
    reservation:<G {...base}><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><Line x1="16" y1="2" x2="16" y2="6"/><Line x1="8" y1="2" x2="8" y2="6"/><Line x1="3" y1="10" x2="21" y2="10"/></G>,
    camera:    <G {...base}><Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><Circle cx="12" cy="13" r="4"/></G>,
    like:      <G {...base}><Path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></G>,
    moon:      <G {...base}><Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></G>,
    sun:       <G {...base}><Circle cx="12" cy="12" r="5"/><Line x1="12" y1="1" x2="12" y2="3"/><Line x1="12" y1="21" x2="12" y2="23"/><Line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><Line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><Line x1="1" y1="12" x2="3" y2="12"/><Line x1="21" y1="12" x2="23" y2="12"/><Line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><Line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></G>,
    bell:      <G {...base}><Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><Path d="M13.73 21a2 2 0 0 1-3.46 0"/></G>,
    analytics: <G {...base}><Line x1="18" y1="20" x2="18" y2="10"/><Line x1="12" y1="20" x2="12" y2="4"/><Line x1="6" y1="20" x2="6" y2="14"/></G>,
    crown:     <G {...base}><Polyline points="2 4 12 14 22 4"/><Polyline points="2 4 2 20 22 20 22 4"/></G>,
    verified:  <G {...base}><Polyline points="20 6 9 17 4 12"/></G>,
    live:      <G {...base}><Circle cx="12" cy="12" r="10"/><Circle cx="12" cy="12" r="3" fill={c}/></G>,
    tag:       <G {...base}><Path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><Line x1="7" y1="7" x2="7.01" y2="7"/></G>,
    fire:      <G {...base}><Path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></G>,
    user:      <G {...base}><Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><Circle cx="12" cy="7" r="4"/></G>,
    checkin:   <G {...base}><Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><Circle cx="12" cy="10" r="3"/></G>,
    save:      <G {...base}><Circle cx="12" cy="12" r="10"/><Line x1="12" y1="8" x2="12" y2="16"/><Line x1="8" y1="12" x2="16" y2="12"/></G>,
    remote:    <G {...base}><Rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><Line x1="8" y1="21" x2="16" y2="21"/><Line x1="12" y1="17" x2="12" y2="21"/></G>,
    certified: <G {...base}><Circle cx="12" cy="8" r="6"/><Path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></G>,
    portfolio: <G {...base}><Rect x="3" y="3" width="18" height="18" rx="2"/><Line x1="3" y1="9" x2="21" y2="9"/><Line x1="9" y1="21" x2="9" y2="9"/></G>,
    fastdelivery:<G {...base}><Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></G>,
    online:    <G {...base}><Circle cx="12" cy="12" r="2"/><Path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></G>,
    appointment:<G {...base}><Rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><Line x1="16" y1="2" x2="16" y2="6"/><Line x1="8" y1="2" x2="8" y2="6"/><Line x1="3" y1="10" x2="21" y2="10"/><Polyline points="12 14 12 18 15 18"/></G>,
    professional:<G {...base}><Rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></G>,
    hotel:     <G {...base}><Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><Path d="M9 22V12h6v10"/></G>,
    arrow:     <G {...base}><Line x1="5" y1="12" x2="19" y2="12"/><Polyline points="12 5 19 12 12 19"/></G>,
    minus:     <G {...base}><Line x1="5" y1="12" x2="19" y2="12"/></G>,
    plus:      <G {...base}><Line x1="12" y1="5" x2="12" y2="19"/><Line x1="5" y1="12" x2="19" y2="12"/></G>,
    chevronDown:<G {...base}><Polyline points="6 9 12 15 18 9"/></G>,
    chevronRight:<G {...base}><Polyline points="9 18 15 12 9 6"/></G>,
    heart:     <G {...base}><Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></G>,
    heartFilled:<G {...base}><Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={c}/></G>,
    info:      <G {...base}><Circle cx="12" cy="12" r="10"/><Line x1="12" y1="16" x2="12" y2="12"/><Line x1="12" y1="8" x2="12.01" y2="8"/></G>,
    open:      <G {...base}><Polyline points="22 11.08 22 12 12 22 2 12 2 11.08"/><Polyline points="22 2 12 12 2 2"/></G>,
  };

  const paths = icons[name];
  if (!paths) return <Text style={{ fontSize: size * 0.8, color }}>{name?.[0]?.toUpperCase() || '?'}</Text>;
  return <Svg width={s} height={s} viewBox="0 0 24 24">{paths}</Svg>;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper: Validate business hours and calculate closing time
const getBusinessStatus = (statusText, isOpen) => {
  if (!statusText || !statusText.includes('ate')) return { isClosed: !isOpen, minsLeft: null };
  
  const match = statusText.match(/ate (\d{2}):(\d{2})/);
  if (!match) return { isClosed: !isOpen, minsLeft: null };
  
  const now = new Date();
  const [, hours, minutes] = match;
  const closing = new Date();
  closing.setHours(parseInt(hours), parseInt(minutes), 0);
  
  const diffMs = closing - now;
  
  // If past closing time, mark as closed
  if (diffMs < 0) {
    return { isClosed: true, minsLeft: null };
  }
  
  // If within 30 min of closing, show countdown
  if (diffMs <= 30 * 60 * 1000) {
    const minsLeft = Math.floor(diffMs / 60000);
    return { isClosed: false, minsLeft: minsLeft > 0 ? minsLeft : 0 };
  }
  
  // Otherwise, normal open status
  return { isClosed: false, minsLeft: null };
};

const VERSION_LOG = {
  version: 'v2.4.2',
  summary: 'v2.1.6: Validates business hours — shows Fechado (red) if current time is past closing time.',
};

const COLORS = {
  red: '#D32323',
  redLight: '#FFF0F0',
  white: '#FFFFFF',
  grayBg: '#F7F7F8',
  grayLine: '#EBEBEB',
  grayText: '#8A8A8A',
  darkText: '#111111',
  green: '#22A06B',
  heroOverlay: 'rgba(0,0,0,0.40)',
  mapBg: '#ECEFF3',
  cardShadow: '#00000012',
};

const TOP_BAR_HEIGHT = 52;
const BASE_TABS = ['Informacoes', 'Avaliacoes', 'Mais'];
const DEFAULT_SERVICES = ['Entrega', 'Reservas', 'WiFi'];
const DEFAULT_HOURS = ['Seg-Sex 09:00 - 21:00', 'Sab 10:00 - 22:00', 'Dom 10:00 - 18:00'];
const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const WEEKDAY_KEYS  = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const TRENDING_SEARCHES = ['Pizza', 'Cafe', 'Farmacia 24h', 'Restaurante angolano', 'Barbearia'];
const AUTOCOMPLETE_SUGGESTIONS = ['Pizzaria','Pizza delivery','Pastelaria','Farmacia','Farmacia 24h','Cafe','Cafeteria','Restaurante','Restaurante italiano','Restaurante angolano','Barbearia','Supermercado'];

const CATEGORIES = [
  { id: 'restaurants', label: 'Restaurantes',   icon: 'fire'         },
  { id: 'delivery',    label: 'Delivery',       icon: 'delivery'     },
  { id: 'hotels',      label: 'Hotéis',         icon: 'hotel'        },
  { id: 'shopping',    label: 'Compras',        icon: 'payment'      },
  { id: 'health',      label: 'Saúde',          icon: 'certified'    },
  { id: 'services',    label: 'Serviços',       icon: 'professional' },
  { id: 'more',        label: 'Mais',           icon: 'chevronRight' }, // ← Trigger modal
];

// Full category hierarchy (Yelp-style)
const ALL_CATEGORIES = [
  { section: 'Popular', items: [
    { id: 'accountants',    label: 'Contabilistas',        icon: 'payment'  },
    { id: 'handyman',       label: 'Faz-tudo',             icon: 'professional' },
    { id: 'electricians',   label: 'Eletricistas',         icon: 'certified' },
  ]},
  { section: 'Lanches e bebidas', items: [
    { id: 'coffee',         label: 'Café e chá',           icon: 'fire' },
    { id: 'bars',           label: 'Bares',                icon: 'fire' },
    { id: 'icecream',       label: 'Doçaria',              icon: 'fire' },
  ]},
  { section: 'Spas e salões de beleza', items: [
    { id: 'beautysalons',   label: 'Salões de beleza',     icon: 'certified' },
    { id: 'massage',        label: 'Massagistas',          icon: 'certified' },
    { id: 'spas',           label: 'Spas',                 icon: 'certified' },
  ]},
  { section: 'Serviços de automóveis', items: [
    { id: 'carwash',        label: 'Lavagem automóvel',    icon: 'delivery' },
    { id: 'mechanics',      label: 'Mecânicos',            icon: 'professional' },
    { id: 'gasstations',    label: 'Postos de gasolina',   icon: 'location' },
  ]},
  { section: 'Todas as categorias', items: [
    { id: 'restaurants',    label: 'Restaurantes',         icon: 'fire' },
    { id: 'nightlife',      label: 'Vida noturna',         icon: 'moon' },
    { id: 'shopping',       label: 'Compras',              icon: 'payment' },
    { id: 'food',           label: 'Comida',               icon: 'fire' },
    { id: 'health',         label: 'Saúde & Medicina',     icon: 'certified' },
    { id: 'beauty',         label: 'Beleza & Spas',        icon: 'certified' },
    { id: 'homeservices',   label: 'Serviços residenciais',icon: 'professional' },
    { id: 'localservices',  label: 'Serviços Locais',      icon: 'professional' },
    { id: 'eventplanning',  label: 'Planejamento de Eventos', icon: 'reservation' },
    { id: 'arts',           label: 'Artes & Entretenimento', icon: 'star' },
    { id: 'active',         label: 'Vida Ativa',           icon: 'outdoor' },
    { id: 'professional',   label: 'Serviços Profissionais', icon: 'professional' },
    { id: 'automotive',     label: 'Veículos',             icon: 'delivery' },
    { id: 'hotelsTravel',   label: 'Hotéis & Viagem',      icon: 'hotel' },
    { id: 'education',      label: 'Educação',             icon: 'certified' },
    { id: 'pets',           label: 'Animais de Estimação', icon: 'heart' },
    { id: 'financial',      label: 'Serviços Financeiros', icon: 'payment' },
    { id: 'localflavor',    label: 'Tesouros Locais',      icon: 'star' },
    { id: 'public',         label: 'Serviços Públicos',    icon: 'info' },
    { id: 'massmedia',      label: 'Meios de Comunicação', icon: 'web' },
    { id: 'religious',      label: 'Organizações Religiosas', icon: 'info' },
  ]},
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recomendado'    },
  { id: 'distance',    label: 'Mais proximo'   },
  { id: 'rating',      label: 'Melhor avaliado'},
  { id: 'reviews',     label: 'Mais comentado' },
];

const PRICE_FILTERS = [
  { id: 'all', label: 'Qualquer preço',  levels: [1,2,3,4] },
  { id: '1',   label: 'Económico',      levels: [1],       symbol: 'Kz'     },
  { id: '2',   label: 'Moderado',       levels: [1,2],     symbol: 'Kz Kz'  },
  { id: '3',   label: 'Elevado',        levels: [1,2,3],   symbol: 'Kz Kz Kz' },
  { id: '4',   label: 'Luxo',          levels: [1,2,3,4], symbol: 'Kz Kz Kz Kz' },
];

const DISTANCE_FILTERS = [
  { id: 'all', label: 'Qualquer distancia', max: 999 },
  { id: '1',   label: 'Ate 1 km',          max: 1   },
  { id: '2',   label: 'Ate 2 km',          max: 2   },
  { id: '5',   label: 'Ate 5 km',          max: 5   },
  { id: '10',  label: 'Ate 10 km',         max: 10  },
];

const REVIEW_FILTERS = [
  { id: 'all',    label: 'Todas'       },
  { id: '5',      label: '5 estrelas' },
  { id: '4',      label: '4+ estrelas'},
  { id: 'photos', label: 'Com fotos'  },
];

const REVIEW_SORT_OPTIONS = [
  { id: 'recent',  label: 'Mais Recentes'    },
  { id: 'helpful', label: 'Mais Uteis'       },
  { id: 'highest', label: 'Melhor Avaliacao' },
  { id: 'lowest',  label: 'Pior Avaliacao'   },
];

const AMENITIES_ICONS = {
  wifi:         { icon: '◉', label: 'WiFi'             },
  parking:      { icon: 'P', label: 'Estacionamento'   },
  delivery:     { icon: '⚡', label: 'Entrega'          },
  reservations: { icon: '◷', label: 'Reservas'         },
  wheelchair:   { icon: '♿', label: 'Acessivel'        },
  outdoor:      { icon: '◐', label: 'Mesas exteriores' },
  petfriendly:  { icon: '◆', label: 'Pet-friendly'     },
  portfolio:    { icon: '◈', label: 'Portfolio'         },
  remote:       { icon: '⌂', label: 'Trabalho Remoto'  },
  fastdelivery: { icon: '⚡', label: 'Entrega Rapida'   },
  certified:    { icon: '✓', label: 'Certificado'      },
  flexible:     { icon: '◷', label: 'Horario Flexivel' },
  online:       { icon: '◉', label: 'Online'           },
  appointment:  { icon: '◷', label: 'Por Marcacao'     },
  professional: { icon: '▪', label: 'Profissional'     },
};

const AMENITY_FILTERS = [
  { id: 'wifi',         label: 'WiFi',            icon: '◉' },
  { id: 'parking',      label: 'Estacionamento',  icon: 'P' },
  { id: 'delivery',     label: 'Entrega',         icon: '⚡' },
  { id: 'wheelchair',   label: 'Acessivel',       icon: '♿' },
  { id: 'outdoor',      label: 'Terraço',         icon: '◐' },
  { id: 'reservations', label: 'Reservas',        icon: '◷' },
];

const BUSINESS_TYPE_BADGES = {
  freelancer:   { icon: '💼', label: 'Freelancer',  color: '#8B5CF6' },
  service:      { icon: '⚙️', label: 'Servico',     color: '#3B82F6' },
  professional: { icon: '👔', label: 'Profissional', color: '#059669' },
  education:    { icon: '🎓', label: 'Educacao',    color: '#DC2626' },
  food:         { icon: '🍴', label: 'Alimentacao', color: '#EA580C' },
};

const MOCK_BUSINESSES = [
  {
    id:'1', name:'Pizzaria Bela Vista', category:'Restaurante Italiano', subcategory:'Pizza, Massa, Italiana',
    icon:'🍕', hero:'🍕', rating:4.8, reviews:120, price:'Kz ··', priceLevel:2,
    followers:1243, checkIns:856, referralCode:'PIZZA20',
    deals:[
      {id:'d1',title:'20% OFF Pizzas Grandes',description:'Válido de Seg-Qui',expires:'2026-02-28',code:'PIZZA20'},
      {id:'d2',title:'2x1 em Bebidas',description:'Todas as bebidas',expires:'2026-03-15',code:'BEBIDAS2X1'},
    ],
    liveStatus:{isLive:true,message:'Promoção ativa agora!',color:'#3CB371'},
    isPremium:true, verifiedBadge:true,
    address:'Rua Comandante Valodia, 123, Talatona', phone:'+244 923 456 789', website:'https://pizzariabelavista.ao',
    hours:'Seg-Dom: 11:00 - 23:00', payment:['Multicaixa Express','TPA','Dinheiro'],
    promo:'20% OFF em pizzas grandes', distance:0.85, distanceText:'850m', isOpen:true, statusText:'Aberto ate 23:00',
    latitude:-8.8388, longitude:13.2894,
    photos:[
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
      'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800',
    ],
    highlights:['"Pizza autentica"','"Ambiente familiar"'],
    services:['Vegan options','Entrega','Reservas'],
    amenities:['wifi','parking','delivery','reservations'],
    hoursList:['Seg-Sex 11:00 - 23:00','Sab 12:00 - 00:00','Dom 12:00 - 22:00'],
    popularDishes:[
      {name:'Pizza Margherita',price:'3.500 Kz',orders:156},
      {name:'Carbonara',price:'4.200 Kz',orders:89},
      {name:'Lasanha',price:'4.800 Kz',orders:67},
    ],
  },
  {
    id:'2', name:'Farmacia Sao Pedro', followers:892, checkIns:654, referralCode:'SAUDE15',
    category:'Farmacia', subcategory:'Medicamentos, Saude', icon:'💊', hero:'💊',
    rating:4.5, reviews:85, price:'Kz', priceLevel:1,
    address:'Avenida 4 de Fevereiro, 567, Maianga', phone:'+244 923 789 456',
    website:'https://farmaciasaopedro.ao', hours:'24 horas',
    payment:['Multicaixa Express','TPA','Dinheiro','Cartao'],
    promo:null, distance:1.2, distanceText:'1.2km', isOpen:true, statusText:'Aberto 24 horas',
    latitude:-8.8150, longitude:13.2302,
    photos:['https://images.unsplash.com/photo-1576602975921-8c18f8b4c8b0?w=800'],
    highlights:['"Atendimento 24h"','"Delivery disponivel"'],
    services:['Entrega','Atendimento 24h'], amenities:['delivery','wheelchair'],
    hoursList:['Todos os dias 00:00 - 24:00'], popularDishes:[],
  },
  {
    id:'3', name:'Supermercado Kero', followers:2105, checkIns:1432, referralCode:'KERO10',
    category:'Supermercado', subcategory:'Alimentacao, Bebidas', icon:'🛒', hero:'🛒',
    rating:4.7, reviews:203, price:'Kz ··', priceLevel:2,
    address:'Rua Rainha Ginga, 89, Maculusso', phone:'+244 923 321 654',
    website:'https://kero.ao', hours:'Seg-Sab: 8:00 - 20:00',
    payment:['Multicaixa Express','TPA','Dinheiro','Vale'],
    promo:'Promocao fim de semana', distance:2.1, distanceText:'2.1km', isOpen:true, statusText:'Aberto ate 20:00',
    latitude:-8.8200, longitude:13.2350,
    photos:['https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800'],
    highlights:['"Produtos frescos"','"Precos competitivos"'],
    services:['Take-away','Produtos frescos'], amenities:['parking','wifi','delivery'],
    hoursList:['Seg-Sab 08:00 - 20:00','Dom 09:00 - 18:00'], popularDishes:[],
  },
  {
    id:'4', name:'Cafe Atlantico', followers:1567, checkIns:923, referralCode:'CAFE5',
    category:'Cafe & Bar', subcategory:'Cafe, Pastelaria, Brunch', icon:'☕', hero:'☕',
    rating:4.6, reviews:156, price:'Kz ··', priceLevel:2,
    address:'Avenida Marginal, 45, Ilha de Luanda', phone:'+244 923 111 222',
    website:'https://cafeatlantico.ao', hours:'Seg-Dom: 7:00 - 22:00',
    payment:['Multicaixa Express','TPA'], promo:null,
    distance:1.5, distanceText:'1.5km', isOpen:true, statusText:'Aberto ate 22:00',
    latitude:-8.8050, longitude:13.2450,
    photos:['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'],
    highlights:['"Vista para o mar"','"WiFi gratis"'],
    services:['WiFi','Brunch','Mesas ao ar livre'], amenities:['wifi','outdoor','petfriendly'],
    hoursList:['Seg-Dom 07:00 - 22:00'],
    popularDishes:[
      {name:'Cappuccino',price:'800 Kz',orders:234},
      {name:'Croissant',price:'600 Kz',orders:189},
      {name:'Brunch completo',price:'3.500 Kz',orders:98},
    ],
  },
  {
    id:'5', name:'Restaurante Tempero Africano', followers:3421, checkIns:2134, referralCode:'TEMPERO25',
    category:'Restaurante Angolano', subcategory:'Culinaria Angolana, Africana',
    isPremium:true, verifiedBadge:true, icon:'🍲', hero:'🍲',
    rating:4.9, reviews:234, price:'Kz ···', priceLevel:3,
    address:'Largo do Kinaxixi, 12, Luanda', phone:'+244 923 777 888',
    website:'https://temperoafricano.ao', hours:'Seg-Dom: 12:00 - 22:00',
    payment:['Multicaixa Express','TPA','Dinheiro'],
    promo:'Almoco executivo 12EUR', distance:1.8, distanceText:'1.8km', isOpen:true, statusText:'Aberto ate 22:00',
    latitude:-8.8180, longitude:13.2340,
    photos:['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
    highlights:['"Muamba autentica"','"Chef premiado"'],
    services:['Reservas','Menu degustacao'], amenities:['reservations','wifi','parking'],
    hoursList:['Seg-Dom 12:00 - 22:00'],
    popularDishes:[
      {name:'Muamba de Galinha',price:'5.500 Kz',orders:412},
      {name:'Calulu de Peixe',price:'6.200 Kz',orders:298},
      {name:'Funge com Kizaka',price:'4.800 Kz',orders:187},
    ],
  },
  {
    id:'6', name:'Barbearia Premium', followers:678, checkIns:445, referralCode:'BARBA10',
    category:'Barbearia', subcategory:'Cabelo, Barba, Estetica', icon:'💈', hero:'💈',
    rating:4.7, reviews:92, price:'Kz ··', priceLevel:2,
    address:'Viana, Rua Principal, 234', phone:'+244 923 555 666',
    website:'https://barbeariapremium.ao', hours:'Seg-Sab: 9:00 - 19:00',
    payment:['Multicaixa Express','Dinheiro'], promo:null,
    distance:3.2, distanceText:'3.2km', isOpen:false, statusText:'Fechado ate 09:00',
    latitude:-8.8500, longitude:13.2600,
    photos:['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800'],
    highlights:['"Cortes modernos"','"Agendamento online"'],
    services:['Agendamento','Produtos para barba'], amenities:['wifi','parking'],
    hoursList:['Seg-Sab 09:00 - 19:00','Dom fechado'], popularDishes:[],
  },
  {
    id:'7', name:'João Silva - Designer Gráfico', followers:543, checkIns:89, referralCode:'DESIGN30',
    category:'Freelancer', subcategory:'Design, Branding, Marketing',
    isPremium:false, verifiedBadge:true,
    deals:[{id:'d1',title:'Desconto 30% Branding',description:'Pacote completo',expires:'2026-03-01',code:'DESIGN30'}],
    icon:'🎨', hero:'🎨', rating:4.9, reviews:67, price:'Kz ···', priceLevel:3,
    address:'Trabalho remoto - Luanda', phone:'+244 923 888 999', website:'https://joaosilva.design',
    hours:'Seg-Sex: 9:00 - 18:00', payment:['Transferencia Bancaria','Multicaixa Express'], promo:null,
    distance:0, distanceText:'Remoto', isOpen:true, statusText:'Disponivel para projetos',
    latitude:-8.8388, longitude:13.2894,
    photos:['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800'],
    highlights:['"Portfolio premiado"','"Entrega rapida"'],
    services:['Design de Logotipos','Branding Completo','Social Media'],
    amenities:['portfolio','remote','fastdelivery'],
    hoursList:['Seg-Sex 09:00 - 18:00','Sab sob consulta'], popularDishes:[],
    businessType:'freelancer',
    servicesOffered:[
      {id:'s1',name:'Logotipo Simples',price:'25.000 Kz',duration:'3 dias',description:'Design de logotipo profissional com 3 revisoes'},
      {id:'s2',name:'Branding Completo',price:'120.000 Kz',duration:'2 semanas',description:'Identidade visual completa: logo, cartoes, manual'},
      {id:'s3',name:'Posts Redes Sociais (pacote 10)',price:'35.000 Kz',duration:'1 semana',description:'Criacao de 10 posts para Instagram/Facebook'},
    ],
    portfolio:[
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    ],
    availability:{mon:true,tue:true,wed:true,thu:true,fri:true,sat:false,sun:false},
  },
  {
    id:'8', name:'FitCoach Angola - Personal Training', category:'Fitness',
    subcategory:'Personal Trainer, Nutricao, Wellness', icon:'💪', hero:'💪',
    rating:4.8, reviews:94, price:'Kz ··', priceLevel:2,
    address:'Talatona Sports Center, Luanda', phone:'+244 923 777 666',
    website:'https://fitcoach.ao', hours:'Seg-Sab: 6:00 - 21:00',
    payment:['Multicaixa Express','Dinheiro','Transferencia'], promo:'Primeira aula gratis',
    distance:1.1, distanceText:'1.1km', isOpen:true, statusText:'Aberto ate 21:00',
    latitude:-8.8400, longitude:13.2900,
    photos:['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800'],
    highlights:['"Resultados garantidos"','"Planos personalizados"'],
    services:['Personal Training','Planos de Nutricao','Aulas de Grupo'],
    amenities:['certified','flexible','online'],
    hoursList:['Seg-Sab 06:00 - 21:00','Dom 08:00 - 14:00'], popularDishes:[],
    businessType:'service',
    servicesOffered:[
      {id:'s1',name:'Sessao Individual',price:'8.000 Kz',duration:'1h',description:'Treino personalizado one-on-one'},
      {id:'s2',name:'Pacote Mensal (12 sessoes)',price:'85.000 Kz',duration:'1 mes',description:'3x por semana + plano nutricional'},
      {id:'s3',name:'Consultoria Nutricional',price:'15.000 Kz',duration:'1h',description:'Avaliacao e plano alimentar personalizado'},
    ],
    portfolio:['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'],
    availability:{mon:true,tue:true,wed:true,thu:true,fri:true,sat:true,sun:true},
  },
  {
    id:'9', name:'Dr. Carlos Mendes - Advogado', category:'Servicos Juridicos',
    subcategory:'Direito Civil, Empresarial, Familiar', icon:'⚖️', hero:'⚖️',
    rating:4.7, reviews:52, price:'Kz ····', priceLevel:4,
    address:'Edificio Atlas, Av. 4 de Fevereiro, Luanda', phone:'+244 923 555 444',
    website:'https://carlosmendes-advogado.ao', hours:'Seg-Sex: 9:00 - 17:00',
    payment:['Transferencia Bancaria','Cheque'], promo:null,
    distance:2.5, distanceText:'2.5km', isOpen:true, statusText:'Aberto ate 17:00',
    latitude:-8.8100, longitude:13.2300,
    photos:['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'],
    highlights:['"15 anos de experiencia"','"Consulta inicial gratuita"'],
    services:['Consultoria Juridica','Representacao Legal','Contratos'],
    amenities:['certified','appointment','parking'],
    hoursList:['Seg-Sex 09:00 - 17:00','Sab-Dom fechado'], popularDishes:[],
    businessType:'professional',
    servicesOffered:[
      {id:'s1',name:'Consulta Juridica',price:'35.000 Kz',duration:'1h',description:'Consultoria e aconselhamento legal'},
      {id:'s2',name:'Elaboracao de Contratos',price:'150.000 Kz',duration:'1 semana',description:'Redacao profissional de contratos'},
      {id:'s3',name:'Representacao em Tribunal',price:'500.000 Kz',duration:'Variavel',description:'Representacao legal completa'},
    ],
    portfolio:[],
    availability:{mon:true,tue:true,wed:true,thu:true,fri:true,sat:false,sun:false},
  },
  {
    id:'10', name:'English Pro - Explicacoes', category:'Educacao',
    subcategory:'Ingles, Preparacao Exames, Conversacao', icon:'📚', hero:'📚',
    rating:4.9, reviews:128, price:'Kz ··', priceLevel:2,
    address:'Maianga, Luanda (aulas online disponiveis)', phone:'+244 923 222 333',
    website:'https://englishpro.ao', hours:'Seg-Dom: 8:00 - 20:00',
    payment:['Multicaixa Express','Transferencia Bancaria'], promo:'Aula experimental gratis',
    distance:1.8, distanceText:'1.8km', isOpen:true, statusText:'Disponivel agora',
    latitude:-8.8200, longitude:13.2400,
    photos:['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'],
    highlights:['"Professores nativos"','"Aulas online e presenciais"'],
    services:['Aulas Individuais','Aulas de Grupo','Preparacao TOEFL/IELTS'],
    amenities:['online','certified','flexible'],
    hoursList:['Seg-Dom 08:00 - 20:00'], popularDishes:[],
    businessType:'education',
    servicesOffered:[
      {id:'s1',name:'Aula Individual (1h)',price:'6.000 Kz',duration:'1h',description:'Aula personalizada one-on-one'},
      {id:'s2',name:'Pacote 10 Aulas',price:'50.000 Kz',duration:'1 mes',description:'10 aulas individuais com desconto'},
      {id:'s3',name:'Curso Intensivo (mes)',price:'80.000 Kz',duration:'1 mes',description:'20 aulas/mes + material didatico'},
    ],
    portfolio:[],
    availability:{mon:true,tue:true,wed:true,thu:true,fri:true,sat:true,sun:true},
  },
  {
    id:'11', name:'Miguel Santos - Fotografo Profissional', category:'Freelancer',
    subcategory:'Fotografia, Eventos, Retratos', icon:'📸', hero:'📸',
    rating:5.0, reviews:89, price:'Kz ···', priceLevel:3,
    address:'Atendimento em todo Luanda', phone:'+244 923 111 000',
    website:'https://miguelsantos.photo', hours:'Flexivel - Por agendamento',
    payment:['Multicaixa Express','Transferencia Bancaria'], promo:null,
    distance:0, distanceText:'Flexivel', isOpen:true, statusText:'Aceita reservas',
    latitude:-8.8388, longitude:13.2894,
    photos:[
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800',
      'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800',
    ],
    highlights:['"Portfolio internacional"','"Equipamento profissional"'],
    services:['Fotografia de Eventos','Ensaios Fotograficos','Fotografia Corporativa'],
    amenities:['portfolio','professional','flexible'],
    hoursList:['Disponibilidade flexivel','Agendamento necessario'], popularDishes:[],
    businessType:'freelancer',
    servicesOffered:[
      {id:'s1',name:'Ensaio Fotografico (1h)',price:'45.000 Kz',duration:'1h',description:'Sessao fotografica + 20 fotos editadas'},
      {id:'s2',name:'Cobertura de Evento (4h)',price:'180.000 Kz',duration:'4h',description:'Casamentos, aniversarios, eventos corporativos'},
      {id:'s3',name:'Fotografia Corporativa',price:'120.000 Kz',duration:'2h',description:'Fotos profissionais para empresas'},
    ],
    portfolio:[
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400',
      'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
    ],
    availability:{mon:true,tue:true,wed:true,thu:true,fri:true,sat:true,sun:true},
  },
];

const QA_MOCK = [
  {id:'q1',question:'Tem menu vegetariano?',answer:'Sim! Temos várias opções vegetarianas incluindo saladas, massas e pizzas.',askedBy:'Maria L.',answeredBy:'Proprietário',date:'10 Fev 2026',helpful:12},
  {id:'q2',question:'Aceitam reservas para grupos grandes?',answer:'Sim, aceitamos reservas para grupos até 20 pessoas.',askedBy:'Pedro S.',answeredBy:'Proprietário',date:'05 Fev 2026',helpful:8},
  {id:'q3',question:'Têm estacionamento?',answer:'Temos estacionamento gratuito para clientes na parte traseira.',askedBy:'Ana R.',answeredBy:'Proprietário',date:'28 Jan 2026',helpful:15},
];

const COLLECTIONS_MOCK = [
  {id:'c1',name:'Melhores Pizzarias',icon:'🍕',businessCount:12,isPublic:true,creator:'João M.'},
  {id:'c2',name:'Romântico em Luanda',icon:'❤️',businessCount:8,isPublic:true,creator:'Sara P.'},
  {id:'c3',name:'Trabalho Remoto Friendly',icon:'💻',businessCount:15,isPublic:true,creator:'Carlos D.'},
];

const REVIEWS_MOCK = [
  {id:'r1',name:'Ana M.',avatar:'👩',rating:5,date:'12 Fev 2026',comment:'Atendimento excelente e comida impecavel.',photos:['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'],helpful:24,ownerResponse:'Obrigado Ana!',ownerResponseDate:'13 Fev 2026'},
  {id:'r2',name:'Bruno L.',avatar:'👨',rating:4,date:'03 Fev 2026',comment:'Bom ambiente, voltarei para experimentar mais pratos.',photos:[],helpful:12,ownerResponse:null,ownerResponseDate:null},
  {id:'r3',name:'Carla S.',avatar:'👩‍🦱',rating:5,date:'28 Jan 2026',comment:'Servico rapido e tudo muito saboroso.',photos:['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],helpful:18,ownerResponse:'Muito obrigado pelo carinho Carla!',ownerResponseDate:'29 Jan 2026'},
  {id:'r4',name:'David P.',avatar:'👨‍🦲',rating:3,date:'15 Jan 2026',comment:'Comida boa mas o tempo de espera foi longo.',photos:[],helpful:8,ownerResponse:'Pedimos desculpa pela espera David.',ownerResponseDate:'16 Jan 2026'},
  {id:'r5',name:'Elena R.',avatar:'👩‍🦰',rating:5,date:'10 Jan 2026',comment:'Melhor pizza de Luanda!',photos:['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'],helpful:31,ownerResponse:null,ownerResponseDate:null},
];

const MENU_ITEMS = [
  {id:'m1',name:'Frango grelhado',price:'4.800 Kz',desc:'Acompanhado de legumes e arroz.'},
  {id:'m2',name:'Massa a bolonhesa',price:'5.500 Kz',desc:'Molho caseiro e parmesao.'},
  {id:'m3',name:'Salada tropical',price:'3.200 Kz',desc:'Frutas frescas e molho citrus.'},
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const isFoodBusiness = (b) =>
  /restaurante|cafe|bar|pastelaria|brunch|pizza|culinaria/i.test(`${b.category} ${b.subcategory}`);

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++)
    stars.push(<Text key={i} style={[starS.star, rating >= i ? starS.filled : starS.empty]}>★</Text>);
  return <View style={starS.row}>{stars}</View>;
};

const renderHeroStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++)
    stars.push(<Text key={i} style={[heroStarS.star, rating >= i ? heroStarS.filled : heroStarS.empty]}>★</Text>);
  return <View style={heroStarS.row}>{stars}</View>;
};

// ─────────────────────────────────────────────────────────────────────────────
// SPONSORED CARD — v1.9.3
// ─────────────────────────────────────────────────────────────────────────────
function SponsoredCard({ business, onPress }) {
  const heroUri = business.photos?.[0] ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800';
  return (
    <TouchableOpacity style={spS.card} onPress={onPress} activeOpacity={0.9}>
      <ImageBackground source={{ uri: heroUri }} style={spS.image} imageStyle={spS.imageFill}>
        <View style={spS.scrim} />
        <View style={spS.topRow}>
          <View style={spS.sponsoredPill}>
            <Text style={spS.sponsoredPillText}>Patrocinado</Text>
          </View>
          {business.isPremium && (
            <View style={spS.premiumPill}><Text style={spS.premiumPillText}>👑 Premium</Text></View>
          )}
          {business.liveStatus?.isLive && (
            <View style={[spS.livePill, { backgroundColor: business.liveStatus.color }]}>
              <View style={spS.liveDot} />
              <Text style={spS.livePillText}>Ao vivo</Text>
            </View>
          )}
        </View>
        <View style={spS.infoStrip}>
          <View style={spS.nameRow}>
            <Text style={spS.name} numberOfLines={1}>{business.name}</Text>
            {business.verifiedBadge && (
              <View style={spS.verifiedBubble}><Text style={spS.verifiedIcon}>✓</Text></View>
            )}
          </View>
          <Text style={spS.category} numberOfLines={1}>{business.subcategory}</Text>
          <View style={spS.metaRow}>
            {renderStars(business.rating)}
            <Text style={spS.ratingTxt}>{business.rating}</Text>
            <Text style={spS.reviewsTxt}>({business.reviews})</Text>
            <View style={spS.dot} />
            <Text style={[spS.statusDot, business.isOpen ? spS.dotOpen : spS.dotClosed]}>●</Text>
            <Text style={[spS.statusTxt, business.isOpen ? spS.statusOpen : spS.statusClosed]}>
              {business.isOpen ? 'Aberto agora' : 'Fechado'}
            </Text>
          </View>
          {!!business.promo && (
            <View style={spS.promoBanner}>
              <Text style={spS.promoIcon}>🏷️</Text>
              <Text style={spS.promoTxt} numberOfLines={1}>{business.promo}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
function AppContent() {
  const insets = useSafeAreaInsets();

  const [searchWhat, setSearchWhat]           = useState('');
  const [searchWhere, setSearchWhere]         = useState('Talatona, Luanda');
  const [activeFilter, setActiveFilter]       = useState('open');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showDetail, setShowDetail]           = useState(false);
  const [activeTab, setActiveTab]             = useState('Menu');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStars, setRatingStars]           = useState(0);
  const [reviewText, setReviewText]             = useState('');
  const [sortBy, setSortBy]                   = useState('recommended');
  const [showSortModal, setShowSortModal]     = useState(false);
  const [priceFilter, setPriceFilter]         = useState('all');
  const [priceMin, setPriceMin]               = useState('');
  const [priceMax, setPriceMax]               = useState('');
  const [distanceFilter, setDistanceFilter]   = useState('all');
  const [bookmarkedIds, setBookmarkedIds]     = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [reviewFilter, setReviewFilter]       = useState('all');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [recentSearches, setRecentSearches]   = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showAllCategories, setShowAllCategories]   = useState(false);
  const [showProfileModal, setShowProfileModal]     = useState(false);
  const [currentTime, setCurrentTime]               = useState(new Date());
  const [searchFocused, setSearchFocused]     = useState(false);
  const [viewMode, setViewMode]               = useState('list');
  const [activeNavTab, setActiveNavTab]       = useState('home');
  const [carouselActiveIndex, setCarouselActiveIndex] = useState(0);
  const [locationPermission, setLocationPermission] = useState('denied');
  const [reviewSort, setReviewSort]           = useState('recent');
  const [helpfulReviews, setHelpfulReviews]   = useState({});
  const [showReviewStats, setShowReviewStats] = useState(false);
  const [selectedReviewUser, setSelectedReviewUser] = useState(null);
  const [followedBusinesses, setFollowedBusinesses] = useState([]);
  const [userCheckIns, setUserCheckIns]       = useState({});
  const [showQAModal, setShowQAModal]         = useState(false);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);
  const [newQuestion, setNewQuestion]         = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [compareList, setCompareList]         = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [bookingDate, setBookingDate]         = useState('');
  const [showDatePicker, setShowDatePicker]   = useState(false);
  const [showTimePicker, setShowTimePicker]   = useState(false);
  const [selectedHour, setSelectedHour]       = useState(10);
  const [selectedMinute, setSelectedMinute]   = useState(0);
  const [calendarMonth, setCalendarMonth]     = useState(new Date());
  const [bookingTime, setBookingTime]         = useState('');
  const [bookingPeople, setBookingPeople]     = useState('2');
  const [darkMode, setDarkMode]               = useState(false);
  const [notifications, setNotifications]     = useState([
    {id:'n1',title:'Nova oferta!',message:'Pizzaria Bela Vista: 20% OFF',time:'5 min atrás',read:false},
    {id:'n2',title:'Reserva confirmada',message:'Personal Trainer amanhã às 10h',time:'1h atrás',read:false},
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnalytics, setShowAnalytics]     = useState(false);
  const [userStats] = useState({ businessesViewed:47, reviewsWritten:12, checkIns:23, savedBusinesses:8 });

  const carouselRef    = useRef(null);
  const carouselIndex  = useRef(0);
  const scrollRef      = useRef(null);
  const searchInputRef = useRef(null);
  const sectionOffsets = useRef({});
  const scrollY        = useRef(new Animated.Value(0)).current;
  const heroHeight     = 260; // v2.0.1: fixed height, info strip is outside image

  const headerOpacity = scrollY.interpolate({
    inputRange: [200, 260],  // fade in fixed header after scrolling past hero image
    outputRange: [0, 1], extrapolate: 'clamp',
  });
  const statsOpacity = scrollY.interpolate({
    inputRange: [0, 80], outputRange: [1, 0], extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [120, 160], outputRange: [0, 1], extrapolate: 'clamp',
  });
  const heroTitleOpacity = scrollY.interpolate({
    inputRange: [0, 180], outputRange: [1, 0], extrapolate: 'clamp',  // hero title fade
  });

  useEffect(() => { loadBookmarks(); loadRecentSearches(); requestLocationPermission(); }, []);

  // Auto-carousel every 3 seconds
  useEffect(() => {
    const SPONSORED = MOCK_BUSINESSES.filter(b => b.isPremium || b.promo).slice(0, 5);
    if (SPONSORED.length < 2) return;
    const timer = setInterval(() => {
      carouselIndex.current = (carouselIndex.current + 1) % SPONSORED.length;
      carouselRef.current?.scrollTo({
        x: carouselIndex.current * SCREEN_WIDTH,
        animated: true,
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Update time every minute for closing countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [activeFilter, searchWhat, searchWhere, sortBy, priceFilter, distanceFilter]);

  const loadBookmarks = async () => {
    try { const s = await AsyncStorage.getItem('bookmarks'); if (s) setBookmarkedIds(JSON.parse(s)); } catch {}
  };
  const loadRecentSearches = async () => {
    try { const s = await AsyncStorage.getItem('recentSearches'); if (s) setRecentSearches(JSON.parse(s)); } catch {}
  };
  const saveRecentSearch = async (q) => {
    try {
      const u = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
      setRecentSearches(u);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(u));
    } catch {}
  };
  const clearRecentSearches = async () => {
    try { setRecentSearches([]); await AsyncStorage.removeItem('recentSearches'); } catch {}
  };

  const requestLocationPermission = () => {
    Alert.alert('Permitir Localizacao', 'AchAqui precisa da sua localizacao para mostrar negocios perto de si', [
      { text: 'Nao Permitir', onPress: () => setLocationPermission('denied') },
      { text: 'Permitir',     onPress: () => setLocationPermission('granted') },
    ]);
  };

  const toggleBookmark = async (id) => {
    try {
      const u = bookmarkedIds.includes(id) ? bookmarkedIds.filter(i => i !== id) : [...bookmarkedIds, id];
      setBookmarkedIds(u);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(u));
    } catch {}
  };
  const handleShare = async (b) => {
    try { await Share.share({ message: `${b.name}\n${b.address}\n⭐ ${b.rating}\n${b.website||''}` }); } catch {}
  };
  const toggleAmenity   = (id) => setSelectedAmenities(p => p.includes(id) ? p.filter(a => a !== id) : [...p, id]);
  const toggleHelpful   = (id) => setHelpfulReviews(p => ({ ...p, [id]: !p[id] }));
  const toggleFollow    = (id) => setFollowedBusinesses(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const handleCheckIn   = (id) => { setUserCheckIns(p => ({ ...p, [id]: (p[id]||0)+1 })); Alert.alert('Check-in realizado!', 'Obrigado por visitar este negócio. 🎉'); };
  const handleAskQuestion = () => { if (newQuestion.trim()) { Alert.alert('Pergunta enviada!','O proprietário será notificado.'); setNewQuestion(''); setShowQAModal(false); } };
  const copyReferralCode  = (c) => Alert.alert('Código copiado!', `"${c}" copiado.`);
  const toggleCompare     = (id) => setCompareList(p => {
    if (p.includes(id)) return p.filter(i => i !== id);
    if (p.length >= 3) { Alert.alert('Limite atingido','Máximo 3 negócios.'); return p; }
    return [...p, id];
  });
  const handleBooking = () => {
    if (!bookingDate) { Alert.alert('Erro','Selecione uma data.'); return; }
    const timeStr = `${String(selectedHour).padStart(2,'0')}:${String(selectedMinute).padStart(2,'0')}`;
    Alert.alert('Reserva Confirmada!', `${bookingPeople} pessoa(s) em ${bookingDate} às ${timeStr}.`);
    setShowBookingModal(false); setBookingDate(''); setShowDatePicker(false); setShowTimePicker(false); setBookingPeople('2'); setSelectedHour(10); setSelectedMinute(0);
  };

  const buildCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];
    let day = 1 - firstDay;
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++, day++) {
        week.push(day >= 1 && day <= daysInMonth ? day : null);
      }
      weeks.push(week);
      if (day > daysInMonth) break;
    }
    return { year, month, weeks };
  };

  const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const DAY_NAMES_SHORT = ['D','S','T','Q','Q','S','S'];
  const toggleDarkMode        = () => { setDarkMode(d => !d); Alert.alert('Modo ' + (darkMode ? 'Claro' : 'Escuro') + ' Ativado'); };
  const markNotificationRead  = (id) => setNotifications(p => p.map(n => n.id===id ? {...n,read:true} : n));
  const clearAllNotifications = () => setNotifications([]);
  const handleSearchSubmit    = () => { if (searchWhat.trim()) { saveRecentSearch(searchWhat.trim()); setShowAutocomplete(false); Keyboard.dismiss(); } };
  const handleSuggestionPress = (s) => { setSearchWhat(s); saveRecentSearch(s); setShowAutocomplete(false); Keyboard.dismiss(); };

  const autocompleteSuggestions = useMemo(() => {
    if (!searchWhat.trim()) return [];
    return AUTOCOMPLETE_SUGGESTIONS.filter(s => s.toLowerCase().includes(searchWhat.toLowerCase())).slice(0, 5);
  }, [searchWhat]);

  const filteredBusinesses = useMemo(() => {
    let r = MOCK_BUSINESSES.filter(b => {
      const matchSearch = [b.name, b.category, b.subcategory].some(s => s.toLowerCase().includes(searchWhat.toLowerCase()));
      if (activeFilter==='deals' && !b.promo) return false;
      if (activeFilter==='open'  && !b.isOpen) return false;
      if (activeFilter==='top'   && b.rating < 4.7) return false;
      if (activeFilter==='premium' && !(b.isPremium || b.promo)) return false;
      if (priceFilter !== 'all') { const pf = PRICE_FILTERS.find(p => p.id===priceFilter); if (pf && !pf.levels.includes(b.priceLevel)) return false; }
      if (distanceFilter !== 'all') { const df = DISTANCE_FILTERS.find(d => d.id===distanceFilter); if (df && b.distance > df.max) return false; }
      if (selectedAmenities.length > 0 && !selectedAmenities.every(a => b.amenities.includes(a))) return false;
      return matchSearch;
    });
    if (sortBy==='distance') r.sort((a,b) => a.distance - b.distance);
    else if (sortBy==='rating')  r.sort((a,b) => b.rating  - a.rating);
    else if (sortBy==='reviews') r.sort((a,b) => b.reviews - a.reviews);
    return r;
  }, [activeFilter, searchWhat, sortBy, priceFilter, distanceFilter, selectedAmenities]);

  const filteredReviews = useMemo(() => {
    let r = [...REVIEWS_MOCK];
    if (reviewFilter==='5')      r = r.filter(x => x.rating===5);
    else if (reviewFilter==='4') r = r.filter(x => x.rating>=4);
    else if (reviewFilter==='photos') r = r.filter(x => x.photos?.length>0);
    if (reviewSort==='helpful') r.sort((a,b) => b.helpful - a.helpful);
    else if (reviewSort==='highest') r.sort((a,b) => b.rating - a.rating);
    else if (reviewSort==='lowest')  r.sort((a,b) => a.rating - b.rating);
    return r;
  }, [reviewFilter, reviewSort]);

  const reviewStats = useMemo(() => {
    if (!selectedBusiness) return null;
    const total = REVIEWS_MOCK.length;
    const avgRating = (REVIEWS_MOCK.reduce((s,r) => s+r.rating, 0)/total).toFixed(1);
    const distribution = [5,4,3,2,1].reduce((acc,n) => { acc[n]=REVIEWS_MOCK.filter(r=>r.rating===n).length; return acc; }, {});
    return { total, avgRating, distribution };
  }, [selectedBusiness]);

  const featuredBusiness = MOCK_BUSINESSES[0];
  const handleBusinessPress = (b) => { setSelectedBusiness(b); setShowDetail(true); setCurrentPhotoIndex(0); setActiveTab(isFoodBusiness(b) ? 'Menu' : 'Informacoes'); };
  const handleCall      = (ph) => Linking.openURL(`tel:${ph.replace(/\s+/g,'')}`).catch(() => {});
  const handleWhatsApp  = (ph) => Linking.openURL(`whatsapp://send?phone=${ph.replace(/\s+/g,'')}`).catch(() => {});
  const handleWebsite   = (url) => { if (url) Linking.openURL(url).catch(() => {}); };
  const handleDirections = (addr, lat, lng) => {
    Alert.alert('Abrir Direcoes','Escolha o aplicativo:',[
      {text:'Google Maps',onPress:()=>Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`)},
      {text:'Waze',onPress:()=>Linking.openURL(`waze://?ll=${lat},${lng}&navigate=yes`)},
      {text:'Cancelar',style:'cancel'},
    ]);
  };
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    const y = sectionOffsets.current[tab];
    if (scrollRef.current && typeof y==='number') scrollRef.current.scrollTo({ y: Math.max(y-8,0), animated:true });
  };

  const detailTabs = useMemo(() => {
    if (!selectedBusiness) return BASE_TABS;
    const tabs = [];
    if (selectedBusiness.servicesOffered?.length) tabs.push('Servicos');
    if (isFoodBusiness(selectedBusiness)) tabs.push('Menu');
    return [...tabs, ...BASE_TABS];
  }, [selectedBusiness]);

  useEffect(() => {
    if (detailTabs.length && !detailTabs.includes(activeTab)) setActiveTab(detailTabs[0]);
  }, [activeTab, detailTabs]);

  const currentSortLabel   = SORT_OPTIONS.find(s => s.id===sortBy)?.label || 'Recomendado';
  const hasActiveFilters   = priceFilter!=='all' || distanceFilter!=='all' || selectedAmenities.length>0;
  const activeFiltersCount = (priceFilter!=='all'?1:0) + (distanceFilter!=='all'?1:0) + selectedAmenities.length;
  const unreadCount        = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={hS.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Platform.OS === 'android' ? COLORS.white : undefined} translucent={Platform.OS === 'android' ? false : undefined} />

      {/* HEADER + AUTOCOMPLETE wrapper — relative so autocomplete drops below search bar */}
      <View style={hS.headerWrapper}>
      <View style={[hS.header, { paddingTop: Platform.OS === 'android' ? insets.top + 12 : 12 }]}>
        <View style={hS.headerTopRow}>
          <Text style={hS.logo}>AchAqui</Text>
          <View style={hS.versionRow}>
            <Text style={hS.versionText}>{VERSION_LOG.version}</Text>
          </View>
          <View style={hS.headerActions}>
            <TouchableOpacity style={hS.headerActionBtn} onPress={toggleDarkMode}>
              <Icon name={darkMode ? 'sun' : 'moon'} size={18} color={COLORS.darkText} />
            </TouchableOpacity>
            <TouchableOpacity style={hS.headerActionBtn} onPress={() => setShowNotifications(true)}>
              <Icon name="bell" size={18} color={COLORS.darkText} />
              {unreadCount > 0 && <View style={hS.notifBadge}><Text style={hS.notifBadgeText}>{unreadCount}</Text></View>}
            </TouchableOpacity>
            <TouchableOpacity style={hS.headerActionBtn} onPress={() => setShowAnalytics(true)}>
              <Icon name="analytics" size={18} color={COLORS.darkText} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={hS.searchBar}>
          <View style={hS.searchColumn}>
            <Text style={hS.searchLabel}>O que</Text>
            <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
              <TextInput
                ref={searchInputRef}
                style={[hS.searchInput, {flex:1}]}
                placeholder="restaurantes, farmacias, cafes"
                placeholderTextColor={COLORS.grayText}
                value={searchWhat}
                onChangeText={t => { setSearchWhat(t); }}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => Keyboard.dismiss()}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
              />
              {showAutocomplete && (
                <TouchableOpacity onPress={() => { setShowAutocomplete(false); setSearchWhat(''); Keyboard.dismiss(); }} style={{paddingLeft:8}}>
                  <Icon name="close" size={18} color={COLORS.grayText} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={hS.searchDivider} />
          <View style={hS.searchColumn}>
            <Text style={hS.searchLabel}>Onde</Text>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <TextInput style={[hS.searchInput,{flex:1}]} placeholder="bairro, cidade" placeholderTextColor={COLORS.grayText} value={searchWhere} onChangeText={setSearchWhere} />
              <TouchableOpacity onPress={requestLocationPermission}>
                <Icon name="location" size={18} color={locationPermission==='granted' ? COLORS.red : COLORS.grayText} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>{/* end hS.header */}


      </View>{/* end headerWrapper */}

      {/* AUTOCOMPLETE — v2.3.8: stays open, closes on tap outside or on item */}
      {showAutocomplete && (
        <>
        <TouchableOpacity 
          style={acS.backdrop} 
          activeOpacity={1} 
          onPress={() => setShowAutocomplete(false)}
        />
        <View style={acS.absoluteDropdown}>
          <View style={acS.container}>
            <ScrollView 
              style={acS.scroll} 
              keyboardShouldPersistTaps="handled" 
              showsVerticalScrollIndicator={false}
              onScrollBeginDrag={() => Keyboard.dismiss()}
            >
              {autocompleteSuggestions.length > 0 && (
                <>
                  <Text style={acS.sectionTitle}>Sugestões</Text>
                  {autocompleteSuggestions.map((s,i) => (
                    <TouchableOpacity key={i} style={acS.item} onPress={() => handleSuggestionPress(s)}>
                      <Icon name="search" size={14} color={COLORS.grayText} strokeWidth={1.5}/>
                      <Text style={acS.text}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {recentSearches.length > 0 && (
                <>
                  <View style={acS.recentHeader}>
                    <Text style={acS.sectionTitle}>Recentes</Text>
                    <TouchableOpacity onPress={clearRecentSearches}><Text style={acS.clearText}>Limpar</Text></TouchableOpacity>
                  </View>
                  {recentSearches.map((s,i) => (
                    <TouchableOpacity key={i} style={acS.item} onPress={() => handleSuggestionPress(s)}>
                      <Icon name="clock" size={14} color={COLORS.grayText} strokeWidth={1.5}/>
                      <Text style={acS.text}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              <Text style={acS.sectionTitle}>Trending</Text>
              {TRENDING_SEARCHES.map((s,i) => (
                <TouchableOpacity key={i} style={acS.item} onPress={() => handleSuggestionPress(s)}>
                  <Icon name="fire" size={14} color={COLORS.red} strokeWidth={1.5}/>
                  <Text style={acS.text}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        </>
      )}

      {/* CATEGORIES */}
      <View style={hS.categoryRowWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={hS.categoryRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={hS.categoryChip} 
              activeOpacity={0.7}
              onPress={() => {
                if (cat.id === 'more') {
                  setShowAllCategories(true);
                } else {
                  // Handle category filter
                }
              }}
            >
              <View style={hS.categoryChipIconWrap}>
                <Icon name={cat.icon} size={14} color={COLORS.darkText} />
              </View>
              <Text style={hS.categoryChipLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* MAIN CONTENT */}
      {viewMode === 'list' ? (
        <ScrollView style={hS.scroll} contentContainerStyle={hS.scrollContent} showsVerticalScrollIndicator={false}>

          {/* SPONSORED CAROUSEL — v2.0.2: auto 3s, full-width snap, dots */}
          {(() => {
            const SPONSORED = MOCK_BUSINESSES.filter(b => b.isPremium || b.promo).slice(0, 5);
            return (
              <View style={hS.carouselSection}>
                <View style={hS.carouselHeader}>
                  <Text style={hS.carouselTitle}>✦ Em Destaque</Text>
                  <View style={hS.carouselDots}>
                    {SPONSORED.map((_,i) => (
                      <View key={i} style={[hS.carouselDot, i===carouselActiveIndex && hS.carouselDotActive]} />
                    ))}
                  </View>
                </View>
                <ScrollView
                  ref={carouselRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  snapToInterval={SCREEN_WIDTH}
                  snapToAlignment="start"
                  contentContainerStyle={hS.carouselScroll}
                  onMomentumScrollEnd={e => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                    carouselIndex.current = idx;
                    setCarouselActiveIndex(idx);
                  }}
                  scrollEventThrottle={16}
                >
                  {SPONSORED.map((b, i) => (
                    <View key={b.id} style={hS.carouselItem}>
                      <SponsoredCard business={b} onPress={() => handleBusinessPress(b)} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            );
          })()}

          {/* FILTER GRID */}
          <View style={hS.controlsSection}>
            <View style={hS.unifiedFilterContainer}>
              <View style={hS.filterRow}>
                {[
                  {id:'open',  icon:'live',   label:'Aberto agora'},
                  {id:'deals', icon:'tag',    label:'Promocoes'   },
                  {id:'top',   icon:'star',   label:'Mais avaliados'},
                ].map(f => (
                  <TouchableOpacity key={f.id} style={[hS.filterItem, activeFilter===f.id && hS.filterItemActive]} onPress={() => setActiveFilter(f.id)} activeOpacity={0.7}>
                    <Icon name={f.icon} size={13} color={activeFilter===f.id ? COLORS.red : COLORS.darkText} strokeWidth={2} />
                    <Text style={[hS.filterItemText, activeFilter===f.id && hS.filterItemTextActive]}>{f.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={hS.filtersSpacer} />
              <View style={hS.filterRow}>
                <TouchableOpacity style={hS.filterItem} onPress={() => setShowSortModal(true)}>
                  <Text style={hS.filterItemText}>{currentSortLabel}</Text>
                  <Icon name="chevronDown" size={12} color={COLORS.darkText} strokeWidth={2} />
                </TouchableOpacity>
                <TouchableOpacity style={[hS.filterItem, hasActiveFilters && hS.filterItemActive]} onPress={() => setShowAdvancedFilters(true)}>
                  <Icon name="filter" size={13} color={hasActiveFilters ? COLORS.red : COLORS.darkText} strokeWidth={2} />
                  <Text style={[hS.filterItemText, hasActiveFilters && hS.filterItemTextActive]}>Filtros</Text>
                  {hasActiveFilters && <View style={hS.controlBadge}><Text style={hS.controlBadgeText}>{activeFiltersCount}</Text></View>}
                </TouchableOpacity>
                <TouchableOpacity style={hS.filterItem} onPress={() => setViewMode('map')}>
                  <Icon name="map" size={13} color={COLORS.darkText} strokeWidth={2} />
                  <Text style={hS.filterItemText}>Mapa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ACTIVE FILTER BADGES */}
          {hasActiveFilters && (
            <View style={fbS.container}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={fbS.scroll}>
                {priceFilter!=='all' && (
                  <View style={fbS.badge}>
                    <Text style={fbS.badgeText}>{PRICE_FILTERS.find(p=>p.id===priceFilter)?.label}</Text>
                    <TouchableOpacity onPress={() => setPriceFilter('all')} style={fbS.badgeClose}><Text style={fbS.badgeCloseText}>✕</Text></TouchableOpacity>
                  </View>
                )}
                {distanceFilter!=='all' && (
                  <View style={fbS.badge}>
                    <Text style={fbS.badgeText}>{DISTANCE_FILTERS.find(d=>d.id===distanceFilter)?.label}</Text>
                    <TouchableOpacity onPress={() => setDistanceFilter('all')} style={fbS.badgeClose}><Text style={fbS.badgeCloseText}>✕</Text></TouchableOpacity>
                  </View>
                )}
                {selectedAmenities.map(aid => {
                  const am = AMENITY_FILTERS.find(a=>a.id===aid);
                  return am ? (
                    <View key={aid} style={fbS.badge}>
                      <Text style={fbS.badgeText}>{am.icon} {am.label}</Text>
                      <TouchableOpacity onPress={() => toggleAmenity(aid)} style={fbS.badgeClose}><Text style={fbS.badgeCloseText}>✕</Text></TouchableOpacity>
                    </View>
                  ) : null;
                })}
              </ScrollView>
            </View>
          )}

          {/* SECTION HEADER */}
          <View style={hS.sectionHeader}>
            <Text style={hS.sectionTitle}>Perto de ti</Text>
            <Text style={hS.sectionCount}>({filteredBusinesses.length} resultados)</Text>
          </View>

          {/* BUSINESS LIST — v1.9.3: marginBottom: 6 (was 12) */}
          {filteredBusinesses.map(b => {
            const bookmarked = bookmarkedIds.includes(b.id);
            return (
              <TouchableOpacity key={b.id} style={hS.listCell} onPress={() => handleBusinessPress(b)} activeOpacity={0.8}>
                <View style={hS.listCellImage}>
                  {b.photos?.[0] ? (
                    <Image source={{ uri: b.photos[0] }} style={hS.listCellPhoto} resizeMode="cover" />
                  ) : (
                    <Text style={hS.listCellIcon}>{b.icon}</Text>
                  )}
                </View>
                <View style={hS.listCellInfo}>
                  {/* Deals badge - top right corner */}
                  {b.deals?.length > 0 && (
                    <View style={hS.dealsBadgeTopRight}>
                      <Icon name="tag" size={9} color={COLORS.white} strokeWidth={2} />
                      <Text style={hS.dealsBadgeText}>{b.deals.length}</Text>
                    </View>
                  )}
                  <View style={hS.listCellTitleRow}>
                    <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                      <Text style={hS.listCellTitle} numberOfLines={1}>{b.name}</Text>
                      {b.isPremium && <Text style={hS.premiumBadge}>👑</Text>}
                      {b.verifiedBadge && <Text style={hS.verifiedBadge}>✓</Text>}
                    </View>
                    <View style={{flexDirection:'row',gap:4}}>
                      <TouchableOpacity style={hS.compareCheckbox} onPress={e => { e.stopPropagation?.(); toggleCompare(b.id); }}>
                        <Icon name={compareList.includes(b.id) ? 'check' : 'info'} size={16} color={compareList.includes(b.id) ? COLORS.red : COLORS.grayText} strokeWidth={2} />
                      </TouchableOpacity>
                      <TouchableOpacity style={hS.bookmarkBtn} onPress={() => toggleBookmark(b.id)}>
                        <Icon name={bookmarkedIds.includes(b.id) ? 'heartFilled' : 'heart'} size={18} color={bookmarkedIds.includes(b.id) ? COLORS.red : COLORS.grayText} strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={hS.listCellMeta}>
                    {renderStars(b.rating)}
                    <Text style={hS.listCellRating}>{b.rating}</Text>
                    <Text style={hS.listCellReviews}>({b.reviews})</Text>
                  </View>
                  <Text style={hS.listCellCategory} numberOfLines={1}>{b.subcategory}</Text>
                  {b.address && (
                    <View style={hS.listCellAddressRow}>
                      <Icon name="location" size={10} color={COLORS.grayText} strokeWidth={1.5} />
                      <Text style={hS.listCellAddress} numberOfLines={1}>{b.address}</Text>
                    </View>
                  )}
                  {b.amenities?.length > 0 && (
                    <View style={hS.amenitiesRow}>
                      {b.amenities.slice(0,3).map(a => {
                        const AMENITY_ICON_MAP = { wifi:'wifi', parking:'parking', delivery:'delivery', reservations:'reservation', wheelchair:'wheelchair', outdoor:'outdoor', petfriendly:'heart', portfolio:'portfolio', remote:'remote', fastdelivery:'fastdelivery', certified:'certified', flexible:'clock', online:'online', appointment:'appointment', professional:'professional' };
                        const iconName = AMENITY_ICON_MAP[a] || 'check';
                        return (
                          <View key={a} style={hS.amenityChip}>
                            <Icon name={iconName} size={11} color={COLORS.grayText} strokeWidth={1.5} />
                          </View>
                        );
                      })}
                    </View>
                  )}
                  <View style={hS.listCellFooter}>
                    <Text style={hS.listCellDistance}>{b.distanceText}</Text>
                    {(() => {
                      const status = getBusinessStatus(b.statusText, b.isOpen);
                      
                      // Show countdown if closing soon
                      if (status.minsLeft !== null) {
                        return <Text style={hS.closingSoonText}>Fecha em {status.minsLeft} min</Text>;
                      }
                      
                      // Show closed if past closing time (even if b.isOpen was true)
                      if (status.isClosed) {
                        return <Text style={hS.closedText}>Fechado</Text>;
                      }
                      
                      // Otherwise show normal open status
                      return <Text style={hS.openText}>Aberto agora</Text>;
                    })()}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={{flex:1,backgroundColor:COLORS.mapBg,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:20,fontWeight:'700',color:COLORS.darkText,marginBottom:10}}>🗺️ Vista de Mapa</Text>
          <Text style={{fontSize:14,color:COLORS.grayText,marginBottom:20}}>{filteredBusinesses.length} negocios perto de si</Text>
          <TouchableOpacity style={{position:'absolute',bottom:30,backgroundColor:COLORS.red,paddingHorizontal:24,paddingVertical:14,borderRadius:25,elevation:8}} onPress={() => setViewMode('list')}>
            <Text style={{fontSize:15,fontWeight:'700',color:COLORS.white}}>📋 Voltar à Lista</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* COMPARE FLOATING */}
      {compareList.length > 0 && (
        <View style={hS.compareFloatingContainer}>
          <TouchableOpacity style={hS.compareFloatingBtn} onPress={() => setShowCompareModal(true)}>
            <Text style={hS.compareFloatingText}>Comparar ({compareList.length})</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SORT MODAL */}
      <Modal visible={showSortModal} transparent animationType="fade" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity style={modS.overlay} activeOpacity={1} onPress={() => setShowSortModal(false)}>
          <View style={modS.sortMenu}>
            <Text style={modS.sortTitle}>Ordenar por</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.id} style={modS.sortOption} onPress={() => { setSortBy(opt.id); setShowSortModal(false); }}>
                <Text style={[modS.sortOptionText, sortBy===opt.id && modS.sortOptionTextActive]}>{opt.label}</Text>
                {sortBy===opt.id && <Text style={modS.sortCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ADVANCED FILTERS MODAL */}
      <Modal visible={showAdvancedFilters} transparent animationType="slide" onRequestClose={() => setShowAdvancedFilters(false)}>
        <View style={modS.overlay}>
          <View style={afS.panel}>
            <View style={afS.header}>
              <Text style={afS.title}>Todos os Filtros</Text>
              <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}><Text style={afS.close}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={afS.scroll}>
              <Text style={afS.groupTitle}>Preço</Text>
              {/* Quick price tier chips */}
              <View style={afS.group}>
                {PRICE_FILTERS.map(p => (
                  <TouchableOpacity key={p.id} style={[afS.option, priceFilter===p.id && afS.optionActive]} onPress={() => setPriceFilter(p.id)}>
                    <Text style={[afS.optionText, priceFilter===p.id && afS.optionTextActive]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Min / Max Kz range inputs */}
              <View style={afS.priceRangeRow}>
                <View style={afS.priceRangeField}>
                  <Text style={afS.priceRangeLabel}>Preço mínimo</Text>
                  <View style={afS.priceRangeInputWrap}>
                    <Text style={afS.priceRangeCurrency}>Kz</Text>
                    <TextInput
                      style={afS.priceRangeInput}
                      placeholder="0"
                      placeholderTextColor={COLORS.grayText}
                      keyboardType="numeric"
                      value={priceMin}
                      onChangeText={setPriceMin}
                      returnKeyType="done"
                    />
                  </View>
                </View>
                <View style={afS.priceRangeDivider}/>
                <View style={afS.priceRangeField}>
                  <Text style={afS.priceRangeLabel}>Preço máximo</Text>
                  <View style={afS.priceRangeInputWrap}>
                    <Text style={afS.priceRangeCurrency}>Kz</Text>
                    <TextInput
                      style={afS.priceRangeInput}
                      placeholder="Qualquer"
                      placeholderTextColor={COLORS.grayText}
                      keyboardType="numeric"
                      value={priceMax}
                      onChangeText={setPriceMax}
                      returnKeyType="done"
                    />
                  </View>
                </View>
              </View>
              <Text style={afS.groupTitle}>Distancia</Text>
              <View style={afS.group}>
                {DISTANCE_FILTERS.map(d => (
                  <TouchableOpacity key={d.id} style={[afS.option, distanceFilter===d.id && afS.optionActive]} onPress={() => setDistanceFilter(d.id)}>
                    <Text style={[afS.optionText, distanceFilter===d.id && afS.optionTextActive]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={afS.groupTitle}>Comodidades</Text>
              <View style={afS.group}>
                {AMENITY_FILTERS.map(am => (
                  <TouchableOpacity key={am.id} style={[afS.option, selectedAmenities.includes(am.id) && afS.optionActive]} onPress={() => toggleAmenity(am.id)}>
                    <Text style={[afS.optionText, selectedAmenities.includes(am.id) && afS.optionTextActive]}>{am.icon} {am.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={afS.footer}>
              <TouchableOpacity style={afS.clearBtn} onPress={() => { setPriceFilter('all'); setDistanceFilter('all'); setSelectedAmenities([]); setPriceMin(''); setPriceMax(''); }}>
                <Text style={afS.clearText}>Limpar Tudo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={afS.applyBtn} onPress={() => setShowAdvancedFilters(false)}>
                <Text style={afS.applyText}>Aplicar ({activeFiltersCount})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal visible={showDetail} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowDetail(false)}>
        {selectedBusiness && (
          <View style={dS.container}>

            {/* ── v2.1.1: header aligned with category modal style ── */}
            <Animated.View style={[dS.fixedHeader, { opacity: headerOpacity, paddingTop: Platform.OS === 'android' ? insets.top + 12 : 12 }]}>
              <View style={dS.fixedHeaderRow}>
                {/* Back button — matches category modal backBtn */}
                <TouchableOpacity style={dS.topBarBack} onPress={() => setShowDetail(false)}>
                  <Icon name="back" size={20} color={COLORS.darkText} strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Title — centre */}
                <Animated.View style={[dS.topBarTitleContainer, { opacity: headerTitleOpacity }]}>
                  <Text style={dS.topBarTitle} numberOfLines={1}>{selectedBusiness.name}</Text>
                </Animated.View>

                {/* Action buttons — right, same height as back button */}
                <View style={dS.headerActions}>
                  <TouchableOpacity style={dS.headerActionBtn} onPress={() => handleShare(selectedBusiness)}>
                    <Icon name="share" size={18} color={COLORS.darkText} strokeWidth={1.5} />
                  </TouchableOpacity>
                  <TouchableOpacity style={dS.headerActionBtn} onPress={() => toggleBookmark(selectedBusiness.id)}>
                    <Icon name={bookmarkedIds.includes(selectedBusiness.id) ? 'heartFilled' : 'heart'} size={18} color={bookmarkedIds.includes(selectedBusiness.id) ? COLORS.red : COLORS.darkText} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            <Animated.ScrollView
              ref={scrollRef}
              stickyHeaderIndices={[2]}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={dS.scrollContent}
              onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
              scrollEventThrottle={16}
            >
              {/* HERO — v2.0.1: image + floating controls + info strip BELOW image */}
              <View style={dS.heroBlock}>
                {/* Photo carousel */}
                <View style={dS.heroImageWrap}>
                  <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={e => setCurrentPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}>
                    {selectedBusiness.photos.map((photo, idx) => (
                      <Image
                        key={idx}
                        style={{ width: SCREEN_WIDTH, height: 260 }}
                        source={{ uri: photo }}
                        resizeMode="cover"
                      />
                    ))}
                  </ScrollView>
                  {/* Photo counter */}
                  <View style={dS.photoCounter}>
                    <Text style={dS.photoCounterText}>{currentPhotoIndex+1} / {selectedBusiness.photos.length}</Text>
                  </View>
                  {/* Floating back button — top left */}
                  <TouchableOpacity style={[dS.floatingBack, { top: (Platform.OS === 'android' ? insets.top + 12 : 12) }]} onPress={() => setShowDetail(false)}>
                    <Icon name="back" size={20} color={COLORS.white} strokeWidth={2.5} />
                  </TouchableOpacity>
                  {/* Floating actions — top right */}
                  <View style={[dS.floatingActions, { top: (Platform.OS === 'android' ? insets.top + 12 : 12) }]}>
                    <TouchableOpacity style={dS.floatingActionBtn} onPress={() => handleShare(selectedBusiness)}>
                      <Icon name="share" size={17} color={COLORS.white} strokeWidth={1.5} />
                    </TouchableOpacity>
                    <TouchableOpacity style={dS.floatingActionBtn} onPress={() => toggleBookmark(selectedBusiness.id)}>
                      <Icon name={bookmarkedIds.includes(selectedBusiness.id) ? 'heartFilled' : 'heart'} size={17} color={COLORS.white} strokeWidth={1.5} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Business info strip — BELOW image, white background */}
                <View style={dS.heroInfoStrip}>
                  <View style={dS.heroInfoTop}>
                    <View style={{flex:1}}>
                      <Text style={dS.heroTitle}>{selectedBusiness.name}</Text>
                      <Text style={dS.heroCategory}>{selectedBusiness.subcategory}</Text>
                    </View>
                    {selectedBusiness.isPremium && (
                      <View style={dS.heroPremiumBadge}><Text style={dS.heroPremiumText}>👑 Premium</Text></View>
                    )}
                  </View>
                  <View style={dS.heroMetaRow}>
                    {renderStars(selectedBusiness.rating)}
                    <Text style={dS.heroRating}>{selectedBusiness.rating}</Text>
                    <Text style={dS.heroReviews}>({selectedBusiness.reviews} avaliações)</Text>
                    <View style={dS.heroSeparator}/>
                    <View style={[dS.heroStatusDot, {backgroundColor: selectedBusiness.isOpen ? COLORS.green : COLORS.red}]}/>
                    <Text style={[dS.heroStatusText, {color: selectedBusiness.isOpen ? COLORS.green : COLORS.red}]}>
                      {selectedBusiness.statusText || (selectedBusiness.isOpen ? 'Aberto agora' : 'Fechado')}
                    </Text>
                  </View>
                  <View style={dS.heroInfoMeta}>
                    <Icon name="location" size={12} color={COLORS.grayText} strokeWidth={1.5}/>
                    <Text style={dS.heroDistance}>{selectedBusiness.distanceText}</Text>
                    <Text style={dS.heroPriceDot}>·</Text>
                    <Text style={dS.heroPrice}>{selectedBusiness.price}</Text>
                  </View>
                </View>
              </View>

              {/* RATING STARTER — v2.0.2: centered, stars on top */}
              <View style={dS.ratingSection}>
                <Text style={dS.reviewStarterTitle}>Inicie uma avaliação</Text>
                <View style={dS.reviewStarterStars}>
                  {[1,2,3,4,5].map(i => (
                    <TouchableOpacity key={i} onPress={() => { setRatingStars(i); setShowRatingModal(true); }} hitSlop={{top:10,bottom:10,left:8,right:8}}>
                      <Text style={[dS.reviewStarterStar, i <= ratingStars && dS.reviewStarterStarFilled]}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={() => setShowRatingModal(true)} style={{marginTop:6}}>
                  <Text style={dS.reviewStarterCta}>Toque para avaliar</Text>
                </TouchableOpacity>
              </View>

              {/* SOCIAL STATS */}
              <Animated.View style={[dS.socialActionsSection, { opacity: statsOpacity }]}>
                <View style={dS.socialStatsRow}>
                  <View style={dS.socialStat}><Text style={dS.socialStatValue}>{selectedBusiness.followers||0}</Text><Text style={dS.socialStatLabel}>Seguidores</Text></View>
                  <View style={dS.socialStat}><Text style={dS.socialStatValue}>{(selectedBusiness.checkIns||0)+(userCheckIns[selectedBusiness.id]||0)}</Text><Text style={dS.socialStatLabel}>Check-ins</Text></View>
                </View>
                <View style={dS.socialButtonsRow}>
                  <TouchableOpacity style={[dS.socialButton, followedBusinesses.includes(selectedBusiness.id) && dS.socialButtonActive]} onPress={() => toggleFollow(selectedBusiness.id)}>
                    <Icon name={followedBusinesses.includes(selectedBusiness.id) ? 'check' : 'save'} size={14} color={followedBusinesses.includes(selectedBusiness.id) ? COLORS.white : COLORS.darkText} strokeWidth={2} />
                    <Text style={[dS.socialButtonText, followedBusinesses.includes(selectedBusiness.id) && dS.socialButtonTextActive]}>{followedBusinesses.includes(selectedBusiness.id)?'A seguir':'Seguir'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={dS.socialButton} onPress={() => handleCheckIn(selectedBusiness.id)}>
                    <Icon name="checkin" size={14} color={COLORS.darkText} strokeWidth={1.5} />
                    <Text style={dS.socialButtonText}>Check-in</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={dS.socialButton} onPress={() => setShowCollectionsModal(true)}>
                    <Icon name="bookmark" size={14} color={COLORS.darkText} strokeWidth={1.5} />
                    <Text style={dS.socialButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* STICKY TABS */}
              <View style={dS.stickyHeader}>
                <View style={dS.tabsBar}>
                  {detailTabs.map(tab => (
                    <TouchableOpacity key={tab} style={dS.tabItem} onPress={() => handleTabPress(tab)} activeOpacity={0.7}>
                      <Text style={activeTab===tab ? dS.tabTextActive : dS.tabText}>{tab}</Text>
                      {activeTab===tab && <View style={dS.tabIndicator} />}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* BUSINESS TYPE BADGE */}
              {selectedBusiness.businessType && BUSINESS_TYPE_BADGES[selectedBusiness.businessType] && (
                <View style={dS.businessTypeBadgeContainer}>
                  <View style={[dS.businessTypeBadge, { backgroundColor: BUSINESS_TYPE_BADGES[selectedBusiness.businessType].color }]}>
                    <Text style={dS.businessTypeBadgeIcon}>{BUSINESS_TYPE_BADGES[selectedBusiness.businessType].icon}</Text>
                    <Text style={dS.businessTypeBadgeText}>{BUSINESS_TYPE_BADGES[selectedBusiness.businessType].label}</Text>
                  </View>
                </View>
              )}

              {/* DEALS */}
              {selectedBusiness.deals?.length > 0 && (
                <View style={dS.sectionBlock}>
                  <Text style={dS.sectionTitle}>🔥 Ofertas Ativas</Text>
                  {selectedBusiness.deals.map(deal => (
                    <View key={deal.id} style={dS.dealCard}>
                      <View style={dS.dealCardHeader}>
                        <Text style={dS.dealTitle}>{deal.title}</Text>
                        <View style={dS.dealCodeBadge}><Text style={dS.dealCodeText}>{deal.code}</Text></View>
                      </View>
                      <Text style={dS.dealDescription}>{deal.description}</Text>
                      <Text style={dS.dealExpires}>Válido até: {deal.expires}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* BOOKING */}
              {['service','professional','education'].includes(selectedBusiness.businessType) && (
                <View style={dS.sectionBlock}>
                  <Text style={dS.sectionTitle}>📅 Fazer Reserva</Text>
                  <TouchableOpacity style={dS.bookingCard} onPress={() => setShowBookingModal(true)}>
                    <View style={dS.bookingIconWrap}><Icon name="appointment" size={26} color={COLORS.red} strokeWidth={1.5} /></View>
                    <View style={dS.bookingInfo}><Text style={dS.bookingTitle}>Agendar Horário</Text><Text style={dS.bookingSubtitle}>Escolha data e hora disponível</Text></View>
                    <Icon name="chevronRight" size={18} color={COLORS.red} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              )}

              {/* LIVE STATUS */}
              {selectedBusiness.liveStatus?.isLive && (
                <View style={[dS.liveStatusBanner, { backgroundColor: selectedBusiness.liveStatus.color+'20', borderColor: selectedBusiness.liveStatus.color }]}>
                  <View style={[dS.liveDot, { backgroundColor: selectedBusiness.liveStatus.color }]} />
                  <Text style={[dS.liveStatusText, { color: selectedBusiness.liveStatus.color }]}>{selectedBusiness.liveStatus.message}</Text>
                </View>
              )}

              {/* SERVICES */}
              {selectedBusiness.servicesOffered?.length > 0 && (
                <View style={dS.menuSectionBlock} onLayout={e => { sectionOffsets.current.Servicos = e.nativeEvent.layout.y; }}>
                  <Text style={dS.sectionTitle}>Servicos Oferecidos</Text>
                  <View style={dS.servicesCard}>
                    {selectedBusiness.servicesOffered.map(s => (
                      <View key={s.id} style={dS.serviceItem}>
                        <View style={dS.serviceItemHeader}><Text style={dS.serviceItemTitle}>{s.name}</Text><Text style={dS.serviceItemPrice}>{s.price}</Text></View>
                        {s.duration && <Text style={dS.serviceItemDuration}>⏱️ {s.duration}</Text>}
                        <Text style={dS.serviceItemDesc}>{s.description}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* PORTFOLIO */}
              {selectedBusiness.portfolio?.length > 0 && (
                <View style={dS.sectionBlock}>
                  <Text style={dS.sectionTitle}>Portfolio</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dS.portfolioScroll}>
                    {selectedBusiness.portfolio.map((img,i) => <Image key={i} source={{ uri: img }} style={dS.portfolioImage} />)}
                  </ScrollView>
                </View>
              )}

              {/* AVAILABILITY */}
              {selectedBusiness.availability && (
                <View style={dS.sectionBlock}>
                  <Text style={dS.sectionTitle}>Disponibilidade</Text>
                  <View style={dS.availabilityCalendar}>
                    {WEEKDAY_KEYS.map((key,i) => {
                      const avail = selectedBusiness.availability[key];
                      return (
                        <View key={key} style={dS.availabilityDay}>
                          <View style={[dS.availabilityDayCircle, avail ? dS.availabilityDayAvailable : dS.availabilityDayUnavailable]}>
                            <Text style={[dS.availabilityDayText, avail && dS.availabilityDayTextAvailable]}>{WEEKDAY_LABELS[i]}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* MENU */}
              {isFoodBusiness(selectedBusiness) && (
                <View style={dS.menuSectionBlock} onLayout={e => { sectionOffsets.current.Menu = e.nativeEvent.layout.y; }}>
                  <Text style={dS.sectionTitle}>Menu do Dia</Text>
                  <View style={dS.menuCard}>
                    {MENU_ITEMS.map(item => (
                      <View key={item.id} style={dS.menuItem}>
                        <View style={dS.menuItemText}><Text style={dS.menuItemTitle}>{item.name}</Text><Text style={dS.menuItemDesc}>{item.desc}</Text></View>
                        <Text style={dS.menuItemPrice}>{item.price}</Text>
                      </View>
                    ))}
                  </View>
                  {selectedBusiness.popularDishes?.length > 0 && (
                    <>
                      <Text style={[dS.sectionTitle,{marginTop:16}]}>Pratos Populares</Text>
                      <View style={dS.popularDishesCard}>
                        {selectedBusiness.popularDishes.map((d,i) => (
                          <View key={i} style={dS.popularDishItem}>
                            <View style={dS.popularDishRank}><Text style={dS.popularDishRankText}>{i+1}</Text></View>
                            <View style={dS.popularDishInfo}><Text style={dS.popularDishName}>{d.name}</Text><Text style={dS.popularDishOrders}>{d.orders} pedidos</Text></View>
                            <Text style={dS.popularDishPrice}>{d.price}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              )}

              {/* INFORMACOES */}
              <View style={dS.sectionBlock} onLayout={e => { sectionOffsets.current.Informacoes = e.nativeEvent.layout.y; }}>
                <Text style={dS.sectionTitle}>Informacoes</Text>
                <View style={dS.infoActionRow}>
                  <TouchableOpacity style={[dS.actionOutline,dS.actionEqual,dS.whatsappButton]} onPress={() => handleWhatsApp(selectedBusiness.phone)} activeOpacity={0.85}>
                    <View style={dS.whatsappBadge}><Icon name="whatsapp" size={12} color="#25D366" strokeWidth={1.5} /></View>
                    <Text style={dS.whatsappButtonText} numberOfLines={1}>WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[dS.actionOutline,dS.actionEqual]} onPress={() => handleCall(selectedBusiness.phone)}>
                    <Icon name="phone" size={14} color={COLORS.darkText} strokeWidth={1.5} />
                    <Text style={dS.actionText}>Ligar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[dS.actionOutline,dS.actionEqual]} onPress={() => handleWebsite(selectedBusiness.website)}>
                    <Icon name="web" size={14} color={COLORS.darkText} strokeWidth={1.5} />
                    <Text style={dS.actionText}>Website</Text>
                  </TouchableOpacity>
                </View>
                <Text style={dS.infoHighlightText}>{selectedBusiness.highlights.map(h=>h.replace(/"/g,'')).join(' • ')}</Text>
                <View style={dS.mapCard}>
                  <View style={dS.mapPlaceholder}><Text style={dS.mapText}>Mini mapa</Text></View>
                  <View style={dS.mapInfoRow}>
                    <View style={dS.mapInfoText}><Text style={dS.mapAddress} numberOfLines={2}>{selectedBusiness.address}</Text><Text style={dS.mapNeighborhood}>{searchWhere}</Text></View>
                    <TouchableOpacity style={dS.directionsBtn} onPress={() => handleDirections(selectedBusiness.address,selectedBusiness.latitude,selectedBusiness.longitude)}>
                      <Text style={dS.directionsText}>Direcoes</Text>
                      <Icon name="arrow" size={13} color={COLORS.darkText} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={dS.infoList}>
                  <View style={dS.infoRow}><View style={dS.infoIconWrap}><Icon name="clock" size={14} color={COLORS.grayText} strokeWidth={1.5} /></View><View style={dS.infoTextBlock}>{(selectedBusiness.hoursList||DEFAULT_HOURS).map(l=><Text key={l} style={dS.infoText}>{l}</Text>)}</View></View>
                  <View style={dS.infoRow}><View style={dS.infoIconWrap}><Icon name="check" size={14} color={COLORS.grayText} strokeWidth={2} /></View><View style={dS.infoTextBlock}>{(selectedBusiness.services||DEFAULT_SERVICES).map(s=><Text key={s} style={dS.infoText}>{s}</Text>)}</View></View>
                  <View style={dS.infoRow}><View style={dS.infoIconWrap}><Icon name="payment" size={14} color={COLORS.grayText} strokeWidth={1.5} /></View><Text style={dS.infoText}>{selectedBusiness.payment.join(', ')}</Text></View>
                </View>
              </View>

              {/* AVALIACOES */}
              <View style={dS.sectionBlock} onLayout={e => { sectionOffsets.current.Avaliacoes = e.nativeEvent.layout.y; }}>
                <Text style={dS.sectionTitle}>Avaliacoes</Text>
                {reviewStats && (
                  <TouchableOpacity style={dS.reviewStatsCard} onPress={() => setShowReviewStats(!showReviewStats)} activeOpacity={0.9}>
                    <View style={dS.reviewStatsHeader}>
                      <View>
                        <Text style={dS.reviewStatsAvg}>{reviewStats.avgRating}</Text>
                        <View style={dS.reviewStars}>{renderStars(parseFloat(reviewStats.avgRating))}</View>
                        <Text style={dS.reviewStatsTotal}>{reviewStats.total} avaliacoes</Text>
                      </View>
                      <Text style={dS.reviewStatsToggle}>{showReviewStats?'▼':'▶'}</Text>
                    </View>
                    {showReviewStats && (
                      <View style={dS.reviewStatsDistribution}>
                        {[5,4,3,2,1].map(star => (
                          <View key={star} style={dS.reviewStatsRow}>
                            <Text style={dS.reviewStatsLabel}>{star}★</Text>
                            <View style={dS.reviewStatsBarBg}><View style={[dS.reviewStatsBarFill,{width:`${(reviewStats.distribution[star]/reviewStats.total)*100}%`}]} /></View>
                            <Text style={dS.reviewStatsCount}>{reviewStats.distribution[star]}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                <View style={dS.reviewControls}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:8}}>
                    <Text style={dS.reviewControlLabel}>Ordenar:</Text>
                    {REVIEW_SORT_OPTIONS.map(s => (
                      <TouchableOpacity key={s.id} style={[dS.reviewSortChip, reviewSort===s.id && dS.reviewSortChipActive]} onPress={() => setReviewSort(s.id)}>
                        <Text style={[dS.reviewSortText, reviewSort===s.id && dS.reviewSortTextActive]}>{s.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={dS.reviewControlLabel}>Filtrar:</Text>
                    {REVIEW_FILTERS.map(f => (
                      <TouchableOpacity key={f.id} style={[dS.reviewFilterChip, reviewFilter===f.id && dS.reviewFilterChipActive]} onPress={() => setReviewFilter(f.id)}>
                        <Text style={[dS.reviewFilterText, reviewFilter===f.id && dS.reviewFilterTextActive]}>{f.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={dS.reviewsList}>
                  {filteredReviews.map(review => {
                    const helpful = helpfulReviews[review.id];
                    return (
                      <View key={review.id} style={dS.reviewCard}>
                        <View style={dS.reviewHeader}>
                          <TouchableOpacity style={dS.reviewUserInfo} onPress={() => setSelectedReviewUser(review)}>
                            <Text style={dS.reviewAvatar}>{review.avatar}</Text>
                            <View><Text style={dS.reviewName}>{review.name}</Text><Text style={dS.reviewDate}>{review.date}</Text></View>
                          </TouchableOpacity>
                        </View>
                        <View style={dS.reviewStars}>{renderStars(review.rating)}</View>
                        <Text style={dS.reviewComment}>{review.comment}</Text>
                        {review.photos?.length > 0 && (
                          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dS.reviewPhotosScroll}>
                            {review.photos.map((p,i) => <Image key={i} source={{uri:p}} style={dS.reviewPhoto} />)}
                          </ScrollView>
                        )}
                        <TouchableOpacity style={dS.reviewHelpfulBtn} onPress={() => toggleHelpful(review.id)}>
                          <Icon name="like" size={14} color={helpful ? COLORS.red : COLORS.grayText} strokeWidth={1.5} />
                          <Text style={[dS.reviewHelpfulText, helpful && dS.reviewHelpfulTextActive]}>Útil ({review.helpful+(helpful?1:0)})</Text>
                        </TouchableOpacity>
                        {review.ownerResponse && (
                          <View style={dS.ownerResponseCard}>
                            <View style={dS.ownerResponseHeader}>
                              <Text style={dS.ownerResponseBadge}>🏪 Resposta do proprietario</Text>
                              <Text style={dS.ownerResponseDate}>{review.ownerResponseDate}</Text>
                            </View>
                            <Text style={dS.ownerResponseText}>{review.ownerResponse}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity style={dS.uploadPhotoBtn} onPress={() => setShowPhotoUpload(true)}>
                  <Icon name="camera" size={18} color={COLORS.darkText} strokeWidth={1.5} />
                  <Text style={dS.uploadPhotoText}>Adicionar fotos</Text>
                </TouchableOpacity>
              </View>

              {/* MAIS */}
              <View style={dS.sectionBlock} onLayout={e => { sectionOffsets.current.Mais = e.nativeEvent.layout.y; }}>
                <Text style={dS.sectionTitle}>Mais</Text>
                <View style={dS.qaSection}>
                  <View style={dS.qaSectionHeader}>
                    <Text style={dS.qaTitle}>Perguntas & Respostas</Text>
                    <TouchableOpacity onPress={() => setShowQAModal(true)}><Text style={dS.qaAskBtn}>Perguntar</Text></TouchableOpacity>
                  </View>
                  {QA_MOCK.slice(0,2).map(qa => (
                    <View key={qa.id} style={dS.qaItem}>
                      <Text style={dS.qaQuestion}>❓ {qa.question}</Text>
                      <Text style={dS.qaAnswer}>💬 {qa.answer}</Text>
                      <View style={dS.qaFooter}><Text style={dS.qaDate}>{qa.date}</Text><Text style={dS.qaHelpful}>👍 {qa.helpful} útil</Text></View>
                    </View>
                  ))}
                  <TouchableOpacity style={dS.qaViewAll}><Text style={dS.qaViewAllText}>Ver todas as perguntas →</Text></TouchableOpacity>
                </View>
                {selectedBusiness.referralCode && (
                  <View style={dS.referralCard}>
                    <View style={dS.referralHeader}>
                      <Text style={dS.referralIcon}>🎁</Text>
                      <View style={dS.referralHeaderText}>
                        <Text style={dS.referralTitle}>Código de Referência</Text>
                        <Text style={dS.referralSubtitle}>Partilhe e ganhe descontos!</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={dS.referralCodeContainer} onPress={() => copyReferralCode(selectedBusiness.referralCode)}>
                      <Text style={dS.referralCode}>{selectedBusiness.referralCode}</Text>
                      <Text style={dS.referralCopyIcon}>📋</Text>
                    </TouchableOpacity>
                    <Text style={dS.referralHint}>Toque para copiar</Text>
                  </View>
                )}
                <View style={dS.highlightsRow}>
                  {selectedBusiness.highlights.map(h => <View key={h} style={dS.highlightChip}><Text style={dS.highlightText}>{h}</Text></View>)}
                </View>
              </View>

              <View style={{ height:80 }} />
            </Animated.ScrollView>

            {/* INNER MODALS */}
            <Modal visible={showRatingModal} transparent animationType="fade" onRequestClose={() => { setShowRatingModal(false); setRatingStars(0); }}>
              <View style={dS.ratingOverlay}>
                <View style={dS.ratingCard}>
                  <Text style={dS.ratingTitle}>Escrever avaliação</Text>
                  <Text style={dS.ratingSubtitle}>Como foi a sua experiência?</Text>
                  {/* Interactive stars in modal */}
                  <View style={dS.modalStarsRow}>
                    {[1,2,3,4,5].map(i => (
                      <TouchableOpacity key={i} onPress={() => setRatingStars(i)} hitSlop={{top:8,bottom:8,left:6,right:6}}>
                        <Text style={[dS.modalStar, i <= ratingStars && dS.modalStarFilled]}>★</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {ratingStars > 0 && (
                    <Text style={dS.ratingLabel}>
                      {['','Muito mau','Mau','Razoável','Bom','Excelente!'][ratingStars]}
                    </Text>
                  )}
                  <TextInput
                    style={dS.ratingInput}
                    placeholder="Conte como foi a sua experiência..."
                    placeholderTextColor={COLORS.grayText}
                    multiline
                    value={reviewText}
                    onChangeText={setReviewText}
                  />
                  <View style={dS.ratingActions}>
                    <TouchableOpacity style={dS.ratingButtonGhost} onPress={() => { setShowRatingModal(false); setRatingStars(0); setReviewText(''); }}>
                      <Text style={dS.ratingButtonGhostText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[dS.ratingButtonPrimary, ratingStars === 0 && {opacity:0.4}]}
                      disabled={ratingStars === 0}
                      onPress={() => { setShowRatingModal(false); setRatingStars(0); setReviewText(''); }}
                    >
                      <Text style={dS.ratingButtonPrimaryText}>Publicar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Modal visible={showPhotoUpload} transparent animationType="fade" onRequestClose={() => setShowPhotoUpload(false)}>
              <View style={dS.ratingOverlay}><View style={dS.ratingCard}>
                <Text style={dS.ratingTitle}>Adicionar fotos</Text>
                <Text style={dS.uploadPhotoHint}>Partilhe fotos da sua experiencia</Text>
                <View style={dS.ratingActions}>
                  <TouchableOpacity style={dS.ratingButtonGhost} onPress={() => setShowPhotoUpload(false)}><Text style={dS.ratingButtonGhostText}>Cancelar</Text></TouchableOpacity>
                  <TouchableOpacity style={dS.ratingButtonPrimary} onPress={() => { Alert.alert('Sucesso','Foto adicionada!'); setShowPhotoUpload(false); }}><Text style={dS.ratingButtonPrimaryText}>Escolher foto</Text></TouchableOpacity>
                </View>
              </View></View>
            </Modal>

            <Modal visible={selectedReviewUser!==null} transparent animationType="fade" onRequestClose={() => setSelectedReviewUser(null)}>
              <View style={dS.ratingOverlay}><View style={dS.ratingCard}>
                {selectedReviewUser && (
                  <>
                    <View style={dS.userProfileHeader}><Text style={dS.userProfileAvatar}>{selectedReviewUser.avatar}</Text><Text style={dS.userProfileName}>{selectedReviewUser.name}</Text></View>
                    <View style={dS.userProfileStats}>
                      <View style={dS.userProfileStat}><Text style={dS.userProfileStatValue}>{REVIEWS_MOCK.filter(r=>r.name===selectedReviewUser.name).length}</Text><Text style={dS.userProfileStatLabel}>Avaliacoes</Text></View>
                      <View style={dS.userProfileStat}><Text style={dS.userProfileStatValue}>{REVIEWS_MOCK.filter(r=>r.name===selectedReviewUser.name).reduce((s,r)=>s+r.helpful,0)}</Text><Text style={dS.userProfileStatLabel}>Votos Uteis</Text></View>
                    </View>
                    <TouchableOpacity style={dS.ratingButtonPrimary} onPress={() => setSelectedReviewUser(null)}><Text style={dS.ratingButtonPrimaryText}>Fechar</Text></TouchableOpacity>
                  </>
                )}
              </View></View>
            </Modal>

            <Modal visible={showQAModal} transparent animationType="fade" onRequestClose={() => setShowQAModal(false)}>
              <View style={dS.ratingOverlay}><View style={dS.ratingCard}>
                <Text style={dS.ratingTitle}>Fazer uma pergunta</Text>
                <TextInput style={dS.ratingInput} placeholder="Escreva sua pergunta..." placeholderTextColor={COLORS.grayText} multiline value={newQuestion} onChangeText={setNewQuestion} />
                <View style={dS.ratingActions}>
                  <TouchableOpacity style={dS.ratingButtonGhost} onPress={() => setShowQAModal(false)}><Text style={dS.ratingButtonGhostText}>Cancelar</Text></TouchableOpacity>
                  <TouchableOpacity style={dS.ratingButtonPrimary} onPress={handleAskQuestion}><Text style={dS.ratingButtonPrimaryText}>Enviar Pergunta</Text></TouchableOpacity>
                </View>
              </View></View>
            </Modal>

            <Modal visible={showCollectionsModal} transparent animationType="slide" onRequestClose={() => setShowCollectionsModal(false)}>
              <View style={dS.ratingOverlay}><View style={[dS.ratingCard,{maxHeight:'80%'}]}>
                <Text style={dS.ratingTitle}>Guardar em Coleção</Text>
                <ScrollView style={{marginVertical:16}}>
                  {COLLECTIONS_MOCK.map(c => (
                    <TouchableOpacity key={c.id} style={dS.collectionItem}>
                      <Text style={dS.collectionIcon}>{c.icon}</Text>
                      <View style={dS.collectionInfo}><Text style={dS.collectionName}>{c.name}</Text><Text style={dS.collectionCount}>{c.businessCount} lugares</Text></View>
                      <View style={dS.collectionCheckbox}><Text style={dS.collectionCheckboxIcon}>☐</Text></View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity style={dS.ratingButtonPrimary} onPress={() => { Alert.alert('Guardado!'); setShowCollectionsModal(false); }}><Text style={dS.ratingButtonPrimaryText}>Concluir</Text></TouchableOpacity>
              </View></View>
            </Modal>

            {/* BOOKING MODAL v2.0.2 — calendar, time picker, keyboard-safe */}
            <Modal visible={showBookingModal} transparent animationType="slide" onRequestClose={() => setShowBookingModal(false)}>
              <View style={dS.bookingOverlay}>
                <View style={dS.bookingModalCard}>
                  {/* Header */}
                  <View style={dS.bookingModalHeader}>
                    <Text style={dS.ratingTitle}>Agendar Horário</Text>
                    <TouchableOpacity onPress={() => setShowBookingModal(false)} style={dS.bookingCloseBtn}>
                      <Icon name="close" size={18} color={COLORS.grayText} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                    {/* DATE — inline calendar */}
                    <View style={dS.bookingField}>
                      <Text style={dS.bookingFieldLabel}>📅  Data</Text>
                      <TouchableOpacity style={dS.bookingDateBtn} onPress={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}>
                        <Text style={bookingDate ? dS.bookingDateValue : dS.bookingDatePlaceholder}>
                          {bookingDate || 'Selecionar data'}
                        </Text>
                        <Icon name="chevronDown" size={14} color={COLORS.grayText} strokeWidth={2} />
                      </TouchableOpacity>

                      {showDatePicker && (() => {
                        const { year, month, weeks } = buildCalendar(calendarMonth);
                        const todayD = new Date();
                        return (
                          <View style={dS.calendarCard}>
                            {/* Month nav */}
                            <View style={dS.calendarNav}>
                              <TouchableOpacity onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()-1, 1))} style={dS.calendarNavBtn}>
                                <Icon name="back" size={16} color={COLORS.darkText} strokeWidth={2} />
                              </TouchableOpacity>
                              <Text style={dS.calendarMonthLabel}>{MONTH_NAMES[month]} {year}</Text>
                              <TouchableOpacity onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth()+1, 1))} style={dS.calendarNavBtn}>
                                <Icon name="chevronRight" size={16} color={COLORS.darkText} strokeWidth={2} />
                              </TouchableOpacity>
                            </View>
                            {/* Day headers */}
                            <View style={dS.calendarDayRow}>
                              {DAY_NAMES_SHORT.map((d,i) => <Text key={i} style={dS.calendarDayHeader}>{d}</Text>)}
                            </View>
                            {/* Weeks */}
                            {weeks.map((week, wi) => (
                              <View key={wi} style={dS.calendarDayRow}>
                                {week.map((day, di) => {
                                  if (!day) return <View key={di} style={dS.calendarDayEmpty}/>;
                                  const dateStr = `${String(day).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}`;
                                  const isPast = new Date(year, month, day) < new Date(todayD.getFullYear(), todayD.getMonth(), todayD.getDate());
                                  const isSelected = bookingDate === dateStr;
                                  return (
                                    <TouchableOpacity key={di} style={[dS.calendarDay, isSelected && dS.calendarDaySelected, isPast && dS.calendarDayPast]} disabled={isPast} onPress={() => { setBookingDate(dateStr); setShowDatePicker(false); }}>
                                      <Text style={[dS.calendarDayText, isSelected && dS.calendarDayTextSelected, isPast && dS.calendarDayTextPast]}>{day}</Text>
                                    </TouchableOpacity>
                                  );
                                })}
                              </View>
                            ))}
                          </View>
                        );
                      })()}
                    </View>

                    {/* TIME — hour/minute wheel picker */}
                    <View style={dS.bookingField}>
                      <Text style={dS.bookingFieldLabel}>🕐  Hora</Text>
                      <TouchableOpacity style={dS.bookingDateBtn} onPress={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}>
                        <Text style={dS.bookingDateValue}>
                          {`${String(selectedHour).padStart(2,'0')}:${String(selectedMinute).padStart(2,'0')}`}
                        </Text>
                        <Icon name="chevronDown" size={14} color={COLORS.grayText} strokeWidth={2} />
                      </TouchableOpacity>
                      {showTimePicker && (
                        <View style={dS.timePickerCard}>
                          <View style={dS.timePickerRow}>
                            {/* Hours */}
                            <View style={dS.timeColumn}>
                              <Text style={dS.timeColumnLabel}>Hora</Text>
                              <ScrollView style={dS.timeScroll} showsVerticalScrollIndicator={false} snapToInterval={44} decelerationRate="fast">
                                {Array.from({length:24},(_,i)=>i).map(h => (
                                  <TouchableOpacity key={h} style={[dS.timeItem, selectedHour===h && dS.timeItemSelected]} onPress={() => setSelectedHour(h)}>
                                    <Text style={[dS.timeItemText, selectedHour===h && dS.timeItemTextSelected]}>{String(h).padStart(2,'0')}</Text>
                                  </TouchableOpacity>
                                ))}
                              </ScrollView>
                            </View>
                            <Text style={dS.timeColon}>:</Text>
                            {/* Minutes */}
                            <View style={dS.timeColumn}>
                              <Text style={dS.timeColumnLabel}>Min</Text>
                              <ScrollView style={dS.timeScroll} showsVerticalScrollIndicator={false} snapToInterval={44} decelerationRate="fast">
                                {[0,15,30,45].map(m => (
                                  <TouchableOpacity key={m} style={[dS.timeItem, selectedMinute===m && dS.timeItemSelected]} onPress={() => { setSelectedMinute(m); setShowTimePicker(false); }}>
                                    <Text style={[dS.timeItemText, selectedMinute===m && dS.timeItemTextSelected]}>{String(m).padStart(2,'0')}</Text>
                                  </TouchableOpacity>
                                ))}
                              </ScrollView>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* PEOPLE — stepper, no keyboard */}
                    <View style={dS.bookingField}>
                      <Text style={dS.bookingFieldLabel}>👥  Pessoas</Text>
                      <View style={dS.stepperRow}>
                        <TouchableOpacity style={dS.stepperBtn} onPress={() => setBookingPeople(p => String(Math.max(1, parseInt(p||1)-1)))}>
                          <Icon name="minus" size={18} color={COLORS.darkText} strokeWidth={2.5} />
                        </TouchableOpacity>
                        <Text style={dS.stepperValue}>{bookingPeople}</Text>
                        <TouchableOpacity style={dS.stepperBtn} onPress={() => setBookingPeople(p => String(Math.min(20, parseInt(p||1)+1)))}>
                          <Icon name="plus" size={18} color={COLORS.darkText} strokeWidth={2.5} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Summary */}
                    {bookingDate && (
                      <View style={dS.bookingSummary}>
                        <Text style={dS.bookingSummaryText}>
                          {bookingPeople} pessoa(s) · {bookingDate} · {String(selectedHour).padStart(2,'0')}:{String(selectedMinute).padStart(2,'0')}
                        </Text>
                      </View>
                    )}

                    {/* Actions — always visible */}
                    <View style={dS.ratingActions}>
                      <TouchableOpacity style={dS.ratingButtonGhost} onPress={() => setShowBookingModal(false)}>
                        <Text style={dS.ratingButtonGhostText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[dS.ratingButtonPrimary, !bookingDate && {opacity:0.4}]} disabled={!bookingDate} onPress={handleBooking}>
                        <Text style={dS.ratingButtonPrimaryText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>

                  </ScrollView>
                </View>
              </View>
            </Modal>

            <Modal visible={showCompareModal} transparent animationType="slide" onRequestClose={() => setShowCompareModal(false)}>
              <View style={dS.ratingOverlay}><View style={[dS.ratingCard,{maxHeight:'85%'}]}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <Text style={dS.ratingTitle}>Comparar Negócios</Text>
                  <TouchableOpacity onPress={() => setShowCompareModal(false)}><Text style={{fontSize:24,color:COLORS.grayText}}>✕</Text></TouchableOpacity>
                </View>
                <ScrollView>
                  {compareList.map(bid => {
                    const b = MOCK_BUSINESSES.find(x=>x.id===bid);
                    if (!b) return null;
                    return (
                      <View key={bid} style={dS.compareItem}>
                        <Text style={dS.compareIcon}>{b.icon}</Text>
                        <View style={dS.compareInfo}><Text style={dS.compareName}>{b.name}</Text><Text style={dS.compareRating}>⭐ {b.rating} ({b.reviews})</Text><Text style={dS.comparePrice}>{b.price} • {b.distanceText}</Text></View>
                        <TouchableOpacity onPress={() => toggleCompare(bid)}><Text style={{fontSize:20}}>🗑️</Text></TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
                <TouchableOpacity style={dS.ratingButtonPrimary} onPress={() => { setCompareList([]); setShowCompareModal(false); }}><Text style={dS.ratingButtonPrimaryText}>Limpar Comparação</Text></TouchableOpacity>
              </View></View>
            </Modal>

            <Modal visible={showNotifications} transparent animationType="slide" onRequestClose={() => setShowNotifications(false)}>
              <View style={dS.ratingOverlay}><View style={[dS.ratingCard,{maxHeight:'80%'}]}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <Text style={dS.ratingTitle}>Notificações</Text>
                  <TouchableOpacity onPress={() => setShowNotifications(false)}><Text style={{fontSize:24,color:COLORS.grayText}}>✕</Text></TouchableOpacity>
                </View>
                <ScrollView style={{flex:1}}>
                  {notifications.length===0
                    ? <Text style={{textAlign:'center',padding:20,color:COLORS.grayText}}>Sem notificações</Text>
                    : notifications.map(n => (
                      <TouchableOpacity key={n.id} style={[dS.notificationItem,!n.read && dS.notificationItemUnread]} onPress={() => markNotificationRead(n.id)}>
                        <View style={dS.notificationContent}><Text style={dS.notificationTitle}>{n.title}</Text><Text style={dS.notificationMessage}>{n.message}</Text><Text style={dS.notificationTime}>{n.time}</Text></View>
                        {!n.read && <View style={dS.notificationDot} />}
                      </TouchableOpacity>
                    ))
                  }
                </ScrollView>
                {notifications.length > 0 && (
                  <TouchableOpacity style={dS.ratingButtonGhost} onPress={clearAllNotifications}><Text style={dS.ratingButtonGhostText}>Limpar Todas</Text></TouchableOpacity>
                )}
              </View></View>
            </Modal>

            <Modal visible={showAnalytics} transparent animationType="slide" onRequestClose={() => setShowAnalytics(false)}>
              <View style={dS.ratingOverlay}><View style={dS.ratingCard}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                  <Text style={dS.ratingTitle}>Suas Estatísticas</Text>
                  <TouchableOpacity onPress={() => setShowAnalytics(false)}><Text style={{fontSize:24,color:COLORS.grayText}}>✕</Text></TouchableOpacity>
                </View>
                <View style={dS.analyticsGrid}>
                  <View style={dS.analyticsCard}><Text style={dS.analyticsValue}>{userStats.businessesViewed}</Text><Text style={dS.analyticsLabel}>Negócios Vistos</Text></View>
                  <View style={dS.analyticsCard}><Text style={dS.analyticsValue}>{userStats.reviewsWritten}</Text><Text style={dS.analyticsLabel}>Avaliações</Text></View>
                  <View style={dS.analyticsCard}><Text style={dS.analyticsValue}>{userStats.checkIns}</Text><Text style={dS.analyticsLabel}>Check-ins</Text></View>
                  <View style={dS.analyticsCard}><Text style={dS.analyticsValue}>{userStats.savedBusinesses}</Text><Text style={dS.analyticsLabel}>Salvos</Text></View>
                </View>
                <TouchableOpacity style={dS.ratingButtonPrimary} onPress={() => setShowAnalytics(false)}><Text style={dS.ratingButtonPrimaryText}>Fechar</Text></TouchableOpacity>
              </View></View>
            </Modal>

          </View>
        )}
      </Modal>
      {/* MAIS CATEGORIAS MODAL — v2.1.0: Yelp-style full category browser */}
      <Modal visible={showAllCategories} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowAllCategories(false)}>
        <SafeAreaView style={catS.container}>
          <StatusBar barStyle="dark-content" />
          
          {/* Header */}
          <View style={[catS.header, { paddingTop: Platform.OS === 'android' ? insets.top + 12 : 12 }]}>
            <TouchableOpacity style={catS.backBtn} onPress={() => setShowAllCategories(false)}>
              <Icon name="back" size={20} color={COLORS.darkText} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={catS.headerTitle}>Mais categorias</Text>
            <View style={{width:32}} />
          </View>

          {/* Category sections */}
          <ScrollView style={catS.scroll} showsVerticalScrollIndicator={false}>
            {ALL_CATEGORIES.map((section, si) => (
              <View key={si} style={catS.section}>
                <Text style={catS.sectionTitle}>{section.section}</Text>
                <View style={catS.sectionItems}>
                  {section.items.map(item => (
                    <TouchableOpacity 
                      key={item.id} 
                      style={catS.categoryRow}
                      onPress={() => {
                        setShowAllCategories(false);
                        // Handle category selection
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={catS.categoryIconWrap}>
                        <Icon name={item.icon} size={18} color={COLORS.darkText} strokeWidth={1.5} />
                      </View>
                      <Text style={catS.categoryLabel}>{item.label}</Text>
                      <Icon name="chevronRight" size={16} color={COLORS.grayText} strokeWidth={2} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* PROFILE OVERLAY — v2.4.0: from v2.2.9, covers all content including search bar, zIndex:200 */}
      {showProfileModal && (
        <View style={[profS.overlay, { 
          top: insets.top,  // Both iOS and Android
          bottom: (insets.bottom || 0) + 58.5  // Safe area + nav bar
        }]}>
          {/* Header */}
          <View style={profS.header}>
            <TouchableOpacity style={profS.backBtn} onPress={() => setShowProfileModal(false)}>
              <Icon name="back" size={20} color={COLORS.darkText} strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={profS.headerTitle}>Perfil</Text>
            <View style={{width:32}} />
          </View>

          {/* Profile content */}
          <ScrollView style={profS.scroll} contentContainerStyle={{padding:16,paddingBottom:100}}>
            <View style={{alignItems:'center',paddingVertical:24}}>
              <View style={{width:80,height:80,borderRadius:40,backgroundColor:COLORS.grayBg,alignItems:'center',justifyContent:'center',marginBottom:12}}>
                <Icon name="user" size={40} color={COLORS.grayText} strokeWidth={1.5} />
              </View>
              <Text style={{fontSize:20,fontWeight:'700',color:COLORS.darkText}}>Utilizador</Text>
              <Text style={{fontSize:13,color:COLORS.grayText,marginTop:4}}>usuario@achaqui.ao</Text>
            </View>

            {/* Profile options */}
            {[
              {icon:'heart', label:'Favoritos', count:bookmarkedIds.length},
              {icon:'clock', label:'Histórico'},
              {icon:'bell', label:'Notificações'},
              {icon:'info', label:'Ajuda e Suporte'},
              {icon:'info', label:'Sobre o AchAqui'},
            ].map((item,i) => (
              <TouchableOpacity key={i} style={profS.categoryRow} activeOpacity={0.7}>
                <View style={profS.categoryIconWrap}>
                  <Icon name={item.icon} size={18} color={COLORS.darkText} strokeWidth={1.5} />
                </View>
                <Text style={profS.categoryLabel}>{item.label}</Text>
                {item.count !== undefined && (
                  <View style={{backgroundColor:COLORS.red,borderRadius:10,paddingHorizontal:8,paddingVertical:2,marginRight:8}}>
                    <Text style={{fontSize:11,fontWeight:'700',color:COLORS.white}}>{item.count}</Text>
                  </View>
                )}
                <Icon name="chevronRight" size={16} color={COLORS.grayText} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* BOTTOM NAVIGATION BAR — v2.0.4: absolute bottom with safe area */}
      <View style={[bnS.bar, { paddingBottom: insets.bottom + 8 }]}>
        {[
          { id:'home',     icon:'outdoor',  label:'Início'    },
          { id:'search',   icon:'search',   label:'Pesquisar' },
          { id:'featured', icon:'star',     label:'Destaque'  },
          { id:'profile',  icon:'user',     label:'Perfil'    },
        ].map(tab => {
          const active = activeNavTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={bnS.tab}
              onPress={() => {
                setActiveNavTab(tab.id);
                
                // Handle each tab action
                if (tab.id === 'home') {
                  // Close profile if open
                  setShowProfileModal(false);
                  // Reset to home view
                  setViewMode('list');
                  setActiveFilter('open');
                  setPriceFilter('all');
                  setDistanceFilter('all');
                  setSelectedAmenities([]);
                  setSearchWhat('');
                }
                else if (tab.id === 'search') {
                  // Close profile if open
                  setShowProfileModal(false);
                  // Focus search bar
                  searchInputRef.current?.focus();
                  setSearchFocused(true);
                  setShowAutocomplete(true);
                }
                else if (tab.id === 'featured') {
                  // Close profile if open
                  setShowProfileModal(false);
                  // Filter to show only featured/premium businesses
                  setViewMode('list');
                  setActiveFilter('premium');
                }
                else if (tab.id === 'profile') {
                  // Toggle profile modal
                  setShowProfileModal(!showProfileModal);
                }
              }}
              activeOpacity={0.75}
            >
              <View style={[bnS.iconWrap, active && bnS.iconWrapActive]}>
                <Icon name={tab.icon} size={20} color={active ? COLORS.red : COLORS.grayText} strokeWidth={active ? 2.5 : 1.5} />
              </View>
              <Text style={[bnS.label, active && bnS.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><AppContent /></SafeAreaProvider>;
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────

// SPONSORED CARD
const spS = StyleSheet.create({
  card: { borderRadius:12, overflow:'hidden', backgroundColor:'#1a1a1a', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.2, shadowRadius:8, elevation:6 },
  image: { width:'100%', aspectRatio:16/9, justifyContent:'space-between' },
  imageFill: { resizeMode:'cover' },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.30)' },
  topRow: { flexDirection:'row', alignItems:'center', padding:12, gap:8 },
  sponsoredPill: { backgroundColor:COLORS.red, paddingHorizontal:10, paddingVertical:4, borderRadius:20, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.35, shadowRadius:2, elevation:3 },
  sponsoredPillText: { fontSize:10, fontWeight:'800', color:COLORS.white, letterSpacing:0.5, textTransform:'uppercase' },
  premiumPill: { backgroundColor:'rgba(0,0,0,0.5)', paddingHorizontal:10, paddingVertical:4, borderRadius:20, borderWidth:1, borderColor:'rgba(255,215,0,0.65)' },
  premiumPillText: { fontSize:10, fontWeight:'700', color:'#FFD700' },
  livePill: { flexDirection:'row', alignItems:'center', gap:5, paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  liveDot: { width:6, height:6, borderRadius:3, backgroundColor:COLORS.white },
  livePillText: { fontSize:10, fontWeight:'700', color:COLORS.white },
  infoStrip: { backgroundColor:'rgba(0,0,0,0.58)', paddingHorizontal:14, paddingTop:12, paddingBottom:14, gap:4 },
  nameRow: { flexDirection:'row', alignItems:'center', gap:6 },
  name: { fontSize:18, fontWeight:'800', color:COLORS.white, flex:1, letterSpacing:-0.3 },
  verifiedBubble: { width:20, height:20, borderRadius:10, backgroundColor:'#1DA1F2', alignItems:'center', justifyContent:'center' },
  verifiedIcon: { fontSize:11, color:COLORS.white, fontWeight:'900' },
  category: { fontSize:12, color:'rgba(255,255,255,0.75)', fontWeight:'500', marginBottom:2 },
  metaRow: { flexDirection:'row', alignItems:'center', gap:5, flexWrap:'wrap' },
  ratingTxt: { fontSize:13, fontWeight:'700', color:COLORS.white },
  reviewsTxt: { fontSize:11, color:'rgba(255,255,255,0.7)' },
  dot: { width:3, height:3, borderRadius:1.5, backgroundColor:'rgba(255,255,255,0.4)', marginHorizontal:2 },
  statusDot: { fontSize:8 },
  dotOpen: { color:'#4ADE80' }, dotClosed: { color:'#F87171' },
  statusTxt: { fontSize:11, fontWeight:'600' },
  statusOpen: { color:'#4ADE80' }, statusClosed: { color:'#F87171' },
  promoBanner: { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(211,35,35,0.88)', borderRadius:6, paddingHorizontal:10, paddingVertical:6, marginTop:6, gap:6 },
  promoIcon: { fontSize:13 },
  promoTxt: { fontSize:12, fontWeight:'700', color:COLORS.white, flex:1 },
});

// HOME — v1.9.5 premium
const hS = StyleSheet.create({
  container: { flex:1, backgroundColor:COLORS.grayBg, flexDirection:'column' },
  headerWrapper: { backgroundColor:COLORS.white, zIndex:10001, elevation:31, position:'relative' },
  header: { paddingHorizontal:16, paddingBottom:12, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  headerTopRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:12 },
  versionRow: { flexDirection:'row', alignItems:'center', flex:1, marginLeft:12 },
  versionText: { fontSize:10, color:COLORS.grayText, fontWeight:'600', letterSpacing:0.3 },
  logo: { fontSize:20, fontWeight:'800', color:COLORS.red, letterSpacing:-0.5 },
  headerActions: { flexDirection:'row', gap:4 },
  headerActionBtn: { width:34, height:34, borderRadius:17, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center', position:'relative' },
  notifBadge: { position:'absolute', top:-2, right:-2, width:14, height:14, borderRadius:7, backgroundColor:COLORS.red, alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:COLORS.white },
  notifBadgeText: { fontSize:8, fontWeight:'800', color:COLORS.white },
  searchBar: { flexDirection:'row', borderWidth:1, borderColor:COLORS.grayLine, borderRadius:10, backgroundColor:COLORS.white, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.04, shadowRadius:2, elevation:1 },
  searchColumn: { flex:1, paddingVertical:7, paddingHorizontal:10 },
  searchDivider: { width:1, backgroundColor:COLORS.grayLine },
  searchLabel: { fontSize:9, color:COLORS.grayText, marginBottom:2, fontWeight:'600', letterSpacing:0.4, textTransform:'uppercase' },
  searchInput: { fontSize:12, color:COLORS.darkText, paddingVertical:0, fontWeight:'500' },
  categoryRowWrapper: { backgroundColor:COLORS.white, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  categoryRow: { paddingHorizontal:16, paddingVertical:10, gap:8 },
  categoryChip: { flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:COLORS.grayLine, borderRadius:20, paddingHorizontal:12, paddingVertical:7, backgroundColor:COLORS.white, gap:6 },
  categoryChipIconWrap: { width:16, height:16, alignItems:'center', justifyContent:'center' },
  categoryChipLabel: { fontSize:12, color:COLORS.darkText, fontWeight:'600', letterSpacing:-0.1 },
  scroll: { flex:1 },
  scrollContent: { paddingBottom:70 },
  sponsoredWrapper: { marginHorizontal:16, marginTop:16, marginBottom:0 },
  controlsSection: { backgroundColor:COLORS.white, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  unifiedFilterContainer: { paddingHorizontal:16, paddingTop:4, paddingBottom:4 },
  filterRow: { flexDirection:'row', width:'100%', alignItems:'center' },
  filterItem: { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', paddingVertical:6, gap:5, minHeight:32 },
  filterItemActive: { backgroundColor:'#FFF5F5', borderRadius:8 },
  filterItemText: { fontSize:11, color:COLORS.darkText, fontWeight:'600', letterSpacing:-0.1 },
  filterItemTextActive: { color:COLORS.red },
  filtersSpacer: { height:1, backgroundColor:COLORS.grayLine, marginVertical:2 },
  controlBadge: { width:16, height:16, borderRadius:8, backgroundColor:COLORS.red, alignItems:'center', justifyContent:'center', marginLeft:2 },
  controlBadgeText: { fontSize:9, color:COLORS.white, fontWeight:'800' },
  sectionHeader: { paddingHorizontal:16, paddingBottom:6, paddingTop:12, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  sectionTitle: { fontSize:15, fontWeight:'700', color:COLORS.darkText, letterSpacing:-0.3 },
  sectionCount: { fontSize:11, color:COLORS.grayText, fontWeight:'500' },
  listCell: { flexDirection:'row', backgroundColor:COLORS.white, marginHorizontal:16, marginBottom:6, borderRadius:14, padding:12, shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.06, shadowRadius:4, elevation:2 },
  listCellImage: { width:72, height:72, borderRadius:10, marginRight:12, position:'relative', overflow:'hidden', backgroundColor:COLORS.grayBg },
  listCellPhoto: { width:'100%', height:'100%' },
  listCellIcon: { fontSize:30 },
  listCellInfo: { flex:1 },
  listCellTitleRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:3 },
  listCellTitle: { fontSize:14, fontWeight:'700', color:COLORS.darkText, flex:1, letterSpacing:-0.2 },
  bookmarkBtn: { padding:4, marginLeft:4 },
  listCellMeta: { flexDirection:'row', alignItems:'center', marginBottom:3 },
  listCellRating: { marginLeft:5, fontSize:12, fontWeight:'700', color:COLORS.darkText },
  listCellReviews: { marginLeft:3, fontSize:11, color:COLORS.grayText },
  listCellCategory: { fontSize:11, color:COLORS.grayText, marginBottom:2, fontWeight:'500' },
  listCellAddressRow: { flexDirection:'row', alignItems:'center', gap:3, marginBottom:4 },
  listCellAddress: { fontSize:10, color:COLORS.grayText, flex:1 },
  amenitiesRow: { flexDirection:'row', gap:5, marginBottom:6 },
  amenityChip: { backgroundColor:COLORS.grayBg, borderRadius:8, width:24, height:24, alignItems:'center', justifyContent:'center' },
  listCellFooter: { flexDirection:'row', justifyContent:'space-between', marginTop:2, alignItems:'center' },
  listCellDistance: { fontSize:11, color:COLORS.grayText, fontWeight:'500' },
  openText: { fontSize:11, color:COLORS.green, fontWeight:'600' },
  closedText: { fontSize:11, color:COLORS.red, fontWeight:'600' },
  closingSoonText: { fontSize:11, color:'#F59E0B', fontWeight:'700' },
  dealsBadgeTopRight: { position:'absolute', top:28, right:4, backgroundColor:COLORS.red, paddingHorizontal:5, paddingVertical:2, borderRadius:10, zIndex:10, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.3, shadowRadius:3, elevation:4, borderWidth:1.5, borderColor:COLORS.white, flexDirection:'row', alignItems:'center', gap:2 },
  dealsBadgeText: { fontSize:9, fontWeight:'800', color:COLORS.white },
  compareCheckbox: { padding:4 },
  premiumBadge: { fontSize:12, marginLeft:3 },
  verifiedBadge: { fontSize:10, color:'#1DA1F2', marginLeft:2, fontWeight:'700' },
  compareFloatingContainer: { position:'absolute', bottom:24, left:0, right:0, alignItems:'center', zIndex:10 },
  compareFloatingBtn: { backgroundColor:COLORS.red, paddingHorizontal:24, paddingVertical:13, borderRadius:25, elevation:8, shadowColor:COLORS.red, shadowOffset:{width:0,height:4}, shadowOpacity:0.35, shadowRadius:8 },
  compareFloatingText: { fontSize:15, fontWeight:'700', color:COLORS.white },

  // ── Carousel v2.0.4: ONE card at a time, full screen width ──────────────
  carouselSection: { marginTop:12, marginBottom:4 },
  carouselHeader: { paddingHorizontal:16, marginBottom:10, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  carouselTitle: { fontSize:12, fontWeight:'700', color:COLORS.darkText, letterSpacing:0.3, textTransform:'uppercase' },
  carouselDots: { flexDirection:'row', gap:5, alignItems:'center' },
  carouselDot: { width:5, height:5, borderRadius:2.5, backgroundColor:COLORS.grayLine },
  carouselDotActive: { width:16, height:5, borderRadius:2.5, backgroundColor:COLORS.red },
  carouselScroll: { paddingVertical:0 },
  carouselItem: { width:SCREEN_WIDTH, paddingHorizontal:16 },
});

// AUTOCOMPLETE — v2.0.3: drops below header/search bar correctly
const acS = StyleSheet.create({
  backdrop: { position:'absolute', top:0, left:0, right:0, bottom:0, zIndex:999 },
  absoluteDropdown: { position:'absolute', top:180, left:0, right:0, maxHeight:400, zIndex:1000, elevation:5 },
  container: { flex:1, backgroundColor:COLORS.white, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:5 },
  scroll: { flex:1 },
  scrollContent: { paddingBottom:70 },
  sectionTitle: { fontSize:10, fontWeight:'700', color:COLORS.grayText, paddingHorizontal:16, paddingTop:12, paddingBottom:6, letterSpacing:0.8, textTransform:'uppercase' },
  item: { flexDirection:'row', alignItems:'center', paddingVertical:12, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, gap:10 },
  text: { fontSize:13, color:COLORS.darkText, flex:1, fontWeight:'500' },
  recentHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, paddingTop:12, paddingBottom:2 },
  clearText: { fontSize:11, color:COLORS.red, fontWeight:'700' },
});

// FILTER BADGES
const fbS = StyleSheet.create({
  container: { paddingBottom:8 },
  scroll: { paddingHorizontal:16, gap:8 },
  badge: { flexDirection:'row', alignItems:'center', backgroundColor:COLORS.red, borderRadius:16, paddingVertical:6, paddingLeft:12, paddingRight:8, gap:6 },
  badgeText: { fontSize:12, color:COLORS.white, fontWeight:'600' },
  badgeClose: { width:16, height:16, borderRadius:8, backgroundColor:'rgba(255,255,255,0.3)', alignItems:'center', justifyContent:'center' },
  badgeCloseText: { fontSize:10, color:COLORS.white, fontWeight:'700' },
});

// MODALS
const modS = StyleSheet.create({
  overlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'flex-end' },
  sortMenu: { backgroundColor:COLORS.white, borderTopLeftRadius:28, borderTopRightRadius:28, padding:24, shadowColor:'#000', shadowOffset:{width:0,height:-8}, shadowOpacity:0.08, shadowRadius:20, elevation:20 },
  sortTitle: { fontSize:18, fontWeight:'800', color:COLORS.darkText, marginBottom:20, letterSpacing:-0.5 },
  sortOption: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:16, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  sortOptionText: { fontSize:14, color:COLORS.darkText, fontWeight:'500' },
  sortOptionTextActive: { fontWeight:'700', color:COLORS.red },
  sortCheck: { fontSize:16, color:COLORS.red },
});

// ADVANCED FILTERS
const afS = StyleSheet.create({
  panel: { flex:1, backgroundColor:COLORS.white, marginTop:80, borderTopLeftRadius:28, borderTopRightRadius:28, shadowColor:'#000', shadowOffset:{width:0,height:-8}, shadowOpacity:0.08, shadowRadius:20, elevation:20 },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:24, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  title: { fontSize:18, fontWeight:'800', color:COLORS.darkText, letterSpacing:-0.5 },
  close: { fontSize:26, color:COLORS.grayText, fontWeight:'300' },
  scroll: { flex:1, padding:20 },
  groupTitle: { fontSize:14, fontWeight:'700', color:COLORS.darkText, marginBottom:12, marginTop:8 },
  group: { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:20 },
  option: { paddingVertical:8, paddingHorizontal:16, borderRadius:20, borderWidth:1, borderColor:COLORS.grayLine, backgroundColor:COLORS.white },
  optionActive: { borderColor:COLORS.red, backgroundColor:'#FFF0F0' },
  optionText: { fontSize:13, color:COLORS.darkText, fontWeight:'600' },
  optionTextActive: { color:COLORS.red },
  footer: { flexDirection:'row', padding:20, gap:12, borderTopWidth:1, borderTopColor:COLORS.grayLine },
  clearBtn: { flex:1, paddingVertical:14, alignItems:'center', borderRadius:12, borderWidth:1, borderColor:COLORS.grayLine },
  clearText: { fontSize:14, fontWeight:'700', color:COLORS.darkText },
  applyBtn: { flex:1, paddingVertical:14, alignItems:'center', borderRadius:12, backgroundColor:COLORS.red },
  applyText: { fontSize:14, fontWeight:'700', color:COLORS.white },
  priceRangeRow: { flexDirection:'row', alignItems:'flex-end', gap:8, marginTop:12, marginBottom:4 },
  priceRangeField: { flex:1 },
  priceRangeLabel: { fontSize:11, fontWeight:'600', color:COLORS.grayText, marginBottom:6, textTransform:'uppercase', letterSpacing:0.4 },
  priceRangeInputWrap: { flexDirection:'row', alignItems:'center', borderWidth:1.5, borderColor:COLORS.grayLine, borderRadius:10, paddingHorizontal:10, paddingVertical:10, backgroundColor:COLORS.white, gap:6 },
  priceRangeCurrency: { fontSize:13, fontWeight:'800', color:COLORS.darkText },
  priceRangeInput: { flex:1, fontSize:14, color:COLORS.darkText, padding:0, fontWeight:'500' },
  priceRangeDivider: { width:12, height:1.5, backgroundColor:COLORS.grayLine, marginBottom:16 },
});

// STARS — v1.9.5 premium
const starS = StyleSheet.create({
  row: { flexDirection:'row', alignItems:'center' },
  star: { fontSize:11, marginRight:1 },
  filled: { color:'#F59E0B' },
  empty: { color:'#E5E7EB' },
});
const heroStarS = StyleSheet.create({
  row: { flexDirection:'row', alignItems:'center' },
  star: { fontSize:11, marginRight:1 },
  filled: { color:'#FCD34D' },
  empty: { color:'rgba(255,255,255,0.35)' },
});

// DETAIL
const dS = StyleSheet.create({
  container: { flex:1, backgroundColor:COLORS.white },
  scrollContent: { paddingBottom:24 },

  // ── v1.9.4: fixed header — back | centered title | actions ──
  fixedHeader: { position:'absolute', top:0, left:0, right:0, backgroundColor:COLORS.white, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, zIndex:9999, elevation:10, paddingBottom:12 },
  fixedHeaderRow: { flexDirection:'row', alignItems:'center', paddingHorizontal:16, justifyContent:'space-between' },
  topBarBack: { width:32, height:32, borderRadius:16, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  topBarBackText: { fontSize:16, color:COLORS.darkText, fontWeight:'700' },
  topBarTitleContainer: { flex:1, alignItems:'center' },
  topBarTitle: { fontSize:18, color:COLORS.darkText, fontWeight:'700', textAlign:'center', letterSpacing:-0.3 },
  headerActions: { flexDirection:'row', gap:4 },
  headerActionBtn: { width:32, height:32, borderRadius:16, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  headerActionIcon: { fontSize:18 },

  heroBlock: { backgroundColor:COLORS.white },
  heroImageWrap: { width:'100%', height:260, position:'relative', overflow:'hidden', backgroundColor:COLORS.grayBg },
  heroInfoStrip: { paddingHorizontal:16, paddingTop:14, paddingBottom:12, backgroundColor:COLORS.white, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  heroInfoTop: { flexDirection:'row', alignItems:'flex-start', marginBottom:8 },
  heroCategory: { fontSize:12, color:COLORS.grayText, marginTop:3, fontWeight:'500' },
  heroPremiumBadge: { backgroundColor:'#FFF8E1', borderRadius:10, paddingHorizontal:8, paddingVertical:4, borderWidth:1, borderColor:'#FFD700' },
  heroPremiumText: { fontSize:11, fontWeight:'700', color:'#B8860B' },
  heroSeparator: { width:1, height:12, backgroundColor:COLORS.grayLine, marginHorizontal:8 },
  heroStatusDot: { width:7, height:7, borderRadius:3.5, marginRight:4 },
  heroInfoMeta: { flexDirection:'row', alignItems:'center', marginTop:6, gap:4 },
  heroDistance: { fontSize:11, color:COLORS.grayText, fontWeight:'500' },
  heroPriceDot: { fontSize:14, color:COLORS.grayText },
  heroPrice: { fontSize:11, color:COLORS.grayText, fontWeight:'600' },
  // legacy kept for scroll interpolation reference
  heroImage: { width:'100%', height:260, position:'relative', backgroundColor:COLORS.grayBg },
  heroImageStyle: { width:'100%', height:'100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor:COLORS.heroOverlay },
  photoCounter: { position:'absolute', bottom:12, right:12, backgroundColor:'rgba(0,0,0,0.55)', paddingHorizontal:10, paddingVertical:5, borderRadius:12, backdropFilter:'blur(8px)' },
  photoCounterText: { color:COLORS.white, fontSize:12, fontWeight:'700' },
  heroIcon: { fontSize:48, color:COLORS.white, alignSelf:'flex-start' },
  // heroContent removed in v2.0.1 — info is now in heroInfoStrip
  heroTitle: { fontSize:20, fontWeight:'800', color:COLORS.darkText, letterSpacing:-0.5 },
  heroMetaRow: { flexDirection:'row', alignItems:'center', gap:5, flexWrap:'wrap' },
  heroRating: { fontSize:13, fontWeight:'700', color:COLORS.darkText },
  heroReviews: { fontSize:12, color:COLORS.grayText },
  heroStatusText: { fontSize:12, fontWeight:'600' },  // color applied inline
  floatingBack: { position:'absolute', left:16, width:38, height:38, borderRadius:19, backgroundColor:'rgba(0,0,0,0.40)', alignItems:'center', justifyContent:'center', zIndex:10, borderWidth:1, borderColor:'rgba(255,255,255,0.2)' },
  floatingActions: { position:'absolute', right:16, flexDirection:'row', gap:8, zIndex:10 },
  floatingActionBtn: { width:36, height:36, borderRadius:18, backgroundColor:'rgba(0,0,0,0.35)', alignItems:'center', justifyContent:'center' },
  floatingActionIcon: { fontSize:18 },

  // v1.9.3: reduced vertical padding
  ratingSection: { backgroundColor:COLORS.white, paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, alignItems:'center' },
  reviewStarterTitle: { fontSize:11, color:COLORS.grayText, fontWeight:'700', marginBottom:10, textTransform:'uppercase', letterSpacing:0.8, textAlign:'center' },
  reviewStarterStars: { flexDirection:'row', gap:8 },
  reviewStarterStar: { fontSize:28, color:'#E5E7EB' },
  reviewStarterStarFilled: { color:'#F59E0B' },
  reviewStarterCta: { fontSize:11, color:COLORS.grayText, fontWeight:'600', letterSpacing:0.3 },
  // modal stars
  ratingSubtitle: { fontSize:13, color:COLORS.grayText, marginTop:4, marginBottom:16 },
  modalStarsRow: { flexDirection:'row', justifyContent:'center', gap:8, marginBottom:8 },
  modalStar: { fontSize:40, color:'#E5E7EB' },
  modalStarFilled: { color:'#F59E0B' },
  ratingLabel: { textAlign:'center', fontSize:14, fontWeight:'700', color:COLORS.darkText, marginBottom:12 },

  // v1.9.3: reduced vertical padding
  socialActionsSection: { backgroundColor:COLORS.grayBg, paddingVertical:10, paddingHorizontal:16 },
  socialStatsRow: { flexDirection:'row', justifyContent:'space-around', marginBottom:12 },
  socialStat: { alignItems:'center' },
  socialStatValue: { fontSize:20, fontWeight:'700', color:COLORS.darkText },
  socialStatLabel: { fontSize:11, color:COLORS.grayText, marginTop:4 },
  socialButtonsRow: { flexDirection:'row', gap:8 },
  socialButton: { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:COLORS.white, borderWidth:1, borderColor:COLORS.grayLine, borderRadius:20, paddingVertical:10, gap:6 },
  socialButtonActive: { backgroundColor:COLORS.red, borderColor:COLORS.red },
  socialButtonIcon: { fontSize:14 },
  socialButtonText: { fontSize:12, fontWeight:'700', color:COLORS.darkText },
  socialButtonTextActive: { color:COLORS.white },

  stickyHeader: { backgroundColor:COLORS.white, borderTopWidth:1, borderTopColor:'#EEE', borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  tabsBar: { flexDirection:'row', justifyContent:'space-between', gap:20, paddingHorizontal:15 },
  tabItem: { paddingVertical:6, alignItems:'center' },
  tabText: { fontSize:12, color:COLORS.grayText, fontWeight:'600' },
  tabTextActive: { fontSize:12, color:COLORS.red, fontWeight:'700' },
  tabIndicator: { marginTop:6, height:2, width:24, backgroundColor:COLORS.red, borderRadius:2 },

  businessTypeBadgeContainer: { paddingHorizontal:16, marginTop:-8, marginBottom:12 },
  businessTypeBadge: { alignSelf:'flex-start', flexDirection:'row', alignItems:'center', paddingVertical:6, paddingHorizontal:12, borderRadius:16, gap:6 },
  businessTypeBadgeIcon: { fontSize:14 },
  businessTypeBadgeText: { fontSize:12, fontWeight:'700', color:COLORS.white },

  // v1.9.3: paddingTop 20 → 12
  sectionBlock: { paddingHorizontal:16, paddingTop:12 },
  // v1.9.3: paddingTop 12 → 8
  menuSectionBlock: { paddingHorizontal:16, paddingTop:8 },
  sectionTitle: { fontSize:14, fontWeight:'700', color:COLORS.darkText, marginBottom:12 },

  dealCard: { backgroundColor:'#FFFBF0', borderRadius:16, padding:16, marginBottom:12, borderWidth:1.5, borderColor:'#FFE082', shadowColor:'#FFD700', shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:6, elevation:2 },
  dealCardHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 },
  dealTitle: { fontSize:15, fontWeight:'700', color:COLORS.darkText, flex:1, marginRight:8 },
  dealCodeBadge: { backgroundColor:COLORS.red, paddingHorizontal:10, paddingVertical:4, borderRadius:12 },
  dealCodeText: { fontSize:11, fontWeight:'700', color:COLORS.white },
  dealDescription: { fontSize:12, color:COLORS.grayText, marginBottom:6 },
  dealExpires: { fontSize:11, color:COLORS.red, fontWeight:'600' },

  bookingCard: { flexDirection:'row', alignItems:'center', backgroundColor:COLORS.white, borderRadius:14, borderWidth:1, borderColor:COLORS.grayLine, padding:16, gap:14 },
  bookingIconWrap: { width:48, height:48, borderRadius:12, backgroundColor:COLORS.redLight, alignItems:'center', justifyContent:'center' },
  bookingInfo: { flex:1 },
  bookingTitle: { fontSize:15, fontWeight:'700', color:COLORS.darkText, letterSpacing:-0.2 },
  bookingSubtitle: { fontSize:12, color:COLORS.grayText, marginTop:3 },
  bookingInput: { borderWidth:1, borderColor:COLORS.grayLine, borderRadius:8, padding:12, fontSize:14, color:COLORS.darkText },

  liveStatusBanner: { marginHorizontal:16, marginBottom:16, padding:12, borderRadius:8, borderWidth:2, flexDirection:'row', alignItems:'center', gap:10 },
  liveDot: { width:10, height:10, borderRadius:5 },
  liveStatusText: { fontSize:13, fontWeight:'700' },

  servicesCard: { borderRadius:12, borderWidth:1, borderColor:COLORS.grayLine, overflow:'hidden' },
  serviceItem: { padding:14, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  serviceItemHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 },
  serviceItemTitle: { fontSize:14, fontWeight:'700', color:COLORS.darkText, flex:1, marginRight:8 },
  serviceItemPrice: { fontSize:14, fontWeight:'700', color:COLORS.red },
  serviceItemDuration: { fontSize:11, color:COLORS.grayText, marginBottom:6 },
  serviceItemDesc: { fontSize:12, color:COLORS.grayText, lineHeight:18 },

  portfolioScroll: { marginTop:12 },
  portfolioImage: { width:150, height:150, borderRadius:8, marginRight:12, backgroundColor:COLORS.grayBg },

  availabilityCalendar: { flexDirection:'row', justifyContent:'space-between', marginTop:12 },
  availabilityDay: { flex:1, alignItems:'center' },
  availabilityDayCircle: { width:44, height:44, borderRadius:22, alignItems:'center', justifyContent:'center', borderWidth:2 },
  availabilityDayAvailable: { backgroundColor:COLORS.green, borderColor:COLORS.green },
  availabilityDayUnavailable: { backgroundColor:COLORS.grayBg, borderColor:COLORS.grayLine },
  availabilityDayText: { fontSize:10, fontWeight:'700', color:COLORS.grayText },
  availabilityDayTextAvailable: { color:COLORS.white },

  menuCard: { borderRadius:12, borderWidth:1, borderColor:COLORS.grayLine, padding:12, gap:12 },
  menuItem: { flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between' },
  menuItemText: { flex:1, paddingRight:12 },
  menuItemTitle: { fontSize:13, fontWeight:'700', color:COLORS.darkText },
  menuItemDesc: { fontSize:11, color:COLORS.grayText, marginTop:4 },
  menuItemPrice: { fontSize:12, color:COLORS.darkText, fontWeight:'700' },

  popularDishesCard: { borderRadius:12, borderWidth:1, borderColor:COLORS.grayLine, padding:12, gap:12 },
  popularDishItem: { flexDirection:'row', alignItems:'center', gap:12 },
  popularDishRank: { width:28, height:28, borderRadius:14, backgroundColor:COLORS.red, alignItems:'center', justifyContent:'center' },
  popularDishRankText: { fontSize:14, fontWeight:'700', color:COLORS.white },
  popularDishInfo: { flex:1 },
  popularDishName: { fontSize:13, fontWeight:'700', color:COLORS.darkText },
  popularDishOrders: { fontSize:11, color:COLORS.grayText, marginTop:2 },
  popularDishPrice: { fontSize:12, fontWeight:'700', color:COLORS.darkText },

  infoActionRow: { flexDirection:'row', gap:8, justifyContent:'space-between', marginBottom:12 },
  actionOutline: { flexDirection:'row', alignItems:'center', borderWidth:1, borderColor:COLORS.grayLine, borderRadius:18, paddingHorizontal:14, paddingVertical:8, backgroundColor:COLORS.white },
  actionEqual: { flex:1, justifyContent:'center', minHeight:36 },
  actionIcon: { fontSize:14, marginRight:6 },
  actionText: { fontSize:12, color:COLORS.darkText, fontWeight:'600' },
  whatsappButton: { backgroundColor:'#25D366', borderColor:'#25D366' },
  whatsappBadge: { width:22, height:22, borderRadius:11, backgroundColor:COLORS.white, alignItems:'center', justifyContent:'center', marginRight:6 },
  whatsappButtonText: { color:COLORS.white, fontWeight:'700', fontSize:12, flexShrink:1 },
  infoHighlightText: { fontSize:12, color:COLORS.grayText, marginBottom:12 },

  mapCard: { borderRadius:12, backgroundColor:COLORS.white, borderWidth:1, borderColor:COLORS.grayLine, overflow:'hidden' },
  mapPlaceholder: { height:140, backgroundColor:COLORS.mapBg, alignItems:'center', justifyContent:'center' },
  mapText: { color:COLORS.grayText, fontSize:12, fontWeight:'600' },
  mapInfoRow: { padding:12, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  mapInfoText: { flex:1, paddingRight:12 },
  mapAddress: { fontSize:12, fontWeight:'700', color:COLORS.darkText },
  mapNeighborhood: { fontSize:11, color:COLORS.grayText, marginTop:2 },
  directionsBtn: { flexDirection:'row', alignItems:'center', backgroundColor:COLORS.grayBg, borderRadius:16, paddingHorizontal:12, paddingVertical:6 },
  directionsText: { fontSize:12, color:COLORS.darkText, fontWeight:'700' },
  directionsIcon: { marginLeft:6, fontSize:14, color:COLORS.darkText },

  infoList: { marginTop:16, gap:12 },
  infoRow: { flexDirection:'row', alignItems:'flex-start' },
  infoIconWrap: { width:20, alignItems:'center', marginTop:1, marginRight:10 },
  infoTextBlock: { flex:1, gap:4 },
  infoText: { fontSize:12, color:COLORS.grayText, lineHeight:18 },

  reviewStatsCard: { backgroundColor:COLORS.white, borderRadius:12, borderWidth:1, borderColor:COLORS.grayLine, padding:16, marginBottom:16 },
  reviewStatsHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  reviewStatsAvg: { fontSize:36, fontWeight:'700', color:COLORS.red },
  reviewStatsTotal: { fontSize:12, color:COLORS.grayText, marginTop:4 },
  reviewStatsToggle: { fontSize:20, color:COLORS.grayText },
  reviewStatsDistribution: { marginTop:16, gap:8 },
  reviewStatsRow: { flexDirection:'row', alignItems:'center', gap:8 },
  reviewStatsLabel: { fontSize:12, fontWeight:'600', color:COLORS.darkText, width:30 },
  reviewStatsBarBg: { flex:1, height:8, backgroundColor:COLORS.grayBg, borderRadius:4, overflow:'hidden' },
  reviewStatsBarFill: { height:'100%', backgroundColor:COLORS.red },
  reviewStatsCount: { fontSize:11, color:COLORS.grayText, width:25, textAlign:'right' },

  reviewControls: { marginBottom:12 },
  reviewControlLabel: { fontSize:12, fontWeight:'700', color:COLORS.darkText, marginRight:8, paddingTop:6 },
  reviewSortChip: { paddingVertical:6, paddingHorizontal:12, borderRadius:16, borderWidth:1, borderColor:COLORS.grayLine, marginRight:8, backgroundColor:COLORS.white },
  reviewSortChipActive: { borderColor:COLORS.red, backgroundColor:'#FFF0F0' },
  reviewSortText: { fontSize:11, color:COLORS.darkText, fontWeight:'600' },
  reviewSortTextActive: { color:COLORS.red },
  reviewFilterChip: { paddingVertical:6, paddingHorizontal:12, borderRadius:16, borderWidth:1, borderColor:COLORS.grayLine, marginRight:8, backgroundColor:COLORS.white },
  reviewFilterChipActive: { borderColor:COLORS.red, backgroundColor:'#FFF0F0' },
  reviewFilterText: { fontSize:11, color:COLORS.darkText, fontWeight:'600' },
  reviewFilterTextActive: { color:COLORS.red },

  reviewsList: { gap:12 },
  reviewCard: { borderWidth:1, borderColor:COLORS.grayLine, borderRadius:12, padding:12 },
  reviewHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  reviewUserInfo: { flexDirection:'row', alignItems:'center', gap:10 },
  reviewAvatar: { fontSize:32 },
  reviewName: { fontSize:13, fontWeight:'700', color:COLORS.darkText },
  reviewDate: { fontSize:11, color:COLORS.grayText },
  reviewStars: { marginTop:6 },
  reviewComment: { marginTop:8, fontSize:12, color:COLORS.grayText, lineHeight:18 },
  reviewPhotosScroll: { marginTop:12 },
  reviewPhoto: { width:80, height:80, borderRadius:8, marginRight:8, backgroundColor:COLORS.grayBg },
  reviewHelpfulBtn: { flexDirection:'row', alignItems:'center', gap:6, marginTop:12, paddingVertical:8, paddingHorizontal:12, borderRadius:8, backgroundColor:COLORS.grayBg, alignSelf:'flex-start' },
  reviewHelpfulIcon: { fontSize:16 },
  reviewHelpfulText: { fontSize:12, color:COLORS.grayText, fontWeight:'600' },
  reviewHelpfulTextActive: { color:COLORS.red },
  ownerResponseCard: { marginTop:12, backgroundColor:'#FFF9E6', borderRadius:8, padding:12, borderLeftWidth:3, borderLeftColor:'#FFD700' },
  ownerResponseHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:8 },
  ownerResponseBadge: { fontSize:11, fontWeight:'700', color:'#C17900' },
  ownerResponseDate: { fontSize:10, color:COLORS.grayText },
  ownerResponseText: { fontSize:12, color:COLORS.darkText, lineHeight:18 },

  uploadPhotoBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', marginTop:12, padding:12, borderRadius:12, borderWidth:1, borderColor:COLORS.grayLine, borderStyle:'dashed', gap:8 },
  uploadPhotoIcon: { fontSize:20 },
  uploadPhotoText: { fontSize:13, color:COLORS.darkText, fontWeight:'600' },
  uploadPhotoHint: { fontSize:12, color:COLORS.grayText, marginTop:8, marginBottom:16, textAlign:'center' },

  qaSection: { marginBottom:20 },
  qaSectionHeader: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  qaTitle: { fontSize:15, fontWeight:'700', color:COLORS.darkText },
  qaAskBtn: { fontSize:13, fontWeight:'700', color:COLORS.red },
  qaItem: { backgroundColor:COLORS.grayBg, borderRadius:12, padding:12, marginBottom:10 },
  qaQuestion: { fontSize:13, fontWeight:'700', color:COLORS.darkText, marginBottom:8 },
  qaAnswer: { fontSize:12, color:COLORS.grayText, lineHeight:18, marginBottom:8 },
  qaFooter: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  qaDate: { fontSize:10, color:COLORS.grayText },
  qaHelpful: { fontSize:11, color:COLORS.darkText },
  qaViewAll: { alignItems:'center', paddingVertical:8 },
  qaViewAllText: { fontSize:13, fontWeight:'600', color:COLORS.red },

  referralCard: { backgroundColor:'#FFF9E6', borderRadius:12, padding:16, marginBottom:20, borderWidth:2, borderColor:'#FFD700' },
  referralHeader: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  referralIcon: { fontSize:32, marginRight:12 },
  referralHeaderText: { flex:1 },
  referralTitle: { fontSize:15, fontWeight:'700', color:COLORS.darkText },
  referralSubtitle: { fontSize:11, color:COLORS.grayText, marginTop:2 },
  referralCodeContainer: { flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:COLORS.white, borderRadius:8, paddingVertical:12, paddingHorizontal:16, marginBottom:8, borderWidth:1, borderColor:'#FFD700' },
  referralCode: { fontSize:20, fontWeight:'700', color:COLORS.red, letterSpacing:2 },
  referralCopyIcon: { fontSize:20, marginLeft:12 },
  referralHint: { fontSize:10, color:COLORS.grayText, textAlign:'center' },

  highlightsRow: { flexDirection:'row', flexWrap:'wrap', gap:8 },
  highlightChip: { borderRadius:14, paddingHorizontal:10, paddingVertical:6, backgroundColor:'#FFF0F0', borderWidth:1, borderColor:'#F8C9C9' },
  highlightText: { fontSize:11, color:COLORS.red, fontWeight:'600' },

  ratingOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.55)', alignItems:'center', justifyContent:'center', padding:20 },
  ratingCard: { width:'100%', backgroundColor:COLORS.white, borderRadius:24, padding:24, shadowColor:'#000', shadowOffset:{width:0,height:20}, shadowOpacity:0.15, shadowRadius:40, elevation:20 },
  ratingTitle: { fontSize:17, fontWeight:'800', color:COLORS.darkText, marginBottom:4, letterSpacing:-0.4 },
  ratingInput: { marginTop:16, borderWidth:1.5, borderColor:COLORS.grayLine, borderRadius:14, padding:14, minHeight:120, textAlignVertical:'top', color:COLORS.darkText, fontSize:14, backgroundColor:COLORS.grayBg },
  ratingActions: { flexDirection:'row', justifyContent:'flex-end', gap:10, marginTop:20 },
  ratingButtonGhost: { paddingHorizontal:16, paddingVertical:12, borderRadius:12, borderWidth:1, borderColor:COLORS.grayLine },
  ratingButtonGhostText: { color:COLORS.grayText, fontWeight:'700', fontSize:13 },
  ratingButtonPrimary: { backgroundColor:COLORS.red, borderRadius:12, paddingHorizontal:20, paddingVertical:12, shadowColor:COLORS.red, shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:8, elevation:4 },
  ratingButtonPrimaryText: { color:COLORS.white, fontWeight:'800', fontSize:13 },

  collectionItem: { flexDirection:'row', alignItems:'center', padding:12, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  collectionIcon: { fontSize:32, marginRight:12 },
  collectionInfo: { flex:1 },
  collectionName: { fontSize:14, fontWeight:'700', color:COLORS.darkText },
  collectionCount: { fontSize:11, color:COLORS.grayText, marginTop:2 },
  collectionCheckbox: { width:24, height:24, borderWidth:2, borderColor:COLORS.grayLine, borderRadius:6, alignItems:'center', justifyContent:'center' },
  collectionCheckboxIcon: { fontSize:16, color:COLORS.grayText },

  compareItem: { flexDirection:'row', alignItems:'center', padding:12, borderBottomWidth:1, borderBottomColor:COLORS.grayLine },
  compareIcon: { fontSize:32, marginRight:12 },
  compareInfo: { flex:1 },
  compareName: { fontSize:14, fontWeight:'700', color:COLORS.darkText },
  compareRating: { fontSize:11, color:COLORS.grayText, marginTop:2 },
  comparePrice: { fontSize:11, color:COLORS.grayText, marginTop:2 },

  notificationItem: { padding:16, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, flexDirection:'row', alignItems:'flex-start' },
  notificationItemUnread: { backgroundColor:'#FFF5F5' },
  notificationContent: { flex:1 },
  notificationTitle: { fontSize:14, fontWeight:'700', color:COLORS.darkText, marginBottom:4 },
  notificationMessage: { fontSize:12, color:COLORS.grayText, marginBottom:4 },
  notificationTime: { fontSize:10, color:COLORS.grayText },
  notificationDot: { width:8, height:8, borderRadius:4, backgroundColor:COLORS.red, marginLeft:8, marginTop:4 },

  analyticsGrid: { flexDirection:'row', flexWrap:'wrap', gap:12, marginBottom:20 },
  analyticsCard: { flex:1, minWidth:'45%', backgroundColor:COLORS.grayBg, borderRadius:12, padding:16, alignItems:'center' },
  analyticsValue: { fontSize:28, fontWeight:'700', color:COLORS.red, marginBottom:6 },
  analyticsLabel: { fontSize:11, color:COLORS.grayText, textAlign:'center' },

  // ── Booking modal v2.0.2 ────────────────────────────────────────────────
  bookingOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.55)', justifyContent:'flex-end' },
  bookingModalCard: { backgroundColor:COLORS.white, borderTopLeftRadius:28, borderTopRightRadius:28, paddingHorizontal:20, paddingTop:20, paddingBottom:40, maxHeight:'90%', shadowColor:'#000', shadowOffset:{width:0,height:-8}, shadowOpacity:0.12, shadowRadius:20, elevation:20 },
  bookingModalHeader: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:20 },
  bookingCloseBtn: { width:32, height:32, borderRadius:16, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  bookingField: { marginBottom:16 },
  bookingFieldLabel: { fontSize:13, fontWeight:'700', color:COLORS.darkText, marginBottom:8, letterSpacing:-0.1 },
  bookingDateBtn: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1.5, borderColor:COLORS.grayLine, borderRadius:12, paddingHorizontal:14, paddingVertical:12, backgroundColor:COLORS.white },
  bookingDateValue: { fontSize:14, color:COLORS.darkText, fontWeight:'600' },
  bookingDatePlaceholder: { fontSize:14, color:COLORS.grayText },
  // Calendar
  calendarCard: { marginTop:8, borderWidth:1, borderColor:COLORS.grayLine, borderRadius:14, padding:12, backgroundColor:COLORS.white },
  calendarNav: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:12 },
  calendarNavBtn: { width:32, height:32, borderRadius:16, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  calendarMonthLabel: { fontSize:14, fontWeight:'700', color:COLORS.darkText },
  calendarDayRow: { flexDirection:'row', justifyContent:'space-around', marginBottom:4 },
  calendarDayHeader: { width:36, textAlign:'center', fontSize:11, fontWeight:'700', color:COLORS.grayText },
  calendarDayEmpty: { width:36, height:36 },
  calendarDay: { width:36, height:36, borderRadius:18, alignItems:'center', justifyContent:'center' },
  calendarDaySelected: { backgroundColor:COLORS.red },
  calendarDayPast: { opacity:0.3 },
  calendarDayText: { fontSize:13, color:COLORS.darkText, fontWeight:'500' },
  calendarDayTextSelected: { color:COLORS.white, fontWeight:'800' },
  calendarDayTextPast: { color:COLORS.grayText },
  // Time picker
  timePickerCard: { marginTop:8, borderWidth:1, borderColor:COLORS.grayLine, borderRadius:14, padding:12, backgroundColor:COLORS.white },
  timePickerRow: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8 },
  timeColumn: { alignItems:'center', flex:1 },
  timeColumnLabel: { fontSize:11, fontWeight:'700', color:COLORS.grayText, marginBottom:8, textTransform:'uppercase', letterSpacing:0.5 },
  timeScroll: { height:180 },
  timeItem: { height:44, alignItems:'center', justifyContent:'center', borderRadius:10 },
  timeItemSelected: { backgroundColor:COLORS.red },
  timeItemText: { fontSize:18, fontWeight:'600', color:COLORS.darkText },
  timeItemTextSelected: { color:COLORS.white, fontWeight:'800' },
  timeColon: { fontSize:28, fontWeight:'700', color:COLORS.darkText, marginBottom:20 },
  // Stepper
  stepperRow: { flexDirection:'row', alignItems:'center', gap:0, borderWidth:1.5, borderColor:COLORS.grayLine, borderRadius:12, overflow:'hidden', alignSelf:'flex-start' },
  stepperBtn: { width:48, height:44, alignItems:'center', justifyContent:'center', backgroundColor:COLORS.grayBg },
  stepperValue: { minWidth:60, textAlign:'center', fontSize:18, fontWeight:'700', color:COLORS.darkText },
  // Summary
  bookingSummary: { backgroundColor:COLORS.grayBg, borderRadius:12, padding:12, marginBottom:8, alignItems:'center' },
  bookingSummaryText: { fontSize:13, fontWeight:'600', color:COLORS.darkText },

  userProfileHeader: { alignItems:'center', marginBottom:20 },
  userProfileAvatar: { fontSize:64, marginBottom:12 },
  userProfileName: { fontSize:18, fontWeight:'700', color:COLORS.darkText },
  userProfileStats: { flexDirection:'row', justifyContent:'space-around', marginBottom:20, paddingVertical:16, borderTopWidth:1, borderBottomWidth:1, borderColor:COLORS.grayLine },
  userProfileStat: { alignItems:'center' },
  userProfileStatValue: { fontSize:24, fontWeight:'700', color:COLORS.red },
  userProfileStatLabel: { fontSize:11, color:COLORS.grayText, marginTop:4 },
});

// PROFILE OVERLAY — v2.2.1: Not a modal, renders above content, nav bar stays visible
const profS = StyleSheet.create({
  overlay: { position:'absolute', left:0, right:0, backgroundColor:COLORS.white, zIndex:20000 },
  header: { backgroundColor:COLORS.white, paddingHorizontal:16, paddingTop:12, paddingBottom:12, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  backBtn: { width:32, height:32, borderRadius:16, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:18, fontWeight:'700', color:COLORS.darkText, letterSpacing:-0.3 },
  scroll: { flex:1 },
  categoryRow: { flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, gap:12 },
  categoryIconWrap: { width:32, height:32, borderRadius:8, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  categoryLabel: { flex:1, fontSize:15, fontWeight:'500', color:COLORS.darkText },
});

// CATEGORY MODAL — v2.1.0: Yelp-style full category browser
const catS = StyleSheet.create({
  container: { flex:1, backgroundColor:COLORS.grayBg },
  header: { backgroundColor:COLORS.white, paddingHorizontal:16, paddingTop:12, paddingBottom:12, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  backBtn: { width:32, height:32, borderRadius:16, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  headerTitle: { fontSize:18, fontWeight:'700', color:COLORS.darkText, letterSpacing:-0.3 },
  scroll: { flex:1 },
  section: { marginBottom:8 },
  sectionTitle: { fontSize:12, fontWeight:'700', color:COLORS.grayText, paddingHorizontal:16, paddingTop:16, paddingBottom:8, letterSpacing:0.5, textTransform:'uppercase' },
  sectionItems: { backgroundColor:COLORS.white },
  categoryRow: { flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:16, borderBottomWidth:1, borderBottomColor:COLORS.grayLine, gap:12 },
  categoryIconWrap: { width:32, height:32, borderRadius:8, backgroundColor:COLORS.grayBg, alignItems:'center', justifyContent:'center' },
  categoryLabel: { flex:1, fontSize:15, fontWeight:'500', color:COLORS.darkText },
});

// BOTTOM NAV — v2.1.0: Yelp-style compact ~50px
const bnS = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLine,
    paddingTop: 4,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    gap: 2,
  },
  iconWrap: {
    width: 32,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#FFF0F0',
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.grayText,
    letterSpacing: 0,
  },
  labelActive: {
    color: COLORS.red,
    fontWeight: '700',
  },
});
