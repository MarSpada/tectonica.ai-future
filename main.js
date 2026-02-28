/* ═══════════════════════════════════════════
   TAI Future — Movement Intelligence Prototype
   ═══════════════════════════════════════════ */

// ─── Hide broken avatar images (graceful fallback to colored circle) ───
document.querySelectorAll('.bot-card__avatar').forEach(img => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
});

// ─── GSAP Defaults ───
gsap.defaults({ ease: 'power2.out', duration: 0.4 });

// ─── Entrance animations (run once on load) ───
function playEntranceAnimations() {
  gsap.from('.bot-card', {
    y: 30, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', clearProps: 'all'
  });
  gsap.from('.category__header', {
    x: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', clearProps: 'all'
  });
  gsap.from('.widget', {
    x: 20, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'power3.out', clearProps: 'all'
  });
  gsap.from('.main__title', {
    y: -15, opacity: 0, duration: 0.6, ease: 'power3.out', clearProps: 'all'
  });
}

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => playEntranceAnimations());
});

// ─── View transition helpers ───
function animateViewIn(viewEl) {
  if (!viewEl) return;
  gsap.fromTo(viewEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'y' });
}

function animateCardsIn(selector) {
  const cards = document.querySelectorAll(selector);
  if (cards.length === 0) return;
  gsap.fromTo(cards, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: 'power3.out', clearProps: 'all' });
}

function animateMessagesIn(selector) {
  const msgs = document.querySelectorAll(selector);
  if (msgs.length === 0) return;
  gsap.fromTo(msgs, { y: 15, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.35, ease: 'power2.out', clearProps: 'all' });
}

// ─── Close all special views ───
function closeAllViews() {
  document.body.classList.remove('chat-mode', 'coach-mode', 'editor-open');
  document.getElementById('bot-chat').style.display = 'none';
  document.getElementById('coach-view').style.display = 'none';
}

function returnToDashboard() {
  closeAllViews();
  currentBotName = null;
  conversationHistory = [];
  document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
  document.querySelector('.sidebar__nav-item')?.classList.add('sidebar__nav-item--active');
  gsap.from('.bot-card', { y: 20, opacity: 0, duration: 0.35, stagger: 0.025, ease: 'power2.out', clearProps: 'all' });
}

// ═══════════════════════════════════════════
// SIDEBAR COLLAPSE
// ═══════════════════════════════════════════

const sidebarCollapse = document.getElementById('sidebar-collapse');
if (sidebarCollapse) {
  sidebarCollapse.addEventListener('click', () => {
    // On small screens, toggle overlay instead
    if (window.innerWidth < 800) {
      document.body.classList.toggle('sidebar-open');
    } else {
      document.body.classList.toggle('sidebar-collapsed');
    }
  });
}

// Close overlay sidebar when clicking backdrop (small screens)
document.addEventListener('click', e => {
  if (window.innerWidth < 800 && document.body.classList.contains('sidebar-open')) {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar.contains(e.target)) {
      document.body.classList.remove('sidebar-open');
    }
  }
});

// ─── Sidebar nav active state ───
document.querySelectorAll('.sidebar__nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
    item.classList.add('sidebar__nav-item--active');
  });
});

// ─── Sidebar section toggles (Projects / Chats) ───
document.querySelectorAll('.sidebar__section-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.dataset.section;
    const list = document.getElementById(`${section}-list`);
    const isCollapsed = list.classList.toggle('sidebar__section-list--collapsed');
    btn.classList.toggle('sidebar__section-toggle--open', !isCollapsed);
    const svg = btn.querySelector('svg');
    if (isCollapsed) {
      svg.innerHTML = '<polyline points="9 18 15 12 9 6"/>';
    } else {
      svg.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
      gsap.from(list.querySelectorAll('li'), { x: -10, opacity: 0, stagger: 0.04, duration: 0.25, ease: 'power2.out', clearProps: 'all' });
    }
  });
});

// ─── Chat item active state ───
document.querySelectorAll('.sidebar__chat-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.sidebar__chat-item--active')?.classList.remove('sidebar__chat-item--active');
    item.classList.add('sidebar__chat-item--active');
  });
});

