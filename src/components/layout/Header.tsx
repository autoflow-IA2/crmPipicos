import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40 animate-slideDown border-b-2 border-transparent bg-gradient-to-r from-transparent via-transparent to-transparent relative">
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-primary-500 to-orange-500"></div>
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md p-1 border-2 border-primary-200">
              <img
                src="https://gjqkkiuqryhhobmcevuo.supabase.co/storage/v1/object/public/pipicos/logo.png"
                alt="Pipicos Festas"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Pipicos Festas
            </h1>
          </div>
          <h1 className="sm:hidden text-2xl font-bold bg-gradient-to-r from-primary-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Pipicos Festas
          </h1>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Busca rápida */}
          <button
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 group"
            onClick={() => navigate('/agendamentos')}
          >
            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-700" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span className="text-sm text-gray-600 group-hover:text-gray-800">Buscar...</span>
            <kbd className="hidden xl:inline-block px-2 py-0.5 text-xs bg-white rounded border border-gray-300 text-gray-500">⌘K</kbd>
          </button>

          {/* Novo agendamento - botão rápido */}
          <button
            onClick={() => navigate('/agendamentos/novo')}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl hover:from-primary-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-pink-glow transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 animate-float"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 4v16m8-8H4"></path>
            </svg>
            <span className="font-medium">Novo</span>
          </button>

          {/* Menu do usuário */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-purple-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md ring-2 ring-primary-200 hover:ring-primary-300 transition-all hover:rotate-12">
                U
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-900">
                  {user?.email?.split('@')[0] || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            {/* Dropdown do usuário */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slideDown overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-primary-50 to-purple-50">
                  <p className="font-bold text-gray-900">
                    {user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email || 'admin@crm.com'}</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors text-left">
                    <svg className="w-5 h-5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="text-sm font-medium">Meu perfil</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors text-left">
                    <svg className="w-5 h-5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm font-medium">Configurações</span>
                  </button>
                </div>
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 rounded-xl transition-colors text-left text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span className="text-sm font-medium">Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
