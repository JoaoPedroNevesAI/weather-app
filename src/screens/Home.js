import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Platform, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import WeatherIcon from '../components/WeatherIcon';
import SunInfo from '../components/SunInfo';

const api = axios.create({
  baseURL: 'https://api.hgbrasil.com/weather',
});

function WeatherDetails({ wind, humidity, rain }) {
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>🌬️ Vento</Text>
        <Text style={styles.detailValue}>{wind}</Text>
      </View>
      <View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>💧 Umidade</Text>
        <Text style={styles.detailValue}>{humidity}%</Text>
      </View>
      <View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>🌧️ Chuva</Text>
        <Text style={styles.detailValue}>{rain}%</Text>
      </View>
    </View>
  );
}

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [location, setLocation] = useState('Recife,PE');
  const [inputValue, setInputValue] = useState(location);

  useEffect(() => {
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchWeatherByCity(location);
  }, [location]);

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await api.get(`?key=ba94c742&city_name=${city}`);
      if (response.data && response.data.results) {
        setWeather(response.data.results);
      }
    } catch (error) {
      console.error('Erro ao buscar cidade:', error);
    }
  };

  const onSearch = () => {
    setLocation(inputValue);
  };

  if (!weather) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const isNight = currentHour < 6 || currentHour >= 18;

  const getBackgroundGradient = (hour) =>
    hour >= 6 && hour < 18 ? ['#4facfe', '#00f2fe'] : ['#0f2027', '#203a43', '#2c5364'];

  return (
    <LinearGradient colors={getBackgroundGradient(currentHour)} style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Digite a cidade, ex: Recife,PE"
          placeholderTextColor="#ccc"
          style={styles.searchInput}
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topIconContainer}>
        <WeatherIcon description={weather.description} currently={isNight ? 'noite' : 'dia'} size={100} />
      </View>

      <View style={styles.card}>
        <Text style={styles.city}>{weather.city}</Text>
        <Text style={styles.temp}>{weather.temp}°C</Text>
        <Text style={styles.desc}>{weather.description}</Text>

        <SunInfo sunrise={weather.sunrise} sunset={weather.sunset} isNight={isNight} />
        <WeatherDetails wind={weather.wind_speedy} humidity={weather.humidity} rain={weather.rain_probability ?? 0} />

        <View style={styles.forecastContainer}>
          <Text style={styles.forecastTitle}>Próximos dias</Text>
          <FlatList
            horizontal
            data={weather.forecast}
            keyExtractor={(item) => item.date}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.forecastCard}>
                <Text style={styles.forecastWeekday}>{item.weekday}</Text>
                <Text style={styles.forecastDate}>{item.date}</Text>
                <WeatherIcon description={item.description} currently={isNight ? 'noite' : 'dia'} size={40} />
                <Text style={styles.forecastTemp}>
                  {item.max}° / {item.min}°
                </Text>
                <Text style={styles.forecastDesc}>{item.description}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: Platform.OS === 'web' ? '100vh' : '100%' },
  loadingContainer: {
    flex: 1,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4facfe',
  },
  loadingText: { color: '#fff', fontSize: 18 },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topIconContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  card: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  city: { fontSize: 28, color: '#fff' },
  temp: { fontSize: 60, fontWeight: 'bold', color: '#fff' },
  desc: { fontSize: 18, color: '#fff', marginBottom: 20 },
  sunContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  sunBlock: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    width: 100,
  },
  sunText: { color: '#fff', marginTop: 5, fontSize: 14 },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  detailBlock: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    width: 90,
  },
  detailTitle: { color: '#fff', fontSize: 14, marginBottom: 5 },
  detailValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  forecastContainer: { marginTop: 30, width: '100%' },
  forecastTitle: { color: '#fff', fontSize: 18, marginBottom: 10 },
  forecastCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    marginRight: 10,
    borderRadius: 15,
    alignItems: 'center',
    width: 100,
  },
  forecastWeekday: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  forecastDate: { color: '#fff', fontSize: 14 },
  forecastTemp: { color: '#fff', fontSize: 16, marginTop: 5 },
  forecastDesc: { color: '#fff', fontSize: 12, marginTop: 2, textAlign: 'center' },
});