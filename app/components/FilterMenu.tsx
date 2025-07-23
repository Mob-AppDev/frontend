import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { List, Clock, ArrowUp, Shuffle, Hash, Building, ChevronRight, ChevronDown } from 'lucide-react-native';

export type SortBy = 'sections' | 'recent';
export type UnreadPriority = 'prioritize' | 'dont';
export type ShowType = 'all' | 'external';

interface FilterMenuProps {
  visible: boolean;
  onClose: () => void;
  sortBy: SortBy;
  onSortByChange: (v: SortBy) => void;
  unreadPriority: UnreadPriority;
  onUnreadPriorityChange: (v: UnreadPriority) => void;
  showType: ShowType;
  onShowTypeChange: (v: ShowType) => void;
}

export default function FilterMenu({
  visible,
  onClose,
  sortBy,
  onSortByChange,
  unreadPriority,
  onUnreadPriorityChange,
  showType,
  onShowTypeChange,
}: FilterMenuProps) {
  const [expanded, setExpanded] = useState<'sort' | 'unread' | 'show' | null>(null);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.menuContainer}>
        {/* Sort by */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setExpanded(expanded === 'sort' ? null : 'sort')}>
          <Text style={styles.menuTitle}>Sort by</Text>
          {expanded === 'sort' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </TouchableOpacity>
        {expanded === 'sort' && (
          <View style={styles.subMenu}>
            <TouchableOpacity style={styles.radioItem} onPress={() => onSortByChange('sections')}>
              <List size={18} style={styles.radioIcon} />
              <Text style={styles.radioText}>Sections</Text>
              <View style={sortBy === 'sections' ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioItem} onPress={() => onSortByChange('recent')}>
              <Clock size={18} style={styles.radioIcon} />
              <Text style={styles.radioText}>Recent activity</Text>
              <View style={sortBy === 'recent' ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
          </View>
        )}
        {/* Unreads and mentions */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setExpanded(expanded === 'unread' ? null : 'unread')}>
          <Text style={styles.menuTitle}>Unreads and mentions</Text>
          {expanded === 'unread' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </TouchableOpacity>
        {expanded === 'unread' && (
          <View style={styles.subMenu}>
            <TouchableOpacity style={styles.radioItem} onPress={() => onUnreadPriorityChange('prioritize')}>
              <ArrowUp size={18} style={styles.radioIcon} />
              <Text style={styles.radioText}>Prioritized to the top</Text>
              <View style={unreadPriority === 'prioritize' ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioItem} onPress={() => onUnreadPriorityChange('dont')}>
              <Shuffle size={18} style={styles.radioIcon} />
              <Text style={styles.radioText}>Don't prioritize</Text>
              <View style={unreadPriority === 'dont' ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
          </View>
        )}
        {/* Show */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setExpanded(expanded === 'show' ? null : 'show')}>
          <Text style={styles.menuTitle}>Show</Text>
          {expanded === 'show' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </TouchableOpacity>
        {expanded === 'show' && (
          <View style={styles.subMenu}>
            <TouchableOpacity style={styles.radioItem} onPress={() => onShowTypeChange('all')}>
              <Hash size={18} style={styles.radioIcon} />
              <Text style={styles.radioText}>All conversations</Text>
              <View style={showType === 'all' ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.radioItem} onPress={() => onShowTypeChange('external')}>
              <Building size={18} style={styles.radioIcon} />
              <Text style={styles.radioText}>External connections</Text>
              <View style={showType === 'external' ? styles.radioSelected : styles.radioUnselected} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 90,
    right: 20,
    minWidth: 260,
    backgroundColor: '#23272F',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 0,
    zIndex: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  subMenu: {
    paddingLeft: 16,
    paddingBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 20,
  },
  radioIcon: {
    marginRight: 10,
  },
  radioText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
  },
  radioSelected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4A9EFF',
    backgroundColor: '#23272F',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioUnselected: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#555',
    backgroundColor: '#23272F',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 