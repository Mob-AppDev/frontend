import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Daily, { DailyCall, DailyParticipant } from '@daily-co/react-native-daily-js';
import DailyVideo from '@daily-co/react-native-daily-js';

const DAILY_API_KEY = '1c04dc36ee79e700afa2d6200835335acb4c32152a522a096075a582381cecd2';
const ROOM_URL = 'https://devsync.daily.co/huddle-demo'; // TODO: Use backend to create/join rooms dynamically

export default function HuddlesVideoScreen() {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState<{ [id: string]: DailyParticipant }>({});
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);

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
  const toggleCamera = async () => {
    if (!callObject) return;
    await callObject.setLocalVideo(!cameraOn);
    setCameraOn((c) => !c);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Huddles Video Call</Text>
      {!joined ? (
        <TouchableOpacity style={styles.button} onPress={joinCall}>
          <Text style={styles.buttonText}>Join Video Huddle</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={leaveCall}>
            <Text style={styles.buttonText}>Leave Huddle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleMute}>
            <Text style={styles.buttonText}>{muted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCamera}>
            <Text style={styles.buttonText}>{cameraOn ? 'Stop Camera' : 'Start Camera'}</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Participants:</Text>
          <ScrollView style={{ width: '100%' }}>
            {Object.values(participants).map((p) => (
              <View key={p.user_id || p.session_id} style={styles.participantTile}>
                <Text style={styles.participantName}>
                  {p.user_name || 'Anonymous'} {p.local ? '(You)' : ''} {p.video ? '' : '(Camera Off)'}
                </Text>
                {p.video ? (
                  <DailyVideo
                    callObject={callObject}
                    sessionId={p.session_id}
                    style={styles.video}
                    mirror={p.local}
                  />
                ) : (
                  <View style={styles.videoPlaceholder}>
                    <Text style={{ color: '#fff' }}>No Video</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
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
  participantTile: {
    backgroundColor: '#23272F',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    alignItems: 'center',
  },
  participantName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  video: {
    width: 160,
    height: 90,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  videoPlaceholder: {
    width: 160,
    height: 90,
    backgroundColor: '#444',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 