import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // TODO: Carregar categorias e serviços próximos da API
      setCategories([
        { id: 1, name: 'Mecânica', icon: '🔧' },
        { id: 2, name: 'Elétrica', icon: '⚡' },
        { id: 3, name: 'Saúde', icon: '🏥' },
        { id: 4, name: 'Beleza', icon: '💇' },
        { id: 5, name: 'Limpeza', icon: '🧹' },
        { id: 6, name: 'Transporte', icon: '🚚' },
      ]);
      
      setNearbyServices([
        { id: 1, name: 'Oficina João', category: 'Mecânica', rating: 4.8, distance: 2.3 },
        { id: 2, name: 'Eletricista Silva', category: 'Elétrica', rating: 4.5, distance: 1.2 },
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate('Search', { category: item.name })}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderService = ({ item }) => (
    <TouchableOpacity 
      style={styles.serviceCard}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <View>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceCategory}>{item.category}</Text>
        <View style={styles.serviceInfo}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.distance}>{item.distance} km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Encontre Serviços Próximos</Text>
        <Text style={styles.headerSubtitle}>Categorias populares</Text>
      </View>

      {/* Categorias */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        scrollEnabled={false}
        style={styles.categoriesSection}
      />

      {/* Serviços Próximos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Serviços Próximos</Text>
        <FlatList
          data={nearbyServices}
          renderItem={renderService}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FF6B35',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  categoriesSection: {
    padding: 10,
  },
  categoryCard: {
    flex: 1,
    margin: 10,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  serviceCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceCategory: {
    fontSize: 14,
    color: '#999',
    marginTop: 3,
  },
  serviceInfo: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  distance: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
});
