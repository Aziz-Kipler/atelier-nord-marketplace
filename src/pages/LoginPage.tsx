import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Shield, Layers, ArrowRight, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { Role } from '../types/index.ts';

export const LoginPage: React.FC = () => {
  const { setRole, role, setPage, t, setCurrentUser, users, registerUser } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login inputs
  const [email, setEmail] = useState('alex.romanov@atelier-nord.ru');
  const [password, setPassword] = useState('••••••••');

  // Registration inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleQuickLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    const matched = users.find((u) => u.role === selectedRole) || users[0];
    setCurrentUser(matched);
    setPage(selectedRole === 'admin' ? 'admin_dashboard' : 'home');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      setRole(existing.role);
      setPage(existing.role === 'admin' ? 'admin_dashboard' : 'home');
    } else if (email.includes('admin')) {
      handleQuickLogin('admin');
    } else {
      handleQuickLogin('buyer');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const newUser = registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim() || '+7 (900) 000-00-00',
    });

    setRegSuccess(true);
    setTimeout(() => {
      setPage('customer_dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-8 select-none">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          Atelier Access
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white">
          {authMode === 'login' ? 'Вход в аккаунт' : 'Создать аккаунт покупателя'}
        </h1>
        <p className="text-xs text-zinc-500">
          {authMode === 'login'
            ? 'Войдите или используйте быстрый вход для проверки ролей'
            : 'Заполните свои данные для создания персонального личного кабинета'}
        </p>
      </div>

      {/* Mode Switcher Tabs (Вход / Регистрация) */}
      <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            authMode === 'login'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          Вход (Sign In)
        </button>

        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            authMode === 'register'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
          }`}
        >
          Регистрация (Sign Up)
        </button>
      </div>

      {authMode === 'login' ? (
        <>
          {/* Quick 1-Click Role Switcher for testing */}
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Быстрый вход для тестирования ролей (RBAC)
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('buyer')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'buyer'
                    ? 'bg-white dark:bg-zinc-800 border-zinc-950 dark:border-white shadow-sm'
                    : 'bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                <Layers className="w-4 h-4 text-zinc-950 dark:text-white mb-1" />
                <div className="font-bold text-xs text-zinc-950 dark:text-white">Покупатель</div>
                <div className="text-[10px] text-zinc-500">Александр Р.</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'bg-white dark:bg-zinc-800 border-amber-500 shadow-sm'
                    : 'bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-500 mb-1" />
                <div className="font-bold text-xs text-amber-500">Администратор</div>
                <div className="text-[10px] text-zinc-500">Панель управления</div>
              </button>
            </div>
          </div>

          {/* Standard Credentials Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                Электронная почта
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                Пароль
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Войти в систему</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </>
      ) : (
        /* Registration Form */
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {regSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                Аккаунт успешно создан!
              </div>
              <p className="text-xs text-zinc-500">
                Перенаправляем в личный кабинет покупателя...
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Ваше имя и фамилия
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="напр. Азиз Рысбеков"
                    className="w-full py-2.5 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Электронная почта (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full py-2.5 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Номер телефона
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full py-2.5 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
                  Придумайте пароль
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="w-full py-2.5 pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Зарегистрироваться</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
};
