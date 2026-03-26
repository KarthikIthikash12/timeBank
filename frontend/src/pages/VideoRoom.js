import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { AuthContext } from '../context/AuthContext';

export default function VideoRoom() {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#0f172a' }}>
      <JitsiMeeting
        domain="meet.jit.si"
        roomName={`TimeBank_Secure_Room_${roomId}`} 
        configOverwrite={{
          startWithAudioMuted: false,
          disableModeratorIndicator: true,
          startScreenSharing: false,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false
        }}
        userInfo={{
          displayName: user?.name || 'TimeBank User',
          email: user?.email
        }}
        onApiReady={(externalApi) => {
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
        onReadyToClose={() => {
          navigate('/'); 
        }}
      />
    </div>
  );
}