// ─── Chat panel toggle (floating button + close) ───
const floatingChatBtn = document.getElementById('floating-chat-btn');
const chatPanelClose = document.getElementById('chat-panel-close');
if (floatingChatBtn) {
  floatingChatBtn.addEventListener('click', () => document.body.classList.add('chat-open'));
}
if (chatPanelClose) {
  chatPanelClose.addEventListener('click', () => document.body.classList.remove('chat-open'));
}

// ─── Group Message overlay toggle ───
const groupMsgBtn = document.getElementById('group-msg-btn');
const groupMsgClose = document.getElementById('group-msg-close');
if (groupMsgBtn) {
  groupMsgBtn.addEventListener('click', () => document.body.classList.add('group-chat-open'));
}
if (groupMsgClose) {
  groupMsgClose.addEventListener('click', () => document.body.classList.remove('group-chat-open'));
}

// ═══════════════════════════════════════════
// BOT SYSTEM PROMPTS
// ═══════════════════════════════════════════

const BOT_PROMPTS = {
  'Graphic Creation Bot': 'You are the Graphic Creation Bot for Tectonica.AI\'s Movement Intelligence platform. You help organizers design graphics, social media cards, posters, and visual assets aligned with their campaign identity. Ask about their brand guidelines, target audience, and the message they want to convey. Suggest layouts, color schemes, and imagery.',
  'Find a Place to Organize': 'You are the Find a Place to Organize Bot. You help organizers discover venues, community spaces, and locations ideal for meetings, rallies, canvassing kickoffs, and events. Ask about location preferences, capacity needs, accessibility requirements, and budget.',
  'Tech Assessment Bot': 'You are the Tech Assessment Bot. You help organizers evaluate their tech stack, identify gaps, and get recommendations for campaign tools. Ask about their current tools, team size, budget, and goals.',
  'Group Placement Bot': 'You are the Group Placement Bot (CRM-connected). You help match volunteers to the right teams and working groups based on their skills, interests, availability, and location. Ask about the volunteer\'s background and what they\'re passionate about.',
  'Creating People Power': 'You are the Creating People Power knowledge center bot. You provide organising knowledge, training materials, and best practices for building people power. Draw from community organizing traditions and help users understand power mapping, relational organizing, and movement building.',
  'Field / Canvassing Bot': 'You are the Field / Canvassing Bot. You help plan door-to-door routes, manage walk lists, and log canvass results. Ask about the area, voter file data, talking points, and canvasser experience level.',
  'Relational Organizing Bot': 'You are the Relational Organizing Bot. You help leverage personal networks to recruit, persuade, and mobilise through trusted relationships. Help users map their networks and create outreach plans.',
  'Events Management Bot': 'You are the Events Management Bot. You help create events, send invites, track RSVPs, and manage day-of logistics. Ask about the type of event, expected turnout, venue, and timeline.',
  'Relationship / Contacts Mng Bot': 'You are the Relationship / Contacts Management Bot. You help organizers manage their contact databases, track interactions, and maintain relationships with supporters, volunteers, and coalition partners.',
  'Local Strategy & Tactics Bot': 'You are the Local Strategy & Tactics Bot. You help develop local campaign strategies, identify key targets, and plan tactical actions. Ask about the community context, issues, and political landscape.',
  'Video Content Bot': 'You are the Video Content Bot. You help create compelling video content for campaigns — from scripts and storyboards to editing suggestions and distribution strategies.',
  'Campaign & Local Microsites': 'You are the Campaign & Local Microsites Bot. You help create and manage campaign websites and local landing pages. Ask about the campaign message, target audience, and call to action.',
  'Distributed Ads Bot': 'You are the Distributed Ads Bot. You help create, review, and distribute advertising content across platforms. Help with ad copy, targeting, budget allocation, and performance tracking.',
  'Tech Tools Use Bot': 'You are the Tech Tools Use Bot. You help organizers learn and effectively use technology tools for their campaigns. Provide tutorials, tips, and troubleshooting for common organizing tools.',
  'Content Writing Bot': 'You are the Content Writing Bot. You help write compelling campaign content — emails, social media posts, press releases, speeches, and talking points. Match the voice and tone of the organization.',
  'Recruitment Bot': 'You are the Recruitment Bot. You help recruit new volunteers, members, and supporters. Develop recruitment pitches, follow-up sequences, and onboarding materials.',
  'Distributed Fundraising Bot': 'You are the Distributed Fundraising Bot. You help plan and execute distributed fundraising campaigns. Create fundraising pages, email appeals, and track progress toward goals.',
  'Targeted Advocacy Bot': 'You are the Targeted Advocacy Bot. You help plan and execute targeted advocacy campaigns — identifying decision-makers, crafting messages, and coordinating constituent pressure.',
  'Scoreboard': 'You are the Scoreboard Bot. You help track and visualize campaign metrics — funds raised, people mobilized, actions taken, and engagement rates. Help set benchmarks and celebrate wins.',
  'Networks, Resources & Orgs': 'You are the Networks, Resources & Orgs Bot. You help identify and connect with allied organizations, shared resources, and coalition networks.',
  'Data Analysis': 'You are the Data Analysis Bot. You help analyze campaign data — voter files, survey results, engagement metrics — to find insights and inform strategy.',
  'Roles, Permissions & Assignments': 'You are the Roles, Permissions & Assignments Bot. You help manage team structure, assign roles, set permissions, and track task completion across the organization.',
  'Tracking & Analytics Dashboards': 'You are the Tracking & Analytics Dashboards Bot. You help set up and interpret analytics dashboards for campaign tracking, benchmarking, and reporting.',
  'Membership Activity Systems': 'You are the Membership Activity Systems Bot. You help manage membership records, track activity levels, and identify engagement opportunities.',
  'Decision-Making Environments': 'You are the Decision-Making Environments (ICAs) Bot. You help facilitate collaborative decision-making — from proposal development to consent-based voting and implementation tracking.'
};

