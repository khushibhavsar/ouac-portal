/* =============================================
   OUAC PORTAL — app.js
   Navigation, Program Explorer, Builder,
   AI Assistant, and Interactions
============================================= */

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();          // Render all Lucide icons
  initNavigation();              // Page routing
  initProgramExplorer();         // Load & filter programs
  initBuilderNav();              // Builder step buttons
  initAIPanel();                 // AI assistant logic
  initMobileSidebar();           // Responsive sidebar
  animateProgressBar();          // Animate dashboard progress bar
});

/* =============================================
   NAVIGATION — switch between pages
============================================= */
function initNavigation() {
  const navItems   = document.querySelectorAll('[data-page]');
  const pages      = document.querySelectorAll('.page');
  const topbarTitle = document.getElementById('topbar-title');

  const pageTitles = {
    dashboard: 'Dashboard',
    explorer:  'Program Explorer',
    builder:   'Application Builder',
    tracker:   'Application Tracker',
  };

  function navigateTo(pageId) {
    // Hide all pages
    pages.forEach(p => p.classList.remove('active'));
    // Show target page
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('active');

    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`[data-page="${pageId}"]`).forEach(el => {
      if (el.classList.contains('nav-item')) el.classList.add('active');
    });

    // Update topbar title
    if (topbarTitle && pageTitles[pageId]) {
      topbarTitle.textContent = pageTitles[pageId];
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
  }

  // Attach click handlers to all [data-page] elements
  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const page = item.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });

  // AI toggle nav item
  document.getElementById('ai-toggle')?.addEventListener('click', e => {
    e.preventDefault();
    openAIPanel();
  });

  // Quick AI button on dashboard
  document.getElementById('ai-quick')?.addEventListener('click', openAIPanel);
}

/* =============================================
   PROGRAM EXPLORER
   Sample data + search/filter logic
============================================= */

// Sample program dataset
const PROGRAMS = [
  {
    id: 1, name: 'Computer Science', uni: 'University of Toronto', code: 'UT',
    color: '#003fa3', textColor: '#fff',
    type: 'Computer Science', coop: false, campus: 'St. George',
    avg: '87–92%', enrollment: 1200, deadline: 'Jan 15'
  },
  {
    id: 2, name: 'Software Engineering', uni: 'University of Waterloo', code: 'UW',
    color: '#ffd700', textColor: '#333',
    type: 'Engineering', coop: true, campus: 'Main',
    avg: '90–95%', enrollment: 450, deadline: 'Jan 15'
  },
  {
    id: 3, name: 'Computer Science', uni: 'University of Waterloo', code: 'UW',
    color: '#ffd700', textColor: '#333',
    type: 'Computer Science', coop: true, campus: 'Main',
    avg: '90–95%', enrollment: 600, deadline: 'Jan 15'
  },
  {
    id: 4, name: 'Engineering Science', uni: 'University of Toronto', code: 'UT',
    color: '#003fa3', textColor: '#fff',
    type: 'Engineering', coop: false, campus: 'St. George',
    avg: '90–95%', enrollment: 300, deadline: 'Jan 15'
  },
  {
    id: 5, name: 'Computer Science', uni: 'McMaster University', code: 'MC',
    color: '#7a003c', textColor: '#fff',
    type: 'Computer Science', coop: true, campus: 'Hamilton',
    avg: '80–87%', enrollment: 400, deadline: 'Jan 15'
  },
  {
    id: 6, name: 'Business Administration', uni: 'Western University', code: 'UW',
    color: '#4f2683', textColor: '#fff',
    type: 'Business', coop: false, campus: 'London',
    avg: '80–87%', enrollment: 1400, deadline: 'Jan 15'
  },
  {
    id: 7, name: 'Life Sciences', uni: "Queen's University", code: 'QU',
    color: '#002452', textColor: '#fff',
    type: 'Health Sciences', coop: false, campus: 'Kingston',
    avg: '85–92%', enrollment: 500, deadline: 'Jan 15'
  },
  {
    id: 8, name: 'Computer Science', uni: 'York University', code: 'YU',
    color: '#c00', textColor: '#fff',
    type: 'Computer Science', coop: false, campus: 'Keele',
    avg: '75–82%', enrollment: 700, deadline: 'Jan 15'
  },
  {
    id: 9, name: 'Data Science', uni: 'Toronto Metropolitan University', code: 'TM',
    color: '#003da5', textColor: '#fff',
    type: 'Computer Science', coop: true, campus: 'Downtown Toronto',
    avg: '78–85%', enrollment: 350, deadline: 'Jan 15'
  },
  {
    id: 10, name: 'Mechanical Engineering', uni: 'University of Waterloo', code: 'UW',
    color: '#ffd700', textColor: '#333',
    type: 'Engineering', coop: true, campus: 'Main',
    avg: '87–92%', enrollment: 400, deadline: 'Jan 15'
  },
  {
    id: 11, name: 'Commerce', uni: 'University of Toronto', code: 'UT',
    color: '#003fa3', textColor: '#fff',
    type: 'Business', coop: false, campus: 'Rotman',
    avg: '84–90%', enrollment: 800, deadline: 'Jan 15'
  },
  {
    id: 12, name: 'Nursing', uni: 'McMaster University', code: 'MC',
    color: '#7a003c', textColor: '#fff',
    type: 'Health Sciences', coop: false, campus: 'Hamilton',
    avg: '82–88%', enrollment: 300, deadline: 'Jan 15'
  },
];

