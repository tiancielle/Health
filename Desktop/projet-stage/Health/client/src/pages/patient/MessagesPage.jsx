import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, Search, User, Calendar, Clock, Plus, Paperclip, Phone, Video, ChevronLeft, MoreVertical } from 'lucide-react';
import Header from '../../components/layout/Header';

export default function MessagesPage() {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const conversations = [
    {
      id: 1,
      doctor: {
        name: 'Dr. Youssef Tazi',
        specialty: 'Dermatologie',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        content: 'Your latest results are very encouraging. Continue the treatment as prescribed.',
        timestamp: '2025-09-07T10:30:00',
        sender: 'doctor'
      },
      unread: 2,
      messages: [
        {
          id: 1,
          content: 'Hello doctor, I have a question about my treatment.',
          timestamp: '2025-09-07T09:00:00',
          sender: 'patient'
        },
        {
          id: 2,
          content: 'Hello! I\'m listening, what\'s your question?',
          timestamp: '2025-09-07T09:15:00',
          sender: 'doctor'
        },
        {
          id: 3,
          content: 'Should I take the medications before or after meals?',
          timestamp: '2025-09-07T09:16:00',
          sender: 'patient'
        },
        {
          id: 4,
          content: 'For Amlodipine, take it preferably in the morning, regardless of meals. For Lisinopril, it\'s better before meals.',
          timestamp: '2025-09-07T09:30:00',
          sender: 'doctor'
        },
        {
          id: 5,
          content: 'Perfect, thank you for these clarifications!',
          timestamp: '2025-09-07T09:35:00',
          sender: 'patient'
        },
        {
          id: 6,
          content: 'Your latest results are very encouraging. Continue the treatment as prescribed.',
          timestamp: '2025-09-07T10:30:00',
          sender: 'doctor'
        }
      ]
    },
    {
      id: 2,
      doctor: {
        name: 'Dr. Ahmed Benali',
        specialty: 'Dermatologue',
        avatar: null,
        status: 'away'
      },
      lastMessage: {
        content: 'Thank you for the photos. The treatment seems to be working well.',
        timestamp: '2025-09-06T14:20:00',
        sender: 'doctor'
      },
      unread: 0,
      messages: [
        {
          id: 1,
          content: 'Doctor, here are the photos of the evolution as requested.',
          timestamp: '2025-09-06T14:00:00',
          sender: 'patient'
        },
        {
          id: 2,
          content: 'Thank you for the photos. The treatment seems to be working well.',
          timestamp: '2025-09-06T14:20:00',
          sender: 'doctor'
        }
      ]
    },
    {
      id: 3,
      doctor: {
        name: 'Dr. Fatima El Amrani',
        specialty: 'Ophtalmologue',
        avatar: null,
        status: 'offline'
      },
      lastMessage: {
        content: 'Don\'t forget your appointment tomorrow at 4:15 PM.',
        timestamp: '2025-09-05T16:45:00',
        sender: 'doctor'
      },
      unread: 1,
      messages: [
        {
          id: 1,
          content: 'Don\'t forget your appointment tomorrow at 4:15 PM.',
          timestamp: '2025-09-05T16:45:00',
          sender: 'doctor'
        }
      ]
    },
    {
      id: 4,
      doctor: {
        name: 'Dr. Karim Alaoui',
        specialty: 'Médecin généraliste',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        content: 'Your blood pressure is well controlled. Keep up the good work!',
        timestamp: '2025-09-04T11:20:00',
        sender: 'doctor'
      },
      unread: 0,
      messages: [
        {
          id: 1,
          content: 'Good morning doctor, I wanted to share my latest blood pressure readings.',
          timestamp: '2025-09-04T11:00:00',
          sender: 'patient'
        },
        {
          id: 2,
          content: 'Good morning! Please share the readings.',
          timestamp: '2025-09-04T11:05:00',
          sender: 'doctor'
        },
        {
          id: 3,
          content: 'Morning: 125/82, Evening: 120/78 - for the past week.',
          timestamp: '2025-09-04T11:07:00',
          sender: 'patient'
        },
        {
          id: 4,
          content: 'Your blood pressure is well controlled. Keep up the good work!',
          timestamp: '2025-09-04T11:20:00',
          sender: 'doctor'
        }
      ]
    }
  ];

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'away':
        return 'bg-yellow-400';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Simuler l'envoi du message
    const message = {
      id: Date.now(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'patient'
    };

    // Ici vous ajouteriez le message à la conversation
    console.log('Sending message:', message);
    setNewMessage('');
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#4d89b1] font-medium mb-4 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Messages
            {totalUnread > 0 && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {totalUnread} unread
              </span>
            )}
          </h1>
          <p className="text-gray-600">Communicate with your healthcare providers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex h-[700px]">
            {/* Sidebar - Liste des conversations */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                      selectedConversation === conversation.id
                        ? 'bg-[#4d89b1] bg-opacity-10 border-l-4 border-l-[#4d89b1]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-[#4d89b1] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.doctor.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {conversation.doctor.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{conversation.doctor.specialty}</p>
                        <p className="text-sm text-gray-700 truncate">{conversation.lastMessage.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {getStatusText(conversation.doctor.status)}
                          </span>
                          {conversation.unread > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#4d89b1] text-white">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Message Button */}
              <div className="p-4 border-t border-gray-200">
                <button className="w-full bg-[#4d89b1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3d6c91] transition flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Message</span>
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-[#4d89b1] rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedConv.doctor.status)}`}></div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedConv.doctor.name}</h3>
                          <p className="text-sm text-gray-600">
                            {selectedConv.doctor.specialty} • {getStatusText(selectedConv.doctor.status)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Voice Call">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="Video Call">
                          <Video className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition" title="More Options">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-25">
                    {selectedConv.messages.map((message, index) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                          {message.sender === 'doctor' && (
                            <div className="w-6 h-6 bg-[#4d89b1] rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              message.sender === 'patient'
                                ? 'bg-[#4d89b1] text-white rounded-br-md'
                                : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                          {message.sender === 'patient' && (
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="Attach File"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent resize-none"
                          rows={1}
                          style={{ minHeight: '40px', maxHeight: '120px' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-[#4d89b1] text-white rounded-lg hover:bg-[#3d6c91] disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Send Message"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-2">
                      Press Enter to send, Shift + Enter for new line
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-25">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a Conversation
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Choose a doctor from the list to start chatting.
                    </p>
                    <button className="bg-[#4d89b1] text-white px-6 py-2 rounded-lg hover:bg-[#3d6c91] transition">
                      Start New Conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Conversations</h3>
                <p className="text-2xl font-bold text-green-600">{conversations.length}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Total doctors you're messaging</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Online Doctors</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {conversations.filter(c => c.doctor.status === 'online').length}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Available for immediate response</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <MessageCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Unread Messages</h3>
                <p className="text-2xl font-bold text-red-600">{totalUnread}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Messages waiting for your attention</p>
          </div>
        </div>
      </div>
    </div>
  );
}