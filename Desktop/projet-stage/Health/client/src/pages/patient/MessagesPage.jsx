import React, { useState } from 'react';
import { MessageCircle, Send, Search, User, Calendar, Clock, Plus, Paperclip, Phone, Video } from 'lucide-react';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées
  const conversations = [
    {
      id: 1,
      doctor: {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiologue',
        avatar: null,
        status: 'online'
      },
      lastMessage: {
        content: 'Vos derniers résultats sont très encourageants. Continuez le traitement comme prescrit.',
        timestamp: '2025-09-07T10:30:00',
        sender: 'doctor'
      },
      unread: 2,
      messages: [
        {
          id: 1,
          content: 'Bonjour docteur, j\'ai une question concernant mon traitement.',
          timestamp: '2025-09-07T09:00:00',
          sender: 'patient'
        },
        {
          id: 2,
          content: 'Bonjour ! Je vous écoute, quelle est votre question ?',
          timestamp: '2025-09-07T09:15:00',
          sender: 'doctor'
        },
        {
          id: 3,
          content: 'Dois-je prendre les médicaments avant ou après le repas ?',
          timestamp: '2025-09-07T09:16:00',
          sender: 'patient'
        },
        {
          id: 4,
          content: 'Pour l\'Amlodipine, prenez-la de préférence le matin, peu importe les repas. Pour le Lisinopril, c\'est mieux avant le repas.',
          timestamp: '2025-09-07T09:30:00',
          sender: 'doctor'
        },
        {
          id: 5,
          content: 'Parfait, merci pour ces précisions !',
          timestamp: '2025-09-07T09:35:00',
          sender: 'patient'
        },
        {
          id: 6,
          content: 'Vos derniers résultats sont très encourageants. Continuez le traitement comme prescrit.',
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
        content: 'Merci pour les photos. Le traitement semble bien fonctionner.',
        timestamp: '2025-09-06T14:20:00',
        sender: 'doctor'
      },
      unread: 0,
      messages: [
        {
          id: 1,
          content: 'Docteur, voici les photos de l\'évolution comme demandé.',
          timestamp: '2025-09-06T14:00:00',
          sender: 'patient'
        },
        {
          id: 2,
          content: 'Merci pour les photos. Le traitement semble bien fonctionner.',
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
        content: 'N\'oubliez pas votre rendez-vous de demain à 16h15.',
        timestamp: '2025-09-05T16:45:00',
        sender: 'doctor'
      },
      unread: 0,
      messages: [
        {
          id: 1,
          content: 'N\'oubliez pas votre rendez-vous de demain à 16h15.',
          timestamp: '2025-09-05T16:45:00',
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
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
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
    console.log('Envoi du message:', message);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communiquez avec vos médecins</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Sidebar - Liste des conversations */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un médecin..."
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
                        {conversation.unread > 0 && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#4d89b1] text-white">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Message Button */}
              <div className="p-4 border-t border-gray-200">
                <button className="w-full bg-[#4d89b1] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3d6c91] transition flex items-center justify-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Nouveau message</span>
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
                          <p className="text-sm text-gray-600">{selectedConv.doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                          <Phone className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                          <Video className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConv.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'patient'
                              ? 'bg-[#4d89b1] text-white'
                              : 'bg-gray-100 text-gray-900'
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
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d89b1] focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-2 bg-[#4d89b1] text-white rounded-lg hover:bg-[#3d6c91] disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sélectionnez une conversation
                    </h3>
                    <p className="text-gray-500">
                      Choisissez un médecin dans la liste pour commencer à discuter.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}