
import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'doctor' | 'patient'
  timestamp: Date
  type: 'text' | 'file' | 'calculation'
  attachment?: {
    name: string
    type: string
    url: string
  }
}

interface PatientChatProps {
  patientName: string
  patientAvatar: string
}

export const PatientChat = ({ patientName, patientAvatar }: PatientChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Добрый день! Посмотрела ваши анализы. Есть несколько моментов, которые хотелось бы обсудить.',
      sender: 'doctor',
      timestamp: new Date('2025-06-21T09:00:00'),
      type: 'text'
    },
    {
      id: '2',
      content: 'Здравствуйте! Да, конечно. Меня особенно беспокоит показатель HOMA-IR.',
      sender: 'patient',
      timestamp: new Date('2025-06-21T09:05:00'),
      type: 'text'
    },
    {
      id: '3',
      content: 'Это пограничные значения, но не критичные. Рекомендую скорректировать питание и увеличить физическую активность. Отправлю вам подробные рекомендации.',
      sender: 'doctor',
      timestamp: new Date('2025-06-21T09:07:00'),
      type: 'text'
    }
  ])
  
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'doctor',
        timestamp: new Date(),
        type: 'text'
      }
      
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-lg flex flex-col h-96">
      {/* Chat Header */}
      <div className="p-4 border-b border-rose-100">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{patientAvatar}</div>
          <div>
            <h3 className="font-bold text-gray-800">{patientName}</h3>
            <p className="text-sm text-green-600">● В сети</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.sender === 'doctor'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'doctor' ? 'text-rose-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-rose-100">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите сообщение..."
              className="w-full px-4 py-2 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              rows={1}
            />
          </div>
          
          <button className="p-2 text-gray-500 hover:text-rose-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-rose-600 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-2 rounded-lg transition-colors ${
              newMessage.trim()
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