const BOT_WELCOME = {
  default: (name) => `Hi Ned! I'm the **${name}**. How can I help you today?`
};

// ═══════════════════════════════════════════
// BOT CHAT HISTORY (mock data)
// ═══════════════════════════════════════════

const BOT_HISTORY = {
  'Graphic Creation Bot': [
    { title: 'Rally poster design', date: 'Today' },
    { title: 'Social media banner set', date: 'Yesterday' },
    { title: 'Email header graphic', date: '3 days ago' },
    { title: 'Flyer for town hall event', date: 'Last week' },
    { title: 'Instagram story templates', date: 'Feb 18' },
  ],
  'Find a Place to Organize': [
    { title: 'Community hall search — downtown', date: 'Today' },
    { title: 'Park permits for rally', date: '2 days ago' },
    { title: 'Accessible venue options', date: 'Last week' },
  ],
  'Tech Assessment Bot': [
    { title: 'CRM migration evaluation', date: 'Yesterday' },
    { title: 'Email platform comparison', date: '4 days ago' },
    { title: 'Data security audit', date: 'Feb 20' },
  ],
  'Field / Canvassing Bot': [
    { title: 'Ward 7 walk list prep', date: 'Today' },
    { title: 'Weekend canvass route plan', date: 'Yesterday' },
    { title: 'Voter outreach script review', date: '3 days ago' },
    { title: 'Canvasser training checklist', date: 'Last week' },
  ],
  'Relational Organizing Bot': [
    { title: 'Network mapping — Ned\'s contacts', date: 'Yesterday' },
    { title: 'Outreach sequence for allies', date: '5 days ago' },
    { title: 'Relational ask templates', date: 'Feb 15' },
  ],
  'Events Management Bot': [
    { title: 'Town hall logistics — March 5', date: 'Today' },
    { title: 'RSVP tracker setup', date: '2 days ago' },
    { title: 'Volunteer briefing agenda', date: 'Last week' },
    { title: 'Post-event survey draft', date: 'Feb 19' },
  ],
  'Video Content Bot': [
    { title: 'Campaign launch video script', date: 'Yesterday' },
    { title: 'Testimonial interview plan', date: '3 days ago' },
    { title: 'Social media clip edits', date: 'Last week' },
  ],
  'Content Writing Bot': [
    { title: 'Fundraising email draft', date: 'Today' },
    { title: 'Press release — policy win', date: 'Yesterday' },
    { title: 'Volunteer newsletter copy', date: '4 days ago' },
    { title: 'Op-ed on housing crisis', date: 'Feb 21' },
  ],
  'Distributed Fundraising Bot': [
    { title: 'March fundraising drive plan', date: 'Today' },
    { title: 'Donor thank-you sequence', date: '2 days ago' },
    { title: 'Peer-to-peer page templates', date: 'Last week' },
  ],
  'Recruitment Bot': [
    { title: 'Spring volunteer drive plan', date: 'Yesterday' },
    { title: 'Onboarding flow for new members', date: '3 days ago' },
    { title: 'Recruitment pitch deck', date: 'Feb 22' },
  ],
  'Data Analysis': [
    { title: 'Voter turnout analysis — Ward 3', date: 'Today' },
    { title: 'Survey results breakdown', date: '2 days ago' },
    { title: 'Engagement trends Q1', date: 'Last week' },
  ],
};

