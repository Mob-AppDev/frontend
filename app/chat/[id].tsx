import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Modal,
  Image,
  Keyboard,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Smile, MoveVertical as MoreVertical, Hash, Users, Phone, Star, Plus, Copy, MessageSquare, Trash2, CreditCard as Edit } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Video, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isCurrentUser: boolean;
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
  thread?: number;
  attachments?: Array<{ type: 'image' | 'file'; name: string; url: string; mimeType?: string }>;
  hasImage?: boolean;
  imageUrl?: string;
}

interface ChannelInfo {
  name: string;
  type: 'channel' | 'dm';
  memberCount?: number;
  isPrivate?: boolean;
  description?: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messageText, setMessageText] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const [channelInfo] = useState<ChannelInfo>(() => {
    if (typeof id === 'string' && id.startsWith('dm-')) {
      return {
        name: 'Caleb Adams',
        type: 'dm',
      };
    }
    return {
      name: id as string,
      type: 'channel',
      memberCount: 9,
      isPrivate: false,
      description: 'Channel description',
    };
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'to-see-cool-ar-features-at-home-list-of-objects/\nwww.cnet.com\nGoogle 3D animals: How to use the cool AR feature at home\nWith Google 3D objects, you can put virtual animals in your real world. (Plus some other options.)',
      sender: 'Luke',
      senderAvatar: 'L',
      timestamp: '2:22 PM',
      isCurrentUser: false,
      hasImage: true,
      imageUrl: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      text: 'I will be your guide',
      sender: 'Scott',
      senderAvatar: 'S',
      timestamp: '2:23 PM',
      isCurrentUser: false,
    },
    {
      id: '3',
      text: 'last chance to enroll to udemy course on flutter development for free, looks interesting udemy.com/course/flutter-rest-api-crash-course-build-a-coronavirus-app/\nwww.udemy.com\nFlutter REST API Crash Course: Build a Coronavirus Tracking App and learn how to use REST APIs in Flutter\nBuild a Coronavirus Tracking App and learn how to use REST APIs in Flutter',
      sender: 'Marcelo Pires',
      senderAvatar: 'MP',
      timestamp: '10:42 AM',
      isCurrentUser: false,
      reactions: [
        { emoji: '😀', count: 1, users: ['User'] },
        { emoji: '👍', count: 2, users: ['User', 'Other'] },
        { emoji: '😡', count: 1, users: ['User'] },
        { emoji: '👿', count: 1, users: ['User'] },
        { emoji: '🎉', count: 1, users: ['User'] },
        { emoji: '❤️', count: 1, users: ['User'] },
      ],
    },
  ]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleEmojiPress = () => setShowEmojiPicker(true);
  const handleAttachPress = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (res && !res.canceled && res.assets && res.assets.length > 0) {
        const { name, uri, mimeType } = res.assets[0];
        if (uri) {
          setMessages(prev => [
            ...prev,
            {
              id: (prev.length + 1).toString(),
              text: name,
              sender: 'You',
              senderAvatar: 'Y',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isCurrentUser: true,
              attachments: [{ type: 'file', name, url: uri, mimeType }],
            },
          ]);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick file.');
      console.log('Picker error:', err);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(messageText + emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = () => {
    if (messageText.trim()) {
      setMessages(prev => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          text: messageText,
          sender: 'You',
          senderAvatar: 'Y',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: true,
        },
      ]);
      setMessageText('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleMessageLongPress = (message: Message) => {
    setSelectedMessage(message);
    setShowActionSheet(true);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setShowActionSheet(false);
  };

  const ActionSheet = () => (
    <Modal
      visible={showActionSheet}
      transparent
      animationType="slide"
      onRequestClose={() => setShowActionSheet(false)}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          onPress={() => setShowActionSheet(false)}
        />
        <View style={styles.actionSheet}>
          <View style={styles.reactionRow}>
            {['😀', '👍', '😡', '👿', '🎉', '❤️'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.reactionButton}
                onPress={() => handleReaction(selectedMessage?.id || '', emoji)}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Edit size={20} color={theme.accent} />
              <Text style={styles.actionButtonText}>Edit Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Trash2 size={20} color={theme.accent} />
              <Text style={[styles.actionButtonText, { color: theme.accent }]}>Delete message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Copy size={20} color={theme.accent} />
              <Text style={styles.actionButtonText}>Copy Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MessageSquare size={20} color={theme.accent} />
              <Text style={styles.actionButtonText}>Reply in Thread</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowActionSheet(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderMessage = (message: Message) => (
    <TouchableOpacity
      key={message.id}
      style={styles.messageContainer}
      onLongPress={() => handleMessageLongPress(message)}
    >
      <View style={styles.messageHeader}>
        <View style={styles.senderAvatar}>
          <Text style={styles.avatarText}>{message.senderAvatar}</Text>
        </View>
        <Text style={[styles.senderName, { color: theme.text }]}>{message.sender}</Text>
        <Text style={styles.messageTime}>{message.timestamp}</Text>
      </View>
      <View style={styles.messageContent}>
        {/* Show image if present */}
        {message.hasImage && message.imageUrl && (
          <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
        )}
        {/* Show attachment preview if present */}
        {message.attachments && message.attachments.length > 0 && message.attachments.map((att, idx) => {
          const isAttachmentImage = att.mimeType && att.mimeType.startsWith('image/');
          const isAttachmentVideo = att.mimeType && att.mimeType.startsWith('video/');
          if (isAttachmentImage) {
            return (
              <View key={idx} style={{ marginBottom: 8 }}>
                <Image source={{ uri: att.url }} style={styles.messageImage} />
                <TouchableOpacity onPress={() => handleDownload(att.url, att.name)} style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: '#fff', borderRadius: 16, padding: 4 }}>
                  <Ionicons name="download" size={20} color={theme.text} />
                </TouchableOpacity>
              </View>
            );
          }
          if (isAttachmentVideo) {
            return (
              <View key={idx} style={{ marginBottom: 8 }}>
                <Video
                  source={{ uri: att.url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode={ResizeMode.CONTAIN}
                  useNativeControls
                  style={{ width: 200, height: 150, borderRadius: 8, backgroundColor: '#000' }}
                />
                <TouchableOpacity onPress={() => handleDownload(att.url, att.name)} style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: '#fff', borderRadius: 16, padding: 4 }}>
                  <Ionicons name="download" size={20} color={theme.text} />
                </TouchableOpacity>
              </View>
            );
          }
          // For other files, show a file icon, name, and download
          return (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 18, marginRight: 6 }}>📄</Text>
              <Text style={{ color: theme.text, textDecorationLine: 'underline', marginRight: 8 }}>{att.name}</Text>
              <TouchableOpacity onPress={() => handleDownload(att.url, att.name)}>
                <Ionicons name="download" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          );
        })}
        <Text style={[styles.messageText, { color: theme.text }]}>{message.text}</Text>
      </View>
      {message.reactions && message.reactions.length > 0 && (
        <View style={styles.reactionsContainer}>
          {message.reactions.map((reaction, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reactionBubble}
              onPress={() => handleReaction(message.id, reaction.emoji)}
            >
              <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              <Text style={styles.reactionCount}>{reaction.count}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  // Add useEffect to scroll to bottom when keyboard appears
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => {
      showSubscription.remove();
    };
  }, []);

  // Add download handler
  const handleDownload = async (url: string, name: string) => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        FileSystem.documentDirectory + name
      );
      const result = await downloadResumable.downloadAsync();
      if (result && result.uri) {
        Alert.alert('Download complete', `Saved to: ${result.uri}`);
      } else {
        Alert.alert('Download failed', 'Could not download file.');
      }
    } catch (e) {
      Alert.alert('Download failed', 'Could not download file.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.accent }]}> 
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={theme.text} />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <View style={styles.headerTitle}>
                {channelInfo.type === 'channel' && (
                  <Hash size={16} color={theme.text} />
                )}
                <Text style={[styles.headerTitleText, { color: theme.text }]}>{channelInfo.name}</Text>
              </View>
              {channelInfo.memberCount && (
                <Text style={[styles.headerSubtitle, { color: theme.tabInactive }]}>
                  {channelInfo.memberCount} Members
                </Text>
              )}
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Users size={20} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreVertical size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingVertical: 16 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: theme.background }}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Message Input with capped bottom inset */}
          <View style={[styles.inputContainer, { paddingBottom: Math.max(Math.min(insets.bottom, 24), 8), backgroundColor: theme.card }]}> 
            <View style={styles.inputRow}>
              <View style={styles.messageInputContainer}>
                <TouchableOpacity style={styles.attachButton} onPress={handleAttachPress}>
                  <Paperclip size={20} color={theme.tabInactive} />
                </TouchableOpacity>
                <TextInput
                  style={[styles.messageInput, { color: '#000' }]}
                  placeholder={`Message ${channelInfo.type === 'channel' ? '#' : ''}${channelInfo.name}`}
                  placeholderTextColor={theme.tabInactive}
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  maxLength={1000}
                />
                <TouchableOpacity style={styles.emojiButton} onPress={handleEmojiPress}>
                  <Smile size={20} color={theme.tabInactive} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    messageText.trim() && styles.sendButtonActive
                  ]}
                  onPress={handleSend}
                  disabled={!messageText.trim()}
                >
                  <Send size={18} color={messageText.trim() ? theme.text : theme.tabInactive} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Emoji Picker Modal (placeholder) */}
          <Modal
            visible={showEmojiPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEmojiPicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <View style={{ backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Pick an emoji</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['😀','😂','😍','😎','😭','😡','👍','🎉','❤️','🔥','🙏','😅'].map(e => (
                    <TouchableOpacity key={e} onPress={() => handleEmojiSelect(e)} style={{ padding: 8 }}>
                      <Text style={{ fontSize: 28 }}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={() => setShowEmojiPicker(false)} style={{ marginTop: 16, alignSelf: 'flex-end' }}>
                  <Text style={{ color: theme.text, fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <ActionSheet />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // keep chat background white for readability
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor: '#FF6600', // was '#4A154B'
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '600',
    // color: '#FFFFFF',
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    // color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D29',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#8B8D97',
  },
  messageContent: {
    marginLeft: 40,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 15,
    color: '#1A1D29',
    lineHeight: 22,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 40,
    marginTop: 8,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: '#4A154B',
    fontWeight: '500',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingHorizontal: 16,
    // backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 4,
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 15,
    // color: '#1A1D29',
    maxHeight: 100,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#4A154B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
  },
  actionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reactionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    paddingTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4A9EFF',
    marginLeft: 12,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
});