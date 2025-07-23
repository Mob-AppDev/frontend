import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import type PagerViewType from 'react-native-pager-view';
import { Chrome as Home, MessageCircle, Bell, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import HomeScreen from './index';
import DmsScreen from './dms';
import ActivityScreen from './activity';
import MoreScreen from './more';

const TABS = [
  {
    key: 'home',
    label: 'Home',
    icon: Home,
    screen: HomeScreen,
  },
  {
    key: 'dms',
    label: 'DMs',
    icon: MessageCircle,
    screen: DmsScreen,
  },
  {
    key: 'activity',
    label: 'Activity',
    icon: Bell,
    screen: ActivityScreen,
  },
  {
    key: 'more',
    label: 'More',
    icon: MoreHorizontal,
    screen: MoreScreen,
  },
];

export default function CustomTabLayout() {
  const pagerRef = useRef<PagerViewType>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const { theme } = useTheme();
  const windowWidth = Dimensions.get('window').width;

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e: { nativeEvent: { position: number } }) => {
    setActiveTab(e.nativeEvent.position);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* @ts-ignore: PagerView is a valid JSX component */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
        scrollEnabled={true}
      >
        {TABS.map((tab, idx) => {
          const ScreenComponent = tab.screen;
          return (
            <View key={tab.key} style={{ flex: 1, width: windowWidth }}>
              <ScreenComponent />
            </View>
          );
        })}
      </PagerView>
      <View style={[styles.tabBar, {
        backgroundColor: theme.accent,
        shadowColor: '#000',
      }]}
      >
        {TABS.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = idx === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                isActive && { backgroundColor: theme.card },
              ]}
              onPress={() => handleTabPress(idx)}
              activeOpacity={0.8}
            >
              <Icon size={26} color={isActive ? theme.text : theme.tabInactive} />
              <Text style={{
                color: isActive ? theme.text : theme.tabInactive,
                fontSize: 11,
                fontWeight: '500',
                marginTop: 2,
              }}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: 32,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8, // Android shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
    marginVertical: 8,
    marginHorizontal: 4,
    height: 54,
  },
});