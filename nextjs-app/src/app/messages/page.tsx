'use client';

import { Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/Redux/store';
import { apiRequest } from '@/utils/axiosApiRequest';
import socket from '@/chat/socket';
import { highlightConversation } from '@/Redux/conversationStyleSlice';

interface Conversation {
  id: number;
  ad: { title: string };
  participants: { id: number }[];
  lastMessage: {
    id: number;
    content: string;
    isRead: boolean;
    receiverId: number;
  };
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  isRead: boolean;
  sender?: { username: string };
  seenAt?: string;
  createdAt: string;
}

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { selectedConversationId } = useSelector((state: RootState) => state.conversation);
  const { user } = useSelector((state: RootState) => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const highlightedConversationId = useSelector((state: RootState) => state.conversationStyle.highlightedConversationId);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_CONVERSATIONS}`,
          useCredentials: true,
        });

        const updatedConversations = response.data.map((conversation: Conversation) => {
          if (
            conversation.lastMessage &&
            conversation.lastMessage.receiverId === user.sub &&
            !conversation.lastMessage.isRead
          ) {
            return { ...conversation, isUnread: true };
          }
          return conversation;
        });

        setConversations(updatedConversations);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };

    fetchConversations();
  }, [user?.sub]);

  useEffect(() => {
    if (selectedConversationId) {
      const conversation = conversations.find(conv => conv.id === selectedConversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [selectedConversationId, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await apiRequest({
            method: 'GET',
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL_GET_CONVERSATIONS_BY_ID}/${selectedConversation.id}`,
            useCredentials: true,
          });
          setMessages(response.data);

          // Emit event to join the chat room
          socket.emit('joinRoom', selectedConversation.id.toString());

          // Mark the last message as read
          const lastMessage = response.data[response.data.length - 1];
          console.log("lastMessage: ",lastMessage)
          if (lastMessage && !lastMessage.isRead && lastMessage.receiverId === user.sub) {
            await apiRequest({
              method: 'PATCH',
              url: `${process.env.NEXT_PUBLIC_BACKEND_URL_MARK_MESSAGE_READ}/${selectedConversation.id}/${lastMessage.id}`,
              useCredentials: true,
            });
            console.log("sending message seen to the event listener...")
            socket.emit('messageSeen', {
              messageId: lastMessage.id,
              userId: lastMessage.senderId,
            });
          }
        } catch (error) {
          console.error('Failed to fetch messages', error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    const handleMessageSeen = (data: { messageId: number; userId: number }) => {
      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === data.messageId
            ? { ...message, isRead: true, seenAt: new Date().toISOString() }
            : message
        )
      );
    };
  
    socket.on('messageSeen', handleMessageSeen);
  
    return () => {
      socket.off('messageSeen', handleMessageSeen);
    };
  }, []);

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

  const handleSendMessage = async () => {
    if (!selectedConversation) return;

    const receiverId = selectedConversation.participants.find(p => p.id !== user?.sub)?.id;
    if (receiverId) {
      socket.emit('send_message', {
        senderId: user.sub,
        receiverId,
        conversationId: selectedConversation.id,
        content: newMessage,
      });

      // Notify receiver
      socket.emit('notifyReceiver', {
        receiverId,
        conversationId: selectedConversation.id,
      });

      // Update pending message count on the backend
      await apiRequest({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL_PENDING_MESSAGES_COUNT}`,
        data: { userId: receiverId },
        useCredentials: true,
      });
    }

    setNewMessage('');
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    dispatch(highlightConversation(conversation.id));
  };

  const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' },
    conversationList: { 
      width: '30%', 
      borderRight: '1px solid #ddd', 
      padding: '10px', 
      backgroundColor: '#f9f9f9' 
    },
    messagePanel: { 
      width: '70%', 
      padding: '10px', 
      backgroundColor: '#ffffff' 
    },
    conversationItem: (isSelected: boolean, isUnread: boolean, isHighlighted: boolean) => ({
      cursor: 'pointer',
      marginBottom: '10px',
      padding: '10px',
      borderRadius: '8px',
      backgroundColor: isSelected 
        ? '#e0e0e0' 
        : isHighlighted 
        ? '#e0f7fa' 
        : 'transparent', 
      fontWeight: isUnread ? 'bold' : 'normal',
      transition: 'background-color 0.3s ease',
    }),
    messageListContainer: {
      maxHeight: '70vh', 
      overflowY: 'auto',
      padding: '10px',
    },
    messageList: {
      listStyleType: 'none',
      padding: '0',
      margin: '0',
    },
    messageItem: {
      padding: '8px',
      borderRadius: '5px',
      marginBottom: '8px',
      backgroundColor: '#f0f0f0',
      maxWidth: '80%',
      wordWrap: 'break-word',
    },
    messageSender: (isCurrentUser: boolean) => ({
      fontWeight: 'bold',
      color: isCurrentUser ? '#333' : '#007bff', // Different color for current user's messages
    }),
    messageStatus: {
      color: 'green',
      marginLeft: '10px',
      fontSize: '0.75em',
    },
    messageDate: {
      fontSize: '0.75em',
      color: '#888',
      marginTop: '4px',
    },
    inputContainer: {
      marginTop: '20px',
    },
    formLabel: {
      marginBottom: '10px',
    },
    sendMsgBtn: {
      margin: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.conversationList}>
        <h2 className='font-bold text-center mt-8 mb-4'>Conversations</h2>
        <ul>
          {conversations?.map(conversation => (
            <li
              key={conversation.id}
              onClick={() => handleConversationClick(conversation)}
              style={styles.conversationItem(
                selectedConversation?.id === conversation.id,
                conversation.isUnread,
                highlightedConversationId === conversation.id
              )}
            >
              {conversation?.ad?.title || 'Deleted Ad'} {/* Display 'Deleted Ad' if title is missing */}
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.messagePanel}>
        <h2 className='font-bold text-center mt-8 mb-6'>Messages</h2>
        {selectedConversation ? (
          <>
            <div style={styles.messageListContainer}>

            <ul style={styles.messageList}>
              {messages?.map((message, index) => (
                <li key={message.id} style={styles.messageItem}>
                  <div style={styles.messageSender(user?.sub === message.senderId)}>
                    {user?.sub === message.senderId ? 'You: ' : `${message.sender?.username}: `}
                  </div>
                  {message.content}
                  {index === messages.length - 1 && user?.sub === message.senderId && (
                    <span style={styles.messageStatus}>
                      {message.isRead
                        ? message.seenAt
                          ? `Seen at ${new Date(message.seenAt).toLocaleTimeString()}`
                          : 'Seen'
                        : 'Delivered'}
                    </span>
                  )}
                  <div style={styles.messageDate}>
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
            </div>
            <Form style={styles.inputContainer}>
              <Form.Group>
                <Form.Label style={styles.formLabel}>Type your message:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </Form.Group>
              <Button style={styles.sendMsgBtn} onClick={handleSendMessage}>Send Message</Button>
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
