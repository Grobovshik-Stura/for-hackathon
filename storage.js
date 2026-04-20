export const getCurrentUser = () => {
  const data = localStorage.getItem('zhumantraxer_currentUser');
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('zhumantraxer_currentUser', JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem('zhumantraxer_currentUser');
};