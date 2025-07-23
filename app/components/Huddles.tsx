import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, TextInput } from 'react-native';
import { Mic, Video, Users, MessageCircle, Smile, Monitor, Image, X, Plus, ChevronDown } from 'lucide-react-native';


// TODO: Integrate with a real-time service like Daily.co, Agora, Twilio, or Jitsi for actual audio/video/screen sharing
// TODO: Integrate with expo-av or expo-audio for audio recording
// TODO: Integrate with backend for notes, reactions, and recordings

const DEMO_PARTICIPANTS = [
  { id: '1', name: 'You', isHost: true, isSpeaking: true },
  { id: '2', name: 'Caleb Adams', isHost: false, isSpeaking: false },
];

export default function Huddles({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [audioOn, setAudioOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [recording, setRecording] = useState(false);
  const [notes, setNotes] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [background, setBackground] = useState<'default' | 'custom'>('default');
  const [topic, setTopic] = useState('');

  // TODO: Replace with real participants from backend/service
  const participants = DEMO_PARTICIPANTS;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Huddle</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Topic */}
        <View style={styles.topicRow}>
          <Text style={styles.topicLabel}>Topic:</Text>
          <TextInput
            style={styles.topicInput}
            placeholder="Set a topic..."
            placeholderTextColor="#aaa"
            value={topic}
            onChangeText={setTopic}
          />
        </View>
        {/* Participants */}
        <TouchableOpacity style={styles.participantsBtn} onPress={() => setShowParticipants((v) => !v)}>
          <Users size={20} color="#fff" />
          <Text style={styles.participantsText}>{participants.length} participants</Text>
          <ChevronDown size={18} color="#fff" />
        </TouchableOpacity>
        {showParticipants && (
          <FlatList
            data={participants}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.participantRow}>
                <Text style={{ color: '#fff', fontWeight: item.isHost ? 'bold' : 'normal' }}>{item.name}</Text>
                {item.isHost && <Text style={{ color: '#4A9EFF', marginLeft: 8 }}>(host)</Text>}
                {item.isSpeaking && <Text style={{ color: '#4A9EFF', marginLeft: 8 }}>🎤</Text>}
              </View>
            )}
            style={styles.participantsList}
          />
        )}
        {/* Controls */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setAudioOn((v) => !v)}>
            <Mic size={28} color={audioOn ? '#4A9EFF' : '#fff'} />
            <Text style={styles.controlLabel}>{audioOn ? 'Mute' : 'Unmute'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setVideoOn((v) => !v)}>
            <Video size={28} color={videoOn ? '#4A9EFF' : '#fff'} />
            <Text style={styles.controlLabel}>{videoOn ? 'Stop Video' : 'Start Video'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setRecording((v) => !v)}>
            <MessageCircle size={28} color={recording ? '#4A9EFF' : '#fff'} />
            <Text style={styles.controlLabel}>{recording ? 'Stop Rec' : 'Record'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setShowReactions((v) => !v)}>
            <Smile size={28} color="#fff" />
            <Text style={styles.controlLabel}>Reactions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Monitor size={28} color="#fff" />
            <Text style={styles.controlLabel}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setBackground(bg => bg === 'default' ? 'custom' : 'default')}>
            <Image size={28} color={background === 'custom' ? '#4A9EFF' : '#fff'} />
            <Text style={styles.controlLabel}>BG</Text>
          </TouchableOpacity>
        </View>
        {/* Notes Thread */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Type notes here..."
            placeholderTextColor="#aaa"
            value={notes}
            onChangeText={setNotes}
            multiline
          />
        </View>
        {/* Emoji Reactions */}
        {showReactions && (
          <View style={styles.reactionsRow}>
            <Text style={{ color: '#fff' }}>😀 😍 🎉 👍 👏 🙌 🚀</Text>
            {/* TODO: Implement real emoji reactions */}
          </View>
        )}
        {/* TODO: Add screen sharing, pop-out window, and more advanced features as needed */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    paddingTop: 40,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 8,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  topicLabel: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  topicInput: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#23272F',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 16,
  },
  participantsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23272F',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  participantsText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  participantsList: {
    maxHeight: 120,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  controlBtn: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  notesSection: {
    backgroundColor: '#23272F',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    flex: 1,
  },
  notesLabel: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6,
  },
  notesInput: {
    color: '#fff',
    fontSize: 15,
    minHeight: 60,
    flex: 1,
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
}); 