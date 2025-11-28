import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common';

const EsqueciSenha: React.FC = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await resetPassword(email);

    setIsLoading(false);

    if (!error) {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-yellow-50 flex items-center justify-center p-4">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl"></div>
        </div>

        {/* Container Principal */}
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-primary-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Email Enviado!</h1>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-8 text-center">
              <p className="text-gray-700 mb-2">
                Enviamos um link de recuperação de senha para:
              </p>
              <p className="text-primary-600 font-bold mb-6">{email}</p>
              <p className="text-sm text-gray-600 mb-6">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
              <Button
                onClick={() => navigate('/login')}
                variant="primary"
                fullWidth
                className="!py-3.5 !text-base !font-bold !rounded-xl"
              >
                Voltar ao Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Container Principal */}
      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-primary-100">
          {/* Header com Logo */}
          <div className="bg-gradient-to-r from-primary-500 via-purple-500 to-yellow-500 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 transform hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src="https://gjqkkiuqryhhobmcevuo.supabase.co/storage/v1/object/public/pipicos/logo.png"
                  alt="Pipicos Festas"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Recuperar Senha</h1>
              <p className="text-white/90 font-medium">Pipicos Festas CRM</p>
            </div>
          </div>

          {/* Formulário */}
          <div className="p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h2>
              <p className="text-gray-600">Digite seu email para receber um link de recuperação</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-primary-200"
                    required
                  />
                </div>
              </div>

              {/* Botão de Enviar */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                className="!py-3.5 !text-base !font-bold !rounded-xl !shadow-lg hover:!shadow-pink-glow"
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>

              {/* Voltar ao Login */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-all"
                >
                  ← Voltar ao Login
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Pipicos Festas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EsqueciSenha;
