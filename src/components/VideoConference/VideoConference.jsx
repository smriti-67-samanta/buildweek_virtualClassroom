import React, { useState, useEffect, useRef } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideo, 
  FaVideoSlash, 
  FaDesktop, 
  FaHandPaper, 
  FaSignOutAlt,
  FaUser,
  FaUserTie
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import '../../styles/dashboard.css';

export const VideoConference = ({ roomName, user, onLeave }) => {
  const [participants, setParticipants] = useState([]);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [raisedHands, setRaisedHands] = useState({});
  const [speakingParticipants, setSpeakingParticipants] = useState([]);
  const [jitsiApi, setJitsiApi] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const participantGridRef = useRef(null);
  const [myUserId, setMyUserId] = useState(null); // Track our own user ID

  useEffect(() => {
    // Add a class to the body to hide the navbar when entering the video conference
    document.body.classList.add('video-conference-active');

    return () => {
      // Ensure the class is removed when the component unmounts
      document.body.classList.remove('video-conference-active');
      // Dispose of the Jitsi API instance
      if (jitsiApi) {
        try {
          jitsiApi.dispose();
        } catch (error) {
          console.error('Error disposing Jitsi API:', error);
        }
      }
    };
  }, []); // Empty dependency array to run only on mount/unmount

  const handleApiReady = (api) => {
    setJitsiApi(api);
    setIsLoading(false);

    // Correct way to get the local participant's ID using getParticipantsInfo
    const participantsInfo = api.getParticipantsInfo();
    const localParticipant = participantsInfo.find(p => p.isLocal);
    const localUserId = localParticipant?.participantId || null;
    setMyUserId(localUserId); // Store our user ID

    // Sync initial states
    setAudioMuted(api.isAudioMuted());
    setVideoMuted(api.isVideoMuted());
    setIsScreenSharing(api.isSharingScreen());

    // Participant tracking
    const updateParticipants = () => {
      const participantsList = [];
      api.getParticipantsInfo().forEach(participant => {
        if (!participant.isLocal) { // Exclude the local participant from the list
          participantsList.push({
            id: participant.participantId,
            name: participant.displayName,
            isModerator: participant.role === 'moderator',
            isAudioMuted: participant.mutedAudio,
            isVideoMuted: participant.mutedVideo
          });
        }
      });
      setParticipants(participantsList);
    };

    // Event listeners
    api.on('audioMuteStatusChanged', ({ muted }) => setAudioMuted(muted));
    api.on('videoMuteStatusChanged', ({ muted }) => setVideoMuted(muted));
    api.on('screenSharingStatusChanged', ({ on }) => setIsScreenSharing(on));
    
    api.on('raiseHandUpdated', ({ id, raised }) => {
      setRaisedHands(prev => ({ ...prev, [id]: raised }));
    });

    api.on('dominantSpeakerChanged', ({ id }) => {
      setSpeakingParticipants(prev => 
        id ? [...new Set([id, ...prev])] : []
      );
    });

    api.on('participantJoined', updateParticipants);
    api.on('participantLeft', updateParticipants);
    api.on('readyToClose', handleLeave);
    api.on('errorOccurred', (err) => {
      console.error('Jitsi error:', err);
      setError('Connection error. Please try again.');
    });

    // Initial participants list
    updateParticipants();
  };

  const toggleMute = () => jitsiApi?.executeCommand('toggleAudio');
  const toggleVideo = () => jitsiApi?.executeCommand('toggleVideo');
  const toggleScreenShare = () => jitsiApi?.executeCommand('toggleShareScreen');
  const toggleRaiseHand = () => jitsiApi?.executeCommand('raiseHand');

  const handleLeave = () => {
    // Ensure the class is removed when leaving the meeting
    document.body.classList.remove('video-conference-active');
    // Dispose of the Jitsi API instance
    if (jitsiApi) {
      try {
        jitsiApi.dispose();
      } catch (error) {
        console.error('Error disposing Jitsi API:', error);
      }
    }
    // Call the onLeave callback to handle navigation
    onLeave?.();
  };

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      } catch (err) {
        console.error('Permission error:', err);
        setError('Camera/microphone permissions required. Please enable them.');
      }
    };
    checkPermissions();
  }, []);

  if (error) {
    return (
      <div className="video-conference-container">
        <div className="error-message">
          <p>{error}</p>
          <button className="control-btn" onClick={() => window.location.reload()}>
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-conference">
      <div className="video-conference-header">
        <h2>{roomName}</h2>
      </div>
      <div className="video-conference-content">
        <div className="video-feed">
          <JitsiMeeting
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              disableModeratorIndicator: true,
              enableWelcomePage: false,
              toolbarButtons: [],
              disabledFeatures: ['speaker-selection']
            }}
            interfaceConfigOverwrite={{
              DEFAULT_BACKGROUND: '#1c1c1c',
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              SHOW_PROMOTIONAL_CLOSE_PAGE: false
            }}
            onApiReady={handleApiReady}
            userInfo={{
              displayName: user?.name || 'Participant',
              email: user?.email || '',
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.borderRadius = '8px';
              iframeRef.style.height = '100%';
              iframeRef.style.minHeight = '400px';
            }}
          />
        </div>
        <div className="participants-sidebar">
          <h3>Participants ({participants.length + 1})</h3>
          <ul>
            <li key="self">{user?.name || 'You'} ({user?.role || 'participant'})</li>
            {participants.map(participant => (
              <li key={participant.id}>
                {participant.name} ({participant.isModerator ? 'Teacher' : 'Student'})
                {raisedHands[participant.id] && ' ✋'}
                {speakingParticipants.includes(participant.id) && ' 🔊'}
                {participant.isAudioMuted && ' 🔇'}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="control-bar">
        {isLoading ? (
          <p>Loading meeting controls...</p>
        ) : (
          <>
            <button 
              className={`control-btn ${audioMuted ? 'muted' : ''}`}
              onClick={toggleMute}
              data-tooltip-id="controls-tooltip"
              data-tooltip-content={audioMuted ? 'Unmute' : 'Mute'}
            >
              {audioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>

            <button 
              className={`control-btn ${videoMuted ? 'muted' : ''}`}
              onClick={toggleVideo}
              data-tooltip-id="controls-tooltip"
              data-tooltip-content={videoMuted ? 'Start Video' : 'Stop Video'}
            >
              {videoMuted ? <FaVideoSlash /> : <FaVideo />}
            </button>

            <button 
              className={`control-btn ${isScreenSharing ? 'sharing' : ''}`}
              onClick={toggleScreenShare}
              data-tooltip-id="controls-tooltip"
              data-tooltip-content={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
            >
              <FaDesktop />
            </button>

            <button 
              className={`control-btn ${raisedHands[myUserId] ? 'active' : ''}`}
              onClick={toggleRaiseHand}
              data-tooltip-id="controls-tooltip"
              data-tooltip-content={raisedHands[myUserId] ? 'Lower Hand' : 'Raise Hand'}
            >
              <FaHandPaper />
            </button>

            <button 
              className="control-btn leave-btn"
              onClick={handleLeave}
              data-tooltip-id="controls-tooltip"
              data-tooltip-content="Leave Meeting"
            >
              <FaSignOutAlt />
            </button>
          </>
        )}
      </div>

      <Tooltip id="controls-tooltip" place="top" effect="solid" />
    </div>
  );
};