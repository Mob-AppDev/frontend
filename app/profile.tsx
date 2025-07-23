import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  BellOff, 
  Moon, 
  Smartphone, 
  Settings, 
  LogOut,
  Coffee,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock
} from 'lucide-react-native';
import { useTheme } from './contexts/ThemeContext';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [awayStatus, setAwayStatus] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => router.replace('/auth/login')
        }
      ]
    );
  };

  const handleStatusChange = () => {
    Alert.alert(
      'Set Status',
      'Choose your status',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Active', onPress: () => setAwayStatus(false) },
        { text: 'Away', onPress: () => setAwayStatus(true) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      {/* Header */}
      <View style={[styles.header, { borderBottomWidth: 0 }]}> 
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>You</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={[styles.profileSection, { borderBottomWidth: 0 }]}> 
          <View style={[styles.profileAvatar, { backgroundColor: theme.card }]}> 
            <User size={32} color={theme.text} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>odfianko</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: awayStatus ? '#FFA726' : '#4CAF50' }]} />
              <Text style={[styles.statusText, { color: theme.text }]}>{awayStatus ? 'Away' : 'Active'}</Text>
            </View>
          </View>
        </View>

        {/* Status Section */}
        <TouchableOpacity style={[styles.statusSection, { borderBottomWidth: 0 }]} onPress={handleStatusChange}>
          <Text style={styles.statusEmoji}>😊</Text>
          <Text style={[styles.statusText, { color: theme.text }]}>What's your status?</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}> 
          <TouchableOpacity style={styles.menuItem}>
            <BellOff size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Pause notifications</Text>
            <Switch
              value={!notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(!value)}
              trackColor={{ false: theme.input, true: theme.card }}
              thumbColor={theme.text}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleStatusChange}>
            <User size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Set yourself as away</Text>
            <Switch
              value={awayStatus}
              onValueChange={setAwayStatus}
              trackColor={{ false: theme.input, true: theme.card }}
              thumbColor={theme.text}
            />
          </TouchableOpacity>
        </View>

        {/* Profile Actions */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}> 
          <TouchableOpacity style={styles.menuItem}>
            <Coffee size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Invitations to connect</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <User size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>View profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Building size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Workspace settings</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}> 
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Mail size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>odfianko@workspace.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Phone size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Add phone number</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Calendar size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Time zone: GMT+0</Text>
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}> 
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Bell size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Moon size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Dark mode</Text>
            <Switch
              value={theme.mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.input, true: theme.card }}
              thumbColor={theme.text}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Smartphone size={20} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>Mobile settings</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutItem} onPress={handleSignOut}>
            <LogOut size={20} color="#FF6B6B" />
            <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FF6600', // was '#1A1D29'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    // borderBottomColor: '#2D3142',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 0,
    // borderBottomColor: '#FF6600', // was '#2D3142'
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    // color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    // color: '#8B8D97',
    fontSize: 16,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 0,
    // borderBottomColor: '#FF6600', // was '#2D3142'
  },
  statusEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  section: {
    borderBottomWidth: 0,
    // borderBottomColor: '#FF6600', // was '#2D3142'
    paddingVertical: 8,
  },
  sectionTitle: {
    // color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuText: {
    // color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  signOutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});