const targets = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    return;
  }
  // replaces the initial compressed image with a higher res one
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    // removes blur effect when the image is replaced
    entry.target.classList.remove('lazy');
  });

  observer.unobserve(entry.target);
};

const observer = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

targets.forEach((img) => observer.observe(img));
