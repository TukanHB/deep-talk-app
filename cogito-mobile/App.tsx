import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

const categories = [
  {
    key: 'friendship',
    label: 'Friendship',
    icon: <Ionicons name="people" size={28} color="#F4B400" />,
    questions: [
      'What makes a friendship last?',
      'How do you define trust?',
      'What do you value most in a friend?',
    ],
  },
  {
    key: 'love',
    label: 'Love & Relationships',
    icon: <MaterialCommunityIcons name="heart-outline" size={28} color="#DB3C8C" />,
    questions: [
      'What does love mean to you?',
      'How do you handle conflicts in relationships?',
    ],
  },
  {
    key: 'identity',
    label: 'Identity & Life',
    icon: <FontAwesome5 name="user-circle" size={28} color="#4285F4" />,
    questions: [
      'Who are you when no one is watching?',
      'What shaped your identity the most?',
    ],
  },
  {
    key: 'goals',
    label: 'Goals & Society',
    icon: <FontAwesome5 name="bullseye" size={28} color="#0F9D58" />,
    questions: [
      'What is your biggest goal?',
      'How do you define success?',
    ],
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark
    ? {
        background: '#000000',
        text: '#FFFFFF',
        subtext: '#AAAAAA',
        card: '#1A1A1A',
      }
    : {
        background: '#FFFFFF',
        text: '#000000',
        subtext: '#444444',
        card: '#F7F7F7',
      };

  const nextQuestion = () => {
    if (!selectedCategory) return;
    setQuestionIndex((prev) => (prev + 1) % selectedCategory.questions.length);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.logo, { color: theme.text }]}>Cogito</Text>
        <Pressable onPress={toggleTheme}>
          <Text style={styles.modeToggle}>{isDark ? '☀️' : '🌙'}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        pagingEnabled
        onMomentumScrollEnd={nextQuestion}
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Landing Page */}
        {!selectedCategory && (
          <>
            <View style={[styles.screen, { backgroundColor: theme.background }]}>
              <Text style={[styles.title, { color: theme.text }]}>Welcome to Cogito!</Text>
              <Text style={[styles.subtitle, { color: theme.subtext }]}>The Voice of Thinking</Text>
              <Text style={[styles.description, { color: theme.subtext }]}>
                Choose a category and explore deep-talk questions — one per page with TikTok-style snap scroll.
              </Text>
            </View>

            {/* Category Selection */}
            <View style={[styles.screen, { backgroundColor: theme.background }]}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.key}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setQuestionIndex(0);
                  }}
                  style={[styles.card, { backgroundColor: theme.card }]}
                >
                  {cat.icon}
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{cat.label}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* Questions View */}
        {selectedCategory && (
          <>
            {selectedCategory.questions.map((q, index) => (
              <View
                key={index}
                style={[styles.screen, { backgroundColor: theme.background }]}
              >
                <Text style={[styles.cardTitle, { color: theme.text }]}> {selectedCategory.label} </Text>
                <Text style={[styles.description, { color: theme.subtext }]}>{q}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Fixed Back to Menu Button */}
      {selectedCategory && (
        <View style={styles.fixedButton}>
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={[styles.backButton, { backgroundColor: '#F4B400' }]}
          >
            <Text style={styles.backButtonText}>← Back to Menu</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  modeToggle: {
    fontSize: 22,
  },
  screen: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  card: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 16,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  fixedButton: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
