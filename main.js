/* ═══════════════════════════════════════════
   TAI Future — Movement Intelligence Prototype
   ═══════════════════════════════════════════ */

// Helper: close all special views
function closeAllViews() {
  document.body.classList.remove('chat-mode', 'coach-mode', 'scoreboard-mode', 'decisions-mode');
  document.getElementById('bot-chat').style.display = 'none';
  document.getElementById('coach-view').style.display = 'none';
  document.getElementById('scoreboard-view').style.display = 'none';
  document.getElementById('decisions-view').style.display = 'none';
}

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

// "More" link in right sidebar → open Scoreboard view
const scoreboardLink = document.getElementById('scoreboard-link');
if (scoreboardLink) {
  scoreboardLink.addEventListener('click', e => {
    e.preventDefault();
    closeAllViews();
    const scoreNav = document.getElementById('nav-scoreboard');
    if (scoreNav) {
      document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
      scoreNav.classList.add('sidebar__nav-item--active');
    }
    document.body.classList.add('scoreboard-mode');
    document.getElementById('scoreboard-view').style.display = 'flex';
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
      closeAllViews();
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
    closeAllViews();
  });
}

// Coach back button — return to dashboard
const coachBack = document.getElementById('coach-back');
if (coachBack) {
  coachBack.addEventListener('click', () => {
    closeAllViews();
  });
}

// Scoreboard back button — return to dashboard
const scoreboardBack = document.getElementById('scoreboard-back');
if (scoreboardBack) {
  scoreboardBack.addEventListener('click', () => {
    closeAllViews();
    // Re-activate Action Center nav
    document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
    document.querySelector('.sidebar__nav-item')?.classList.add('sidebar__nav-item--active');
  });
}

// Decisions back button — return to dashboard
const decisionsBack = document.getElementById('decisions-back');
if (decisionsBack) {
  decisionsBack.addEventListener('click', () => {
    closeAllViews();
    document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
    document.querySelector('.sidebar__nav-item')?.classList.add('sidebar__nav-item--active');
  });
}

// AI Campaign Coach nav — open coach view
const coachNav = document.getElementById('nav-coach');
if (coachNav) {
  coachNav.addEventListener('click', e => {
    e.preventDefault();
    closeAllViews();
    document.body.classList.add('coach-mode');
    document.getElementById('coach-view').style.display = 'flex';
  });
}

// Scoreboard nav — open scoreboard view
const scoreboardNav = document.getElementById('nav-scoreboard');
if (scoreboardNav) {
  scoreboardNav.addEventListener('click', e => {
    e.preventDefault();
    closeAllViews();
    document.body.classList.add('scoreboard-mode');
    document.getElementById('scoreboard-view').style.display = 'flex';
  });
}

// Decision Making Tools nav — open decisions view
const decisionsNav = document.getElementById('nav-decisions');
if (decisionsNav) {
  decisionsNav.addEventListener('click', e => {
    e.preventDefault();
    closeAllViews();
    document.body.classList.add('decisions-mode');
    document.getElementById('decisions-view').style.display = 'flex';
  });
}

// Other nav items — go back to dashboard (skip items with their own handlers)
document.querySelectorAll('.sidebar__nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (['nav-coach', 'nav-scoreboard', 'nav-decisions'].includes(item.id)) return;
    closeAllViews();
  });
});
