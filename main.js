/* ═══════════════════════════════════════════
   TAI Future — Movement Intelligence Prototype
   ═══════════════════════════════════════════ */

// Sidebar nav active state
document.querySelectorAll('.sidebar__nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
    item.classList.add('sidebar__nav-item--active');
  });
});

// Sidebar section toggles (Projects / Chats)
document.querySelectorAll('.sidebar__section-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.section;
    const list = document.getElementById(`${section}-list`);
    const isCollapsed = list.classList.toggle('sidebar__section-list--collapsed');
    btn.classList.toggle('sidebar__section-toggle--open', !isCollapsed);
    // Swap chevron direction
    const svg = btn.querySelector('svg');
    if (isCollapsed) {
      svg.innerHTML = '<polyline points="9 18 15 12 9 6"/>';
    } else {
      svg.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
    }
  });
});

// Chat item active state
document.querySelectorAll('.sidebar__chat-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.sidebar__chat-item--active')?.classList.remove('sidebar__chat-item--active');
    item.classList.add('sidebar__chat-item--active');
  });
});

// "More" link in right sidebar → activate Scoreboard nav
const scoreboardLink = document.getElementById('scoreboard-link');
if (scoreboardLink) {
  scoreboardLink.addEventListener('click', e => {
    e.preventDefault();
    const scoreNav = document.getElementById('nav-scoreboard');
    if (scoreNav) {
      document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
      scoreNav.classList.add('sidebar__nav-item--active');
    }
  });
}

// Chat panel toggle
const chatPanelToggle = document.getElementById('chat-panel-toggle');
const chatPanelClose = document.getElementById('chat-panel-close');
if (chatPanelToggle) {
  chatPanelToggle.addEventListener('click', () => {
    document.body.classList.toggle('chat-open');
  });
}
if (chatPanelClose) {
  chatPanelClose.addEventListener('click', () => {
    document.body.classList.remove('chat-open');
  });
}

// Bot card click — open chat for Visual Creation Bot, log others
document.querySelectorAll('.bot-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('.bot-card__title')?.textContent;
    if (title === 'Visual Creation Bot') {
      document.body.classList.add('chat-mode');
      document.getElementById('bot-chat').style.display = 'flex';
    } else {
      console.log(`[MI] Opened: ${title}`);
    }
  });
});

// Back button — return to dashboard
const chatBack = document.getElementById('chat-back');
if (chatBack) {
  chatBack.addEventListener('click', () => {
    document.body.classList.remove('chat-mode');
    document.getElementById('bot-chat').style.display = 'none';
  });
}

// Coach back button — return to dashboard
const coachBack = document.getElementById('coach-back');
if (coachBack) {
  coachBack.addEventListener('click', () => {
    document.body.classList.remove('coach-mode');
    document.getElementById('coach-view').style.display = 'none';
  });
}

// AI Campaign Coach nav — open coach view
const coachNav = document.getElementById('nav-coach');
if (coachNav) {
  coachNav.addEventListener('click', e => {
    e.preventDefault();
    // Close bot chat if open
    document.body.classList.remove('chat-mode');
    document.getElementById('bot-chat').style.display = 'none';
    // Open coach
    document.body.classList.add('coach-mode');
    document.getElementById('coach-view').style.display = 'flex';
  });
}

// Other nav items — go back to dashboard (skip coach nav which has its own handler)
document.querySelectorAll('.sidebar__nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (item.id === 'nav-coach') return;
    if (document.body.classList.contains('chat-mode')) {
      document.body.classList.remove('chat-mode');
      document.getElementById('bot-chat').style.display = 'none';
    }
    if (document.body.classList.contains('coach-mode')) {
      document.body.classList.remove('coach-mode');
      document.getElementById('coach-view').style.display = 'none';
    }
  });
});
