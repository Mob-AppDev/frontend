import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, AtSign, MessageSquare, RotateCcw, User, Hash, X, Menu } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import FilterMenu, { SortBy, UnreadPriority, ShowType } from '../components/FilterMenu';

interface ActivityItem {
  id: string;
  type: 'channel_invitation' | 'app_notification' | 'mention' | 'thread' | 'reaction';
  title: string;
  subtitle: string;
  timestamp: string;
  avatar: string;
  color: string;
  channel?: string;
  user?: string;
  message?: string;
}

export default function ActivityScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentions' | 'threads' | 'reactions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);  
  const [showUserModal, setShowUserModal] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('sections');
  const [unreadPriority, setUnreadPriority] = useState<UnreadPriority>('prioritize');
  const [showType, setShowType] = useState<ShowType>('all');
  
  const [allActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'channel_invitation',
      title: 'Caleb Adams',
      subtitle: 'Added you to #test-channel',
      timestamp: 'Jun 9th',
      avatar: 'C',
      color: '#E91E63',
      channel: 'test-channel',
    },
    {
      id: '2',
      type: 'app_notification',
      title: 'Slackbot',
      subtitle: '@Alvin archived the channel 🗑️random',
      timestamp: 'May 20th',
      avatar: 'S',
      color: '#4A154B',
      user: 'Alvin',
      channel: 'random',
    },
    {
      id: '3',
      type: 'channel_invitation',
      title: 'Alvin',
      subtitle: 'Added you to #backend',
      timestamp: 'May 9th',
      avatar: 'A',
      color: '#9C27B0',
      channel: 'backend',
    },
    {
      id: '4',
      type: 'mention',
      title: 'Michael Oti Yamoah',
      subtitle: 'mentioned you in #general: @odfianko can you review this?',
      timestamp: 'Jun 8th',
      avatar: 'M',
      color: '#FF9800',
      channel: 'general',
      message: 'can you review this?',
    },
    {
      id: '5',
      type: 'mention',
      title: 'Hakeem Adam',
      subtitle: 'mentioned you in #main: @odfianko what do you think?',
      timestamp: 'Jun 7th',
      avatar: 'H',
      color: '#4CAF50',
      channel: 'main',
      message: 'what do you think?',
    },
    {
      id: '6',
      type: 'thread',
      title: 'Frank Iokko',
      subtitle: 'replied to your thread in #announcements',
      timestamp: 'Jun 6th',
      avatar: 'F',
      color: '#2196F3',
      channel: 'announcements',
    },
    {
      id: '7',
      type: 'thread',
      title: 'Caleb Adams',
      subtitle: 'started a thread on your message in #general',
      timestamp: 'Jun 5th',
      avatar: 'C',
      color: '#E91E63',
      channel: 'general',
    },
    {
      id: '8',
      type: 'reaction',
      title: 'Michael Oti Yamoah',
      subtitle: 'reacted 👍 to your message in #main',
      timestamp: 'Jun 4th',
      avatar: 'M',
      color: '#FF9800',
      channel: 'main',
    },
    {
      id: '9',
      type: 'reaction',
      title: 'Alvin',
      subtitle: 'reacted ❤️ to your message in #backend',
      timestamp: 'Jun 3rd',
      avatar: 'A',
      color: '#9C27B0',
      channel: 'backend',
    },
  ]);

  const getFilteredActivities = () => {
    let filtered = allActivities;

    // Filter by type
    switch (activeFilter) {
      case 'mentions':
        filtered = filtered.filter(item => item.type === 'mention');
        break;
      case 'threads':
        filtered = filtered.filter(item => item.type === 'thread');
        break;
      case 'reactions':
        filtered = filtered.filter(item => item.type === 'reaction');
        break;
      default:
        // 'all' shows everything
        break;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.channel && item.channel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.user && item.user.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  const getFilterIcon = (filterType: string) => {
    switch (filterType) {
      case 'mentions':
        return AtSign;
      case 'threads':
        return MessageSquare;
      case 'reactions':
        return RotateCcw;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'channel_invitation':
        return '#';
      case 'app_notification':
        return '📱';
      case 'mention':
        return '@';
      case 'thread':
        return '💬';
      case 'reaction':
        return '👍';
      default:
        return '•';
    }
  };

  const filterButtons = [
    { key: 'all', label: 'All' },
    { key: 'mentions', label: 'Mentions' },
    { key: 'threads', label: 'Threads' },
    { key: 'reactions', label: 'Reactions' },
  ];

  const filteredActivities = getFilteredActivities();
  const { theme } = useTheme();

  const SearchModal = () => (
    <Modal visible={showSearch} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={[styles.searchModal, { backgroundColor: theme.background }]}>
        <View style={[styles.searchHeader, { backgroundColor: theme.card }]}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={theme.tabInactive} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search activity..."
              placeholderTextColor={theme.tabInactive}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowSearch(false)}
          >
            <Text style={[styles.cancelText, { color: theme.accent }]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.searchResults}>
          {filteredActivities.length > 0 ? (
            filteredActivities.map(renderActivityItem)
          ) : (
            <View style={[styles.noResults, { backgroundColor: theme.card }]}>
              <Text style={[styles.noResultsText, { color: theme.tabInactive }]}>
                {searchQuery ? `No results for "${searchQuery}"` : 'Start typing to search activity...'}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderActivityItem = (item: ActivityItem) => (
    <TouchableOpacity key={item.id} style={[styles.activityItem, { backgroundColor: theme.card }]}>
      <View style={styles.activityLeft}>
        <View style={[styles.activityIcon, { backgroundColor: theme.card }]}>
          <Text style={[styles.activityIconText, { color: theme.tabInactive }]}>{getActivityIcon(item.type)}</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: item.color }]}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <Text style={[styles.activityTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.timestamp, { color: theme.tabInactive }]}>{item.timestamp}</Text>
          </View>
          <Text style={[styles.activitySubtitle, { color: theme.tabInactive }]}>
            {item.subtitle}
            {item.channel && (
              <Text style={[styles.channelLink, { color: theme.accent }]}> #{item.channel}</Text>
            )}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Activity</Text>
        
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

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filterButtons.map((filter) => {
          const IconComponent = getFilterIcon(filter.key);
          return (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                activeFilter === filter.key && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter.key as any)}
            >
              {IconComponent && (
                <IconComponent 
                  size={16} 
                  color={activeFilter === filter.key ? theme.text : theme.tabInactive} 
                />
              )}
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter.key && styles.filterButtonTextActive,
                { color: theme.tabInactive }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(renderActivityItem)
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              {activeFilter === 'all' 
                ? 'No activity yet' 
                : `No ${activeFilter} found`}
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.tabInactive }]}>
              {activeFilter === 'mentions' && 'When someone mentions you, it will appear here'}
              {activeFilter === 'threads' && 'Thread replies will appear here'}
              {activeFilter === 'reactions' && 'Message reactions will appear here'}
              {activeFilter === 'all' && 'Your activity will appear here'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Unread Button */}
      <TouchableOpacity style={[styles.unreadButton, { backgroundColor: theme.card }]}>
        <Text style={[styles.unreadButtonText, { color: theme.text }]}>Unread</Text>
      </TouchableOpacity>

      <SearchModal />
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color: '#FFFFFF',
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
    backgroundColor: '#2D3142', // was '#2D3142'
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchPlaceholder: {
    // color: '#8B8D97',
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    backgroundColor: '#2D3142', // was '#2D3142'
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  filterButtonActive: {
    // backgroundColor: '#4A154B',
  },
  filterButtonText: {
    // color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    // color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0,
    // borderBottomColor: '#2D3142',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  activityIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    // backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 6,
  },
  activityIconText: {
    fontSize: 10,
    // color: '#8B8D97',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    // color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTitle: {
    // color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    // color: '#8B8D97',
    fontSize: 12,
  },
  activitySubtitle: {
    // color: '#B8BCC8',
    fontSize: 14,
    lineHeight: 20,
  },
  channelLink: {
    // color: '#4A9EFF',
  },
  unreadButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    // backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  unreadButtonText: {
    // color: '#1A1D29',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateText: {
    // color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    // color: '#8B8D97',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  searchModal: {
    flex: 1,
    // backgroundColor: '#FF6600', // was '#1A1D29'
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#FF6600', // was '#2D3142'
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    // color: '#FFFFFF',
    fontSize: 16,
  },
  cancelButton: {
    marginLeft: 12,
    paddingVertical: 8,
  },
  cancelText: {
    // color: '#4A9EFF',
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
    // color: '#8B8D97',
    fontSize: 16,
    textAlign: 'center',
  },
});