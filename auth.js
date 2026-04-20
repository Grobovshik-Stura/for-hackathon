import { usersDB } from './data.js';
import { getCurrentUser, setCurrentUser, clearCurrentUser } from './storage.js';
import { updateUIForAuth } from './ui.js';

export const initAuth = () => {
  const avatarBtn = document.getElementById('avatarBtn');
  const authModal = document.getElementById('authModal');
  const profileModal = document.getElementById('profileModal');
  const closeModals = document.querySelectorAll('.close-modal');
  const loginForm = document.getElementById('loginForm');
  const showRegister = document.getElementById('showRegister');
  const registerFormDiv = document.getElementById('registerForm');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const addEcoActionBtn = document.getElementById('addEcoActionBtn');

  // Открытие модалки входа
  avatarBtn.addEventListener('click', () => {
    if (getCurrentUser()) {
      openProfileModal();
    } else {
      authModal.style.display = 'flex';
    }
  });

  // Закрытие модалок
  closeModals.forEach(btn => btn.addEventListener('click', () => {
    authModal.style.display = 'none';
    profileModal.style.display = 'none';
    document.getElementById('ecoActionModal').style.display = 'none';
    document.getElementById('createPostModal').style.display = 'none';
  }));

  // Логин
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const user = usersDB.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser({ username: user.username, fullName: user.fullName });
      updateUIForAuth();
      authModal.style.display = 'none';
      loginForm.reset();
    } else {
      alert('Неверный логин или пароль');
    }
  });

  // Показать форму регистрации
  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    registerFormDiv.style.display = 'block';
  });

  // Регистрация (упрощённо: добавляем в мок-базу)
  registerBtn.addEventListener('click', () => {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const fullName = document.getElementById('regFullName').value.trim();
    if (!username || !password) return alert('Заполните поля');
    if (usersDB.find(u => u.username === username)) return alert('Пользователь уже существует');
    usersDB.push({ username, password, fullName });
    setCurrentUser({ username, fullName });
    updateUIForAuth();
    authModal.style.display = 'none';
    registerFormDiv.style.display = 'none';
  });

  // Выход
  logoutBtn.addEventListener('click', () => {
    clearCurrentUser();
    updateUIForAuth();
    profileModal.style.display = 'none';
  });

  // Открытие профиля
  window.openProfileModal = () => {
    const user = getCurrentUser();
    if (!user) return;
    document.getElementById('profileName').textContent = user.fullName;
    document.getElementById('profileLogin').textContent = user.username;
    // обновление истории и кг будет в actions.js
    profileModal.style.display = 'flex';
  };

  // Инициализация UI при загрузке
  updateUIForAuth();
};