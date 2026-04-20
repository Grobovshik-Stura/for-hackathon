// Мок-пользователи (база входа)
export const usersDB = [
  { username: 'Admin', password: 'admin', fullName: 'Администратор' },
  { username: 'BlyaApai', password: '123', fullName: 'Бля Апай' },
  { username: 'Fuki', password: '123', fullName: 'Фуки' }
];

// Инициализация хранилища
export const initStorage = () => {
  if (!localStorage.getItem('zhumantraxer_posts')) {
    localStorage.setItem('zhumantraxer_posts', JSON.stringify(defaultPosts));
  }
  if (!localStorage.getItem('zhumantraxer_actions')) {
    localStorage.setItem('zhumantraxer_actions', JSON.stringify({}));
  }
};

// Посты по умолчанию
const defaultPosts = [
  {
    id: '1',
    userId: 'Admin',
    content: 'Сдал 12 кг макулатуры в экоцентре на Юго-Западной. Отличное место, принимают даже чеки!',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    likes: ['Fuki'],
    authorName: 'Администратор'
  },
  {
    id: '2',
    userId: 'BlyaApai',
    content: 'Завтра субботник в парке Дружбы, присоединяйтесь! Сбор в 10:00 у главного входа 🌱',
    imageUrl: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: [],
    authorName: 'Бля Апай'
  }
];

// Экспорт функций работы с постами
export const getPosts = () => JSON.parse(localStorage.getItem('zhumantraxer_posts') || '[]');
export const savePosts = (posts) => localStorage.setItem('zhumantraxer_posts', JSON.stringify(posts));

export const getUserActions = (username) => {
  const all = JSON.parse(localStorage.getItem('zhumantraxer_actions') || '{}');
  return all[username] || [];
};
export const addUserAction = (username, action) => {
  const all = JSON.parse(localStorage.getItem('zhumantraxer_actions') || '{}');
  if (!all[username]) all[username] = [];
  all[username].push({ ...action, id: Date.now(), createdAt: new Date().toISOString() });
  localStorage.setItem('zhumantraxer_actions', JSON.stringify(all));
};

export const addComment = (postId, username, text) => {
  if (!text.trim()) return;

  const posts = JSON.parse(localStorage.getItem('zhumantraxer_posts') || '[]');

  const updated = posts.map(post => {
    if (post.id !== postId) return post;

    const comments = post.comments || [];

    return {
      ...post,
      comments: [
        ...comments,
        {
          id: Date.now(),
          user: username,
          text,
          createdAt: new Date().toISOString()
        }
      ]
    };
  });

  localStorage.setItem('zhumantraxer_posts', JSON.stringify(updated));
};