const BOT_HISTORY_DEFAULT = [
  { title: 'Getting started', date: 'Today' },
  { title: 'Previous session', date: 'Last week' },
];

function populateChatHistory(botName) {
  const list = document.getElementById('bot-chat-history-list');
  if (!list) return;
  const items = BOT_HISTORY[botName] || BOT_HISTORY_DEFAULT;
  list.innerHTML = items.map((item, i) =>
    `<li class="bot-chat__history-item${i === 0 ? ' bot-chat__history-item--active' : ''}">
      <span class="bot-chat__history-title">${item.title}</span>
      <span class="bot-chat__history-date">${item.date}</span>
    </li>`
  ).join('');
}

// ═══════════════════════════════════════════
// OPENAI CHAT INTEGRATION
// ═══════════════════════════════════════════

let currentBotName = null;
let conversationHistory = [];
let isStreaming = false;

// Open bot chat for ANY bot card
function openBotChat(botName, imgSrc) {
  closeAllViews();
  currentBotName = botName;
  conversationHistory = [];

  // Reset nav
  document.querySelector('.sidebar__nav-item--active')?.classList.remove('sidebar__nav-item--active');
  document.querySelector('.sidebar__nav-item')?.classList.add('sidebar__nav-item--active');

  // Update header
  document.querySelector('.bot-chat__header-title').textContent = botName;
  if (imgSrc) {
    const avatarEl = document.getElementById('bot-chat-avatar');
    if (avatarEl) { avatarEl.src = imgSrc; avatarEl.alt = botName; }
  }

  // Show Studio button only for Graphic Creation Bot
  const studioBtn = document.getElementById('editor-toggle');
  if (studioBtn) studioBtn.style.display = botName === 'Graphic Creation Bot' ? 'flex' : 'none';

  // Populate chat history sidebar
  populateChatHistory(botName);

  // Clear messages and add welcome
  const messagesEl = document.getElementById('chat-messages');
  messagesEl.innerHTML = '';
  appendBotMessage(BOT_WELCOME.default(botName));

  // Show chat
  document.body.classList.add('chat-mode');
  document.getElementById('bot-chat').style.display = 'flex';
  animateMessagesIn('.bot-chat__msg');
}

// Append a user message to the DOM
function appendUserMessage(text) {
  const messagesEl = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'bot-chat__msg bot-chat__msg--user';
  msgDiv.innerHTML = `
    <div class="bot-chat__msg-content">
      <p>${escapeHtml(text)}</p>
      <span class="bot-chat__msg-time">${formatTime()}</span>
    </div>
    <img src="images/Nd.jpeg" alt="Ned" class="bot-chat__msg-avatar bot-chat__msg-avatar--user">
  `;
  messagesEl.appendChild(msgDiv);
  scrollToBottom();
}

// Append a bot message to the DOM (returns the <p> element for streaming)
function appendBotMessage(text) {
  const messagesEl = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'bot-chat__msg bot-chat__msg--bot';
  msgDiv.innerHTML = `
    <div class="bot-chat__msg-avatar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </div>
    <div class="bot-chat__msg-content">
      <span class="bot-chat__msg-name">${escapeHtml(currentBotName || 'Bot')}</span>
      <div class="bot-chat__msg-text">${renderMarkdown(text)}</div>
      <span class="bot-chat__msg-time">${formatTime()}</span>
    </div>
  `;
  messagesEl.appendChild(msgDiv);
  scrollToBottom();
  return msgDiv.querySelector('.bot-chat__msg-text');
}

