// تغییر حالت نمایش
const viewButtons = document.querySelectorAll('.view-btn');
const cardsContainer = document.getElementById('cards-container');

viewButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    viewButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.view === 'list') {
      cardsContainer.classList.add('list-view');
    } else {
      cardsContainer.classList.remove('list-view');
    }
  });
});

// مرتب‌سازی
const sortButtons = document.querySelectorAll('.sort-btn');
sortButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sortButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// دکمه مقایسه
document.querySelectorAll('.compare-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      btn.textContent = '＋';
      btn.style.background = '';
      btn.style.color = '';
    } else {
      btn.classList.add('active');
      btn.textContent = '✓';
      btn.style.background = '#d97706';
      btn.style.color = 'white';
    }
  });
});