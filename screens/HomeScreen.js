import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../constants/theme';

export default function HomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { role } = route.params || { role: 'seeker' };
  const scrollX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const screenWidth = Dimensions.get('window').width;
  const textWidth = screenWidth * 3.5;

  useEffect(() => {
    const duration = 25000;
    const animate = () => {
      scrollX.setValue(screenWidth);
      Animated.timing(scrollX, {
        toValue: -textWidth,
        duration,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start(() => animate());
    };
    animate();
  }, [scrollX, textWidth, screenWidth]);

  const jobSeekerBannerText = 'You are in the Top 10% of job Seekers in your community with 247 points - keep up the good work! ...... 123623 IzziJobs Users worldwide and growing!';
  const employerBannerText = 'You are managing top jobs in your community with 150 points - keep it up! ...... 123623 IzziJobs Users worldwide and growing!';

  const renderSeekerContent = () => (
    <ScrollView style={{ flex: 1, marginTop: -5 }} contentContainerStyle={styles.scrollContent}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RankScreen')}>
          <Icon name="crown" size={35} color="#333" style={styles.icon} />
          <Text style={styles.itemText}>Rank</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RatingScreen')}>
          <Icon name="star" size={35} color="#ff9800" style={styles.icon} />
          <Text style={styles.itemText}>Rating</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WeatherScreen')}>
          <Icon name="weather-partly-cloudy" size={35} color="#ffeb3b" style={styles.icon} />
          <Text style={styles.itemText}>Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CalendarScreen')}>
          <Icon name="calendar" size={35} color="#4caf50" style={styles.icon} />
          <Text style={styles.itemText}>Calendar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <View style={styles.card}>
          <Icon name="chat" size={35} color="#007bff" style={styles.icon} />
          <Text style={styles.itemText}>Unread: 2</Text>
        </View>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EarningsStatementScreen')}>
          <Icon name="bank" size={35} color="#6a1b9a" style={styles.icon} />
          <Text style={styles.itemText}>2513</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ListOfJobsScreen')}>
          <Icon name="briefcase" size={35} color="#ff4500" style={styles.icon} />
          <Text style={styles.itemText}>Jobs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AppliedJobsScreen')}>
          <Icon name="file-document" size={35} color="#48d22b" style={styles.icon} />
          <Text style={styles.itemText}>Applied</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderEmployerContent = () => (
    <ScrollView style={{ flex: 1, marginTop: 70 }} contentContainerStyle={styles.scrollContent}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('WeatherScreen')}>
          <Icon name="weather-partly-cloudy" size={35} color="#ffeb3b" style={styles.icon} />
          <Text style={styles.itemText}>Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CalendarScreen')}>
          <Icon name="calendar" size={35} color="#4caf50" style={styles.icon} />
          <Text style={styles.itemText}>Calendar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <View style={styles.card}>
          <Icon name="chat" size={35} color="#007bff" style={styles.icon} />
          <Text style={styles.itemText}>Unread: 2</Text>
        </View>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RatingScreen')}>
          <Icon name="star" size={35} color="#ff9800" style={styles.icon} />
          <Text style={styles.itemText}>Rating</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PostingJobsScreen')}>
          <Icon name="briefcase" size={35} color="#48d22b" style={styles.icon} />
          <Text style={styles.itemText}>New Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MyJobPosts')}>
          <Icon name="briefcase-check" size={35} color="#2196f3" style={styles.icon} />
          <Text style={styles.itemText}>My Jobs</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ApplicantsScreen')}>
          <Icon name="account-group" size={35} color="#ff4500" style={styles.icon} />
          <Text style={styles.itemText}>Applicants</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SalariesPaid')}>
          <Icon name="cash" size={35} color="#6a1b9a" style={styles.icon} />
          <Text style={styles.itemText}>Salaries</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Animated.View style={{ transform: [{ translateX: scrollX }], width: textWidth }}>
          <Text style={styles.bannerText} numberOfLines={1}>
            {role === 'seeker' ? jobSeekerBannerText : employerBannerText}
          </Text>
        </Animated.View>
      </View>
      {role === 'seeker' ? renderSeekerContent() : renderEmployerContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  banner: {
    height: 40,
    backgroundColor: '#48d22b',
    justifyContent: 'center',
    paddingHorizontal: 0,
    width: Dimensions.get('window').width,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  bannerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingTop: 70,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    width: 95,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 4,
  },
  itemText: {
    fontSize: 11,
    textAlign: 'center',
  },
});