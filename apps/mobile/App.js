import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, SafeAreaView,
  StatusBar, Linking, LayoutAnimation, Platform, UIManager, ImageBackground, Animated,
  Share, Alert, Dimensions, Image, FlatList, Keyboard
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MOCK_BUSINESSES = [
  {
    id: '1', name: 'Pizzaria Bela Vista', category: 'Restaurante Italiano', subcategory: 'Pizza, Massa, Italiana',
    icon: '🍕', hero: '🍕', rating: 4.8, reviews: 120, price: '$$', priceLevel: 2,
    followers: 1243, checkIns: 856, referralCode: 'PIZZA20',
    deals: [
      { id: 'd1', title: '20% OFF Pizzas Grandes', description: 'Válido de Seg-Qui', expires: '2026-02-28', code: 'PIZZA20' },
      { id: 'd2', title: '2x1 em Bebidas', description: 'Todas as bebidas', expires: '2026-03-15', code: 'BEBIDAS2X1' }
    ],
    liveStatus: { isLive: true, message: 'Promoção ativa agora!', color: '#3CB371' },
    isPremium: true, verifiedBadge: true,
    address: 'Rua Comandante Valodia, 123, Talatona', phone: '+244 923 456 789', website: 'https://pizzariabelavista.ao',
    hours: 'Seg-Dom: 11:00 - 23:00', payment: ['Multicaixa Express', 'TPA', 'Dinheiro'], promo: '20% OFF em pizzas grandes',
    distance: 0.85, distanceText: '850m', isOpen: true, statusText: 'Aberto ate 23:00',
    latitude: -8.8388, longitude: 13.2894,
    photos: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800', 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800'],
    highlights: ['"Pizza autentica"', '"Ambiente familiar"'], services: ['Vegan options', 'Entrega', 'Reservas'],
    amenities: ['wifi', 'parking', 'delivery', 'reservations'], hoursList: ['Seg-Sex 11:00 - 23:00', 'Sab 12:00 - 00:00', 'Dom 12:00 - 22:00'],
    popularDishes: [{ name: 'Pizza Margherita', price: '3.500 Kz', orders: 156 }, { name: 'Carbonara', price: '4.200 Kz', orders: 89 }, { name: 'Lasanha', price: '4.800 Kz', orders: 67 }]
  },
  {
    id: '2', name: 'Farmacia Sao Pedro', followers: 892, checkIns: 654, referralCode: 'SAUDE15', category: 'Farmacia', subcategory: 'Medicamentos, Saude', icon: '💊', hero: '💊',
    rating: 4.5, reviews: 85, price: '$', priceLevel: 1, address: 'Avenida 4 de Fevereiro, 567, Maianga', phone: '+244 923 789 456',
    website: 'https://farmaciasaopedro.ao', hours: '24 horas', payment: ['Multicaixa Express', 'TPA', 'Dinheiro', 'Cartao'],
    promo: null, distance: 1.2, distanceText: '1.2km', isOpen: true, statusText: 'Aberto 24 horas',
    latitude: -8.8150, longitude: 13.2302,
    photos: ['https://images.unsplash.com/photo-1576602975921-8c18f8b4c8b0?w=800', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800'],
    highlights: ['"Atendimento 24h"', '"Delivery disponivel"'], services: ['Entrega', 'Atendimento 24h'], amenities: ['delivery', 'wheelchair'],
    hoursList: ['Todos os dias 00:00 - 24:00'], popularDishes: []
  },
  {
    id: '3', name: 'Supermercado Kero', followers: 2105, checkIns: 1432, referralCode: 'KERO10', category: 'Supermercado', subcategory: 'Alimentacao, Bebidas', icon: '🛒', hero: '🛒',
    rating: 4.7, reviews: 203, price: '$$', priceLevel: 2, address: 'Rua Rainha Ginga, 89, Maculusso', phone: '+244 923 321 654',
    website: 'https://kero.ao', hours: 'Seg-Sab: 8:00 - 20:00', payment: ['Multicaixa Express', 'TPA', 'Dinheiro', 'Vale'],
    promo: 'Promocao fim de semana', distance: 2.1, distanceText: '2.1km', isOpen: true, statusText: 'Aberto ate 20:00',
    latitude: -8.8200, longitude: 13.2350,
    photos: ['https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'],
    highlights: ['"Produtos frescos"', '"Precos competitivos"'], services: ['Take-away', 'Produtos frescos'], amenities: ['parking', 'wifi', 'delivery'],
    hoursList: ['Seg-Sab 08:00 - 20:00', 'Dom 09:00 - 18:00'], popularDishes: []
  },
  {
    id: '4', name: 'Cafe Atlantico', followers: 1567, checkIns: 923, referralCode: 'CAFE5', category: 'Cafe & Bar', subcategory: 'Cafe, Pastelaria, Brunch', icon: '☕', hero: '☕',
    rating: 4.6, reviews: 156, price: '$$', priceLevel: 2, address: 'Avenida Marginal, 45, Ilha de Luanda', phone: '+244 923 111 222',
    website: 'https://cafeatlantico.ao', hours: 'Seg-Dom: 7:00 - 22:00', payment: ['Multicaixa Express', 'TPA'], promo: null,
    distance: 1.5, distanceText: '1.5km', isOpen: true, statusText: 'Aberto ate 22:00',
    latitude: -8.8050, longitude: 13.2450,
    photos: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800'],
    highlights: ['"Vista para o mar"', '"WiFi gratis"'], services: ['WiFi', 'Brunch', 'Mesas ao ar livre'], amenities: ['wifi', 'outdoor', 'petfriendly'],
    hoursList: ['Seg-Dom 07:00 - 22:00'], popularDishes: [{ name: 'Cappuccino', price: '800 Kz', orders: 234 }, { name: 'Croissant', price: '600 Kz', orders: 189 }, { name: 'Brunch completo', price: '3.500 Kz', orders: 98 }]
  },
  {
    id: '5', name: 'Restaurante Tempero Africano', followers: 3421, checkIns: 2134, referralCode: 'TEMPERO25', category: 'Restaurante Angolano', subcategory: 'Culinaria Angolana, Africana',
    isPremium: true, verifiedBadge: true,
    icon: '🍲', hero: '🍲', rating: 4.9, reviews: 234, price: '$$$', priceLevel: 3, address: 'Largo do Kinaxixi, 12, Luanda',
    phone: '+244 923 777 888', website: 'https://temperoafricano.ao', hours: 'Seg-Dom: 12:00 - 22:00',
    payment: ['Multicaixa Express', 'TPA', 'Dinheiro'], promo: 'Almoco executivo 12EUR', distance: 1.8, distanceText: '1.8km',
    isOpen: true, statusText: 'Aberto ate 22:00',
    latitude: -8.8180, longitude: 13.2340,
    photos: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
    highlights: ['"Muamba autentica"', '"Chef premiado"'], services: ['Reservas', 'Menu degustacao'], amenities: ['reservations', 'wifi', 'parking'],
    hoursList: ['Seg-Dom 12:00 - 22:00'], popularDishes: [{ name: 'Muamba de Galinha', price: '5.500 Kz', orders: 412 }, { name: 'Calulu de Peixe', price: '6.200 Kz', orders: 298 }, { name: 'Funge com Kizaka', price: '4.800 Kz', orders: 187 }]
  },
  {
    id: '6', name: 'Barbearia Premium', followers: 678, checkIns: 445, referralCode: 'BARBA10', category: 'Barbearia', subcategory: 'Cabelo, Barba, Estetica', icon: '💈', hero: '💈',
    rating: 4.7, reviews: 92, price: '$$', priceLevel: 2, address: 'Viana, Rua Principal, 234', phone: '+244 923 555 666',
    website: 'https://barbeariapremium.ao', hours: 'Seg-Sab: 9:00 - 19:00', payment: ['Multicaixa Express', 'Dinheiro'],
    promo: null, distance: 3.2, distanceText: '3.2km', isOpen: false, statusText: 'Fechado ate 09:00',
    latitude: -8.8500, longitude: 13.2600,
    photos: ['https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800'],
    highlights: ['"Cortes modernos"', '"Agendamento online"'], services: ['Agendamento', 'Produtos para barba'], amenities: ['wifi', 'parking'],
    hoursList: ['Seg-Sab 09:00 - 19:00', 'Dom fechado'], popularDishes: []
  },
  {
    id: '7', name: 'João Silva - Designer Gráfico', followers: 543, checkIns: 89, referralCode: 'DESIGN30', category: 'Freelancer', subcategory: 'Design, Branding, Marketing',
    isPremium: false, verifiedBadge: true,
    deals: [{ id: 'd1', title: 'Desconto 30% Branding', description: 'Pacote completo', expires: '2026-03-01', code: 'DESIGN30' }],
    icon: '🎨', hero: '🎨', rating: 4.9, reviews: 67, price: '$$$', priceLevel: 3,
    address: 'Trabalho remoto - Luanda', phone: '+244 923 888 999', website: 'https://joaosilva.design',
    hours: 'Seg-Sex: 9:00 - 18:00', payment: ['Transferencia Bancaria', 'Multicaixa Express'], promo: null,
    distance: 0, distanceText: 'Remoto', isOpen: true, statusText: 'Disponivel para projetos',
    latitude: -8.8388, longitude: 13.2894,
    photos: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'],
    highlights: ['"Portfolio premiado"', '"Entrega rapida"'], services: ['Design de Logotipos', 'Branding Completo', 'Social Media'],
    amenities: ['portfolio', 'remote', 'fastdelivery'], hoursList: ['Seg-Sex 09:00 - 18:00', 'Sab sob consulta'], popularDishes: [],
    businessType: 'freelancer',
    servicesOffered: [
      { id: 's1', name: 'Logotipo Simples', price: '25.000 Kz', duration: '3 dias', description: 'Design de logotipo profissional com 3 revisoes' },
      { id: 's2', name: 'Branding Completo', price: '120.000 Kz', duration: '2 semanas', description: 'Identidade visual completa: logo, cartoes, manual' },
      { id: 's3', name: 'Posts Redes Sociais (pacote 10)', price: '35.000 Kz', duration: '1 semana', description: 'Criacao de 10 posts para Instagram/Facebook' }
    ],
    portfolio: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400'],
    availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false }
  },
  {
    id: '8', name: 'FitCoach Angola - Personal Training', category: 'Fitness', subcategory: 'Personal Trainer, Nutricao, Wellness',
    icon: '💪', hero: '💪', rating: 4.8, reviews: 94, price: '$$', priceLevel: 2,
    address: 'Talatona Sports Center, Luanda', phone: '+244 923 777 666', website: 'https://fitcoach.ao',
    hours: 'Seg-Sab: 6:00 - 21:00', payment: ['Multicaixa Express', 'Dinheiro', 'Transferencia'], promo: 'Primeira aula gratis',
    distance: 1.1, distanceText: '1.1km', isOpen: true, statusText: 'Aberto ate 21:00',
    latitude: -8.8400, longitude: 13.2900,
    photos: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800'],
    highlights: ['"Resultados garantidos"', '"Planos personalizados"'], services: ['Personal Training', 'Planos de Nutricao', 'Aulas de Grupo'],
    amenities: ['certified', 'flexible', 'online'], hoursList: ['Seg-Sab 06:00 - 21:00', 'Dom 08:00 - 14:00'], popularDishes: [],
    businessType: 'service',
    servicesOffered: [
      { id: 's1', name: 'Sessao Individual', price: '8.000 Kz', duration: '1h', description: 'Treino personalizado one-on-one' },
      { id: 's2', name: 'Pacote Mensal (12 sessoes)', price: '85.000 Kz', duration: '1 mes', description: '3x por semana + plano nutricional' },
      { id: 's3', name: 'Consultoria Nutricional', price: '15.000 Kz', duration: '1h', description: 'Avaliacao e plano alimentar personalizado' }
    ],
    portfolio: ['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'],
    availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
  },
  {
    id: '9', name: 'Dr. Carlos Mendes - Advogado', category: 'Servicos Juridicos', subcategory: 'Direito Civil, Empresarial, Familiar',
    icon: '⚖️', hero: '⚖️', rating: 4.7, reviews: 52, price: '$$$$', priceLevel: 4,
    address: 'Edificio Atlas, Av. 4 de Fevereiro, Luanda', phone: '+244 923 555 444', website: 'https://carlosmendes-advogado.ao',
    hours: 'Seg-Sex: 9:00 - 17:00', payment: ['Transferencia Bancaria', 'Cheque'], promo: null,
    distance: 2.5, distanceText: '2.5km', isOpen: true, statusText: 'Aberto ate 17:00',
    latitude: -8.8100, longitude: 13.2300,
    photos: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'],
    highlights: ['"15 anos de experiencia"', '"Consulta inicial gratuita"'], services: ['Consultoria Juridica', 'Representacao Legal', 'Contratos'],
    amenities: ['certified', 'appointment', 'parking'], hoursList: ['Seg-Sex 09:00 - 17:00', 'Sab-Dom fechado'], popularDishes: [],
    businessType: 'professional',
    servicesOffered: [
      { id: 's1', name: 'Consulta Juridica', price: '35.000 Kz', duration: '1h', description: 'Consultoria e aconselhamento legal' },
      { id: 's2', name: 'Elaboracao de Contratos', price: '150.000 Kz', duration: '1 semana', description: 'Redacao profissional de contratos' },
      { id: 's3', name: 'Representacao em Tribunal', price: '500.000 Kz', duration: 'Variavel', description: 'Representacao legal completa' }
    ],
    portfolio: [], availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false }
  },
  {
    id: '10', name: 'English Pro - Explicacoes', category: 'Educacao', subcategory: 'Ingles, Preparacao Exames, Conversacao',
    icon: '📚', hero: '📚', rating: 4.9, reviews: 128, price: '$$', priceLevel: 2,
    address: 'Maianga, Luanda (aulas online disponiveis)', phone: '+244 923 222 333', website: 'https://englishpro.ao',
    hours: 'Seg-Dom: 8:00 - 20:00', payment: ['Multicaixa Express', 'Transferencia Bancaria'], promo: 'Aula experimental gratis',
    distance: 1.8, distanceText: '1.8km', isOpen: true, statusText: 'Disponivel agora',
    latitude: -8.8200, longitude: 13.2400,
    photos: ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800'],
    highlights: ['"Professores nativos"', '"Aulas online e presenciais"'], services: ['Aulas Individuais', 'Aulas de Grupo', 'Preparacao TOEFL/IELTS'],
    amenities: ['online', 'certified', 'flexible'], hoursList: ['Seg-Dom 08:00 - 20:00'], popularDishes: [],
    businessType: 'education',
    servicesOffered: [
      { id: 's1', name: 'Aula Individual (1h)', price: '6.000 Kz', duration: '1h', description: 'Aula personalizada one-on-one' },
      { id: 's2', name: 'Pacote 10 Aulas', price: '50.000 Kz', duration: '1 mes', description: '10 aulas individuais com desconto' },
      { id: 's3', name: 'Curso Intensivo (mes)', price: '80.000 Kz', duration: '1 mes', description: '20 aulas/mes + material didatico' }
    ],
    portfolio: [], availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
  },
  {
    id: '11', name: 'Miguel Santos - Fotografo Profissional', category: 'Freelancer', subcategory: 'Fotografia, Eventos, Retratos',
    icon: '📸', hero: '📸', rating: 5.0, reviews: 89, price: '$$$', priceLevel: 3,
    address: 'Atendimento em todo Luanda', phone: '+244 923 111 000', website: 'https://miguelsantos.photo',
    hours: 'Flexivel - Por agendamento', payment: ['Multicaixa Express', 'Transferencia Bancaria'], promo: null,
    distance: 0, distanceText: 'Flexivel', isOpen: true, statusText: 'Aceita reservas',
    latitude: -8.8388, longitude: 13.2894,
    photos: ['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800', 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800'],
    highlights: ['"Portfolio internacional"', '"Equipamento profissional"'], services: ['Fotografia de Eventos', 'Ensaios Fotograficos', 'Fotografia Corporativa'],
    amenities: ['portfolio', 'professional', 'flexible'], hoursList: ['Disponibilidade flexivel', 'Agendamento necessario'], popularDishes: [],
    businessType: 'freelancer',
    servicesOffered: [
      { id: 's1', name: 'Ensaio Fotografico (1h)', price: '45.000 Kz', duration: '1h', description: 'Sessao fotografica + 20 fotos editadas' },
      { id: 's2', name: 'Cobertura de Evento (4h)', price: '180.000 Kz', duration: '4h', description: 'Casamentos, aniversarios, eventos corporativos' },
      { id: 's3', name: 'Fotografia Corporativa', price: '120.000 Kz', duration: '2h', description: 'Fotos profissionais para empresas' }
    ],
    portfolio: ['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400', 'https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400', 'https://images.unsplash.com/photo-1533094602577-198d3beab8ea?w=400'],
    availability: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }
  }
];