// Show typing indicator
function showTyping() {
  const messagesEl = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'bot-chat__msg bot-chat__msg--bot bot-chat__msg--typing';
  typing.innerHTML = `
    <div class="bot-chat__msg-avatar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </div>
    <div class="bot-chat__msg-content">
      <div class="bot-chat__typing">
        <div class="bot-chat__typing-dot"></div>
        <div class="bot-chat__typing-dot"></div>
        <div class="bot-chat__typing-dot"></div>
      </div>
    </div>
  `;
  messagesEl.appendChild(typing);
  scrollToBottom();
  return typing;
}

function removeTyping() {
  document.querySelector('.bot-chat__msg--typing')?.remove();
}

// Send message to OpenAI via our proxy
async function sendMessage(userText) {
  if (isStreaming || !userText.trim()) return;
  isStreaming = true;

  appendUserMessage(userText);
  conversationHistory.push({ role: 'user', content: userText });

  const typingEl = showTyping();

  try {
    const systemPrompt = BOT_PROMPTS[currentBotName] || `You are ${currentBotName}, an AI assistant for the Tectonica.AI Movement Intelligence platform. Help the user with their request.`;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt + '\n\nYou are talking to Ned Howey, an organizer at People\'s Movement. Keep responses concise, helpful, and action-oriented. Use markdown formatting when helpful.' },
          ...conversationHistory
        ]
      })
    });

    removeTyping();

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      appendBotMessage(`⚠️ Sorry, I encountered an error. ${err.error || 'Please try again.'}`);
      isStreaming = false;
      return;
    }

    // Stream the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let botText = '';
    const textEl = appendBotMessage('');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              botText += content;
              textEl.innerHTML = renderMarkdown(botText);
              scrollToBottom();
            }
          } catch (e) { /* skip malformed chunks */ }
        }
      }
    }

    conversationHistory.push({ role: 'assistant', content: botText });

  } catch (err) {
    removeTyping();
    appendBotMessage('⚠️ Network error. Please check your connection and try again.');
    console.error('[MI] Chat error:', err);
  }

  isStreaming = false;
}

// ─── Helpers ───
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderMarkdown(text) {
  // Simple markdown: bold, italic, code, line breaks
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
  const el = document.getElementById('chat-messages');
  el.scrollTop = el.scrollHeight;
}

// ═══════════════════════════════════════════
// BOT CARD CLICK — OPEN CHAT FOR ANY BOT
// ═══════════════════════════════════════════

document.querySelectorAll('.bot-card').forEach(card => {
  card.addEventListener('click', () => {
    const title = card.querySelector('.bot-card__title')?.textContent;
    if (title) openBotChat(title, null);
  });
});

// ─── Chat input handler ───
const chatInput = document.querySelector('.bot-chat__input');
const chatSend = document.querySelector('.bot-chat__send');

if (chatInput && chatSend) {
  chatSend.addEventListener('click', () => {
    sendMessage(chatInput.value);
    chatInput.value = '';
  });

  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
      chatInput.value = '';
    }
  });
}

// ─── Back buttons ───
const chatBack = document.getElementById('chat-back');
if (chatBack) chatBack.addEventListener('click', () => returnToDashboard());

const coachBack = document.getElementById('coach-back');
if (coachBack) coachBack.addEventListener('click', () => returnToDashboard());

// ─── Nav view handlers ───
const coachNav = document.getElementById('nav-coach');
if (coachNav) {
  coachNav.addEventListener('click', e => {
    e.preventDefault();
    closeAllViews();
    document.body.classList.add('coach-mode');
    document.getElementById('coach-view').style.display = 'flex';
    animateMessagesIn('.coach__msg');
  });
}

// ─── Other nav items — return to dashboard ───
document.querySelectorAll('.sidebar__nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (item.id === 'nav-coach') return;
    closeAllViews();
    gsap.from('.bot-card', { y: 20, opacity: 0, duration: 0.35, stagger: 0.025, ease: 'power2.out', clearProps: 'all' });
  });
});

// ─── Image editor toggle ───
const editorToggle = document.getElementById('editor-toggle');
const editorClose = document.getElementById('editor-close');
if (editorToggle) editorToggle.addEventListener('click', () => document.body.classList.toggle('editor-open'));
if (editorClose) editorClose.addEventListener('click', () => document.body.classList.remove('editor-open'));

// ═══════════════════════════════════════════
// DRAG-TO-FAVORITES + CAROUSEL
// ═══════════════════════════════════════════

