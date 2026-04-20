import { initStorage } from './data.js';
import { initAuth } from './auth.js';
import { initMap, initFullMap } from './map.js';
import { initFeed, initPostCreation, renderFeed } from './feed.js';
import { initActions } from './actions.js';
import { initLearning, renderLesson } from './learning.js';
import { updateUIForAuth, updateProfileModal } from './ui.js';

initStorage();
initAuth();
initMap();
initFullMap();
initFeed('feedContainer');
initFeed('feedContainerFull');
initPostCreation();
initActions();
initLearning();

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

updateUIForAuth();

// Навигация по разделам
const sections = {
  home: document.getElementById('homeSection'),
  map: document.getElementById('mapSection'),
  learning: document.getElementById('learningSection'),
  feed: document.getElementById('feedSection')
};

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const section = item.dataset.section;
    Object.values(sections).forEach(s => s.style.display = 'none');
    sections[section].style.display = 'block';
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    if (section === 'map') {
      setTimeout(() => {
        if (window.fullMapInstance) window.fullMapInstance.container.fitToViewport();
      }, 100);
    }
    if (section === 'learning') {
      renderLesson();
    }
    if (section === 'feed') {
      renderFeed('feedContainerFull');
    }
  });
});

// CTA кнопки
document.getElementById('startLearningBtn').addEventListener('click', () => {
  document.querySelector('[data-section="learning"]').click();
});
document.getElementById('findPointBtn').addEventListener('click', () => {
  document.querySelector('[data-section="map"]').click();
});

// Закрытие модалок по клику вне
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Обновление профиля при открытии
const profileModal = document.getElementById('profileModal');
const observer2 = new MutationObserver(() => {
  if (profileModal.style.display === 'flex') {
    updateProfileModal();
  }
});
observer2.observe(profileModal, { attributes: true, attributeFilter: ['style'] });

