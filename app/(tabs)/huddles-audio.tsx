import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Daily, { DailyCall, DailyEventObjectParticipant, DailyParticipant } from '@daily-co/react-native-daily-js';

const DAILY_API_KEY = '1c04dc36ee79e700afa2d6200835335acb4c32152a522a096075a582381cecd2';
const ROOM_URL = 'https://devsync.daily.co/huddle-demo'; // TODO: Use backend to create/join rooms dynamically

export default function HuddlesAudioScreen() {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState<{ [id: string]: DailyParticipant }>({});
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const call = Daily.createCallObject();
    setCallObject(call);
    return () => {
      call.destroy();
    };
  }, []);

  useEffect(() => {
    if (!callObject) return;
    const handleJoined = () => setJoined(true);
    const handleLeft = () => setJoined(false);
    const handleParticipants = () => {
      setParticipants(callObject.participants());
    };
    callObject.on('joined-meeting', handleJoined);
    callObject.on('left-meeting', handleLeft);
    callObject.on('participant-joined', handleParticipants);
    callObject.on('participant-updated', handleParticipants);
    callObject.on('participant-left', handleParticipants);
    return () => {
      callObject.off('joined-meeting', handleJoined);
      callObject.off('left-meeting', handleLeft);
      callObject.off('participant-joined', handleParticipants);
      callObject.off('participant-updated', handleParticipants);
      callObject.off('participant-left', handleParticipants);
    };
  }, [callObject]);

  const joinCall = async () => {
    if (!callObject) return;
    await callObject.join({ url: ROOM_URL, token: DAILY_API_KEY });
  };
  const leaveCall = async () => {
    if (!callObject) return;
    await callObject.leave();
  };
  const toggleMute = async () => {
    if (!callObject) return;
    await callObject.setLocalAudio(!muted);
    setMuted((m) => !m);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Huddles Audio Call</Text>
      {!joined ? (
        <TouchableOpacity style={styles.button} onPress={joinCall}>
          <Text style={styles.buttonText}>Join Audio Huddle</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={leaveCall}>
            <Text style={styles.buttonText}>Leave Huddle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleMute}>
            <Text style={styles.buttonText}>{muted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Participants:</Text>
          {Object.values(participants).map((p) => (
            <Text key={p.user_id || p.session_id} style={styles.participant}>
              {p.user_name || 'Anonymous'} {p.local ? '(You)' : ''} {p.audio ? '' : '(Muted)'}
            </Text>
          ))}
        </>
      )}
      {/* TODO: Add advanced controls, backend room management, and error handling */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4A9EFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginVertical: 12,
    width: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 24,
    marginBottom: 8,
  },
  participant: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
}); 