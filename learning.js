import { getCurrentUser } from './storage.js';

const lessons = [
  {
    id: 1,
    title: 'Раздельный сбор: основы',
    questions: [
      { q: 'Куда выбрасывать пластиковую бутылку?', options: ['В общий мусор', 'В контейнер для пластика', 'В контейнер для стекла'], correct: 1 },
      { q: 'Что можно сдать как макулатуру?', options: ['Газеты и журналы', 'Чеки из магазина', 'Использованные салфетки'], correct: 0 },
      { q: 'Какого цвета контейнер для стекла в Алматы?', options: ['Синий', 'Зелёный', 'Жёлтый'], correct: 1 }
    ]
  },
  {
    id: 2,
    title: 'Опасные отходы',
    questions: [
      { q: 'Куда сдавать батарейки?', options: ['В обычный мусор', 'В специальные пункты приёма', 'Сжигать'], correct: 1 },
      { q: 'Что относится к опасным отходам?', options: ['Пластик', 'Ртутные лампы', 'Бумага'], correct: 1 }
    ]
  }
];

let userProgress = JSON.parse(localStorage.getItem('learningProgress')) || { currentLesson: 1, answers: {} };

function isLessonComplete(lessonId) {
  const lesson = lessons.find(l => l.id === lessonId);
  return lesson.questions.every((_, idx) => userProgress.answers[`${lessonId}-${idx}`] !== undefined);
}

function updateLevelDisplay() {
  const level = Math.floor(userProgress.currentLesson / 2) + 1;
  document.getElementById('userLevel').textContent = level;
  document.getElementById('previewLevel').textContent = level;
  const progress = (userProgress.currentLesson - 1) / lessons.length * 100;
  document.getElementById('levelProgress').style.width = progress + '%';
}

export const renderLesson = () => {
  const container = document.getElementById('lessonContainer');
  if (!container) return;
  const user = getCurrentUser();
  const lessonId = userProgress.currentLesson;
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) {
    container.innerHTML = '<p>Вы прошли все уроки! Поздравляем!</p>';
    return;
  }

  let html = `<h3>${lesson.title}</h3>`;
  lesson.questions.forEach((q, idx) => {
    const answered = userProgress.answers[`${lessonId}-${idx}`];
    html += `<div class="quiz-item">
      <p>${q.q}</p>
      <div class="options">`;
    q.options.forEach((opt, optIdx) => {
      const isCorrect = optIdx === q.correct;
      const selected = answered === optIdx;
      html += `<button class="quiz-option ${selected ? (isCorrect ? 'correct' : 'incorrect') : ''}" data-lesson="${lessonId}" data-qidx="${idx}" data-opt="${optIdx}" ${answered !== undefined ? 'disabled' : ''}>${opt}</button>`;
    });
    html += `</div></div>`;
  });

  html += `<button id="nextLessonBtn" ${!isLessonComplete(lessonId) ? 'disabled' : ''}>Следующий урок</button>`;
  container.innerHTML = html;

  container.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const lessonId = parseInt(btn.dataset.lesson);
      const qIdx = parseInt(btn.dataset.qidx);
      const opt = parseInt(btn.dataset.opt);
      const key = `${lessonId}-${qIdx}`;
      userProgress.answers[key] = opt;
      localStorage.setItem('learningProgress', JSON.stringify(userProgress));
      renderLesson();
    });
  });

  const nextBtn = document.getElementById('nextLessonBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      userProgress.currentLesson++;
      localStorage.setItem('learningProgress', JSON.stringify(userProgress));
      renderLesson();
      updateLevelDisplay();
    });
  }

  updateLevelDisplay();
};

export const initLearning = () => {
  updateLevelDisplay();
};