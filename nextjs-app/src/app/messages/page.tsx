'use client';

import { Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { apiRequest } from '@/utils/axiosApiRequest';
import socket from '@/chat/socket';

interface Conversation {
  id: number;
  ad: { title: string };
  participants: { id: number }[];
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  sender?: { username: string };
}

const MessagesPage = () => {
  const { selectedConversationId } = useSelector((state: RootState) => state.conversation);
  const { user } = useSelector((state: RootState) => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_CONVERSATIONS}`,
          useCredentials: true,
        });
        setConversations(response.data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      const conversation = conversations.find(conv => conv.id === selectedConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [selectedConversationId, conversations]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_CONVERSATIONS_BY_ID}/${selectedConversation.id}`,
          useCredentials: true,
        });
        setMessages(response.data);
        socket.emit('joinRoom', selectedConversation.id.toString());
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    const handleNewMessage = (response: any) => {
      if (response?.data?.content) {
        setMessages(prevMessages => [...prevMessages, response.data]);
      } else {
        console.error('Received message is missing content:', response);
      }
    };

    socket.on('send_message', handleNewMessage);

    return () => {
      socket.off('send_message', handleNewMessage);
    };
  }, []);

  const handleSendMessage = () => {
    if (!selectedConversation) return;

    const receiverId = selectedConversation.participants.find(p => p.id !== user.id)?.id;

    if (receiverId) {
      socket.emit('send_message', {
        senderId: user.sub,
        receiverId,
        conversationId: selectedConversation.id,
        content: newMessage,
      });
    }

    setNewMessage('');
  };

  const styles = {
    container: { display: 'flex', height: '100vh' },
    conversationList: { width: '30%', borderRight: '1px solid #ccc', padding: '10px' },
    messagePanel: { width: '70%', padding: '10px' },
    conversationItem: (isSelected: boolean) => ({
      cursor: 'pointer',
      marginBottom: '10px',
      padding: '5px',
      borderRadius: '4px',
      backgroundColor: isSelected ? '#f0f0f0' : 'transparent',
    }),
  };

  return (
    <div style={styles.container}>
      <div style={styles.conversationList}>
        <h2>Conversations</h2>
        <ul>
          {conversations?.map(conversation => (
            <li
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              style={styles.conversationItem(selectedConversation?.id === conversation.id)}
            >
              {conversation?.ad?.title || 'Deleted Ad'} {/* Display 'Deleted Ad' if title is missing */}
              </li>
          ))}
        </ul>
      </div>
      <div style={styles.messagePanel}>
        <h2>Messages</h2>
        {selectedConversation ? (
          <>
            <ul>
              {messages?.map(message => (
                <li key={message.id}>
                  <strong>{user?.sub === message.senderId ? 'You: ' : `${message.sender?.username}: `}</strong>
                  {message.content}
                </li>
              ))}
            </ul>
            <Form>
              <Form.Group className="mb-3 mt-10" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Type a message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </Form.Group>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </Form>
          </>
        ) : (
          <p>Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