const QA_MOCK = [
  { id: 'q1', question: 'Tem menu vegetariano?', answer: 'Sim! Temos várias opções vegetarianas incluindo saladas, massas e pizzas.', askedBy: 'Maria L.', answeredBy: 'Proprietário', date: '10 Fev 2026', helpful: 12 },
  { id: 'q2', question: 'Aceitam reservas para grupos grandes?', answer: 'Sim, aceitamos reservas para grupos até 20 pessoas. Contacte-nos com 24h de antecedência.', askedBy: 'Pedro S.', answeredBy: 'Proprietário', date: '05 Fev 2026', helpful: 8 },
  { id: 'q3', question: 'Têm estacionamento?', answer: 'Temos estacionamento gratuito para clientes na parte traseira do edifício.', askedBy: 'Ana R.', answeredBy: 'Proprietário', date: '28 Jan 2026', helpful: 15 }
];

const COLLECTIONS_MOCK = [
  { id: 'c1', name: 'Melhores Pizzarias', icon: '🍕', businessCount: 12, isPublic: true, creator: 'João M.' },
  { id: 'c2', name: 'Romântico em Luanda', icon: '❤️', businessCount: 8, isPublic: true, creator: 'Sara P.' },
  { id: 'c3', name: 'Trabalho Remoto Friendly', icon: '💻', businessCount: 15, isPublic: true, creator: 'Carlos D.' }
];

const NEARBY_BUSINESSES = [
  { id: 'n1', name: 'Padaria Central', icon: '🥖', distance: 0.3, distanceText: '300m', latitude: -8.8365, longitude: 13.2880 },
  { id: 'n2', name: 'Ginasio Fitness', icon: '💪', distance: 0.5, distanceText: '500m', latitude: -8.8395, longitude: 13.2905 },
  { id: 'n3', name: 'Livraria Moderna', icon: '📚', distance: 0.7, distanceText: '700m', latitude: -8.8410, longitude: 13.2910 }
];

const TRENDING_SEARCHES = ['Pizza', 'Cafe', 'Farmacia 24h', 'Restaurante angolano', 'Barbearia'];
const AUTOCOMPLETE_SUGGESTIONS = ['Pizzaria', 'Pizza delivery', 'Pastelaria', 'Farmacia', 'Farmacia 24h', 'Cafe', 'Cafeteria', 'Restaurante', 'Restaurante italiano', 'Restaurante angolano', 'Barbearia', 'Supermercado'];

const CATEGORIES = [
  { id: 'restaurants', label: 'Restaurantes', icon: '🍴' },
  { id: 'delivery', label: 'Delivery', icon: '📦' },
  { id: 'shopping', label: 'Compras', icon: '🛒' },
  { id: 'health', label: 'Saúde', icon: '➕' },
  { id: 'services', label: 'Servicos', icon: '🔧' }
];

const QUICK_FILTERS = [
  { id: 'open', label: 'Aberto agora', icon: '●' },
  { id: 'deals', label: 'Promocoes', icon: '%' },
  { id: 'top', label: 'Mais avaliados', icon: '★' }
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recomendado' },
  { id: 'distance', label: 'Mais proximo' },
  { id: 'rating', label: 'Melhor avaliado' },
  { id: 'reviews', label: 'Mais comentado' }
];

const PRICE_FILTERS = [
  { id: 'all', label: 'Qualquer preco', levels: [1, 2, 3, 4] },
  { id: '1', label: '$', levels: [1] },
  { id: '2', label: '$$', levels: [1, 2] },
  { id: '3', label: '$$$', levels: [1, 2, 3] },
  { id: '4', label: '$$$$', levels: [1, 2, 3, 4] }
];

const DISTANCE_FILTERS = [
  { id: 'all', label: 'Qualquer distancia', max: 999 },
  { id: '1', label: 'Ate 1 km', max: 1 },
  { id: '2', label: 'Ate 2 km', max: 2 },
  { id: '5', label: 'Ate 5 km', max: 5 },
  { id: '10', label: 'Ate 10 km', max: 10 }
];

const REVIEW_FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: '5', label: '5 estrelas' },
  { id: '4', label: '4+ estrelas' },
  { id: 'photos', label: 'Com fotos' }
];

const REVIEW_SORT_OPTIONS = [
  { id: 'recent', label: 'Mais Recentes' },
  { id: 'helpful', label: 'Mais Uteis' },
  { id: 'highest', label: 'Melhor Avaliacao' },
  { id: 'lowest', label: 'Pior Avaliacao' }
];

const AMENITIES_ICONS = {
  wifi: { icon: '◉', label: 'WiFi' },
  parking: { icon: 'P', label: 'Estacionamento' },
  delivery: { icon: '⚡', label: 'Entrega' },
  reservations: { icon: '◷', label: 'Reservas' },
  wheelchair: { icon: '♿', label: 'Acessivel' },
  outdoor: { icon: '◐', label: 'Mesas exteriores' },
  petfriendly: { icon: '◆', label: 'Pet-friendly' },
  // FASE 5: Novos amenities
  portfolio: { icon: '◈', label: 'Portfolio' },
  remote: { icon: '⌂', label: 'Trabalho Remoto' },
  fastdelivery: { icon: '⚡', label: 'Entrega Rapida' },
  certified: { icon: '✓', label: 'Certificado' },
  flexible: { icon: '◷', label: 'Horario Flexivel' },
  online: { icon: '◉', label: 'Online' },
  appointment: { icon: '◷', label: 'Por Marcacao' },
  professional: { icon: '▪', label: 'Profissional' }
};

const AMENITY_FILTERS = [
  { id: 'wifi', label: 'WiFi', icon: '◉' },
  { id: 'parking', label: 'Estacionamento', icon: 'P' },
  { id: 'delivery', label: 'Entrega', icon: '⚡' },
  { id: 'wheelchair', label: 'Acessivel', icon: '♿' },
  { id: 'outdoor', label: 'Terraço', icon: '◐' },
  { id: 'reservations', label: 'Reservas', icon: '◷' }
];

const BUSINESS_TYPE_BADGES = {
  freelancer: { icon: '💼', label: 'Freelancer', color: '#8B5CF6' },
  service: { icon: '⚙️', label: 'Servico', color: '#3B82F6' },
  professional: { icon: '👔', label: 'Profissional', color: '#059669' },
  education: { icon: '🎓', label: 'Educacao', color: '#DC2626' },
  food: { icon: '🍴', label: 'Alimentacao', color: '#EA580C' }
};

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const COLORS = {
  red: '#D32323', white: '#FFFFFF', grayBg: '#F5F5F5', grayLine: '#E8E8E8', grayText: '#6B6B6B',
  darkText: '#1F1F1F', green: '#3CB371', orange: '#D32323', heroOverlay: 'rgba(0,0,0,0.45)', mapBg: '#ECEFF3'
};

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=60';
const TOP_BAR_HEIGHT = 52;
const VERSION_LOG = { version: 'FASE 8 - FINAL', summary: 'Polish & Premium: Dark Mode, Notifications, Analytics, Premium Badge, Offline Mode' };
const BASE_TABS = ['Informacoes', 'Avaliacoes', 'Mais'];
const DEFAULT_SERVICES = ['Entrega', 'Reservas', 'WiFi'];
const DEFAULT_HOURS = ['Seg-Sex 09:00 - 21:00', 'Sab 10:00 - 22:00', 'Dom 10:00 - 18:00'];

const MENU_ITEMS = [
  { id: 'm1', name: 'Frango grelhado', price: '4.800 Kz', desc: 'Acompanhado de legumes e arroz.' },
  { id: 'm2', name: 'Massa a bolonhesa', price: '5.500 Kz', desc: 'Molho caseiro e parmesao.' },
  { id: 'm3', name: 'Salada tropical', price: '3.200 Kz', desc: 'Frutas frescas e molho citrus.' }
];

const REVIEWS_MOCK = [
  { 
    id: 'r1', 
    name: 'Ana M.', 
    avatar: '👩',
    rating: 5, 
    date: '12 Fev 2026', 
    comment: 'Atendimento excelente e comida impecavel. A pizza estava deliciosa e o ambiente muito acolhedor. Recomendo!', 
    photos: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400'],
    helpful: 24,
    ownerResponse: 'Obrigado Ana! Ficamos muito felizes com seu feedback. Esperamos recebe-la novamente em breve!',
    ownerResponseDate: '13 Fev 2026'
  },
  { 
    id: 'r2', 
    name: 'Bruno L.', 
    avatar: '👨',
    rating: 4, 
    date: '03 Fev 2026', 
    comment: 'Bom ambiente, voltarei para experimentar mais pratos. Servico foi rapido e simpatico.', 
    photos: [],
    helpful: 12,
    ownerResponse: null,
    ownerResponseDate: null
  },
  { 
    id: 'r3', 
    name: 'Carla S.', 
    avatar: '👩‍🦱',
    rating: 5, 
    date: '28 Jan 2026', 
    comment: 'Servico rapido e tudo muito saboroso. As massas sao mesmo caseiras!', 
    photos: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
    helpful: 18,
    ownerResponse: 'Muito obrigado pelo carinho Carla! Todas as nossas massas sao feitas diariamente.',
    ownerResponseDate: '29 Jan 2026'
  },
  { 
    id: 'r4', 
    name: 'David P.', 
    avatar: '👨‍🦲',
    rating: 3, 
    date: '15 Jan 2026', 
    comment: 'Comida boa mas o tempo de espera foi longo. Preco justo.', 
    photos: [],
    helpful: 8,
    ownerResponse: 'Pedimos desculpa pela espera David. Estamos a trabalhar para melhorar nosso tempo de servico.',
    ownerResponseDate: '16 Jan 2026'
  },
  { 
    id: 'r5', 
    name: 'Elena R.', 
    avatar: '👩‍🦰',
    rating: 5, 
    date: '10 Jan 2026', 
    comment: 'Melhor pizza de Luanda! Adorei a margherita e o tiramisu estava divinal.', 
    photos: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'],
    helpful: 31,
    ownerResponse: null,
    ownerResponseDate: null
  }
];

const isFoodBusiness = (business) => /restaurante|cafe|bar|pastelaria|brunch|pizza|culinaria/i.test(`${business.category} ${business.subcategory}`.toLowerCase());

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) stars.push(<Text key={`star-${i}`} style={[starStyles.star, rating >= i ? starStyles.starFilled : starStyles.starEmpty]}>★</Text>);
  return <View style={starStyles.starRow}>{stars}</View>;
};

const renderHeroStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) stars.push(<Text key={`hs-${i}`} style={[heroStarStyles.star, rating >= i ? heroStarStyles.starFilled : heroStarStyles.starEmpty]}>★</Text>);
  return <View style={heroStarStyles.starRow}>{stars}</View>;
};

