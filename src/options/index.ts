import './index.css';
import van from 'vanjs-core';

const { iframe } = van.tags;

const formContent = iframe({
  src: 'http://localhost:9011/oauth2/authorize?client_id=f95db56d-2e57-4f38-ae10-929700c3d925&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth',
});
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.appendChild(formContent);
});