(function initDragAndCarousel() {
  if (typeof Sortable === 'undefined') return;

  const featuredContainer = document.querySelector('.category--featured');
  const featuredCards = featuredContainer?.querySelector('.category__cards');
  const btnLeft = document.getElementById('carousel-left');
  const btnRight = document.getElementById('carousel-right');
  if (!featuredCards) return;

  // ─── Helpers ───

  /** Get the names of all bots currently in the featured section */
  function getFeaturedBotNames() {
    return [...featuredCards.querySelectorAll('.bot-card__title')].map(t => t.textContent.trim());
  }

  /** Scroll amount = one card width + gap */
  function getScrollStep() {
    const card = featuredCards.querySelector('.bot-card');
    return card ? card.offsetWidth + 14 : 144;
  }

  // ─── Carousel arrow logic ───
  function updateCarouselArrows() {
    if (!featuredCards || !btnLeft || !btnRight) return;
    const { scrollLeft, scrollWidth, clientWidth } = featuredCards;
    const hasOverflow = scrollWidth > clientWidth + 2;
    btnLeft.classList.toggle('category__carousel-btn--visible', hasOverflow && scrollLeft > 4);
    btnRight.classList.toggle('category__carousel-btn--visible', hasOverflow && scrollLeft < scrollWidth - clientWidth - 4);
  }

  featuredCards.addEventListener('scroll', updateCarouselArrows);
  if (btnLeft) btnLeft.addEventListener('click', () => { featuredCards.scrollBy({ left: -getScrollStep(), behavior: 'smooth' }); });
  if (btnRight) btnRight.addEventListener('click', () => { featuredCards.scrollBy({ left: getScrollStep(), behavior: 'smooth' }); });

  // Observe resize to update arrows
  new ResizeObserver(updateCarouselArrows).observe(featuredCards);
  updateCarouselArrows();

  // ─── Add remove button to a featured card ───
  function addRemoveButton(card) {
    if (card.querySelector('.bot-card__remove')) return; // already has one
    const btn = document.createElement('button');
    btn.className = 'bot-card__remove';
    btn.title = 'Remove from Your Bots';
    btn.innerHTML = '×';
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // don't open bot chat
      gsap.to(card, {
        scale: 0.8, opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete() {
          card.remove();
          setTimeout(updateCarouselArrows, 50);
        }
      });
    });
    card.appendChild(btn);
  }

  // Add remove buttons to existing featured cards
  featuredCards.querySelectorAll('.bot-card').forEach(addRemoveButton);

  // ─── Attach bot-card click listener ───
  function attachCardClick(card) {
    card.addEventListener('click', () => {
      const title = card.querySelector('.bot-card__title')?.textContent;
      if (title) openBotChat(title, null);
    });
  }

  // ─── SortableJS: Featured section (receives cards) ───
  Sortable.create(featuredCards, {
    group: { name: 'bots', pull: true, put: true },
    animation: 200,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    sort: true,
    onAdd(evt) {
      const newName = evt.item.querySelector('.bot-card__title')?.textContent?.trim();
      // ─── Prevent duplicates ───
      const existing = getFeaturedBotNames();
      const dupeCount = existing.filter(n => n === newName).length;
      if (dupeCount > 1) {
        evt.item.remove();
        setTimeout(updateCarouselArrows, 50);
        return;
      }
      // ─── Detect source category and set data-category ───
      const srcCategory = evt.from.closest('.category');
      let cat = '';
      if (srcCategory?.classList.contains('category--orange')) cat = 'organizer';
      else if (srcCategory?.classList.contains('category--purple')) cat = 'content';
      else if (srcCategory?.classList.contains('category--green')) cat = 'fundraising';
      else if (srcCategory?.classList.contains('category--blue')) cat = 'admin';
      if (cat) evt.item.setAttribute('data-category', cat);
      // Add remove button + click handler
      addRemoveButton(evt.item);
      attachCardClick(evt.item);
      // Update carousel
      setTimeout(updateCarouselArrows, 50);
      // Animate the new card in
      gsap.from(evt.item, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' });
    },
    onRemove() {
      setTimeout(updateCarouselArrows, 50);
    },
    onSort() {
      setTimeout(updateCarouselArrows, 50);
    }
  });

  // ─── SortableJS: All other categories (source, clone mode) ───
  document.querySelectorAll('.category:not(.category--featured) .category__cards').forEach(grid => {
    Sortable.create(grid, {
      group: { name: 'bots', pull: 'clone', put: false },
      animation: 200,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      sort: false,
      // Highlight featured drop zone
      onStart() { featuredContainer?.classList.add('drag-over'); },
      onEnd() { featuredContainer?.classList.remove('drag-over'); },
    });
  });

  // ─── Star-to-favorite: add star buttons to non-featured cards ───
  function detectCategory(card) {
    const cat = card.closest('.category');
    if (cat?.classList.contains('category--orange')) return 'organizer';
    if (cat?.classList.contains('category--purple')) return 'content';
    if (cat?.classList.contains('category--green')) return 'fundraising';
    if (cat?.classList.contains('category--blue')) return 'admin';
    return '';
  }

  function addStarButton(card) {
    if (card.querySelector('.bot-card__star')) return;
    const btn = document.createElement('button');
    btn.className = 'bot-card__star';
    btn.title = 'Add to Your Bots';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const botName = card.querySelector('.bot-card__title')?.textContent?.trim();
      // Prevent duplicates
      if (getFeaturedBotNames().includes(botName)) return;
      // Clone the card
      const clone = card.cloneNode(true);
      // Set data-category
      const cat = detectCategory(card);
      if (cat) clone.setAttribute('data-category', cat);
      // Remove star from clone, add remove button
      clone.querySelector('.bot-card__star')?.remove();
      addRemoveButton(clone);
      attachCardClick(clone);
      // Add to featured
      featuredCards.appendChild(clone);
      setTimeout(updateCarouselArrows, 50);
      gsap.from(clone, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' });
      // Quick feedback on the star
      gsap.to(btn, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
    });
    card.appendChild(btn);
  }

  // Add stars to all non-featured cards
  document.querySelectorAll('.category:not(.category--featured) .bot-card').forEach(addStarButton);

})();

