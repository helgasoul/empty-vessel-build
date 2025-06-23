
import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  unread: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);
  
  const unreadCount = notificationList.filter(n => n.unread).length;
  
  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };
  
  const removeNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        aria-label="Уведомления"
      >
        <Bell className="w-5 h-5 text-neutral-600" />
        {unreadCount > 0 && (
          <Badge 
            variant="error" 
            size="sm"
            className="absolute -top-1 -right-1 min-w-[20px] h-5 text-xs flex items-center justify-center"
          >
            {unreadCount}
          </Badge>
        )}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-neutral-200 z-20 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">Уведомления</h3>
                {unreadCount > 0 && (
                  <Badge variant="primary" size="sm">
                    {unreadCount} новых
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notificationList.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Нет уведомлений</p>
                </div>
              ) : (
                notificationList.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer ${
                      notification.unread ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${getTypeColor(notification.type)}`} />
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {notification.title}
                          </p>
                        </div>
                        <p className="text-sm text-neutral-600 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {notification.time}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="ml-2 p-1 hover:bg-neutral-100 rounded transition-colors"
                        aria-label="Удалить уведомление"
                      >
                        <X className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {notificationList.length > 0 && (
              <div className="p-3 border-t border-neutral-200 bg-neutral-50">
                <button className="text-sm text-[#FF6B9D] hover:text-[#9B59B6] font-medium transition-colors">
                  Посмотреть все уведомления
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
