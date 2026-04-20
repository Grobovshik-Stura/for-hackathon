import { getCurrentUser } from './storage.js';
import { addUserAction } from './data.js';
import { updateUIForAuth, updateProfileModal } from './ui.js';

export const initActions = () => {
  const ecoActionModal = document.getElementById('ecoActionModal');
  const saveBtn = document.getElementById('saveEcoAction');
  const addBtn = document.getElementById('addEcoActionBtn');

  addBtn.addEventListener('click', () => {
    ecoActionModal.style.display = 'flex';
  });

  saveBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;
    const type = document.getElementById('wasteTypeSelect').value;
    const amount = parseFloat(document.getElementById('wasteAmount').value);
    if (isNaN(amount) || amount <= 0) return alert('Укажите корректное количество');
    addUserAction(user.username, { type, amount });
    updateUIForAuth();
    updateProfileModal();
    ecoActionModal.style.display = 'none';
  });
};