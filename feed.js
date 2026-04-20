import { getCurrentUser } from './storage.js';
import { getPosts, savePosts, usersDB } from './data.js';

export function renderFeed(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const posts = getPosts();
  const user = getCurrentUser();
  container.innerHTML = posts.map(post => {
    const liked = user && post.likes.includes(user.username);
    return `
      <div class="feed-item" data-post-id="${post.id}">
        <div class="feed-header">
          <div class="feed-avatar">${post.authorName.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div>
            <span class="feed-name">${post.authorName}</span>
            ${post.userId === 'Admin' ? '<span class="feed-badge">Админ</span>' : ''}
          </div>
        </div>
        <p>${post.content}</p>
        <div class="feed-actions">
          <span class="action-btn like-btn" data-id="${post.id}">
            <i class="ph ph-heart" style="${liked ? 'color:#C8F06C;' : ''}"></i> ${post.likes.length}
          </span>
          <span class="action-btn"><i class="ph ph-chat-circle"></i>
            ${(post.comments || []).length}</span>
          <span class="action-btn share-btn" data-id="${post.id}">
            <i class="ph ph-share"></i></span>
        </div>
        <div class="comments">
          ${(post.comments || []).map(c => `
          <div class="comment">
            <b>${c.user}</b>: ${c.text}
          </div>
          `).join('')}
      </div>

      <div class="comment-box">
        <input class="comment-input" data-id="${post.id}" placeholder="Комментарий..." />
          <button class="comment-send" data-id="${post.id}">Отправить</button>
        </div>
      </div>
  `;
  }).join('');
}

export const initFeed = (containerId = 'feedContainer') => {
  const container = document.getElementById(containerId);
  if (!container) return;

  renderFeed(containerId);

  // Лайки
  container.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (!likeBtn) return;
    const user = getCurrentUser();
    if (!user) {
      alert('Войдите, чтобы ставить лайки');
      return;
    }
    const postId = likeBtn.dataset.id;
    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const likedIndex = post.likes.indexOf(user.username);
    if (likedIndex === -1) {
      post.likes.push(user.username);
    } else {
      post.likes.splice(likedIndex, 1);
    }
    savePosts(posts);
    renderFeed(containerId);
    if (containerId === 'feedContainer') {
      const fullContainer = document.getElementById('feedContainerFull');
      if (fullContainer) renderFeed('feedContainerFull');
    } else {
      renderFeed('feedContainer');
    }
  });

  container.addEventListener('click', (e) => {
  const btn = e.target.closest('.comment-send');
  if (!btn) return;

  const user = getCurrentUser();
  if (!user) {
    alert('Войдите');
    return;
  }

  const postId = btn.dataset.id;
  const input = container.querySelector(`.comment-input[data-id="${postId}"]`);

  addComment(postId, user.username, input.value);

  input.value = '';
  renderFeed(container.id);
  });

  container.addEventListener('click', async (e) => {
  const btn = e.target.closest('.share-btn');
  if (!btn) return;

  const postId = btn.dataset.id;
  const user = getCurrentUser();
  if (!user) return;

  const link = `${window.location.origin}${window.location.pathname}#post-${postId}`;

  try {
    await navigator.clipboard.writeText(link);
    alert('Ссылка скопирована');
  } catch {
    alert('Не удалось скопировать');
  }
});

};



// Инициализация кнопок создания поста
export const initPostCreation = () => {
  const createPostModal = document.getElementById('createPostModal');
  const publishBtn = document.getElementById('publishPostBtn');
  const postContent = document.getElementById('postContent');

  const openModal = () => {
    const user = getCurrentUser();
    if (!user) {
      alert('Войдите, чтобы писать посты');
      return;
    }
    createPostModal.style.display = 'flex';
  };

  document.getElementById('newPostBtn').addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
  document.getElementById('newPostBtnFull').addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  publishBtn.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;
    const content = postContent.value.trim();
    if (!content) return;
    const posts = getPosts();
    const newPost = {
      id: Date.now().toString(),
      userId: user.username,
      content,
      imageUrl: null,
      createdAt: new Date().toISOString(),
      likes: [],
      authorName: user.fullName
    };
    posts.unshift(newPost);
    savePosts(posts);
    renderFeed('feedContainer');
    renderFeed('feedContainerFull');
    createPostModal.style.display = 'none';
    postContent.value = '';
  });
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