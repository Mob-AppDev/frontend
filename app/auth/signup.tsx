import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Alert, BackHandler, ScrollView } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const SignupScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    const onBackPress = () => {
      router.replace('./login');
      return true; // Prevent default back action (quitting the app)
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [router]);

  const handleSignup = () => {
    setPasswordError('');
    setConfirmPasswordError('');
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return;
    }
    // After signup, go to login and ask user to login
    Alert.alert('Success', 'Account created! Please log in with your credentials.', [
      { text: 'OK', onPress: () => router.replace('./login') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>SIGN UP FOR <Text style={{ color: '#FF6600', fontWeight: 'bold' }}>DEVSYNC</Text></Text>
        {/* Username Label and Input */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={[styles.input, { marginBottom: 10 }]}
          autoCapitalize="none"
          placeholderTextColor="#6e6259"
        />
        {/* Email Label and Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { marginBottom: 10 }]}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#6e6259"
        />
        {/* Password Label and Input */}
        <Text style={styles.label}>Enter your password</Text>
        <View style={[styles.passwordContainer, { marginBottom: 10 }]}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => { setPassword(text); setPasswordError(''); }}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            secureTextEntry={!showPassword}
            placeholderTextColor="#6e6259"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#6e6259" />
          </Pressable>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {/* Confirm Password Label and Input */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={[styles.passwordContainer, { marginBottom: 10 }]}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={text => { setConfirmPassword(text); setConfirmPasswordError(''); }}
            style={[styles.input, { flex: 1, marginBottom: 0 }, confirmPasswordError && styles.inputError]}
            secureTextEntry={!showPassword}
            placeholderTextColor="#6e6259"
          />
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        {/* Sign Up Button */}
        <TouchableOpacity style={[styles.signupButton, { marginTop: 14 }]} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>
        {/* Social Login Buttons */}
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="google" size={22} color="#EA4335" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="github" size={22} color="#000" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with GitHub</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <AntDesign name="apple1" size={22} color="#000" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
        {/* Login Link */}
        <TouchableOpacity onPress={() => router.replace('./login')}>
          <Text style={styles.signupLink}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1C1D',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1C1D',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40, // reduced from 48
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 0,
    fontSize: 16,
    color: '#3a2d1a',
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: 13,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#FF6600',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12, // reduced from 24
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#696969',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf9f7',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    textAlign: 'center',
  },
  signupLink: {
    marginTop: 18,
    color: '#FF6600',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 0,
    marginBottom: 8,
    marginLeft: 2,
    fontWeight: '500',
    textAlign: 'left',
  },
});