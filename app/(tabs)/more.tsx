import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User, FileText, List, Users, Building, Menu } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import FilterMenu, { SortBy, UnreadPriority, ShowType } from '../components/FilterMenu';

interface MoreItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  isPro?: boolean;
}

export default function MoreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('sections');
  const [unreadPriority, setUnreadPriority] = useState<UnreadPriority>('prioritize');
  const [showType, setShowType] = useState<ShowType>('all');
  
  const moreItems: MoreItem[] = [
    {
      id: '1',
      title: 'Canvases',
      subtitle: 'Curate content and collaborate',
      icon: FileText,
      isPro: true,
    },
    {
      id: '2',
      title: 'Lists',
      subtitle: 'Track and manage projects',
      icon: List,
      isPro: true,
    },
    {
      id: '3',
      title: 'Assigned to you',
      subtitle: 'Tick off your tasks',
      icon: Users,
      isPro: true,
    },
    {
      id: '4',
      title: 'External connections',
      subtitle: 'Work with people from other organisations',
      icon: Building,
      isPro: true,
    },
  ];

  const getFilteredItems = () => {
    if (!searchQuery.trim()) return moreItems;
    
    return moreItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const SearchModal = () => (
    <Modal visible={showSearch} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.searchModal}>
        <View style={styles.searchHeader}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#8B8D97" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search features..."
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
          {getFilteredItems().length > 0 ? (
            getFilteredItems().map(renderMoreItem)
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search features...'}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderMoreItem = (item: MoreItem) => (
    <TouchableOpacity key={item.id} style={styles.moreItem}>
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>
          <item.icon size={20} color="#FFFFFF" />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.itemSubtitle, { color: theme.text }]}>{item.subtitle}</Text>
        </View>
      </View>
      {item.isPro && (
        <View style={styles.proBadge}>
          <Text style={styles.proText}>PRO</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>More</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <View style={[styles.profileAvatar, { backgroundColor: theme.accent }]}>
            <User size={16} color={theme.text} />
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
      <FilterMenu
        visible={filterMenuVisible}
        onClose={() => setFilterMenuVisible(false)}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        unreadPriority={unreadPriority}
        onUnreadPriorityChange={setUnreadPriority}
        showType={showType}
        onShowTypeChange={setShowType}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {getFilteredItems().map(renderMoreItem)}
      </ScrollView>

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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    marginBottom: 12, // pull the search bar down a little
    marginTop: 12, // slightly less space at the top
  },
  searchBar: {
    flex: 1,
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
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  moreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0,
    // borderBottomColor: '#2D3142',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    lineHeight: 20,
  },
  proBadge: {
    backgroundColor: '#9C27B0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  proText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
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
    color: '#FFFFFF',
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