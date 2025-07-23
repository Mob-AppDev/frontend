import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Menu, Users, Plus, Hash, Building, Bell } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

interface DirectMessage {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  lastMessage: string;
  timestamp: string;
  isBot?: boolean;
  unread?: boolean;
  external?: boolean;
}

const DM_FILTERS = [
  { key: 'all', label: 'All conversations', icon: Hash },
  { key: 'unread', label: 'Only unread messages', icon: Bell },
  { key: 'external', label: 'External people', icon: Building },
] as const;
type DmFilterType = typeof DM_FILTERS[number]['key'];

export default function DirectMessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [dmFilter, setDmFilter] = useState<DmFilterType>('all');
  
  const [directMessages] = useState<DirectMessage[]>([
    {
      id: '1',
      name: 'Frank Iokko',
      avatar: 'F',
      color: '#4CAF50',
      isOnline: true,
      lastMessage: 'You: Worla joined Slack — take a second to say hello.',
      timestamp: 'May 9th',
      unread: true,
      external: false,
    },
    {
      id: '2',
      name: 'Caleb Adams',
      avatar: 'C',
      color: '#E91E63',
      isOnline: false,
      lastMessage: 'You: Worla joined Slack — take a second to say hello.',
      timestamp: 'May 9th',
      unread: true,
      external: false,
    },
    {
      id: '3',
      name: 'Michael Oti Yamoah',
      avatar: 'M',
      color: '#8B4513',
      isOnline: false,
      lastMessage: 'You: Worla has joined Slack — take a second to say hello.',
      timestamp: 'May 9th',
      unread: false,
      external: true,
    },
    {
      id: '4',
      name: 'Hakeem Adam',
      avatar: 'H',
      color: '#4CAF50',
      isOnline: true,
      lastMessage: 'You: Worla has joined Slack — take a second to say hello.',
      timestamp: 'May 9th',
      unread: false,
      external: false,
    },
    {
      id: '5',
      name: 'Alvin',
      avatar: 'A',
      color: '#9C27B0',
      isOnline: false,
      lastMessage: 'You: Worla accepted your invitation to join Slack — take a second to say hello.',
      timestamp: 'May 9th',
      unread: true,
      external: true,
    },
    {
      id: '6',
      name: 'selormfidel',
      avatar: 'S',
      color: '#607D8B',
      isOnline: false,
      lastMessage: 'odefiankoworlasi made updates to a canvas tab:',
      timestamp: 'May 8th',
      unread: false,
      external: false,
    },
    {
      id: '7',
      name: 'Roger Osafo Kwabena Adu',
      avatar: 'R',
      color: '#795548',
      isOnline: false,
      lastMessage: 'Roger Osafo Kwabena Adu made updates to a canvas tab:',
      timestamp: 'May 9th',
      unread: false,
      external: true,
    },
  ]);

  const getFilteredMessages = () => {
    let filtered = directMessages;
    if (dmFilter === 'unread') filtered = filtered.filter(dm => dm.unread);
    if (dmFilter === 'external') filtered = filtered.filter(dm => dm.external);
    return !searchQuery.trim()
      ? filtered
      : filtered.filter(dm =>
          dm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dm.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
        );
  };

  const FilterMenu = () => (
    <Modal visible={filterMenuVisible} transparent animationType="fade" onRequestClose={() => setFilterMenuVisible(false)}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }} activeOpacity={1} onPress={() => setFilterMenuVisible(false)} />
      <View style={{ position: 'absolute', top: 90, right: 20, minWidth: 220, backgroundColor: '#23272F', borderRadius: 12, paddingVertical: 8, zIndex: 2, elevation: 8 }}>
        {DM_FILTERS.map(opt => {
          const Icon = opt.icon;
          return (
            <TouchableOpacity
              key={opt.key}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 }}
              onPress={() => { setDmFilter(opt.key); setFilterMenuVisible(false); }}
            >
              <Icon size={18} color="#fff" style={{ marginRight: 12 }} />
              <Text style={{ color: '#fff', fontSize: 16, flex: 1 }}>{opt.label}</Text>
              {dmFilter === opt.key && <Text style={{ color: '#4A9EFF', fontSize: 18, marginLeft: 8 }}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </Modal>
  );

  const SearchModal = () => (
    <Modal visible={showSearch} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.searchModal}>
        <View style={styles.searchHeader}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8B8D97" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search direct messages..."
              placeholderTextColor="#8B8D97"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.searchResults}>
          {getFilteredMessages().length > 0 ? (
            getFilteredMessages().map(renderDirectMessage)
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search messages...'}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderDirectMessage = (dm: DirectMessage) => (
    <TouchableOpacity
      key={dm.id}
      style={[styles.dmItem, { borderBottomWidth: 0, borderColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent' }]}
      onPress={() => router.push(`/chat/dm-${dm.id}`)}
    >
      <View style={styles.dmLeft}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: dm.color }]}>
            <Text style={styles.avatarText}>{dm.avatar}</Text>
          </View>
          {dm.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.dmContent}>
          <View style={styles.dmHeader}>
            <Text style={[styles.dmName, { color: theme.text }]}>{dm.name}</Text>
            <Text style={styles.timestamp}>{dm.timestamp}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={2}>
            {dm.lastMessage}
          </Text>
          {dm.lastMessage.includes('canvas tab:') && (
            <Text style={styles.canvasLink}>📋 Weekly 1:1</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Direct messages</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <View style={[styles.profileAvatar, { backgroundColor: theme.accent }]}>
            <Users size={16} color={theme.text} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setShowSearch(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
            <Search size={16} color={theme.tabInactive} />
            <Text style={[styles.searchPlaceholder, { color: theme.tabInactive }]}>Jump to or search...</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.card }]} onPress={() => setFilterMenuVisible(true)}>
          <Menu size={20} color={theme.text} />
        </TouchableOpacity>
      </View>
      <FilterMenu />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Direct Messages List */}
        {getFilteredMessages().map(renderDirectMessage)}

        {/* Browse All People */}
        <TouchableOpacity style={styles.browseItem}>
          <View style={styles.browseIcon}>
            <Users size={20} color="#FFFFFF" />
          </View>
          <View style={styles.browseContent}>
            <Text style={[styles.browseName, { color: theme.text }]}>Browse all people</Text>
            <Text style={styles.browseSubtitle}>8 members</Text>
          </View>
        </TouchableOpacity>

        {/* Add Teammates */}
        <TouchableOpacity style={styles.browseItem}>
          <View style={styles.addIcon}>
            <Users size={20} color="#FFFFFF" />
          </View>
          <View style={styles.browseContent}>
            <Text style={[styles.browseName, { color: theme.text }]}>Add teammates</Text>
            <Text style={styles.browseSubtitle}>By SMS, email or phone contacts</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <SearchModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6600', // was '#1A1D29'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    marginBottom: 12, // pull the search bar down a little
    marginTop: 12, // slightly less space at the top
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6600', // was '#2D3142'
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchPlaceholder: {
    color: '#8B8D97',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#FF6600', // was '#2D3142'
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  dmItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  dmLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1A1D29',
  },
  dmContent: {
    flex: 1,
  },
  dmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dmName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    color: '#8B8D97',
    fontSize: 12,
  },
  lastMessage: {
    color: '#B8BCC8',
    fontSize: 14,
    lineHeight: 20,
  },
  canvasLink: {
    color: '#4A9EFF',
    fontSize: 14,
    marginTop: 4,
  },
  browseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  browseIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  browseContent: {
    flex: 1,
  },
  browseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  browseSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  searchModal: {
    flex: 1,
    backgroundColor: '#FF6600', // was '#1A1D29'
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FF6600', // was '#2D3142'
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6600', // was '#2D3142'
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#4A9EFF',
    fontSize: 16,
    fontWeight: '500',
  },
  searchResults: {
    flex: 1,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  noResultsText: {
    color: '#8B8D97',
    fontSize: 16,
    textAlign: 'center',
  },
});