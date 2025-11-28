import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 text-primary-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
    },
    {
      path: '/agendamentos',
      label: 'Agendamentos',
      icon: (
        <svg className="w-5 h-5 text-orange-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
      ),
    },
    {
      path: '/calendario',
      label: 'Calendário',
      icon: (
        <svg className="w-5 h-5 text-blue-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
    },
    {
      path: '/clientes',
      label: 'Clientes',
      icon: (
        <svg className="w-5 h-5 text-green-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
    },
    {
      path: '/estoque',
      label: 'Estoque',
      icon: (
        <svg className="w-5 h-5 text-purple-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      ),
    },
    {
      path: '/relatorios',
      label: 'Relatórios',
      icon: (
        <svg className="w-5 h-5 text-yellow-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      ),
    },
    {
      path: '/api-docs',
      label: 'API REST',
      icon: (
        <svg className="w-5 h-5 text-pink-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-20' : 'w-64'}
        bg-gradient-sidebar text-white min-h-screen
        transition-all duration-300 ease-in-out
        flex flex-col
        shadow-2xl
      `}
    >
      {/* Logo e Toggle */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-fadeIn">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-primary-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">Pipicos Festas</h2>
              <p className="text-xs text-white/70">CRM Agendamentos</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-110"
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <li key={item.path} style={{ animationDelay: `${index * 50}ms` }} className="animate-slideInLeft">
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 transform
                    relative group
                    ${
                      active
                        ? 'bg-white/20 text-white shadow-lg scale-105'
                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-102'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className={`${active ? 'animate-pulse' : ''}`}>{item.icon}</span>
                  {!isCollapsed && (
                    <span className="font-medium flex-1 animate-fadeIn">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-scaleIn">
                      {item.badge}
                    </span>
                  )}
                  {/* Gradient indicator bar */}
                  {active && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-pink-400 to-orange-400 rounded-r-full animate-slideInLeft"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed ? (
          <div className="bg-white/10 rounded-xl p-4 animate-fadeIn backdrop-blur-sm">
            <p className="text-xs text-white/70 mb-2">Precisa de ajuda?</p>
            <button className="text-sm text-yellow-300 hover:text-yellow-200 font-medium transition-colors flex items-center gap-2 group">
              <svg className="w-4 h-4 group-hover:animate-wiggle" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Suporte
            </button>
          </div>
        ) : (
          <button className="w-full p-3 rounded-xl hover:bg-white/10 transition-colors" title="Ajuda">
            <svg className="w-5 h-5 mx-auto text-yellow-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
