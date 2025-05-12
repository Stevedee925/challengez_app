import React, { useState, useEffect, useRef } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Image, 
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  ImageBackground
} from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  TextInput, 
  Divider, 
  Chip,
  Avatar,
  Snackbar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { phoenixColors } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Define types for our data
interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  text: string;
  role: string;
}

// Define a type for the icon names we're using
type IconName = 'timer-outline' | 'book-open-variant' | 'fire' | 'repeat' | 'chart-line' | 'account-group' | 'check-circle' | 'clock-outline' | 'facebook' | 'twitter' | 'whatsapp';

interface Feature {
  id: number;
  icon: IconName;
  title: string;
  description: string;
}

interface LandingPageProps {
  navigation: NavigationProp<any>;
}

const LandingPage = ({ navigation }: LandingPageProps) => {
  // State for form
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [remainingSpots, setRemainingSpots] = useState(150);
  const [showThankYou, setShowThankYou] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah J.',
      avatar: 'S',
      text: 'Challengez helped me establish a consistent fasting routine. I have lost 15 pounds in just 2 months!',
      role: 'Fitness Enthusiast'
    },
    {
      id: 2,
      name: 'Mike T.',
      avatar: 'M',
      text: 'The daily rituals feature transformed my morning routine. I am more productive than ever.',
      role: 'Entrepreneur'
    },
    {
      id: 3,
      name: 'Leila K.',
      avatar: 'L',
      text: 'I love challenging my friends! It keeps us all accountable and makes fitness fun again.',
      role: 'College Student'
    }
  ];

  // Features data
  const features: Feature[] = [
    {
      id: 1,
      icon: 'timer-outline',
      title: 'Fasting Timer',
      description: 'Track your intermittent fasting periods with precision. Set goals, monitor progress, and receive notifications.'
    },
    {
      id: 2,
      icon: 'book-open-variant',
      title: 'Daily Journal',
      description: 'Record your thoughts, track your mood, and document your transformation journey with our intuitive journaling system.'
    },
    {
      id: 3,
      icon: 'fire',
      title: 'Personal Challenges',
      description: 'Set and track custom goals for fitness, mindfulness, and more. Challenge yourself or compete with friends.'
    },
    {
      id: 4,
      icon: 'repeat',
      title: 'Daily Rituals',
      description: 'Build lasting habits with customizable daily routines that transform your life one day at a time.'
    },
    {
      id: 5,
      icon: 'chart-line',
      title: 'Progress Tracking',
      description: 'Visualize your achievements and streaks at a glance with beautiful, intuitive charts and statistics.'
    },
    {
      id: 6,
      icon: 'account-group',
      title: 'Social Motivation',
      description: 'Connect with friends, share achievements, and motivate each other on your wellness journeys.'
    }
  ];

  // Start animations when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    // Start continuous rotation animation for the flame icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    // Simulate decreasing spots
    const interval = setInterval(() => {
      setRemainingSpots(prev => {
        if (prev > 120) return prev - 1;
        return prev;
      });
    }, 60000); // Decrease by 1 every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate rotation for flame animation
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'] as any
  });

  // Handle signup
  const handleSignup = async () => {
    if (!email) {
      setSnackbarMessage('Please enter your email address');
      setSnackbarVisible(true);
      return;
    }

    setSignupLoading(true);
    
    try {
      // In a real app, this would send the data to a server
      // For now, we'll just store it locally
      const waitlistData = {
        email,
        name: name || '',
        timestamp: new Date().toISOString(),
      };
      
      // Get existing waitlist or create new array
      const existingWaitlist = await AsyncStorage.getItem('waitlist');
      const waitlist = existingWaitlist ? JSON.parse(existingWaitlist) : [];
      
      // Add new signup to waitlist
      waitlist.push(waitlistData);
      
      // Save updated waitlist
      await AsyncStorage.setItem('waitlist', JSON.stringify(waitlist));
      
      // Update remaining spots
      setRemainingSpots(prev => prev - 1);
      
      // Show success message
      setTimeout(() => {
        setSignupLoading(false);
        setShowThankYou(true);
        setEmail('');
        setName('');
      }, 1500);
    } catch (error) {
      console.error('Error saving to waitlist:', error);
      setSignupLoading(false);
      setSnackbarMessage('Something went wrong. Please try again.');
      setSnackbarVisible(true);
    }
  };

  // Render testimonial card
  const renderTestimonial = (item: Testimonial) => (
    <Card key={item.id} style={styles.testimonialCard}>
      <Card.Content>
        <View style={styles.testimonialHeader}>
          <Avatar.Text size={40} label={item.avatar} color="#FFF" style={{ backgroundColor: phoenixColors.primary }} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.testimonialName}>{item.name}</Text>
            <Text style={styles.testimonialRole}>{item.role}</Text>
          </View>
        </View>
        <Text style={styles.testimonialText}>"{item.text}"</Text>
      </Card.Content>
    </Card>
  );

  // Render feature card
  const renderFeature = (item: Feature, index: number) => (
    <Card 
      key={item.id} 
      style={[
        styles.featureCard, 
        { 
          marginRight: index % 2 === 0 ? 10 : 0,
          marginLeft: index % 2 === 1 ? 10 : 0
        }
      ]}
    >
      <Card.Content>
        <View style={styles.featureIconContainer}>
          <MaterialCommunityIcons name={item.icon} size={32} color={phoenixColors.primary} />
        </View>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </Card.Content>
    </Card>
  );

  // If showing thank you screen
  if (showThankYou) {
    return (
      <ScrollView contentContainerStyle={styles.thankYouContainer}>
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: 'center'
          }}
        >
          <MaterialCommunityIcons name="check-circle" size={100} color={phoenixColors.primary} />
          <Text style={styles.thankYouTitle}>You're on the list!</Text>
          <Text style={styles.thankYouSubtitle}>Thank you for joining our waitlist</Text>
          <Text style={styles.thankYouText}>
            You're now in line for early access to Challengez. We'll notify you as soon as it's your turn to join the beta.
          </Text>
          
          <Card style={styles.referralCard}>
            <Card.Content>
              <Text style={styles.referralTitle}>Want to move up the list?</Text>
              <Text style={styles.referralText}>
                Share Challengez with your friends and get priority access when they join the waitlist.
              </Text>
              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
                  <MaterialCommunityIcons name="facebook" size={20} color="#FFF" />
                  <Text style={styles.socialButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}>
                  <MaterialCommunityIcons name="twitter" size={20} color="#FFF" />
                  <Text style={styles.socialButtonText}>Tweet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#25D366' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={20} color="#FFF" />
                  <Text style={styles.socialButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
          
          <Button 
            mode="outlined" 
            style={styles.backButton}
            onPress={() => setShowThankYou(false)}
          >
            Back to Home
          </Button>
        </Animated.View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ]
          }}
        >
          <View style={styles.logoContainer}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <MaterialCommunityIcons name="fire" size={100} color={phoenixColors.primary} />
            </Animated.View>
          </View>
          <Text style={styles.title}>Challengez</Text>
          <Text style={styles.subtitle}>
            Ignite Your Journey to Peak Performance
          </Text>
          <Text style={styles.description}>
            Whether you're a high school student, a young adult, or getting back into the gym with friends, Challengez helps you build healthy habits, track your progress, and stay motivated.
          </Text>
          
          <View style={styles.heroButtonsContainer}>
            <Button 
              mode="contained" 
              style={styles.primaryButton}
              onPress={() => {
                // Scroll to waitlist section
                // In a real app, this would use a ref to scroll to the section
              }}
            >
              Join the Waitlist
            </Button>
            <Button 
              mode="outlined" 
              style={styles.secondaryButton}
              onPress={() => navigation && navigation.navigate('Onboarding')}
            >
              Learn More
            </Button>
          </View>
        </Animated.View>
      </View>
      
      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>150+</Text>
          <Text style={styles.statLabel}>Beta Testers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>User Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>30+</Text>
          <Text style={styles.statLabel}>Challenge Types</Text>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Transform Your Life with Challengez</Text>
        <Text style={styles.sectionSubtitle}>
          Our app provides all the tools you need to build better habits, stay accountable, and achieve your goals.
        </Text>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => renderFeature(feature, index))}
        </View>
      </View>
      
      {/* Testimonials Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>What Our Users Say</Text>
        <Text style={styles.sectionSubtitle}>
          Join thousands of users who are already transforming their lives with Challengez.
        </Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.testimonialContainer}
        >
          {testimonials.map(testimonial => renderTestimonial(testimonial))}
        </ScrollView>
      </View>

      {/* Waitlist Section */}
      <View style={styles.waitlistSection}>
        <Card style={styles.waitlistCard}>
          <Card.Content>
            <Text style={styles.waitlistTitle}>Join the Waitlist</Text>
            <Text style={styles.waitlistSubtitle}>
              Be among the first to experience Challengez
            </Text>
            
            <View style={styles.spotsContainer}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={phoenixColors.primary} />
              <Text style={styles.spotsText}>
                <Text style={{ fontWeight: 'bold' }}>{remainingSpots}</Text> spots remaining
              </Text>
            </View>
            
            <View style={styles.formContainer}>
              <TextInput
                label="Name (optional)"
                value={name}
                onChangeText={setName}
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Button
                mode="contained"
                style={styles.waitlistButton}
                onPress={handleSignup}
                disabled={signupLoading}
                loading={signupLoading}
              >
                Join the Waitlist
              </Button>
            </View>
            
            <Text style={styles.privacyText}>
              By joining, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </Card.Content>
        </Card>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Challengez</Text>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Challengez. All rights reserved.
        </Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerLink}>Terms of Service</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerLink}>Contact Us</Text>
        </View>
      </View>
      
      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
  heroSection: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: phoenixColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: phoenixColors.secondary,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  heroButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: phoenixColors.primary,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  secondaryButton: {
    borderColor: phoenixColors.primary,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    marginTop: -20,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: phoenixColors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  sectionContainer: {
    padding: 24,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
  },
  featureIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  testimonialContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  testimonialCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 10,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  testimonialRole: {
    fontSize: 14,
    color: '#666',
  },
  testimonialText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  waitlistSection: {
    padding: 24,
    backgroundColor: phoenixColors.primary,
    marginTop: 16,
  },
  waitlistCard: {
    borderRadius: 10,
    elevation: 4,
  },
  waitlistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: phoenixColors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  waitlistSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  spotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
  },
  spotsText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  formContainer: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  waitlistButton: {
    backgroundColor: phoenixColors.primary,
    borderRadius: 25,
    paddingVertical: 8,
    marginTop: 8,
  },
  privacyText: {
    fontSize: 12,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: 14,
    color: '#FFF',
    marginHorizontal: 8,
  },
  footerDot: {
    fontSize: 14,
    color: '#CCC',
  },
  thankYouContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F5F5',
  },
  thankYouTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: phoenixColors.primary,
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  thankYouSubtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  referralCard: {
    width: '100%',
    marginVertical: 24,
    borderRadius: 10,
    elevation: 2,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  referralText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  socialButtonText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 24,
    borderColor: phoenixColors.primary,
    borderRadius: 25,
  },
});

export default LandingPage;
