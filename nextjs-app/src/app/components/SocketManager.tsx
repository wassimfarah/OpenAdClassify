'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import socket from '@/chat/socket';
import { incrementPendingMessageCount } from '@/Redux/pendingMessageSlice';
import { highlightConversation } from '@/Redux/conversationStyleSlice'; // Import corrected action name

const SocketManager = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit('userConnected', { userId: user?.sub });

    // Clean up on unmount
    return () => {
      socket.off('connect');
    };
  }, []);

  useEffect(() => {
    // Listen for the notifyReceiver event
    socket.on('notifyReceiver', (data) => {

      // Increment the received messages count
      dispatch(incrementPendingMessageCount());
      // Highlight the conversation
      dispatch(highlightConversation(data.conversationId)); // Corrected function usage
    });

    // Clean up on unmount
    return () => {
      socket.off('notifyReceiver');
    };
  }, [dispatch]);

  return null; // This component does not render anything
};

export default SocketManager;
