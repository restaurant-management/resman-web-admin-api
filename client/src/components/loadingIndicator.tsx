const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'mask';

const loader = document.createElement('div');
loader.id = 'loader';

loadingIndicator.appendChild(loader);

export { loadingIndicator as LoadingIndicator };