// ═══════════════════════════════════════════
// WIDGET RESIZE SYSTEM (iPhone-style)
// ═══════════════════════════════════════════

(function initWidgetResize() {
  const SIZE_CYCLE = ['small', 'medium', 'large'];
  const grid = document.querySelector('.right-sidebar__grid');
  if (!grid) return;

  // ─── Cycle widget size on handle click ───
  grid.addEventListener('click', function (e) {
    var handle = e.target.closest('.rs-widget__resize-handle');
    if (!handle) return;
    e.stopPropagation();

    var widget = handle.closest('.rs-widget');
    if (!widget || !widget.dataset.widgetSize) return;

    var allWidgets = Array.from(grid.querySelectorAll('.rs-widget'));

    // FLIP Step 1: Record "First" positions of ALL widgets
    var firstPositions = new Map();
    allWidgets.forEach(function (w) {
      firstPositions.set(w, w.getBoundingClientRect());
    });

    // Cycle size
    var currentSize = widget.dataset.widgetSize;
    var currentIndex = SIZE_CYCLE.indexOf(currentSize);
    var nextSize = SIZE_CYCLE[(currentIndex + 1) % SIZE_CYCLE.length];
    widget.dataset.widgetSize = nextSize;

    // FLIP Step 2: Animate from old positions to new
    allWidgets.forEach(function (w) {
      var first = firstPositions.get(w);
      var last = w.getBoundingClientRect();
      var dx = first.left - last.left;
      var dy = first.top - last.top;

      if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || w === widget) {
        gsap.fromTo(w,
          { x: dx, y: dy },
          { x: 0, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform' }
        );
      }
    });

    // Subtle scale pulse on the resized widget
    gsap.fromTo(widget, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'power2.out', clearProps: 'scale' });
  });

  // ─── Edit mode toggle ───
  var headline = document.querySelector('.right-sidebar__headline');
  if (headline) {
    var editBtn = document.createElement('button');
    editBtn.className = 'rs-edit-toggle';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', function () {
      var sidebar = document.querySelector('.right-sidebar');
      sidebar.classList.toggle('right-sidebar--editing');
      editBtn.textContent = sidebar.classList.contains('right-sidebar--editing') ? 'Done' : 'Edit';
    });
    headline.appendChild(editBtn);
  }
})();
