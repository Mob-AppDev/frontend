import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');
    let emailWrong = false;
    let passwordWrong = false;

    if (!email) {
      setEmailError('Email is required.');
      emailWrong = true;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      emailWrong = true;
    }
    if (!password) {
      setPasswordError('Password is required.');
      passwordWrong = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      passwordWrong = true;
    } else if ((password.match(/[a-zA-Z]/g) || []).length < 4) {
      setPasswordError('Password must contain at least 4 letters.');
      passwordWrong = true;
    }
    if (emailWrong || passwordWrong) return;

    // Allow login if all above checks pass (simulate success)
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        <Text style={{ color: '#1D1C1D', fontWeight: 'bold' }}>LOG IN TO </Text>
        <Text style={{ color: '#FF6600', fontWeight: 'bold' }}>DEVSYNC</Text>
      </Text>
      {/* Email Label and Input */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => { setEmail(text); setEmailError(''); }}
        style={[styles.input, emailError && styles.inputError]}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#6e6259"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      {/* Password Label and Input */}
      <Text style={[styles.label, { marginTop: 18 }]}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => { setPassword(text); setPasswordError(''); }}
          style={[styles.input, { flex: 1, marginBottom: 0 }, passwordError && styles.inputError]}
          secureTextEntry={!showPassword}
          placeholderTextColor="#6e6259"
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#6e6259" />
        </Pressable>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <TouchableOpacity style={styles.forgotPassword} onPress={() => router.replace('./forgot-password')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      {/* Log In Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
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
      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => router.replace('./signup')}>
        <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6600',
    marginTop: 30, // reduced from 60
    marginBottom: 32,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: '#3a2d1a',
    marginBottom: 6,
    marginLeft: 2,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#d6d6d6',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 0, // set to 0 for tight error placement
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#FF6600',
    fontWeight: '500',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FF6600',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
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