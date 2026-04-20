import { getCurrentUser } from './storage.js';
import { getUserActions } from './data.js';

export const updateUIForAuth = () => {
  const user = getCurrentUser();
  const avatarBtn = document.getElementById('avatarBtn');
  const greeting = document.getElementById('greeting');
  const modulesCount = document.getElementById('modulesCount');
  const kgRecycled = document.getElementById('kgRecycled');

  if (user) {
    avatarBtn.textContent = user.fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    greeting.textContent = `Привет, ${user.fullName.split(' ')[0]}`;
    const actions = getUserActions(user.username);
    const totalKg = actions.reduce((sum, a) => sum + (a.amount || 0), 0);
    kgRecycled.textContent = totalKg.toFixed(1);
    modulesCount.textContent = '3';
  } else {
    avatarBtn.textContent = 'ВХ';
    greeting.textContent = 'Привет, Гость';
    modulesCount.textContent = '0';
    kgRecycled.textContent = '0';
  }
};

export const updateProfileModal = () => {
  const user = getCurrentUser();
  if (!user) return;
  document.getElementById('profileName').textContent = user.fullName;
  document.getElementById('profileLogin').textContent = user.username;
  const actions = getUserActions(user.username);
  const totalKg = actions.reduce((sum, a) => sum + (a.amount || 0), 0);
  document.getElementById('profileKg').textContent = totalKg.toFixed(1);
  const historyDiv = document.getElementById('actionHistory');
  historyDiv.innerHTML = actions.slice(0,5).map(a => 
    `<div>${new Date(a.createdAt).toLocaleDateString()}: ${a.type} ${a.amount} кг</div>`
  ).join('') || 'Нет действий';
};