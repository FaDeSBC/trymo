import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Animated, 
  PanResponder, 
  Dimensions, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../constants/Colors';
import { validateEmail } from '../../utils/validation';

const { height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const slideAnim = useRef(new Animated.Value(height)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(slideAnim, { toValue: height, duration: 300, useNativeDriver: false }).start();
          Animated.timing(logoAnim, { toValue: 0, duration: 300, useNativeDriver: false }).start();
          pan.setValue({ x: 0, y: 0 });
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  const openPanel = () => {
    Animated.spring(slideAnim, { 
      toValue: height / 2, 
      useNativeDriver: false,
      tension: 50,
      friction: 8
    }).start();
    Animated.spring(logoAnim, { 
      toValue: -150, 
      useNativeDriver: false,
      tension: 50,
      friction: 8
    }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Image
            source={require('../../assets/seekerLg.png')}
            style={[styles.logo, { transform: [{ translateY: logoAnim }] }]}
            resizeMode="contain"
          />

          <Animated.View style={[styles.loginForm, { transform: [{ translateY: logoAnim }] }]}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && styles.inputFocused
                ]}
                placeholder="Email"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'password' && styles.inputFocused
                ]}
                placeholder="Password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <TouchableOpacity 
              onPress={handleLogin} 
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity onPress={openPanel} style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>Don't have an account? </Text>
            <Text style={styles.createAccountLink}>Sign Up</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.panel, { top: Animated.add(slideAnim, pan.y) }]}
      >
        <View style={styles.panelHandle} />
        <Text style={styles.panelTitle}>Create an account with</Text>
        
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            style={styles.socialButton}
            activeOpacity={0.8}
          >
            <Image source={require('../../assets/googleoption.png')} style={styles.socialIcon}/>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            style={styles.socialButton}
            activeOpacity={0.8}
          >
            <Image source={require('../../assets/fboption.png')} style={styles.socialIcon}/>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            style={styles.socialButton}
            activeOpacity={0.8}
          >
            <Image source={require('../../assets/appleoption.png')} style={styles.socialIcon}/>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')} 
          style={styles.emailButton}
          activeOpacity={0.8}
        >
          <Text style={styles.emailButtonText}>Sign up with Email</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logo: { 
    width: 280, 
    height: 180, 
    marginBottom: 32,
  },
  loginForm: {
    width: '85%',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.textPrimary,
    // transition: 'all 0.2s',
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.background,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  button: { 
    width: '100%', 
    alignItems: 'center', 
    backgroundColor: colors.primary, 
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { 
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  forgotPasswordText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  createAccountContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  createAccountText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  createAccountLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  panel: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: height / 2,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  panelHandle: {
    width: 48,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 3,
    marginBottom: 20,
  },
  panelTitle: { 
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 24,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 100,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  socialIcon: {
    width: 32,
    height: 32,
  },
  emailButton: {
    width: '90%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emailButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
});