function AppContent() {
  const insets = useSafeAreaInsets();
  const [searchWhat, setSearchWhat] = useState('');
  const [searchWhere, setSearchWhere] = useState('Talatona, Luanda');
  const [activeFilter, setActiveFilter] = useState('open');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('Menu');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [showSortModal, setShowSortModal] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  
  // FASE 2: Novos estados
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // FASE 3: Novos estados
  const [viewMode, setViewMode] = useState('list');
  const [locationPermission, setLocationPermission] = useState('denied');
  const [userLocation, setUserLocation] = useState({ latitude: -8.8388, longitude: 13.2894 });
  const [selectedMapBusiness, setSelectedMapBusiness] = useState(null);
  const [showNearby, setShowNearby] = useState(false);
  
  // FASE 4: Novos estados
  const [reviewSort, setReviewSort] = useState('recent');
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const [showReviewStats, setShowReviewStats] = useState(false);
  const [selectedReviewUser, setSelectedReviewUser] = useState(null);
  
  // FASE 6: Novos estados
  const [followedBusinesses, setFollowedBusinesses] = useState([]);
  const [userCheckIns, setUserCheckIns] = useState({});
  const [showQAModal, setShowQAModal] = useState(false);
  const [showCollectionsModal, setShowCollectionsModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  
  // FASE 7: Novos estados
  const [showDealsModal, setShowDealsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingPeople, setBookingPeople] = useState('2');
  
  // FASE 8: Novos estados
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Nova oferta!', message: 'Pizzaria Bela Vista: 20% OFF', time: '5 min atrás', read: false },
    { id: 'n2', title: 'Reserva confirmada', message: 'Personal Trainer amanhã às 10h', time: '1h atrás', read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [userStats] = useState({
    businessesViewed: 47,
    reviewsWritten: 12,
    checkIns: 23,
    savedBusinesses: 8
  });
  
  const scrollRef = useRef(null);
  const sectionOffsets = useRef({});
  const scrollY = useRef(new Animated.Value(0)).current;
  const heroHeight = 280 + insets.top;
  const headerOpacity = scrollY.interpolate({ inputRange: [heroHeight - TOP_BAR_HEIGHT - 16, heroHeight - TOP_BAR_HEIGHT + 16], outputRange: [0, 1], extrapolate: 'clamp' });
  const heroTitleOpacity = scrollY.interpolate({ inputRange: [0, heroHeight - TOP_BAR_HEIGHT - 24], outputRange: [1, 0], extrapolate: 'clamp' });

  useEffect(() => { loadBookmarks(); loadRecentSearches(); requestLocationPermission(); }, []);
  useEffect(() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); }, [activeFilter, searchWhat, searchWhere, sortBy, priceFilter, distanceFilter]);

  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem('bookmarks');
      if (saved) setBookmarkedIds(JSON.parse(saved));
    } catch (e) { console.log('Error loading bookmarks:', e); }
  };

  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentSearches');
      if (saved) setRecentSearches(JSON.parse(saved));
    } catch (e) { console.log('Error loading recent searches:', e); }
  };

  const saveRecentSearch = async (query) => {
    try {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (e) { console.log('Error saving search:', e); }
  };

  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('recentSearches');
    } catch (e) { console.log('Error clearing searches:', e); }
  };

  const requestLocationPermission = () => {
    Alert.alert(
      'Permitir Localizacao',
      'AcheiAqui precisa da sua localizacao para mostrar negocios perto de si',
      [
        { text: 'Nao Permitir', onPress: () => setLocationPermission('denied') },
        { text: 'Permitir', onPress: () => { setLocationPermission('granted'); setUserLocation({ latitude: -8.8388, longitude: 13.2894 }); } }
      ]
    );
  };

  const toggleBookmark = async (businessId) => {
    try {
      const updated = bookmarkedIds.includes(businessId) ? bookmarkedIds.filter(id => id !== businessId) : [...bookmarkedIds, businessId];
      setBookmarkedIds(updated);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
    } catch (e) { console.log('Error saving bookmark:', e); }
  };

  const handleShare = async (business) => {
    try {
      await Share.share({ message: `${business.name} - ${business.subcategory}\n${business.address}\n⭐ ${business.rating} (${business.reviews} avaliacoes)\n${business.website || ''}`, title: business.name });
    } catch (error) { console.log('Error sharing:', error); }
  };

  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) ? prev.filter(a => a !== amenityId) : [...prev, amenityId]
    );
  };

  const toggleHelpful = (reviewId) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const toggleFollow = (businessId) => {
    setFollowedBusinesses(prev => 
      prev.includes(businessId) ? prev.filter(id => id !== businessId) : [...prev, businessId]
    );
  };

  const handleCheckIn = (businessId) => {
    setUserCheckIns(prev => ({
      ...prev,
      [businessId]: (prev[businessId] || 0) + 1
    }));
    Alert.alert('Check-in realizado!', 'Obrigado por visitar este negócio. 🎉');
  };

  const handleAskQuestion = () => {
    if (newQuestion.trim()) {
      Alert.alert('Pergunta enviada!', 'O proprietário será notificado e responderá em breve.');
      setNewQuestion('');
      setShowQAModal(false);
    }
  };

  const copyReferralCode = (code) => {
    Alert.alert('Código copiado!', `Código "${code}" copiado para a área de transferência.`);
  };

  const toggleCompare = (businessId) => {
    setCompareList(prev => {
      if (prev.includes(businessId)) return prev.filter(id => id !== businessId);
      if (prev.length >= 3) {
        Alert.alert('Limite atingido', 'Pode comparar até 3 negócios de cada vez.');
        return prev;
      }
      return [...prev, businessId];
    });
  };

  const handleBooking = () => {
    if (!bookingDate || !bookingTime) {
      Alert.alert('Erro', 'Por favor preencha data e hora.');
      return;
    }
    Alert.alert('Reserva Confirmada!', `Reserva para ${bookingPeople} pessoa(s) em ${bookingDate} às ${bookingTime}.`);
    setShowBookingModal(false);
    setBookingDate('');
    setBookingTime('');
    setBookingPeople('2');
  };

 

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    Alert.alert(darkMode ? 'Modo Claro Ativado' : 'Modo Escuro Ativado', 'A interface foi atualizada.');
  };

  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    Alert.alert('Notificações limpas', 'Todas as notificações foram removidas.');
  };

  const handleSearchSubmit = () => {
    if (searchWhat.trim()) {
      saveRecentSearch(searchWhat.trim());
      setShowAutocomplete(false);
      Keyboard.dismiss();
    }
  };

  const handleSuggestionPress = (suggestion) => {
    setSearchWhat(suggestion);
    saveRecentSearch(suggestion);
    setShowAutocomplete(false);
    Keyboard.dismiss();
  };

  const autocompleteSuggestions = useMemo(() => {
    if (!searchWhat.trim()) return [];
    return AUTOCOMPLETE_SUGGESTIONS.filter(s => 
      s.toLowerCase().includes(searchWhat.toLowerCase())
    ).slice(0, 5);
  }, [searchWhat]);

  const filteredBusinesses = useMemo(() => {
    let result = MOCK_BUSINESSES.filter((b) => {
      const matchesSearch = b.name.toLowerCase().includes(searchWhat.toLowerCase()) || b.category.toLowerCase().includes(searchWhat.toLowerCase()) || b.subcategory.toLowerCase().includes(searchWhat.toLowerCase());
      if (activeFilter === 'deals' && !b.promo) return false;
      if (activeFilter === 'open' && !b.isOpen) return false;
      if (activeFilter === 'top' && b.rating < 4.7) return false;
      if (priceFilter !== 'all') { const pf = PRICE_FILTERS.find(p => p.id === priceFilter); if (pf && !pf.levels.includes(b.priceLevel)) return false; }
      if (distanceFilter !== 'all') { const df = DISTANCE_FILTERS.find(d => d.id === distanceFilter); if (df && b.distance > df.max) return false; }
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(a => b.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }
      return matchesSearch;
    });
    if (sortBy === 'distance') result.sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'reviews') result.sort((a, b) => b.reviews - a.reviews);
    return result;
  }, [activeFilter, searchWhat, sortBy, priceFilter, distanceFilter, selectedAmenities]);

  const filteredReviews = useMemo(() => {
    if (!selectedBusiness) return REVIEWS_MOCK;
    let result = REVIEWS_MOCK;
    if (reviewFilter === '5') result = result.filter(r => r.rating === 5);
    else if (reviewFilter === '4') result = result.filter(r => r.rating >= 4);
    else if (reviewFilter === 'photos') result = result.filter(r => r.photos && r.photos.length > 0);
    
    // FASE 4: Sort reviews
    if (reviewSort === 'helpful') result = [...result].sort((a, b) => b.helpful - a.helpful);
    else if (reviewSort === 'highest') result = [...result].sort((a, b) => b.rating - a.rating);
    else if (reviewSort === 'lowest') result = [...result].sort((a, b) => a.rating - b.rating);
    // 'recent' já está em ordem por padrão
    
    return result;
  }, [reviewFilter, reviewSort, selectedBusiness]);

  const reviewStats = useMemo(() => {
    if (!selectedBusiness) return null;
    const total = REVIEWS_MOCK.length;
    const avgRating = (REVIEWS_MOCK.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1);
    const distribution = {
      5: REVIEWS_MOCK.filter(r => r.rating === 5).length,
      4: REVIEWS_MOCK.filter(r => r.rating === 4).length,
      3: REVIEWS_MOCK.filter(r => r.rating === 3).length,
      2: REVIEWS_MOCK.filter(r => r.rating === 2).length,
      1: REVIEWS_MOCK.filter(r => r.rating === 1).length
    };
    return { total, avgRating, distribution };
  }, [selectedBusiness]);

  const featuredBusiness = MOCK_BUSINESSES[0];
  const handleBusinessPress = (business) => { setSelectedBusiness(business); setShowDetail(true); setCurrentPhotoIndex(0); setActiveTab(isFoodBusiness(business) ? 'Menu' : 'Informacoes'); };
  const handleCall = (phone) => Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => alert('Nao foi possivel ligar'));
  const handleWhatsApp = (phone) => Linking.openURL(`whatsapp://send?phone=${phone.replace(/\s+/g, '')}`).catch(() => alert('WhatsApp nao instalado'));
  const handleWebsite = (url) => { if (!url) return; Linking.openURL(url).catch(() => alert('Nao foi possivel abrir o site')); };
  const handleDirections = (address, lat, lng) => {
    if (!lat || !lng) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`).catch(() => alert('Nao foi possivel abrir o mapa'));
      return;
    }
    Alert.alert(
      'Abrir Direcoes',
      'Escolha o aplicativo:',
      [
        { text: 'Google Maps', onPress: () => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`).catch(() => alert('Erro ao abrir Maps')) },
        { text: 'Waze', onPress: () => Linking.openURL(`waze://?ll=${lat},${lng}&navigate=yes`).catch(() => Linking.openURL(`https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`)) },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };
  
  const handleTabPress = (tab) => { setActiveTab(tab); const targetY = sectionOffsets.current[tab]; if (scrollRef.current && typeof targetY === 'number') scrollRef.current.scrollTo({ y: Math.max(targetY - 8, 0), animated: true }); };
  const detailTabs = useMemo(() => { 
    if (!selectedBusiness) return BASE_TABS; 
    const tabs = [];
    if (selectedBusiness.servicesOffered && selectedBusiness.servicesOffered.length > 0) tabs.push('Servicos');
    if (isFoodBusiness(selectedBusiness)) tabs.push('Menu');
    return [...tabs, ...BASE_TABS];
  }, [selectedBusiness]);
  useEffect(() => { if (detailTabs.length && !detailTabs.includes(activeTab)) setActiveTab(detailTabs[0]); }, [activeTab, detailTabs]);

  const currentSortLabel = SORT_OPTIONS.find(s => s.id === sortBy)?.label || 'Recomendado';
  const hasActiveFilters = priceFilter !== 'all' || distanceFilter !== 'all' || selectedAmenities.length > 0;
  const activeFiltersCount = (priceFilter !== 'all' ? 1 : 0) + (distanceFilter !== 'all' ? 1 : 0) + selectedAmenities.length;

  return (
    <SafeAreaView style={homeStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={homeStyles.header}>
        <View style={homeStyles.headerTopRow}>
          <Text style={homeStyles.logo}>AcheiAqui</Text>
          <View style={homeStyles.versionRow}>
            <Text style={homeStyles.versionText}>{VERSION_LOG.version}</Text>
            <Text style={homeStyles.versionSummary} numberOfLines={1}>{VERSION_LOG.summary}</Text>
          </View>
          
          {/* FASE 8: Header Actions */}
          <View style={homeStyles.headerActions}>
            <TouchableOpacity style={homeStyles.headerActionBtn} onPress={toggleDarkMode}>
              <Text style={homeStyles.headerActionIcon}>{darkMode ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={homeStyles.headerActionBtn} onPress={() => setShowNotifications(true)}>
              <Text style={homeStyles.headerActionIcon}>🔔</Text>
              {notifications.filter(n => !n.read).length > 0 && (
                <View style={homeStyles.notificationBadge}>
                  <Text style={homeStyles.notificationBadgeText}>{notifications.filter(n => !n.read).length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={homeStyles.headerActionBtn} onPress={() => setShowAnalytics(true)}>
              <Text style={homeStyles.headerActionIcon}>📊</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={homeStyles.searchBar}>
          <View style={homeStyles.searchColumn}>
            <Text style={homeStyles.searchLabel}>O que</Text>
            <TextInput
              style={homeStyles.searchInput}
              placeholder="restaurantes, farmacias, cafes"
              placeholderTextColor={COLORS.grayText}
              value={searchWhat}
              onChangeText={(text) => { setSearchWhat(text); setShowAutocomplete(text.length > 0); }}
              onFocus={() => { setSearchFocused(true); setShowAutocomplete(searchWhat.length > 0); }}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
          </View>
          <View style={homeStyles.searchDivider} />
          <View style={homeStyles.searchColumn}>
            <Text style={homeStyles.searchLabel}>Onde</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput 
                style={[homeStyles.searchInput, { flex: 1 }]} 
                placeholder="bairro, cidade" 
                placeholderTextColor={COLORS.grayText} 
                value={searchWhere} 
                onChangeText={setSearchWhere} 
              />
              <TouchableOpacity onPress={() => locationPermission === 'granted' ? setSearchWhere('Minha Localizacao') : requestLocationPermission()}>
                <Text style={{ fontSize: 18, color: locationPermission === 'granted' ? COLORS.red : COLORS.grayText }}>📍</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
       
      </View>

      {/* FASE 2: Autocomplete Dropdown */}
      {showAutocomplete && searchFocused && (
        <View style={autocompleteStyles.container}>
          <ScrollView style={autocompleteStyles.scroll} keyboardShouldPersistTaps="handled">
            {autocompleteSuggestions.length > 0 && (
              <>
                <Text style={autocompleteStyles.sectionTitle}>Sugestoes</Text>
                {autocompleteSuggestions.map((suggestion, idx) => (
                  <TouchableOpacity key={idx} style={autocompleteStyles.item} onPress={() => handleSuggestionPress(suggestion)}>
                    <Text style={autocompleteStyles.icon}>🔍</Text>
                    <Text style={autocompleteStyles.text}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {recentSearches.length > 0 && (
              <>
                <View style={autocompleteStyles.recentHeader}>
                  <Text style={autocompleteStyles.sectionTitle}>Recentes</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={autocompleteStyles.clearText}>Limpar</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((search, idx) => (
                  <TouchableOpacity key={idx} style={autocompleteStyles.item} onPress={() => handleSuggestionPress(search)}>
                    <Text style={autocompleteStyles.icon}>🕐</Text>
                    <Text style={autocompleteStyles.text}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            <Text style={autocompleteStyles.sectionTitle}>Trending</Text>
            {TRENDING_SEARCHES.map((trend, idx) => (
              <TouchableOpacity key={idx} style={autocompleteStyles.item} onPress={() => handleSuggestionPress(trend)}>
                <Text style={autocompleteStyles.icon}>🔥</Text>
                <Text style={autocompleteStyles.text}>{trend}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={homeStyles.categoryRowWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={homeStyles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={homeStyles.categoryChip} activeOpacity={0.7}>
              <Text style={homeStyles.categoryChipIcon}>{cat.icon}</Text>
              <Text style={homeStyles.categoryChipLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {viewMode === 'list' ? (
      <ScrollView style={homeStyles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={homeStyles.sponsoredCard} onPress={() => handleBusinessPress(featuredBusiness)} activeOpacity={0.85}>
          <View style={homeStyles.sponsoredBadge}><Text style={homeStyles.sponsoredBadgeText}>Patrocinado</Text></View>
          <View style={homeStyles.sponsoredContent}>
            <View style={homeStyles.sponsoredImage}><Text style={homeStyles.sponsoredIcon}>{featuredBusiness.icon}</Text></View>
            <View style={homeStyles.sponsoredInfo}>
              <Text style={homeStyles.sponsoredTitle} numberOfLines={1}>{featuredBusiness.name}</Text>
              <View style={homeStyles.sponsoredMetaRow}>
                {renderStars(featuredBusiness.rating)}
                <Text style={homeStyles.sponsoredRating}>{featuredBusiness.rating}</Text>
                <Text style={homeStyles.sponsoredReviews}>({featuredBusiness.reviews})</Text>
              </View>
              <Text style={homeStyles.sponsoredCategory} numberOfLines={1}>{featuredBusiness.subcategory}</Text>
              {featuredBusiness.promo && <View style={homeStyles.sponsoredPromo}><Text style={homeStyles.sponsoredPromoText}>{featuredBusiness.promo}</Text></View>}
            </View>
          </View>
        </TouchableOpacity>

        {/* REORGANIZADO: Filters area - alinhamento inteligente */}
        <View style={homeStyles.controlsSection}>
          {/* Container unificado com alinhamento perfeito */}
          <View style={homeStyles.filtersContainer}>
            {/* Quick Filters - flex wrap automático */}
            <View style={homeStyles.quickFiltersRow}>
              {QUICK_FILTERS.map((filter) => (
                <TouchableOpacity 
                  key={filter.id} 
                  style={[homeStyles.quickFilterPill, activeFilter === filter.id && homeStyles.quickFilterPillActive]} 
                  onPress={() => setActiveFilter(filter.id)} 
                  activeOpacity={0.7}
                >
                  <Text style={[homeStyles.quickFilterText, activeFilter === filter.id && homeStyles.quickFilterTextActive]}>
                    {filter.icon} {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Linha de separação sutil */}
            <View style={homeStyles.filtersSeparator} />

            {/* Main Controls - sempre 3 colunas iguais */}
            <View style={homeStyles.mainControlsRow}>
              <TouchableOpacity style={homeStyles.controlBtn} onPress={() => setShowSortModal(true)}>
                <Text style={homeStyles.controlBtnText}>{currentSortLabel}</Text>
                <Text style={homeStyles.controlBtnIcon}>▼</Text>
              </TouchableOpacity>
              
              <View style={homeStyles.controlDivider} />
              
              <TouchableOpacity 
                style={[homeStyles.controlBtn, hasActiveFilters && homeStyles.controlBtnActive]} 
                onPress={() => setShowAdvancedFilters(true)}
              >
                <Text style={homeStyles.controlBtnIcon}>◐</Text>
                <Text style={[homeStyles.controlBtnText, hasActiveFilters && homeStyles.controlBtnTextActive]}>
                  Filtros
                </Text>
                {hasActiveFilters && (
                  <View style={homeStyles.controlBadge}>
                    <Text style={homeStyles.controlBadgeText}>{activeFiltersCount}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={homeStyles.controlDivider} />
              
              <TouchableOpacity 
                style={homeStyles.controlBtn} 
                onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              >
                <Text style={homeStyles.controlBtnIcon}>{viewMode === 'list' ? '◉' : '▤'}</Text>
                <Text style={homeStyles.controlBtnText}>{viewMode === 'list' ? 'Mapa' : 'Lista'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FASE 2: Active Filters Badges */}
        {hasActiveFilters && (
          <View style={filterBadgeStyles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={filterBadgeStyles.scroll}>
              {priceFilter !== 'all' && (
                <View style={filterBadgeStyles.badge}>
                  <Text style={filterBadgeStyles.badgeText}>{PRICE_FILTERS.find(p => p.id === priceFilter)?.label}</Text>
                  <TouchableOpacity onPress={() => setPriceFilter('all')} style={filterBadgeStyles.badgeClose}>
                    <Text style={filterBadgeStyles.badgeCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              {distanceFilter !== 'all' && (
                <View style={filterBadgeStyles.badge}>
                  <Text style={filterBadgeStyles.badgeText}>{DISTANCE_FILTERS.find(d => d.id === distanceFilter)?.label}</Text>
                  <TouchableOpacity onPress={() => setDistanceFilter('all')} style={filterBadgeStyles.badgeClose}>
                    <Text style={filterBadgeStyles.badgeCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              {selectedAmenities.map(amenityId => {
                const amenity = AMENITY_FILTERS.find(a => a.id === amenityId);
                return amenity ? (
                  <View key={amenityId} style={filterBadgeStyles.badge}>
                    <Text style={filterBadgeStyles.badgeText}>{amenity.icon} {amenity.label}</Text>
                    <TouchableOpacity onPress={() => toggleAmenity(amenityId)} style={filterBadgeStyles.badgeClose}>
                      <Text style={filterBadgeStyles.badgeCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : null;
              })}
            </ScrollView>
          </View>
        )}

        <View style={homeStyles.sectionHeader}>
          <Text style={homeStyles.sectionTitle}>Perto de ti</Text>
          <Text style={homeStyles.sectionCount}>({filteredBusinesses.length} resultados)</Text>
        </View>

        {filteredBusinesses.map((business) => {
          const isBookmarked = bookmarkedIds.includes(business.id);
          return (
            <TouchableOpacity key={business.id} style={homeStyles.listCell} onPress={() => handleBusinessPress(business)} activeOpacity={0.8}>
              <View style={homeStyles.listCellImage}>
                {/* FASE 7: Deal Badge - reposicionado sobre o ícone */}
                {business.deals && business.deals.length > 0 && (
                  <View style={homeStyles.dealBadgeOverlay}>
                    <Text style={homeStyles.dealBadgeText} numberOfLines={1}>
                      🔥 {business.deals.length} {business.deals.length > 1 ? 'Ofertas' : 'Oferta'}
                    </Text>
                  </View>
                )}
                <Text style={homeStyles.listCellIcon}>{business.icon}</Text>
              </View>
              <View style={homeStyles.listCellInfo}>
                <View style={homeStyles.listCellTitleRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={homeStyles.listCellTitle} numberOfLines={1}>{business.name}</Text>
                    {/* FASE 8: Premium & Verified Badges */}
                    {business.isPremium && <Text style={homeStyles.premiumBadge}>👑</Text>}
                    {business.verifiedBadge && <Text style={homeStyles.verifiedBadge}>✓</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    {/* FASE 7: Compare Checkbox */}
                    <TouchableOpacity 
                      style={homeStyles.compareCheckbox} 
                      onPress={(e) => { e.stopPropagation(); toggleCompare(business.id); }}
                    >
                      <Text style={homeStyles.compareCheckboxIcon}>
                        {compareList.includes(business.id) ? '☑' : '☐'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={homeStyles.bookmarkBtn} onPress={() => toggleBookmark(business.id)}>
                      <Text style={homeStyles.bookmarkIcon}>{isBookmarked ? '♥' : '♡'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={homeStyles.listCellMeta}>
                  {renderStars(business.rating)}
                  <Text style={homeStyles.listCellRating}>{business.rating}</Text>
                  <Text style={homeStyles.listCellReviews}>({business.reviews})</Text>
                </View>
                <Text style={homeStyles.listCellCategory} numberOfLines={1}>{business.price} • {business.subcategory}</Text>
                {business.amenities && business.amenities.length > 0 && (
                  <View style={homeStyles.amenitiesRow}>
                    {business.amenities.slice(0, 3).map(a => { const ad = AMENITIES_ICONS[a]; return ad ? <View key={a} style={homeStyles.amenityChip}><Text style={homeStyles.amenityIcon}>{ad.icon}</Text></View> : null; })}
                  </View>
                )}
                <View style={homeStyles.listCellFooter}>
                  <Text style={homeStyles.listCellDistance}>{business.distanceText}</Text>
                  <Text style={business.isOpen ? homeStyles.openText : homeStyles.closedText}>{business.isOpen ? 'Aberto agora' : 'Fechado'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      ) : (
        <View style={{ flex: 1, backgroundColor: COLORS.mapBg, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.darkText, marginBottom: 10 }}>🗺️ Vista de Mapa</Text>
          <Text style={{ fontSize: 14, color: COLORS.grayText, marginBottom: 20 }}>{filteredBusinesses.length} negocios perto de si</Text>
          <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: COLORS.grayText, marginBottom: 8 }}>Centro do mapa:</Text>
            <Text style={{ fontSize: 11, color: COLORS.darkText, fontWeight: '600' }}>
              {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </Text>
          </View>
          <TouchableOpacity 
            style={{ position: 'absolute', bottom: 30, backgroundColor: COLORS.red, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 8 }}
            onPress={() => setViewMode('list')}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.white }}>📋 Voltar à Lista</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FASE 8: Offline Mode Indicator */}
      {offlineMode && (
        <View style={homeStyles.offlineIndicator}>
          <Text style={homeStyles.offlineText}>📵 Modo Offline</Text>
        </View>
      )}

      {/* FASE 7: Compare Floating Button */}
      {compareList.length > 0 && (
        <View style={homeStyles.compareFloatingContainer}>
          <TouchableOpacity 
            style={homeStyles.compareFloatingBtn} 
            onPress={() => setShowCompareModal(true)}
          >
            <Text style={homeStyles.compareFloatingText}>Comparar ({compareList.length})</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sort Modal */}
      <Modal visible={showSortModal} transparent animationType="fade" onRequestClose={() => setShowSortModal(false)}>
        <TouchableOpacity style={modalStyles.overlay} activeOpacity={1} onPress={() => setShowSortModal(false)}>
          <View style={modalStyles.sortMenu}>
            <Text style={modalStyles.sortTitle}>Ordenar por</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.id} style={modalStyles.sortOption} onPress={() => { setSortBy(opt.id); setShowSortModal(false); }}>
                <Text style={[modalStyles.sortOptionText, sortBy === opt.id && modalStyles.sortOptionTextActive]}>{opt.label}</Text>
                {sortBy === opt.id && <Text style={modalStyles.sortCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* FASE 2: Advanced Filters Modal */}
      <Modal visible={showAdvancedFilters} transparent animationType="slide" onRequestClose={() => setShowAdvancedFilters(false)}>
        <View style={modalStyles.overlay}>
          <View style={advancedFilterStyles.panel}>
            <View style={advancedFilterStyles.header}>
              <Text style={advancedFilterStyles.title}>Todos os Filtros</Text>
              <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}>
                <Text style={advancedFilterStyles.close}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={advancedFilterStyles.scroll}>
              <Text style={advancedFilterStyles.groupTitle}>Preco</Text>
              <View style={advancedFilterStyles.group}>
                {PRICE_FILTERS.map(p => (
                  <TouchableOpacity key={p.id} style={[advancedFilterStyles.option, priceFilter === p.id && advancedFilterStyles.optionActive]} onPress={() => setPriceFilter(p.id)}>
                    <Text style={[advancedFilterStyles.optionText, priceFilter === p.id && advancedFilterStyles.optionTextActive]}>{p.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={advancedFilterStyles.groupTitle}>Distancia</Text>
              <View style={advancedFilterStyles.group}>
                {DISTANCE_FILTERS.map(d => (
                  <TouchableOpacity key={d.id} style={[advancedFilterStyles.option, distanceFilter === d.id && advancedFilterStyles.optionActive]} onPress={() => setDistanceFilter(d.id)}>
                    <Text style={[advancedFilterStyles.optionText, distanceFilter === d.id && advancedFilterStyles.optionTextActive]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={advancedFilterStyles.groupTitle}>Comodidades</Text>
              <View style={advancedFilterStyles.group}>
                {AMENITY_FILTERS.map(amenity => (
                  <TouchableOpacity key={amenity.id} style={[advancedFilterStyles.option, selectedAmenities.includes(amenity.id) && advancedFilterStyles.optionActive]} onPress={() => toggleAmenity(amenity.id)}>
                    <Text style={[advancedFilterStyles.optionText, selectedAmenities.includes(amenity.id) && advancedFilterStyles.optionTextActive]}>{amenity.icon} {amenity.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={advancedFilterStyles.footer}>
              <TouchableOpacity style={advancedFilterStyles.clearBtn} onPress={() => { setPriceFilter('all'); setDistanceFilter('all'); setSelectedAmenities([]); }}>
                <Text style={advancedFilterStyles.clearText}>Limpar Tudo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={advancedFilterStyles.applyBtn} onPress={() => setShowAdvancedFilters(false)}>
                <Text style={advancedFilterStyles.applyText}>Aplicar ({activeFiltersCount})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail Modal - Sem mudanças da FASE 1 */}
      <Modal visible={showDetail} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowDetail(false)}>
        {selectedBusiness && (
          <View style={detailStyles.container}>
            <Animated.View style={[detailStyles.fixedHeader, { opacity: headerOpacity, paddingTop: insets.top }]}>
              <View style={detailStyles.fixedHeaderRow}>
                <View style={detailStyles.backGroup}>
                  <TouchableOpacity style={detailStyles.topBarBack} onPress={() => setShowDetail(false)}><Text style={detailStyles.topBarBackText}>{'<'}</Text></TouchableOpacity>
                  <Text style={detailStyles.backLabel}>Voltar</Text>
                </View>
                <Text style={detailStyles.topBarTitle} numberOfLines={1}>{selectedBusiness.name}</Text>
                <View style={detailStyles.headerActions}>
                  <TouchableOpacity style={detailStyles.headerActionBtn} onPress={() => handleShare(selectedBusiness)}><Text style={detailStyles.headerActionIcon}>↗️</Text></TouchableOpacity>
                  <TouchableOpacity style={detailStyles.headerActionBtn} onPress={() => toggleBookmark(selectedBusiness.id)}><Text style={detailStyles.headerActionIcon}>{bookmarkedIds.includes(selectedBusiness.id) ? '❤️' : '🤍'}</Text></TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            
            <Animated.ScrollView ref={scrollRef} stickyHeaderIndices={[2]} showsVerticalScrollIndicator={false} contentContainerStyle={detailStyles.scrollContent} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })} scrollEventThrottle={16}>
              <View style={[detailStyles.heroImage, { height: heroHeight }]}>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setCurrentPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}>
                  {selectedBusiness.photos.map((photo, idx) => (
                    <ImageBackground key={idx} style={{ width: SCREEN_WIDTH, height: heroHeight }} imageStyle={detailStyles.heroImageStyle} source={{ uri: photo }} resizeMode="cover">
                      <View style={detailStyles.heroOverlay} />
                    </ImageBackground>
                  ))}
                </ScrollView>
                <View style={detailStyles.photoCounter}><Text style={detailStyles.photoCounterText}>{currentPhotoIndex + 1} / {selectedBusiness.photos.length}</Text></View>
                <Text style={detailStyles.heroIcon}>{selectedBusiness.hero || selectedBusiness.icon}</Text>
                <Animated.View style={[detailStyles.heroContent, { opacity: heroTitleOpacity }]}>
                  <Text style={detailStyles.heroTitle}>{selectedBusiness.name}</Text>
                  <View style={detailStyles.heroMetaRow}>
                    {renderHeroStars(selectedBusiness.rating)}
                    <Text style={detailStyles.heroRating}>{selectedBusiness.rating}</Text>
                    <Text style={detailStyles.heroReviews}>({selectedBusiness.reviews})</Text>
                  </View>
                  <Text style={detailStyles.heroStatusText}>{selectedBusiness.statusText || (selectedBusiness.isOpen ? 'Aberto agora' : 'Fechado')}</Text>
                </Animated.View>
                <TouchableOpacity style={[detailStyles.floatingBack, { top: insets.top + 12 }]} onPress={() => setShowDetail(false)}><Text style={detailStyles.floatingBackText}>{'<'}</Text></TouchableOpacity>
                <View style={[detailStyles.floatingActions, { top: insets.top + 12 }]}>
                  <TouchableOpacity style={detailStyles.floatingActionBtn} onPress={() => handleShare(selectedBusiness)}><Text style={detailStyles.floatingActionIcon}>↗️</Text></TouchableOpacity>
                  <TouchableOpacity style={detailStyles.floatingActionBtn} onPress={() => toggleBookmark(selectedBusiness.id)}><Text style={detailStyles.floatingActionIcon}>{bookmarkedIds.includes(selectedBusiness.id) ? '❤️' : '🤍'}</Text></TouchableOpacity>
                </View>
              </View>

              <View style={detailStyles.ratingSection}>
                <TouchableOpacity style={detailStyles.reviewStarter} onPress={() => setShowRatingModal(true)} activeOpacity={0.8}>
                  <Text style={detailStyles.reviewStarterTitle}>Inicie uma avaliacao</Text>
                  <View style={detailStyles.reviewStarterStars}>{[1,2,3,4,5].map(i => <Text key={i} style={detailStyles.reviewStarterStar}>☆</Text>)}</View>
                </TouchableOpacity>
              </View>

              {/* FASE 6: Social Actions */}
              <View style={detailStyles.socialActionsSection}>
                <View style={detailStyles.socialStatsRow}>
                  <View style={detailStyles.socialStat}>
                    <Text style={detailStyles.socialStatValue}>{selectedBusiness.followers || 0}</Text>
                    <Text style={detailStyles.socialStatLabel}>Seguidores</Text>
                  </View>
                  <View style={detailStyles.socialStat}>
                    <Text style={detailStyles.socialStatValue}>{(selectedBusiness.checkIns || 0) + (userCheckIns[selectedBusiness.id] || 0)}</Text>
                    <Text style={detailStyles.socialStatLabel}>Check-ins</Text>
                  </View>
                </View>
                <View style={detailStyles.socialButtonsRow}>
                  <TouchableOpacity 
                    style={[detailStyles.socialButton, followedBusinesses.includes(selectedBusiness.id) && detailStyles.socialButtonActive]} 
                    onPress={() => toggleFollow(selectedBusiness.id)}
                  >
                    <Text style={detailStyles.socialButtonIcon}>{followedBusinesses.includes(selectedBusiness.id) ? '✓' : '+'}</Text>
                    <Text style={[detailStyles.socialButtonText, followedBusinesses.includes(selectedBusiness.id) && detailStyles.socialButtonTextActive]}>
                      {followedBusinesses.includes(selectedBusiness.id) ? 'A seguir' : 'Seguir'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={detailStyles.socialButton} onPress={() => handleCheckIn(selectedBusiness.id)}>
                    <Text style={detailStyles.socialButtonIcon}>📍</Text>
                    <Text style={detailStyles.socialButtonText}>Check-in</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={detailStyles.socialButton} onPress={() => setShowCollectionsModal(true)}>
                    <Text style={detailStyles.socialButtonIcon}>📌</Text>
                    <Text style={detailStyles.socialButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={detailStyles.stickyHeader}>
                <View style={detailStyles.tabsBar}>
                  {detailTabs.map((tab) => (
                    <TouchableOpacity key={tab} style={detailStyles.tabItem} onPress={() => handleTabPress(tab)} activeOpacity={0.7}>
                      <Text style={activeTab === tab ? detailStyles.tabTextActive : detailStyles.tabText}>{tab}</Text>
                      {activeTab === tab && <View style={detailStyles.tabIndicator} />}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* FASE 5: Business Type Badge */}
              {selectedBusiness.businessType && BUSINESS_TYPE_BADGES[selectedBusiness.businessType] && (
                <View style={detailStyles.businessTypeBadgeContainer}>
                  <View style={[detailStyles.businessTypeBadge, { backgroundColor: BUSINESS_TYPE_BADGES[selectedBusiness.businessType].color }]}>
                    <Text style={detailStyles.businessTypeBadgeIcon}>{BUSINESS_TYPE_BADGES[selectedBusiness.businessType].icon}</Text>
                    <Text style={detailStyles.businessTypeBadgeText}>{BUSINESS_TYPE_BADGES[selectedBusiness.businessType].label}</Text>
                  </View>
                </View>
              )}

              {/* FASE 7: Deals & Offers */}
              {selectedBusiness.deals && selectedBusiness.deals.length > 0 && (
                <View style={detailStyles.sectionBlock}>
                  <Text style={detailStyles.sectionTitle}>🔥 Ofertas Ativas</Text>
                  {selectedBusiness.deals.map(deal => (
                    <View key={deal.id} style={detailStyles.dealCard}>
                      <View style={detailStyles.dealCardHeader}>
                        <Text style={detailStyles.dealTitle}>{deal.title}</Text>
                        <View style={detailStyles.dealCodeBadge}>
                          <Text style={detailStyles.dealCodeText}>{deal.code}</Text>
                        </View>
                      </View>
                      <Text style={detailStyles.dealDescription}>{deal.description}</Text>
                      <Text style={detailStyles.dealExpires}>Válido até: {deal.expires}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* FASE 7: Booking System */}
              {(selectedBusiness.businessType === 'service' || selectedBusiness.businessType === 'professional' || selectedBusiness.businessType === 'education') && (
                <View style={detailStyles.sectionBlock}>
                  <Text style={detailStyles.sectionTitle}>📅 Fazer Reserva</Text>
                  <TouchableOpacity style={detailStyles.bookingCard} onPress={() => setShowBookingModal(true)}>
                    <Text style={detailStyles.bookingIcon}>📆</Text>
                    <View style={detailStyles.bookingInfo}>
                      <Text style={detailStyles.bookingTitle}>Agendar Horário</Text>
                      <Text style={detailStyles.bookingSubtitle}>Escolha data e hora disponível</Text>
                    </View>
                    <Text style={detailStyles.bookingArrow}>→</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* FASE 7: Live Status */}
              {selectedBusiness.liveStatus && selectedBusiness.liveStatus.isLive && (
                <View style={[detailStyles.liveStatusBanner, { backgroundColor: selectedBusiness.liveStatus.color + '20', borderColor: selectedBusiness.liveStatus.color }]}>
                  <View style={[detailStyles.liveDot, { backgroundColor: selectedBusiness.liveStatus.color }]} />
                  <Text style={[detailStyles.liveStatusText, { color: selectedBusiness.liveStatus.color }]}>
                    {selectedBusiness.liveStatus.message}
                  </Text>
                </View>
              )}

              {/* FASE 5: Services Catalog (para todos os tipos de negócio) */}
              {selectedBusiness.servicesOffered && selectedBusiness.servicesOffered.length > 0 && (
                <View style={detailStyles.menuSectionBlock} onLayout={(e) => { sectionOffsets.current.Servicos = e.nativeEvent.layout.y; }}>
                  <Text style={detailStyles.sectionTitle}>Servicos Oferecidos</Text>
                  <View style={detailStyles.servicesCard}>
                    {selectedBusiness.servicesOffered.map((service) => (
                      <View key={service.id} style={detailStyles.serviceItem}>
                        <View style={detailStyles.serviceItemHeader}>
                          <Text style={detailStyles.serviceItemTitle}>{service.name}</Text>
                          <Text style={detailStyles.serviceItemPrice}>{service.price}</Text>
                        </View>
                        {service.duration && (
                          <Text style={detailStyles.serviceItemDuration}>⏱️ {service.duration}</Text>
                        )}
                        <Text style={detailStyles.serviceItemDesc}>{service.description}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* FASE 5: Portfolio (para freelancers e profissionais) */}
              {selectedBusiness.portfolio && selectedBusiness.portfolio.length > 0 && (
                <View style={detailStyles.sectionBlock}>
                  <Text style={detailStyles.sectionTitle}>Portfolio</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={detailStyles.portfolioScroll}>
                    {selectedBusiness.portfolio.map((img, idx) => (
                      <Image key={idx} source={{ uri: img }} style={detailStyles.portfolioImage} />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* FASE 5: Availability Calendar */}
              {selectedBusiness.availability && (
                <View style={detailStyles.sectionBlock}>
                  <Text style={detailStyles.sectionTitle}>Disponibilidade</Text>
                  <View style={detailStyles.availabilityCalendar}>
                    {WEEKDAY_KEYS.map((key, idx) => {
                      const isAvailable = selectedBusiness.availability[key];
                      return (
                        <View key={key} style={detailStyles.availabilityDay}>
                          <View style={[detailStyles.availabilityDayCircle, isAvailable ? detailStyles.availabilityDayAvailable : detailStyles.availabilityDayUnavailable]}>
                            <Text style={[detailStyles.availabilityDayText, isAvailable && detailStyles.availabilityDayTextAvailable]}>
                              {WEEKDAY_LABELS[idx]}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {isFoodBusiness(selectedBusiness) && (
                <View style={detailStyles.menuSectionBlock} onLayout={(e) => { sectionOffsets.current.Menu = e.nativeEvent.layout.y; }}>
                  <Text style={detailStyles.sectionTitle}>Menu do Dia</Text>
                  <View style={detailStyles.menuCard}>
                    {MENU_ITEMS.map((item) => (
                      <View key={item.id} style={detailStyles.menuItem}>
                        <View style={detailStyles.menuItemText}>
                          <Text style={detailStyles.menuItemTitle}>{item.name}</Text>
                          <Text style={detailStyles.menuItemDesc}>{item.desc}</Text>
                        </View>
                        <Text style={detailStyles.menuItemPrice}>{item.price}</Text>
                      </View>
                    ))}
                  </View>
                  {selectedBusiness.popularDishes && selectedBusiness.popularDishes.length > 0 && (
                    <>
                      <Text style={[detailStyles.sectionTitle, { marginTop: 20 }]}>Pratos Populares</Text>
                      <View style={detailStyles.popularDishesCard}>
                        {selectedBusiness.popularDishes.map((dish, idx) => (
                          <View key={idx} style={detailStyles.popularDishItem}>
                            <View style={detailStyles.popularDishRank}><Text style={detailStyles.popularDishRankText}>{idx + 1}</Text></View>
                            <View style={detailStyles.popularDishInfo}>
                              <Text style={detailStyles.popularDishName}>{dish.name}</Text>
                              <Text style={detailStyles.popularDishOrders}>{dish.orders} pedidos</Text>
                            </View>
                            <Text style={detailStyles.popularDishPrice}>{dish.price}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              )}

              <View style={detailStyles.sectionBlock} onLayout={(e) => { sectionOffsets.current.Informacoes = e.nativeEvent.layout.y; }}>
                <Text style={detailStyles.sectionTitle}>Informacoes</Text>
                <View style={detailStyles.infoActionRow}>
                  <TouchableOpacity style={[detailStyles.actionOutline, detailStyles.actionEqual, detailStyles.whatsappButton]} onPress={() => handleWhatsApp(selectedBusiness.phone)} activeOpacity={0.85}>
                    <View style={detailStyles.whatsappBadge}><Text style={detailStyles.whatsappBadgeText}>WA</Text></View>
                    <Text style={detailStyles.whatsappButtonText} numberOfLines={1}>Contactar via WhatsApp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[detailStyles.actionOutline, detailStyles.actionEqual]} onPress={() => handleCall(selectedBusiness.phone)} activeOpacity={0.7}>
                    <Text style={detailStyles.actionIcon}>☎</Text>
                    <Text style={detailStyles.actionText}>Ligar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[detailStyles.actionOutline, detailStyles.actionEqual]} onPress={() => handleWebsite(selectedBusiness.website)} activeOpacity={0.7}>
                    <Text style={detailStyles.actionIcon}>↗</Text>
                    <Text style={detailStyles.actionText}>Website</Text>
                  </TouchableOpacity>
                </View>
                <Text style={detailStyles.infoHighlightText}>{selectedBusiness.highlights.map((item) => item.replace(/"/g, '')).join(' • ')}</Text>
                <View style={detailStyles.mapCard}>
                  <View style={detailStyles.mapPlaceholder}><Text style={detailStyles.mapText}>Mini mapa</Text></View>
                  <View style={detailStyles.mapInfoRow}>
                    <View style={detailStyles.mapInfoText}>
                      <Text style={detailStyles.mapAddress} numberOfLines={2}>{selectedBusiness.address}</Text>
                      <Text style={detailStyles.mapNeighborhood}>{searchWhere}</Text>
                    </View>
                    <TouchableOpacity style={detailStyles.directionsBtn} onPress={() => handleDirections(selectedBusiness.address, selectedBusiness.latitude, selectedBusiness.longitude)} activeOpacity={0.7}>
                      <Text style={detailStyles.directionsText}>Direcoes</Text>
                      <Text style={detailStyles.directionsIcon}>→</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={detailStyles.infoList}>
                  <View style={detailStyles.infoRow}>
                    <Text style={detailStyles.infoIcon}>○</Text>
                    <View style={detailStyles.infoTextBlock}>{(selectedBusiness.hoursList || DEFAULT_HOURS).map((line) => <Text key={line} style={detailStyles.infoText}>{line}</Text>)}</View>
                  </View>
                  <View style={detailStyles.infoRow}>
                    <Text style={detailStyles.infoIcon}>✓</Text>
                    <View style={detailStyles.infoTextBlock}>{(selectedBusiness.services || DEFAULT_SERVICES).map((s) => <Text key={s} style={detailStyles.infoText}>{s}</Text>)}</View>
                  </View>
                  <View style={detailStyles.infoRow}>
                    <Text style={detailStyles.infoIcon}>$</Text>
                    <Text style={detailStyles.infoText}>{selectedBusiness.payment.join(', ')}</Text>
                  </View>
                </View>
              </View>

              <View style={detailStyles.sectionBlock} onLayout={(e) => { sectionOffsets.current.Avaliacoes = e.nativeEvent.layout.y; }}>
                <Text style={detailStyles.sectionTitle}>Avaliacoes</Text>
                
                {/* FASE 4: Review Stats */}
                {reviewStats && (
                  <TouchableOpacity style={detailStyles.reviewStatsCard} onPress={() => setShowReviewStats(!showReviewStats)} activeOpacity={0.9}>
                    <View style={detailStyles.reviewStatsHeader}>
                      <View>
                        <Text style={detailStyles.reviewStatsAvg}>{reviewStats.avgRating}</Text>
                        <View style={detailStyles.reviewStars}>{renderStars(parseFloat(reviewStats.avgRating))}</View>
                        <Text style={detailStyles.reviewStatsTotal}>{reviewStats.total} avaliacoes</Text>
                      </View>
                      <TouchableOpacity onPress={() => setShowReviewStats(!showReviewStats)}>
                        <Text style={detailStyles.reviewStatsToggle}>{showReviewStats ? '▼' : '▶'}</Text>
                      </TouchableOpacity>
                    </View>
                    {showReviewStats && (
                      <View style={detailStyles.reviewStatsDistribution}>
                        {[5, 4, 3, 2, 1].map(star => (
                          <View key={star} style={detailStyles.reviewStatsRow}>
                            <Text style={detailStyles.reviewStatsLabel}>{star}★</Text>
                            <View style={detailStyles.reviewStatsBarBg}>
                              <View style={[detailStyles.reviewStatsBarFill, { width: `${(reviewStats.distribution[star] / reviewStats.total) * 100}%` }]} />
                            </View>
                            <Text style={detailStyles.reviewStatsCount}>{reviewStats.distribution[star]}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                )}
                
                {/* FASE 4: Review Sort + Filters */}
                <View style={detailStyles.reviewControls}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                    <Text style={detailStyles.reviewControlLabel}>Ordenar:</Text>
                    {REVIEW_SORT_OPTIONS.map(s => (
                      <TouchableOpacity key={s.id} style={[detailStyles.reviewSortChip, reviewSort === s.id && detailStyles.reviewSortChipActive]} onPress={() => setReviewSort(s.id)}>
                        <Text style={[detailStyles.reviewSortText, reviewSort === s.id && detailStyles.reviewSortTextActive]}>{s.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={detailStyles.reviewControlLabel}>Filtrar:</Text>
                    {REVIEW_FILTERS.map(f => (
                      <TouchableOpacity key={f.id} style={[detailStyles.reviewFilterChip, reviewFilter === f.id && detailStyles.reviewFilterChipActive]} onPress={() => setReviewFilter(f.id)}>
                        <Text style={[detailStyles.reviewFilterText, reviewFilter === f.id && detailStyles.reviewFilterTextActive]}>{f.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={detailStyles.reviewsList}>
                  {filteredReviews.map((review) => {
                    const isHelpful = helpfulReviews[review.id];
                    const helpfulCount = review.helpful + (isHelpful ? 1 : 0);
                    return (
                    <View key={review.id} style={detailStyles.reviewCard}>
                      <View style={detailStyles.reviewHeader}>
                        <TouchableOpacity style={detailStyles.reviewUserInfo} onPress={() => setSelectedReviewUser(review)}>
                          <Text style={detailStyles.reviewAvatar}>{review.avatar}</Text>
                          <View>
                            <Text style={detailStyles.reviewName}>{review.name}</Text>
                            <Text style={detailStyles.reviewDate}>{review.date}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={detailStyles.reviewStars}>{renderStars(review.rating)}</View>
                      <Text style={detailStyles.reviewComment}>{review.comment}</Text>
                      {review.photos && review.photos.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={detailStyles.reviewPhotosScroll}>
                          {review.photos.map((photo, idx) => <Image key={idx} source={{ uri: photo }} style={detailStyles.reviewPhoto} />)}
                        </ScrollView>
                      )}
                      
                      {/* FASE 4: Helpful votes */}
                      <TouchableOpacity style={detailStyles.reviewHelpfulBtn} onPress={() => toggleHelpful(review.id)}>
                        <Text style={detailStyles.reviewHelpfulIcon}>{isHelpful ? '👍' : '👍🏻'}</Text>
                        <Text style={[detailStyles.reviewHelpfulText, isHelpful && detailStyles.reviewHelpfulTextActive]}>
                          Útil ({helpfulCount})
                        </Text>
                      </TouchableOpacity>
                      
                      {/* FASE 4: Owner Response */}
                      {review.ownerResponse && (
                        <View style={detailStyles.ownerResponseCard}>
                          <View style={detailStyles.ownerResponseHeader}>
                            <Text style={detailStyles.ownerResponseBadge}>🏪 Resposta do proprietario</Text>
                            <Text style={detailStyles.ownerResponseDate}>{review.ownerResponseDate}</Text>
                          </View>
                          <Text style={detailStyles.ownerResponseText}>{review.ownerResponse}</Text>
                        </View>
                      )}
                    </View>
                  )})}
                </View>
                <TouchableOpacity style={detailStyles.uploadPhotoBtn} onPress={() => setShowPhotoUpload(true)}>
                  <Text style={detailStyles.uploadPhotoIcon}>📷</Text>
                  <Text style={detailStyles.uploadPhotoText}>Adicionar fotos</Text>
                </TouchableOpacity>
              </View>

              <View style={detailStyles.sectionBlock} onLayout={(e) => { sectionOffsets.current.Mais = e.nativeEvent.layout.y; }}>
                <Text style={detailStyles.sectionTitle}>Mais</Text>
                
                {/* FASE 6: Q&A Section */}
                <View style={detailStyles.qaSection}>
                  <View style={detailStyles.qaSectionHeader}>
                    <Text style={detailStyles.qaTitle}>Perguntas & Respostas</Text>
                    <TouchableOpacity onPress={() => setShowQAModal(true)}>
                      <Text style={detailStyles.qaAskBtn}>Perguntar</Text>
                    </TouchableOpacity>
                  </View>
                  {QA_MOCK.slice(0, 2).map(qa => (
                    <View key={qa.id} style={detailStyles.qaItem}>
                      <Text style={detailStyles.qaQuestion}>❓ {qa.question}</Text>
                      <Text style={detailStyles.qaAnswer}>💬 {qa.answer}</Text>
                      <View style={detailStyles.qaFooter}>
                        <Text style={detailStyles.qaDate}>{qa.date}</Text>
                        <Text style={detailStyles.qaHelpful}>👍 {qa.helpful} útil</Text>
                      </View>
                    </View>
                  ))}
                  <TouchableOpacity style={detailStyles.qaViewAll}>
                    <Text style={detailStyles.qaViewAllText}>Ver todas as perguntas →</Text>
                  </TouchableOpacity>
                </View>

                {/* FASE 6: Referral Code */}
                {selectedBusiness.referralCode && (
                  <View style={detailStyles.referralCard}>
                    <View style={detailStyles.referralHeader}>
                      <Text style={detailStyles.referralIcon}>🎁</Text>
                      <View style={detailStyles.referralHeaderText}>
                        <Text style={detailStyles.referralTitle}>Código de Referência</Text>
                        <Text style={detailStyles.referralSubtitle}>Partilhe e ganhe descontos!</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={detailStyles.referralCodeContainer} 
                      onPress={() => copyReferralCode(selectedBusiness.referralCode)}
                    >
                      <Text style={detailStyles.referralCode}>{selectedBusiness.referralCode}</Text>
                      <Text style={detailStyles.referralCopyIcon}>📋</Text>
                    </TouchableOpacity>
                    <Text style={detailStyles.referralHint}>Toque para copiar</Text>
                  </View>
                )}
                
                <View style={detailStyles.highlightsRow}>
                  {selectedBusiness.highlights.map((item) => <View key={item} style={detailStyles.highlightChip}><Text style={detailStyles.highlightText}>{item}</Text></View>)}
                </View>
              </View>

              <View style={{ height: 80 }} />
            </Animated.ScrollView>

            <Modal visible={showRatingModal} transparent animationType="fade" onRequestClose={() => setShowRatingModal(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={detailStyles.ratingCard}>
                  <Text style={detailStyles.ratingTitle}>Escrever avaliacao</Text>
                  <TextInput style={detailStyles.ratingInput} placeholder="Conte como foi a sua experiencia..." placeholderTextColor={COLORS.grayText} multiline />
                  <View style={detailStyles.ratingActions}>
                    <TouchableOpacity style={detailStyles.ratingButtonGhost} onPress={() => setShowRatingModal(false)}><Text style={detailStyles.ratingButtonGhostText}>Cancelar</Text></TouchableOpacity>
                    <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={() => setShowRatingModal(false)}><Text style={detailStyles.ratingButtonPrimaryText}>Enviar</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            
            <Modal visible={showPhotoUpload} transparent animationType="fade" onRequestClose={() => setShowPhotoUpload(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={detailStyles.ratingCard}>
                  <Text style={detailStyles.ratingTitle}>Adicionar fotos</Text>
                  <Text style={detailStyles.uploadPhotoHint}>Partilhe fotos da sua experiencia</Text>
                  <View style={detailStyles.ratingActions}>
                    <TouchableOpacity style={detailStyles.ratingButtonGhost} onPress={() => setShowPhotoUpload(false)}><Text style={detailStyles.ratingButtonGhostText}>Cancelar</Text></TouchableOpacity>
                    <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={() => { Alert.alert('Sucesso', 'Foto adicionada com sucesso!'); setShowPhotoUpload(false); }}>
                      <Text style={detailStyles.ratingButtonPrimaryText}>Escolher foto</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            
            {/* FASE 4: User Profile Modal */}
            <Modal visible={selectedReviewUser !== null} transparent animationType="fade" onRequestClose={() => setSelectedReviewUser(null)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={detailStyles.ratingCard}>
                  {selectedReviewUser && (
                    <>
                      <View style={detailStyles.userProfileHeader}>
                        <Text style={detailStyles.userProfileAvatar}>{selectedReviewUser.avatar}</Text>
                        <Text style={detailStyles.userProfileName}>{selectedReviewUser.name}</Text>
                      </View>
                      <View style={detailStyles.userProfileStats}>
                        <View style={detailStyles.userProfileStat}>
                          <Text style={detailStyles.userProfileStatValue}>{REVIEWS_MOCK.filter(r => r.name === selectedReviewUser.name).length}</Text>
                          <Text style={detailStyles.userProfileStatLabel}>Avaliacoes</Text>
                        </View>
                        <View style={detailStyles.userProfileStat}>
                          <Text style={detailStyles.userProfileStatValue}>{REVIEWS_MOCK.filter(r => r.name === selectedReviewUser.name).reduce((sum, r) => sum + r.helpful, 0)}</Text>
                          <Text style={detailStyles.userProfileStatLabel}>Votos Uteis</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={() => setSelectedReviewUser(null)}>
                        <Text style={detailStyles.ratingButtonPrimaryText}>Fechar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </Modal>
            
            {/* FASE 6: Q&A Modal */}
            <Modal visible={showQAModal} transparent animationType="fade" onRequestClose={() => setShowQAModal(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={detailStyles.ratingCard}>
                  <Text style={detailStyles.ratingTitle}>Fazer uma pergunta</Text>
                  <TextInput 
                    style={detailStyles.ratingInput} 
                    placeholder="Escreva sua pergunta..." 
                    placeholderTextColor={COLORS.grayText} 
                    multiline 
                    value={newQuestion}
                    onChangeText={setNewQuestion}
                  />
                  <View style={detailStyles.ratingActions}>
                    <TouchableOpacity style={detailStyles.ratingButtonGhost} onPress={() => setShowQAModal(false)}>
                      <Text style={detailStyles.ratingButtonGhostText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={handleAskQuestion}>
                      <Text style={detailStyles.ratingButtonPrimaryText}>Enviar Pergunta</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* FASE 6: Collections Modal */}
            <Modal visible={showCollectionsModal} transparent animationType="slide" onRequestClose={() => setShowCollectionsModal(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={[detailStyles.ratingCard, { maxHeight: '80%' }]}>
                  <Text style={detailStyles.ratingTitle}>Guardar em Coleção</Text>
                  <ScrollView style={{ marginVertical: 16 }}>
                    {COLLECTIONS_MOCK.map(collection => (
                      <TouchableOpacity key={collection.id} style={detailStyles.collectionItem}>
                        <Text style={detailStyles.collectionIcon}>{collection.icon}</Text>
                        <View style={detailStyles.collectionInfo}>
                          <Text style={detailStyles.collectionName}>{collection.name}</Text>
                          <Text style={detailStyles.collectionCount}>{collection.businessCount} lugares</Text>
                        </View>
                        <View style={detailStyles.collectionCheckbox}>
                          <Text style={detailStyles.collectionCheckboxIcon}>☐</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={() => { Alert.alert('Guardado!', 'Negócio adicionado à coleção.'); setShowCollectionsModal(false); }}>
                    <Text style={detailStyles.ratingButtonPrimaryText}>Concluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            
            {/* FASE 7: Booking Modal */}
            <Modal visible={showBookingModal} transparent animationType="slide" onRequestClose={() => setShowBookingModal(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={detailStyles.ratingCard}>
                  <Text style={detailStyles.ratingTitle}>Agendar Horário</Text>
                  <View style={{ marginVertical: 16, gap: 12 }}>
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 6 }}>Data</Text>
                      <TextInput 
                        style={detailStyles.bookingInput} 
                        placeholder="DD/MM/AAAA" 
                        value={bookingDate}
                        onChangeText={setBookingDate}
                      />
                    </View>
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 6 }}>Hora</Text>
                      <TextInput 
                        style={detailStyles.bookingInput} 
                        placeholder="HH:MM" 
                        value={bookingTime}
                        onChangeText={setBookingTime}
                      />
                    </View>
                    <View>
                      <Text style={{ fontSize: 12, fontWeight: '600', marginBottom: 6 }}>Número de pessoas</Text>
                      <TextInput 
                        style={detailStyles.bookingInput} 
                        placeholder="2" 
                        keyboardType="numeric"
                        value={bookingPeople}
                        onChangeText={setBookingPeople}
                      />
                    </View>
                  </View>
                  <View style={detailStyles.ratingActions}>
                    <TouchableOpacity style={detailStyles.ratingButtonGhost} onPress={() => setShowBookingModal(false)}>
                      <Text style={detailStyles.ratingButtonGhostText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={handleBooking}>
                      <Text style={detailStyles.ratingButtonPrimaryText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* FASE 7: Compare Modal */}
            <Modal visible={showCompareModal} transparent animationType="slide" onRequestClose={() => setShowCompareModal(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={[detailStyles.ratingCard, { maxHeight: '85%' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={detailStyles.ratingTitle}>Comparar Negócios</Text>
                    <TouchableOpacity onPress={() => setShowCompareModal(false)}>
                      <Text style={{ fontSize: 24, color: COLORS.grayText }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView>
                    {compareList.map(businessId => {
                      const business = MOCK_BUSINESSES.find(b => b.id === businessId);
                      if (!business) return null;
                      return (
                        <View key={businessId} style={detailStyles.compareItem}>
                          <Text style={detailStyles.compareIcon}>{business.icon}</Text>
                          <View style={detailStyles.compareInfo}>
                            <Text style={detailStyles.compareName}>{business.name}</Text>
                            <Text style={detailStyles.compareRating}>⭐ {business.rating} ({business.reviews})</Text>
                            <Text style={detailStyles.comparePrice}>{business.price} • {business.distanceText}</Text>
                          </View>
                          <TouchableOpacity onPress={() => toggleCompare(businessId)}>
                            <Text style={{ fontSize: 20 }}>🗑️</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </ScrollView>
                  <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={() => { setCompareList([]); setShowCompareModal(false); }}>
                    <Text style={detailStyles.ratingButtonPrimaryText}>Limpar Comparação</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            
            {/* FASE 8: Notifications Modal */}
            <Modal visible={showNotifications} transparent animationType="slide" onRequestClose={() => setShowNotifications(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={[detailStyles.ratingCard, { maxHeight: '80%' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={detailStyles.ratingTitle}>Notificações</Text>
                    <TouchableOpacity onPress={() => setShowNotifications(false)}>
                      <Text style={{ fontSize: 24, color: COLORS.grayText }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={{ flex: 1 }}>
                    {notifications.length === 0 ? (
                      <Text style={{ textAlign: 'center', padding: 20, color: COLORS.grayText }}>Sem notificações</Text>
                    ) : (
                      notifications.map(notif => (
                        <TouchableOpacity 
                          key={notif.id} 
                          style={[detailStyles.notificationItem, !notif.read && detailStyles.notificationItemUnread]}
                          onPress={() => markNotificationRead(notif.id)}
                        >
                          <View style={detailStyles.notificationContent}>
                            <Text style={detailStyles.notificationTitle}>{notif.title}</Text>
                            <Text style={detailStyles.notificationMessage}>{notif.message}</Text>
                            <Text style={detailStyles.notificationTime}>{notif.time}</Text>
                          </View>
                          {!notif.read && <View style={detailStyles.notificationDot} />}
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                  {notifications.length > 0 && (
                    <TouchableOpacity style={detailStyles.ratingButtonGhost} onPress={clearAllNotifications}>
                      <Text style={detailStyles.ratingButtonGhostText}>Limpar Todas</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>

            {/* FASE 8: Analytics Modal */}
            <Modal visible={showAnalytics} transparent animationType="slide" onRequestClose={() => setShowAnalytics(false)}>
              <View style={detailStyles.ratingOverlay}>
                <View style={detailStyles.ratingCard}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={detailStyles.ratingTitle}>Suas Estatísticas</Text>
                    <TouchableOpacity onPress={() => setShowAnalytics(false)}>
                      <Text style={{ fontSize: 24, color: COLORS.grayText }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={detailStyles.analyticsGrid}>
                    <View style={detailStyles.analyticsCard}>
                      <Text style={detailStyles.analyticsValue}>{userStats.businessesViewed}</Text>
                      <Text style={detailStyles.analyticsLabel}>Negócios Vistos</Text>
                    </View>
                    <View style={detailStyles.analyticsCard}>
                      <Text style={detailStyles.analyticsValue}>{userStats.reviewsWritten}</Text>
                      <Text style={detailStyles.analyticsLabel}>Avaliações</Text>
                    </View>
                    <View style={detailStyles.analyticsCard}>
                      <Text style={detailStyles.analyticsValue}>{userStats.checkIns}</Text>
                      <Text style={detailStyles.analyticsLabel}>Check-ins</Text>
                    </View>
                    <View style={detailStyles.analyticsCard}>
                      <Text style={detailStyles.analyticsValue}>{userStats.savedBusinesses}</Text>
                      <Text style={detailStyles.analyticsLabel}>Salvos</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={detailStyles.ratingButtonPrimary} onPress={() => setShowAnalytics(false)}>
                    <Text style={detailStyles.ratingButtonPrimaryText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

// STYLES - Mantendo os da FASE 1 + novos da FASE 2
const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.grayBg },
  header: { backgroundColor: COLORS.white, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  versionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1, marginLeft: 12 },
  versionText: { fontSize: 11, color: COLORS.grayText, fontWeight: '700' },
  versionSummary: { marginLeft: 8, fontSize: 10, color: COLORS.grayText },
  logo: { fontSize: 22, fontWeight: '700', color: COLORS.red, marginRight: 12 },
  searchBar: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.grayLine, borderRadius: 10, backgroundColor: COLORS.white, overflow: 'hidden' },
  searchColumn: { flex: 1, paddingVertical: 10, paddingHorizontal: 12 },
  searchDivider: { width: 1, backgroundColor: COLORS.grayLine },
  searchLabel: { fontSize: 11, color: COLORS.grayText, marginBottom: 2 },
  searchInput: { fontSize: 14, color: COLORS.darkText, paddingVertical: 0 },
  categoryRowWrapper: { backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  categoryRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.grayLine, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.white },
  categoryChipIcon: { marginRight: 6, fontSize: 16 },
  categoryChipLabel: { fontSize: 12, color: COLORS.darkText, fontWeight: '600' },
  scroll: { flex: 1 },
  sponsoredCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine, padding: 14 },
  sponsoredBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.red, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sponsoredBadgeText: { fontSize: 10, color: COLORS.white, fontWeight: '700' },
  sponsoredContent: { flexDirection: 'row', marginTop: 12 },
  sponsoredImage: { width: 64, height: 64, borderRadius: 10, backgroundColor: COLORS.grayBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sponsoredIcon: { fontSize: 30 },
  sponsoredInfo: { flex: 1 },
  sponsoredTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkText, marginBottom: 6 },
  sponsoredMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sponsoredRating: { marginLeft: 6, fontSize: 12, fontWeight: '700', color: COLORS.darkText },
  sponsoredReviews: { marginLeft: 4, fontSize: 12, color: COLORS.grayText },
  sponsoredCategory: { fontSize: 12, color: COLORS.grayText },
  sponsoredPromo: { marginTop: 8, backgroundColor: '#FFF0F0', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 8 },
  sponsoredPromoText: { fontSize: 12, color: COLORS.red, fontWeight: '600' },
  // REDESIGN: Controls Section - Alinhamento Inteligente Responsivo
  controlsSection: { 
    backgroundColor: COLORS.white, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.grayLine 
  },
  filtersContainer: { 
    paddingHorizontal: 16, 
    paddingTop: 12, 
    paddingBottom: 12 
  },
  quickFiltersRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 12 
  },
  quickFilterPill: { 
    paddingVertical: 7, 
    paddingHorizontal: 14, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderColor: COLORS.grayLine, 
    backgroundColor: COLORS.white 
  },
  quickFilterPillActive: { 
    borderColor: COLORS.red, 
    backgroundColor: COLORS.red 
  },
  quickFilterText: { 
    fontSize: 12, 
    color: COLORS.darkText, 
    fontWeight: '600' 
  },
  quickFilterTextActive: { 
    color: COLORS.white 
  },
  filtersSeparator: { 
    height: 1, 
    backgroundColor: COLORS.grayLine, 
    marginBottom: 12 
  },
  mainControlsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 0 
  },
  controlBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 8,
    gap: 4,
    minHeight: 40
  },
  controlBtnActive: { 
    backgroundColor: '#FFF9E6',
    borderRadius: 8
  },
  controlBtnIcon: { 
    fontSize: 15, 
    color: COLORS.darkText 
  },
  controlBtnText: { 
    fontSize: 12, 
    color: COLORS.darkText, 
    fontWeight: '600' 
  },
  controlBtnTextActive: { 
    color: COLORS.red 
  },
  controlBadge: { 
    width: 17, 
    height: 17, 
    borderRadius: 8.5, 
    backgroundColor: COLORS.red, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 3 
  },
  controlBadgeText: { 
    fontSize: 9, 
    color: COLORS.white, 
    fontWeight: '700' 
  },
  controlDivider: { 
    width: 1, 
    height: 20, 
    backgroundColor: COLORS.grayLine 
  },
  sectionHeader: { paddingHorizontal: 16, paddingBottom: 6, paddingTop: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkText },
  sectionCount: { fontSize: 12, color: COLORS.grayText },
  listCell: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 12, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.grayLine },
  listCellImage: { width: 72, height: 72, borderRadius: 8, backgroundColor: COLORS.grayBg, alignItems: 'center', justifyContent: 'center', marginRight: 12, position: 'relative', overflow: 'visible' },
  listCellIcon: { fontSize: 32 },
  listCellInfo: { flex: 1 },
  listCellTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  listCellTitle: { fontSize: 15, fontWeight: '700', color: COLORS.darkText, flex: 1 },
  bookmarkBtn: { padding: 4 },
  bookmarkIcon: { fontSize: 18 },
  listCellMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  listCellRating: { marginLeft: 6, fontSize: 12, fontWeight: '700', color: COLORS.darkText },
  listCellReviews: { marginLeft: 4, fontSize: 12, color: COLORS.grayText },
  listCellCategory: { fontSize: 12, color: COLORS.grayText, marginBottom: 6 },
  amenitiesRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  amenityChip: { backgroundColor: COLORS.grayBg, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  amenityIcon: { fontSize: 12 },
  listCellFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  listCellDistance: { fontSize: 12, color: COLORS.grayText },
  openText: { fontSize: 12, color: COLORS.green, fontWeight: '600' },
  closedText: { fontSize: 12, color: COLORS.red, fontWeight: '600' },
 
  // FASE 7 & 8: Advanced home styles
  dealBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: COLORS.red, paddingHorizontal: 8,       paddingVertical: 4, borderRadius: 12, zIndex: 1 },
  dealBadgeOverlay: { 
    position: 'absolute', 
    top: -8, 
    right: -8, 
    backgroundColor: COLORS.red, 
    paddingHorizontal: 7, 
    paddingVertical: 4, 
    borderRadius: 12, 
    zIndex: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.5, 
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    maxWidth: 200
  },
  dealBadgeText: { 
    fontSize: 9, 
    fontWeight: '700', 
    color: COLORS.white, 
    letterSpacing: 0.3,
    flexShrink: 0,
    numberOfLines: 1
  },
  compareCheckbox: { padding: 4 },
  compareCheckboxIcon: { fontSize: 20, color: COLORS.red },
  compareFloatingContainer: { position: 'absolute', bottom: 20, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  compareFloatingBtn: { backgroundColor: COLORS.red, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 8 },
  compareFloatingText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerActionBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.grayBg, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  headerActionIcon: { fontSize: 16 },
  notificationBadge: { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center' },
  notificationBadgeText: { fontSize: 9, fontWeight: '700', color: COLORS.white },
  premiumBadge: { fontSize: 14, marginLeft: 4 },
  verifiedBadge: { fontSize: 12, color: '#1DA1F2', marginLeft: 2 },
  offlineIndicator: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: '#FF6B6B', paddingVertical: 8, alignItems: 'center', zIndex: 999 },
  offlineText: { fontSize: 12, fontWeight: '700', color: COLORS.white }
});

// FASE 2: Autocomplete Styles
const autocompleteStyles = StyleSheet.create({
  container: { position: 'absolute', top: 110, left: 0, right: 0, maxHeight: 400, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine, zIndex: 1000, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  scroll: { flex: 1 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.darkText, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  icon: { fontSize: 16, marginRight: 12, color: COLORS.grayText },
  text: { fontSize: 14, color: COLORS.darkText, flex: 1 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  clearText: { fontSize: 12, color: COLORS.red, fontWeight: '600' }
});

// FASE 2: Filter Badges Styles
const filterBadgeStyles = StyleSheet.create({
  container: { paddingBottom: 8 },
  scroll: { paddingHorizontal: 16, gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.red, borderRadius: 16, paddingVertical: 6, paddingLeft: 12, paddingRight: 8, gap: 6 },
  badgeText: { fontSize: 12, color: COLORS.white, fontWeight: '600' },
  badgeClose: { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  badgeCloseText: { fontSize: 10, color: COLORS.white, fontWeight: '700' }
});

// FASE 2: Advanced Filters Modal Styles
const advancedFilterStyles = StyleSheet.create({
  panel: { flex: 1, backgroundColor: COLORS.white, marginTop: 80, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.darkText },
  close: { fontSize: 28, color: COLORS.grayText },
  scroll: { flex: 1, padding: 20 },
  groupTitle: { fontSize: 14, fontWeight: '700', color: COLORS.darkText, marginBottom: 12, marginTop: 8 },
  group: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  option: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.grayLine, backgroundColor: COLORS.white },
  optionActive: { borderColor: COLORS.red, backgroundColor: '#FFF0F0' },
  optionText: { fontSize: 13, color: COLORS.darkText, fontWeight: '600' },
  optionTextActive: { color: COLORS.red },
  footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: COLORS.grayLine },
  clearBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine },
  clearText: { fontSize: 14, fontWeight: '700', color: COLORS.darkText },
  applyBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12, backgroundColor: COLORS.red },
  applyText: { fontSize: 14, fontWeight: '700', color: COLORS.white }
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sortMenu: { backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  sortTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkText, marginBottom: 16 },
  sortOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  sortOptionText: { fontSize: 14, color: COLORS.darkText },
  sortOptionTextActive: { fontWeight: '700', color: COLORS.red },
  sortCheck: { fontSize: 16, color: COLORS.red }
});

const starStyles = StyleSheet.create({ 
  starRow: { flexDirection: 'row', alignItems: 'center' }, 
  star: { fontSize: 12, marginRight: 1 }, 
  starFilled: { color: COLORS.red }, 
  starEmpty: { color: '#D8D8D8' }
});

const heroStarStyles = StyleSheet.create({ 
  starRow: { flexDirection: 'row', alignItems: 'center' }, 
  star: { fontSize: 12, marginRight: 1 }, 
  starFilled: { color: COLORS.white }, 
  starEmpty: { color: 'rgba(255,255,255,0.5)' } 
});

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 12, justifyContent: 'flex-start' },
  floatingBack: { position: 'absolute', left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  floatingBackText: { fontSize: 18, color: COLORS.white, fontWeight: '700' },
  floatingActions: { position: 'absolute', right: 16, flexDirection: 'row', gap: 8, zIndex: 10 },
  floatingActionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  floatingActionIcon: { fontSize: 18 },
  topBarBack: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  topBarBackText: { fontSize: 16, color: COLORS.darkText, fontWeight: '700' },
  topBarTitle: { flex: 1, marginLeft: 12, textAlign: 'left', fontSize: 16, color: COLORS.darkText, fontWeight: '700' },
  heroImage: { width: '100%', justifyContent: 'flex-end', padding: 16, backgroundColor: COLORS.red, marginTop: 0, position: 'relative' },
  heroImageStyle: { width: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.heroOverlay },
  photoCounter: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  photoCounterText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  heroIcon: { fontSize: 48, color: COLORS.white, alignSelf: 'flex-start' },
  heroContent: { marginTop: 16 },
  heroTitle: { fontSize: 20, fontWeight: '700', color: COLORS.white },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  heroRating: { fontSize: 13, fontWeight: '700', color: COLORS.white },
  heroReviews: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  heroStatusText: { marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  fixedHeader: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine, zIndex: 20 },
  fixedHeaderRow: { position: 'relative', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: TOP_BAR_HEIGHT },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerActionBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerActionIcon: { fontSize: 18 },
  ratingSection: { width: '100%', backgroundColor: COLORS.white, paddingVertical: 10, alignItems: 'center', marginBottom: 0 },
  stickyHeader: { backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#EEE', borderBottomWidth: 1, borderBottomColor: COLORS.grayLine, marginTop: 0, paddingTop: 0 },
  backGroup: { flexDirection: 'row', alignItems: 'center', zIndex: 2 },
  backLabel: { fontSize: 13, color: COLORS.darkText, fontWeight: '600' },
  tabsBar: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, paddingHorizontal: 15, paddingTop: 0, marginTop: 0 },
  tabItem: { paddingVertical: 6, alignItems: 'center' },
  tabText: { fontSize: 12, color: COLORS.grayText, fontWeight: '600' },
  tabTextActive: { fontSize: 12, color: COLORS.red, fontWeight: '700' },
  tabIndicator: { marginTop: 6, height: 2, width: 24, backgroundColor: COLORS.red, borderRadius: 2 },
  reviewStarter: { marginTop: 0, paddingVertical: 0, paddingBottom: 0, marginBottom: 0, alignItems: 'center', justifyContent: 'center' },
  reviewStarterTitle: { fontSize: 13, color: COLORS.darkText, fontWeight: '700', textAlign: 'center' },
  reviewStarterStars: { flexDirection: 'row', marginTop: 6, justifyContent: 'center' },
  reviewStarterStar: { fontSize: 16, color: '#CFCFCF', marginRight: 2 },
  actionOutline: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.grayLine, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.white },
  actionEqual: { flex: 1, justifyContent: 'center', minHeight: 36 },
  actionIcon: { fontSize: 14, marginRight: 6 },
  actionText: { fontSize: 12, color: COLORS.darkText, fontWeight: '600' },
  infoActionRow: { flexDirection: 'row', gap: 8, justifyContent: 'space-between', marginBottom: 12 },
  whatsappButton: { backgroundColor: '#25D366', borderColor: '#25D366' },
  whatsappBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  whatsappBadgeText: { fontSize: 9, fontWeight: '700', color: '#25D366' },
  whatsappButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 12, flexShrink: 1 },
  sectionBlock: { paddingHorizontal: 16, paddingTop: 20 },
  menuSectionBlock: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.darkText, marginBottom: 12 },
  mapCard: { borderRadius: 12, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.grayLine, overflow: 'hidden' },
  mapPlaceholder: { height: 140, backgroundColor: COLORS.mapBg, alignItems: 'center', justifyContent: 'center' },
  mapText: { color: COLORS.grayText, fontSize: 12, fontWeight: '600' },
  mapInfoRow: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mapInfoText: { flex: 1, paddingRight: 12 },
  mapAddress: { fontSize: 12, fontWeight: '700', color: COLORS.darkText },
  mapNeighborhood: { fontSize: 11, color: COLORS.grayText, marginTop: 2 },
  directionsBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.grayBg, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  directionsText: { fontSize: 12, color: COLORS.darkText, fontWeight: '700' },
  directionsIcon: { marginLeft: 6, fontSize: 14, color: COLORS.darkText },
  infoHighlightText: { fontSize: 12, color: COLORS.grayText, marginBottom: 12 },
  infoList: { marginTop: 16, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  infoIcon: { fontSize: 14, marginRight: 10, marginTop: 2 },
  infoTextBlock: { flex: 1, gap: 4 },
  infoText: { fontSize: 12, color: COLORS.grayText },
  menuCard: { borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine, padding: 12, gap: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  menuItemText: { flex: 1, paddingRight: 12 },
  menuItemTitle: { fontSize: 13, fontWeight: '700', color: COLORS.darkText },
  menuItemDesc: { fontSize: 11, color: COLORS.grayText, marginTop: 4 },
  menuItemPrice: { fontSize: 12, color: COLORS.darkText, fontWeight: '700' },
  popularDishesCard: { borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine, padding: 12, gap: 12 },
  popularDishItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  popularDishRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.red, alignItems: 'center', justifyContent: 'center' },
  popularDishRankText: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  popularDishInfo: { flex: 1 },
  popularDishName: { fontSize: 13, fontWeight: '700', color: COLORS.darkText },
  popularDishOrders: { fontSize: 11, color: COLORS.grayText, marginTop: 2 },
  popularDishPrice: { fontSize: 12, fontWeight: '700', color: COLORS.darkText },
  reviewFilterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: COLORS.grayLine, marginRight: 8, backgroundColor: COLORS.white },
  reviewFilterChipActive: { borderColor: COLORS.red, backgroundColor: '#FFF0F0' },
  reviewFilterText: { fontSize: 11, color: COLORS.darkText, fontWeight: '600' },
  reviewFilterTextActive: { color: COLORS.red },
  reviewsList: { gap: 12 },
  reviewCard: { borderWidth: 1, borderColor: COLORS.grayLine, borderRadius: 12, padding: 12 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewName: { fontSize: 13, fontWeight: '700', color: COLORS.darkText },
  reviewDate: { fontSize: 11, color: COLORS.grayText },
  reviewStars: { marginTop: 6 },
  reviewComment: { marginTop: 8, fontSize: 12, color: COLORS.grayText, lineHeight: 18 },
  reviewPhotosScroll: { marginTop: 12 },
  reviewPhoto: { width: 80, height: 80, borderRadius: 8, marginRight: 8, backgroundColor: COLORS.grayBg },
  uploadPhotoBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine, borderStyle: 'dashed', gap: 8 },
  uploadPhotoIcon: { fontSize: 20 },
  uploadPhotoText: { fontSize: 13, color: COLORS.darkText, fontWeight: '600' },
  uploadPhotoHint: { fontSize: 12, color: COLORS.grayText, marginTop: 8, marginBottom: 16, textAlign: 'center' },
  ratingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  ratingCard: { width: '100%', backgroundColor: COLORS.white, borderRadius: 16, padding: 16 },
  ratingTitle: { fontSize: 15, fontWeight: '700', color: COLORS.darkText },
  ratingInput: { marginTop: 12, borderWidth: 1, borderColor: COLORS.grayLine, borderRadius: 12, padding: 12, minHeight: 120, textAlignVertical: 'top', color: COLORS.darkText },
  ratingActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 },
  ratingButtonGhost: { paddingHorizontal: 12, paddingVertical: 8 },
  ratingButtonGhostText: { color: COLORS.grayText, fontWeight: '700' },
  ratingButtonPrimary: { backgroundColor: COLORS.red, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  ratingButtonPrimaryText: { color: COLORS.white, fontWeight: '700' },
  highlightsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  highlightChip: { borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: '#F8C9C9' },
  highlightText: { fontSize: 11, color: COLORS.red, fontWeight: '600' },
  // FASE 4: Review enhancements
  reviewStatsCard: { backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine, padding: 16, marginBottom: 16 },
  reviewStatsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewStatsAvg: { fontSize: 36, fontWeight: '700', color: COLORS.red },
  reviewStatsTotal: { fontSize: 12, color: COLORS.grayText, marginTop: 4 },
  reviewStatsToggle: { fontSize: 20, color: COLORS.grayText },
  reviewStatsDistribution: { marginTop: 16, gap: 8 },
  reviewStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewStatsLabel: { fontSize: 12, fontWeight: '600', color: COLORS.darkText, width: 30 },
  reviewStatsBarBg: { flex: 1, height: 8, backgroundColor: COLORS.grayBg, borderRadius: 4, overflow: 'hidden' },
  reviewStatsBarFill: { height: '100%', backgroundColor: COLORS.red },
  reviewStatsCount: { fontSize: 11, color: COLORS.grayText, width: 25, textAlign: 'right' },
  reviewControls: { marginBottom: 12 },
  reviewControlLabel: { fontSize: 12, fontWeight: '700', color: COLORS.darkText, marginRight: 8, paddingTop: 6 },
  reviewSortChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: COLORS.grayLine, marginRight: 8, backgroundColor: COLORS.white },
  reviewSortChipActive: { borderColor: COLORS.red, backgroundColor: '#FFF0F0' },
  reviewSortText: { fontSize: 11, color: COLORS.darkText, fontWeight: '600' },
  reviewSortTextActive: { color: COLORS.red },
  reviewUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reviewAvatar: { fontSize: 32 },
  reviewHelpfulBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: COLORS.grayBg, alignSelf: 'flex-start' },
  reviewHelpfulIcon: { fontSize: 16 },
  reviewHelpfulText: { fontSize: 12, color: COLORS.grayText, fontWeight: '600' },
  reviewHelpfulTextActive: { color: COLORS.red },
  ownerResponseCard: { marginTop: 12, backgroundColor: '#FFF9E6', borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: '#FFD700' },
  ownerResponseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ownerResponseBadge: { fontSize: 11, fontWeight: '700', color: '#C17900' },
  ownerResponseDate: { fontSize: 10, color: COLORS.grayText },
  ownerResponseText: { fontSize: 12, color: COLORS.darkText, lineHeight: 18 },
  userProfileHeader: { alignItems: 'center', marginBottom: 20 },
  userProfileAvatar: { fontSize: 64, marginBottom: 12 },
  userProfileName: { fontSize: 18, fontWeight: '700', color: COLORS.darkText },
  userProfileStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.grayLine },
  userProfileStat: { alignItems: 'center' },
  userProfileStatValue: { fontSize: 24, fontWeight: '700', color: COLORS.red },
  userProfileStatLabel: { fontSize: 11, color: COLORS.grayText, marginTop: 4 },
  // FASE 5: Business Versatility styles
  businessTypeBadgeContainer: { paddingHorizontal: 16, marginTop: -8, marginBottom: 12 },
  businessTypeBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, gap: 6 },
  businessTypeBadgeIcon: { fontSize: 14 },
  businessTypeBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.white },
  servicesCard: { borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine, overflow: 'hidden' },
  serviceItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  serviceItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  serviceItemTitle: { fontSize: 14, fontWeight: '700', color: COLORS.darkText, flex: 1, marginRight: 8 },
  serviceItemPrice: { fontSize: 14, fontWeight: '700', color: COLORS.red },
  serviceItemDuration: { fontSize: 11, color: COLORS.grayText, marginBottom: 6 },
  serviceItemDesc: { fontSize: 12, color: COLORS.grayText, lineHeight: 18 },
  portfolioScroll: { marginTop: 12 },
  portfolioImage: { width: 150, height: 150, borderRadius: 8, marginRight: 12, backgroundColor: COLORS.grayBg },
  availabilityCalendar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  availabilityDay: { flex: 1, alignItems: 'center' },
  availabilityDayCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  availabilityDayAvailable: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  availabilityDayUnavailable: { backgroundColor: COLORS.grayBg, borderColor: COLORS.grayLine },
  availabilityDayText: { fontSize: 10, fontWeight: '700', color: COLORS.grayText },
  availabilityDayTextAvailable: { color: COLORS.white },
  // FASE 6: Social & Engagement styles
  socialActionsSection: { backgroundColor: COLORS.grayBg, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 0 },
  socialStatsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  socialStat: { alignItems: 'center' },
  socialStatValue: { fontSize: 20, fontWeight: '700', color: COLORS.darkText },
  socialStatLabel: { fontSize: 11, color: COLORS.grayText, marginTop: 4 },
  socialButtonsRow: { flexDirection: 'row', gap: 8 },
  socialButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.grayLine, borderRadius: 20, paddingVertical: 10, gap: 6 },
  socialButtonActive: { backgroundColor: COLORS.red, borderColor: COLORS.red },
  socialButtonIcon: { fontSize: 14 },
  socialButtonText: { fontSize: 12, fontWeight: '700', color: COLORS.darkText },
  socialButtonTextActive: { color: COLORS.white },
  qaSection: { marginBottom: 20 },
  qaSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  qaTitle: { fontSize: 15, fontWeight: '700', color: COLORS.darkText },
  qaAskBtn: { fontSize: 13, fontWeight: '700', color: COLORS.red },
  qaItem: { backgroundColor: COLORS.grayBg, borderRadius: 12, padding: 12, marginBottom: 10 },
  qaQuestion: { fontSize: 13, fontWeight: '700', color: COLORS.darkText, marginBottom: 8 },
  qaAnswer: { fontSize: 12, color: COLORS.grayText, lineHeight: 18, marginBottom: 8 },
  qaFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qaDate: { fontSize: 10, color: COLORS.grayText },
  qaHelpful: { fontSize: 11, color: COLORS.darkText },
  qaViewAll: { alignItems: 'center', paddingVertical: 8 },
  qaViewAllText: { fontSize: 13, fontWeight: '600', color: COLORS.red },
  referralCard: { backgroundColor: '#FFF9E6', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 2, borderColor: '#FFD700' },
  referralHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  referralIcon: { fontSize: 32, marginRight: 12 },
  referralHeaderText: { flex: 1 },
  referralTitle: { fontSize: 15, fontWeight: '700', color: COLORS.darkText },
  referralSubtitle: { fontSize: 11, color: COLORS.grayText, marginTop: 2 },
  referralCodeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 8, borderWidth: 1, borderColor: '#FFD700' },
  referralCode: { fontSize: 20, fontWeight: '700', color: COLORS.red, letterSpacing: 2 },
  referralCopyIcon: { fontSize: 20, marginLeft: 12 },
  referralHint: { fontSize: 10, color: COLORS.grayText, textAlign: 'center' },
  collectionItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  collectionIcon: { fontSize: 32, marginRight: 12 },
  collectionInfo: { flex: 1 },
  collectionName: { fontSize: 14, fontWeight: '700', color: COLORS.darkText },
  collectionCount: { fontSize: 11, color: COLORS.grayText, marginTop: 2 },
  collectionCheckbox: { width: 24, height: 24, borderWidth: 2, borderColor: COLORS.grayLine, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  collectionCheckboxIcon: { fontSize: 16, color: COLORS.grayText },
  // FASE 7: Detail-specific styles (Deals, Booking, Live Status, Compare Modal)
  dealCard: { backgroundColor: '#FFF9E6', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 2, borderColor: '#FFD700' },
  dealCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  dealTitle: { fontSize: 15, fontWeight: '700', color: COLORS.darkText, flex: 1, marginRight: 8 },
  dealCodeBadge: { backgroundColor: COLORS.red, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dealCodeText: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  dealDescription: { fontSize: 12, color: COLORS.grayText, marginBottom: 6 },
  dealExpires: { fontSize: 11, color: COLORS.red, fontWeight: '600' },
  bookingCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.grayLine, padding: 16, gap: 12 },
  bookingIcon: { fontSize: 32 },
  bookingInfo: { flex: 1 },
  bookingTitle: { fontSize: 15, fontWeight: '700', color: COLORS.darkText },
  bookingSubtitle: { fontSize: 12, color: COLORS.grayText, marginTop: 4 },
  bookingArrow: { fontSize: 24, color: COLORS.red },
  bookingInput: { borderWidth: 1, borderColor: COLORS.grayLine, borderRadius: 8, padding: 12, fontSize: 14, color: COLORS.darkText },
  liveStatusBanner: { marginHorizontal: 16, marginBottom: 16, padding: 12, borderRadius: 8, borderWidth: 2, flexDirection: 'row', alignItems: 'center', gap: 10 },
  liveDot: { width: 10, height: 10, borderRadius: 5 },
  liveStatusText: { fontSize: 13, fontWeight: '700' },
  compareItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine },
  compareIcon: { fontSize: 32, marginRight: 12 },
  compareInfo: { flex: 1 },
  compareName: { fontSize: 14, fontWeight: '700', color: COLORS.darkText },
  compareRating: { fontSize: 11, color: COLORS.grayText, marginTop: 2 },
  comparePrice: { fontSize: 11, color: COLORS.grayText, marginTop: 2 },
  // FASE 8: Modal-specific styles (Notifications, Analytics)
  notificationItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: COLORS.grayLine, flexDirection: 'row', alignItems: 'flex-start' },
  notificationItemUnread: { backgroundColor: '#FFF9E6' },
  notificationContent: { flex: 1 },
  notificationTitle: { fontSize: 14, fontWeight: '700', color: COLORS.darkText, marginBottom: 4 },
  notificationMessage: { fontSize: 12, color: COLORS.grayText, marginBottom: 4 },
  notificationTime: { fontSize: 10, color: COLORS.grayText },
  notificationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.red, marginLeft: 8, marginTop: 4 },
  analyticsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  analyticsCard: { flex: 1, minWidth: '45%', backgroundColor: COLORS.grayBg, borderRadius: 12, padding: 16, alignItems: 'center' },
  analyticsValue: { fontSize: 28, fontWeight: '700', color: COLORS.red, marginBottom: 6 },
  analyticsLabel: { fontSize: 11, color: COLORS.grayText, textAlign: 'center' }
});