import React, { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../services/authService';
import { colors } from '../../constants/Colors';
import { validateEmail, validatePassword, validatePhoneNumber, validateRequired } from '../../utils/validation';

export default function RegisterScreen({ navigation }: any) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [frontIdImage, setFrontIdImage] = useState<string | null>(null);
  const [backIdImage, setBackIdImage] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    {label: 'Student', value: 'Student'},
    {label: 'Civilian', value: 'Civilian'},
    {label: 'Blue-collar', value: 'Blue-collar'},
    {label: 'White-collar', value: 'White-collar'},
    {label: 'Official', value: 'Official'}
  ]);

  const [open2, setOpen2] = useState(false);
  const [value2, setValue2] = useState<string | null>(null);
  const [items2, setItems2] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Other', value: 'Other'}
  ]);

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const numMo = (text: string) => {
    const numericValue = text.replace(/[^0-9-]/g, ''); 
    setContactNumber(numericValue);
  };

  const pickImage = async (setImage: (uri: string) => void) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!validateRequired(fullName)) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      Alert.alert('Error', passwordValidation.message || 'Invalid password');
      return;
    }

    if (!value) {
      Alert.alert('Error', 'Please select your label');
      return;
    }

    if (!age || parseInt(age) < 1) {
      Alert.alert('Error', 'Please enter a valid age');
      return;
    }

    if (!value2) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    if (!validatePhoneNumber(contactNumber)) {
      Alert.alert('Error', 'Please enter a valid contact number');
      return;
    }

    if (!profileImage || !frontIdImage || !backIdImage) {
      Alert.alert('Error', 'Please upload all required images (profile, front ID, back ID)');
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await signUp(email, password, {
        full_name: fullName,
        label: value,
        age: parseInt(age),
        gender: value2,
        contact_number: contactNumber,
        profile_image_url: '',
        front_id_image_url: '',
        back_id_image_url: '',
      });

      if (signUpError) {
        throw signUpError;
      }

      Alert.alert(
        'Success', 
        'Account created successfully! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>Create Profile</Text>
          <Text style={styles.headerSubtitle}>Join our community</Text>

          <View style={styles.profileSection}>
            <View style={styles.circle}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/proflogo.png")
                }
                style={styles.profileImage}
              />
            </View>

            <TouchableOpacity 
              onPress={() => pickImage(setProfileImage)} 
              style={styles.addPhotoButton}
              activeOpacity={0.8}
            >
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && styles.inputFocused
                ]}
                onChangeText={setEmail}
                value={email}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'password' && styles.inputFocused
                ]}
                onChangeText={setPassword}
                value={password}
                placeholder="Min 6 characters"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Label</Text>
              <DropDownPicker 
                style={styles.dropdown}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                listMode="SCROLLVIEW"
                placeholder="Select your label"
                placeholderStyle={{ color: colors.textMuted }}
                dropDownContainerStyle={styles.dropdownContainer}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'name' && styles.inputFocused
                ]}
                onChangeText={setFullName}
                value={fullName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textMuted}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'age' && styles.inputFocused
                  ]}
                  keyboardType="numeric"
                  onChangeText={setAge}
                  value={age}
                  placeholder="Age"
                  placeholderTextColor={colors.textMuted}
                  onFocus={() => setFocusedInput('age')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Gender</Text>
                <DropDownPicker 
                  style={styles.dropdown}
                  open={open2}
                  value={value2}
                  items={items2}
                  setOpen={setOpen2}
                  setValue={setValue2}
                  setItems={setItems2}
                  listMode="SCROLLVIEW"
                  placeholder="Select"
                  placeholderStyle={{ color: colors.textMuted }}
                  dropDownContainerStyle={styles.dropdownContainer}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'contact' && styles.inputFocused
                ]}
                keyboardType="numeric"
                onChangeText={numMo}
                value={contactNumber}
                placeholder="Enter contact number"
                placeholderTextColor={colors.textMuted}
                onFocus={() => setFocusedInput('contact')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.idSection}>
              <Text style={styles.sectionTitle}>Identity Verification</Text>
              <View style={styles.idContainer}>
                <View style={styles.idItem}>
                  <Text style={styles.idLabel}>Front ID</Text>
                  <View style={styles.idImageContainer}>
                    <Image
                      source={
                        frontIdImage
                          ? { uri: frontIdImage }
                          : require("../../assets/idenlogo.png")
                      }
                      style={styles.idImage}
                    />
                  </View>
                  <TouchableOpacity 
                    onPress={() => pickImage(setFrontIdImage)} 
                    style={styles.addPhotoButtonSmall}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addPhotoTextSmall}>Add Photo</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.idItem}>
                  <Text style={styles.idLabel}>Back ID</Text>
                  <View style={styles.idImageContainer}>
                    <Image
                      source={
                        backIdImage
                          ? { uri: backIdImage }
                          : require("../../assets/idenlogo.png")
                      }
                      style={styles.idImage}
                    />
                  </View>
                  <TouchableOpacity 
                    onPress={() => pickImage(setBackIdImage)} 
                    style={styles.addPhotoButtonSmall}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addPhotoTextSmall}>Add Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleRegister} 
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>CREATE ACCOUNT</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
    fontWeight: '500',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primarySoft,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  addPhotoButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  addPhotoText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdown: {
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: colors.background,
    minHeight: 52,
  },
  dropdownContainer: {
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  idSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  idContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  idItem: {
    flex: 1,
    alignItems: 'center',
  },
  idLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  idImageContainer: {
    width: '100%',
    aspectRatio: 0.7,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.border,
    marginBottom: 8,
  },
  idImage: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  addPhotoButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  addPhotoTextSmall: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  createButton: {
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginLinkBold: {
    color: colors.primary,
    fontWeight: '700',
  },
});