// Saved programs state
const savedPrograms = new Set();

function initProgramExplorer() {
  renderPrograms(PROGRAMS);

  // Search
  document.getElementById('program-search')?.addEventListener('input', filterPrograms);
  document.getElementById('filter-uni')?.addEventListener('change', filterPrograms);
  document.getElementById('filter-type')?.addEventListener('change', filterPrograms);
  document.getElementById('filter-coop')?.addEventListener('change', filterPrograms);
}

function filterPrograms() {
  const searchVal = document.getElementById('program-search')?.value.toLowerCase() || '';
  const uniVal    = document.getElementById('filter-uni')?.value || '';
  const typeVal   = document.getElementById('filter-type')?.value || '';
  const coopOnly  = document.getElementById('filter-coop')?.checked || false;

  const filtered = PROGRAMS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchVal) ||
                        p.uni.toLowerCase().includes(searchVal);
    const matchUni    = !uniVal  || p.uni  === uniVal;
    const matchType   = !typeVal || p.type === typeVal;
    const matchCoop   = !coopOnly || p.coop;
    return matchSearch && matchUni && matchType && matchCoop;
  });

  renderPrograms(filtered);
}

function renderPrograms(programs) {
  const grid = document.getElementById('programs-grid');
  if (!grid) return;

  if (programs.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted);">
        <p style="font-size:2rem;">🌿</p>
        <p style="font-size:1rem; margin-top:8px;">No programs found. Try adjusting your filters.</p>
      </div>`;
    return;
  }

  grid.innerHTML = programs.map((p, i) => `
    <div class="program-card" style="animation-delay:${i * 50}ms;">
      <div class="prog-header">
        <div class="prog-logo" style="background:${p.color}; color:${p.textColor};">${p.code}</div>
        <div class="prog-meta">
          <div class="prog-name">${p.name}</div>
          <div class="prog-uni">${p.uni} · ${p.campus}</div>
        </div>
      </div>
      <div class="prog-tags">
        <span class="prog-tag ${p.type === 'Engineering' ? 'eng' : ''}">${p.type}</span>
        ${p.coop ? '<span class="prog-tag coop">Co-op Available</span>' : ''}
      </div>
      <div class="prog-details">
        <div class="prog-stat">
          <span class="prog-stat-label">Avg Required</span>
          <span class="prog-stat-val">${p.avg}</span>
        </div>
        <div class="prog-stat">
          <span class="prog-stat-label">Enrolment</span>
          <span class="prog-stat-val">~${p.enrollment.toLocaleString()}</span>
        </div>
        <div class="prog-stat">
          <span class="prog-stat-label">Deadline</span>
          <span class="prog-stat-val">${p.deadline}</span>
        </div>
      </div>
      <div class="prog-actions">
        <button class="btn-save ${savedPrograms.has(p.id) ? 'saved' : ''}"
          onclick="toggleSave(${p.id}, this)">
          <i data-lucide="${savedPrograms.has(p.id) ? 'bookmark-check' : 'bookmark'}"></i>
          ${savedPrograms.has(p.id) ? 'Saved' : 'Save'}
        </button>
        <button class="btn-apply" onclick="applyToProgram('${p.name}', '${p.uni}')">
          Apply →
        </button>
      </div>
    </div>
  `).join('');

  lucide.createIcons(); // Re-render icons in new cards
}

function toggleSave(id, btn) {
  if (savedPrograms.has(id)) {
    savedPrograms.delete(id);
    btn.innerHTML = `<i data-lucide="bookmark"></i> Save`;
    btn.classList.remove('saved');
    showToast('Program removed from saved');
  } else {
    savedPrograms.add(id);
    btn.innerHTML = `<i data-lucide="bookmark-check"></i> Saved`;
    btn.classList.add('saved');
    showToast('Program saved!');
  }
  lucide.createIcons();
}

function applyToProgram(name, uni) {
  showToast(`Added "${name}" at ${uni} to your application`);
  // Navigate to builder
  setTimeout(() => {
    document.querySelector('[data-page="builder"]')?.click();
  }, 800);
}

/* =============================================
   APPLICATION BUILDER — step navigation
============================================= */
let currentStep = 4; // Demo starts at step 4 (review)

function initBuilderNav() {
  // Show starting step on load
  showBuilderStep(currentStep);
}

function goToStep(step) {
  currentStep = step;
  showBuilderStep(step);

  // Update visual step indicators
  updateStepIndicator(step);

  // Scroll builder to top
  document.getElementById('page-builder')?.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showBuilderStep(step) {
  // Hide all builder panels
  document.querySelectorAll('.builder-panel').forEach(p => p.classList.add('hidden'));

  // Show target step panel
  const panel = document.getElementById(`builder-step-${step}`);
  if (panel) {
    panel.classList.remove('hidden');
    panel.style.animation = 'fadeUp 0.3s ease';
  }
}

function updateStepIndicator(activeStep) {
  for (let i = 1; i <= 5; i++) {
    const stepEl = document.querySelector(`[data-step="${i}"]`);
    const lineEl = document.getElementById(`line-${i}-${i + 1}`) ||
                   document.querySelectorAll('.step-line')[i - 1];

    if (!stepEl) continue;

    stepEl.classList.remove('done', 'active');
    if (i < activeStep)       stepEl.classList.add('done');
    else if (i === activeStep) stepEl.classList.add('active');

    // Update dot content
    const dot = stepEl.querySelector('.step-dot');
    if (!dot) continue;
    if (i < activeStep) {
      dot.innerHTML = '<i data-lucide="check"></i>';
    } else {
      dot.textContent = i;
    }
  }

  // Update step lines
  const lines = document.querySelectorAll('.step-line');
  lines.forEach((line, idx) => {
    line.classList.toggle('done', idx + 1 < activeStep);
  });

  lucide.createIcons();
}

function submitApplication() {
  // Show loading state
  const btn = document.querySelector('.btn-submit');
  if (btn) {
    btn.textContent = 'Processing…';
    btn.disabled = true;
  }

  setTimeout(() => {
    // Hide all builder panels
    document.querySelectorAll('.builder-panel').forEach(p => p.classList.add('hidden'));
    // Show success
    document.getElementById('builder-step-success')?.classList.remove('hidden');

    // Update step indicator to all done
    updateStepIndicator(6);
    showToast('Application submitted successfully! 🎉');
  }, 1800);
}

/* =============================================
   AI ASSISTANT PANEL
============================================= */
const AI_RESPONSES = {
  default: [
    "That's a great question! The OUAC application process can feel complex, but I'm here to help. Could you be more specific about what you'd like to know?",
    "I'd recommend checking the specific university's admissions page for the most up-to-date requirements. Is there a particular program or school you're asking about?",
    "Based on your current application profile (90.8% average), you're competitive for most Ontario university programs. Would you like me to suggest which programs might be a good fit?",
  ],
  requirements: "For **University of Toronto Computer Science**, you'll need a minimum of 87% in English (ENG4U), Advanced Functions (MHF4U), and one of Calculus & Vectors or Data Management. The actual competitive average is typically **91–95%**. Co-op is not available at UofT CS, but research opportunities through the Faculty of Arts & Science are excellent.",
  deadline: "The **Equal Consideration Deadline** for most Ontario universities is **January 15, 2026**. This means your application should be submitted by this date to receive equal consideration for admission. Some programs like Waterloo Engineering and Architecture may have earlier supplemental deadlines — I see you have a Waterloo AIF due **February 1, 2026**.",
  check: "I've reviewed your application, Jamie! Here's what I found:\n\n✅ Personal information looks complete\n✅ Academic history entered (90.8% avg — very competitive!)\n✅ 3 programs selected\n⚠️ Your **Waterloo AIF** is due February 1 — don't forget!\n⚠️ Mid-year grades for UofT are expected in March\n\nOverall your application looks strong. Ready to submit?",
};

function initAIPanel() {
  const closeBtn  = document.getElementById('ai-close');
  const sendBtn   = document.getElementById('ai-send');
  const input     = document.getElementById('ai-input');

  closeBtn?.addEventListener('click', closeAIPanel);
  sendBtn?.addEventListener('click', sendMessage);

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Overlay closes panel on mobile
  document.getElementById('overlay')?.addEventListener('click', () => {
    closeAIPanel();
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
  });
}

function openAIPanel() {
  document.getElementById('ai-panel')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('visible');
  document.getElementById('ai-input')?.focus();
}

function closeAIPanel() {
  document.getElementById('ai-panel')?.classList.remove('open');
  // Only remove overlay if sidebar is also closed
  if (!document.getElementById('sidebar')?.classList.contains('open')) {
    document.getElementById('overlay')?.classList.remove('visible');
  }
}

function askAI(question) {
  const input = document.getElementById('ai-input');
  if (input) input.value = question;
  sendMessage();
}

function sendMessage() {
  const input = document.getElementById('ai-input');
  const messages = document.getElementById('ai-messages');
  if (!input || !messages) return;

  const text = input.value.trim();
  if (!text) return;

  // Clear suggestions on first message
  const suggestions = messages.querySelector('.ai-suggestions');
  if (suggestions) suggestions.remove();

  // Add user message
  appendMessage(text, 'user');
  input.value = '';

  // Show typing indicator
  const typingId = showTyping();

  // Simulate AI response
  setTimeout(() => {
    removeTyping(typingId);
    const response = getAIResponse(text);
    appendMessage(response, 'bot');
  }, 1200 + Math.random() * 800);
}

function appendMessage(text, sender) {
  const messages = document.getElementById('ai-messages');
  if (!messages) return;

  const div = document.createElement('div');
  div.className = `ai-msg ${sender}`;
  // Convert **bold** markdown to <strong> tags
  const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  div.innerHTML = `<div class="msg-bubble">${formatted}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById('ai-messages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'ai-msg bot';
  div.id = id;
  div.innerHTML = `<div class="typing-bubble"><span></span><span></span><span></span></div>`;
  messages?.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}

function getAIResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes('requirement') || lower.includes('uoft') || lower.includes('toronto')) {
    return AI_RESPONSES.requirements;
  }
  if (lower.includes('deadline') || lower.includes('date') || lower.includes('when')) {
    return AI_RESPONSES.deadline;
  }
  if (lower.includes('check') || lower.includes('review') || lower.includes('look')) {
    return AI_RESPONSES.check;
  }
  if (lower.includes('waterloo') || lower.includes('aif')) {
    return "The **Waterloo AIF (Admission Information Form)** is a supplemental application required for most Waterloo programs including Software Engineering. It asks about your extracurriculars, interests, and background. You should receive an email with AIF instructions after submitting your OUAC application. The deadline for your program is **February 1, 2026**.";
  }
  if (lower.includes('average') || lower.includes('grade') || lower.includes('mark')) {
    return "Your current average of **90.8%** is very competitive! It puts you in a strong position for all three programs you've applied to. UofT CS and Waterloo Software Engineering are competitive (91–95% range), but your profile looks solid. Keep your grades up in second semester!";
  }

  // Default random response
  const defaults = AI_RESPONSES.default;
  return defaults[Math.floor(Math.random() * defaults.length)];
}

/* =============================================
   MOBILE SIDEBAR
============================================= */
function initMobileSidebar() {
  const toggle   = document.getElementById('menu-toggle');
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('overlay');

  toggle?.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    } else {
      sidebar.classList.add('open');
      overlay.classList.add('visible');
    }
  });
}

/* =============================================
   DASHBOARD — animate progress bar on load
============================================= */
function animateProgressBar() {
  const fill = document.querySelector('.progress-bar-fill');
  if (!fill) return;
  const target = fill.style.width;
  fill.style.width = '0%';
  setTimeout(() => {
    fill.style.width = target;
  }, 400);
}

/* =============================================
   TOAST NOTIFICATION
============================================= */
function showToast(message) {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toast-msg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');
  lucide.createIcons();

  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* =============================================
   UTILITY — expose key functions to HTML
============================================= */
window.goToStep         = goToStep;
window.submitApplication = submitApplication;
window.toggleSave       = toggleSave;
window.askAI            = askAI;
window.applyToProgram   = applyToProgram;
