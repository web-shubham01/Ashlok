/* ==========================================================================
   ASLOK WORLD CALCULATION - APPLICATION LOGIC & INTERACTIVE ENGINE
   High-Precision Computational Studio & Live Python Workbench
   ========================================================================== */

class AslokStudioApp {
  constructor() {
    this.historyKey = 'aslok_calc_history';
    this.soundEnabled = localStorage.getItem('aslok_sound_enabled') !== 'false';
    this.history = JSON.parse(localStorage.getItem(this.historyKey) || '[]');
    
    // Audio Context Setup
    this.audioCtx = null;

    this.initCanvas();
    this.initAudio();
    this.initEventListeners();
    this.initTabs();
    this.initThemes();
    this.initSearchAndFilter();
    
    // Initialize all 12 tools on load
    this.generateProfile();
    this.generatePattern();
    this.calcPower();
    this.calcSumSuite();
    this.convertLength();
    this.generateTable();
    this.calcInterest();
    this.calcRectangle();
    this.calcTriangle();
    this.calcGrades();
    this.calcDiscount();
    this.calcCuboid();

    this.updateHistoryBadge();
  }

  /* ------------------------------------------------------------------------
     1. Web Audio Synthesizer (Futuristic Micro-Haptics)
     ------------------------------------------------------------------------ */
  initAudio() {
    const soundToggle = document.getElementById('btn-toggle-sound');
    if (soundToggle) {
      if (this.soundEnabled) soundToggle.classList.add('active');
      else soundToggle.classList.remove('active');

      soundToggle.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('aslok_sound_enabled', this.soundEnabled ? 'true' : 'false');
        if (this.soundEnabled) {
          soundToggle.classList.add('active');
          this.playSound('click');
          this.showToast('Audio feedback enabled');
        } else {
          soundToggle.classList.remove('active');
          this.showToast('Audio feedback muted');
        }
      });
    }
  }

  playSound(type = 'click') {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.audioCtx = new AudioContext();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'copy') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.14);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.start(now);
        osc.stop(now + 0.14);
      }
    } catch (e) {
      // Audio playback fails gracefully if not permitted
    }
  }

  /* ------------------------------------------------------------------------
     2. Interactive Particle Constellation Canvas Backdrop
     ------------------------------------------------------------------------ */
  initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: -1000, y: -1000, radius: 140 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    const particles = [];
    const count = Math.min(Math.floor(width / 22), 65);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        baseColor: i % 2 === 0 ? 'rgba(0, 242, 254, 0.45)' : 'rgba(128, 0, 255, 0.4)'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse gentle repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distToMouse = Math.hypot(dx, dy);
        if (distToMouse < mouse.radius) {
          const force = (1 - distToMouse / mouse.radius) * 1.5;
          p.x -= (dx / distToMouse) * force;
          p.y -= (dy / distToMouse) * force;
        }

        ctx.fillStyle = p.baseColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 135) {
            const alpha = (1 - dist / 135) * 0.16;
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(render);
    };

    render();
  }

  /* ------------------------------------------------------------------------
     3. Global Event Handlers & History Drawer
     ------------------------------------------------------------------------ */
  initEventListeners() {
    const btnOpenHistory = document.getElementById('btn-open-history');
    const btnCloseHistory = document.getElementById('btn-close-history');
    const backdrop = document.getElementById('history-backdrop');

    if (btnOpenHistory && backdrop) {
      btnOpenHistory.addEventListener('click', () => {
        this.playSound('click');
        this.renderHistory();
        backdrop.classList.add('active');
      });
    }

    if (btnCloseHistory && backdrop) {
      btnCloseHistory.addEventListener('click', () => {
        this.playSound('click');
        backdrop.classList.remove('active');
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
        }
      });
    }

    // Keyboard Shortcut Ctrl/Cmd + K to focus search
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const search = document.getElementById('global-search');
        if (search) search.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. Card Tabs (Interactive Tool vs Python Code)
     ------------------------------------------------------------------------ */
  initTabs() {
    document.querySelectorAll('.tool-card').forEach(card => {
      const tabBtns = card.querySelectorAll('.card-tab-btn');
      const calcTab = card.querySelector('.calc-pane');
      const codeTab = card.querySelector('.code-pane');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.playSound('click');
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const tabType = btn.dataset.tab;
          if (tabType === 'calc') {
            if (calcTab) calcTab.classList.remove('hidden');
            if (codeTab) codeTab.classList.add('hidden');
          } else {
            if (calcTab) calcTab.classList.add('hidden');
            if (codeTab) codeTab.classList.remove('hidden');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Color Theme Selection
     ------------------------------------------------------------------------ */
  initThemes() {
    const pills = document.querySelectorAll('.theme-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.playSound('click');
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        document.body.className = '';
        const theme = pill.dataset.theme;
        if (theme && theme !== 'theme-prism') {
          document.body.classList.add(theme);
        }
        this.showToast(`Theme switched: ${pill.title}`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Search & Category Filters
     ------------------------------------------------------------------------ */
  initSearchAndFilter() {
    const searchInput = document.getElementById('global-search');
    const categoryBtns = document.querySelectorAll('.cat-pill');
    const cards = document.querySelectorAll('.tool-card');

    let currentCat = 'all';
    let searchQuery = '';

    const filterTools = () => {
      cards.forEach(card => {
        const title = card.querySelector('.tool-name-title')?.textContent.toLowerCase() || '';
        const cat = card.dataset.category || '';
        const matchesCategory = (currentCat === 'all' || cat === currentCat);
        const matchesSearch = title.includes(searchQuery.toLowerCase());

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        filterTools();
      });
    }

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.playSound('click');
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = btn.dataset.category;
        filterTools();
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. History Logging & Toast Notifications
     ------------------------------------------------------------------------ */
  logHistory(toolName, summary) {
    const record = {
      tool: toolName,
      summary: summary,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    this.history.unshift(record);
    if (this.history.length > 30) this.history.pop();
    localStorage.setItem(this.historyKey, JSON.stringify(this.history));
    this.updateHistoryBadge();
  }

  updateHistoryBadge() {
    const badge = document.getElementById('history-count-badge');
    if (badge) {
      badge.textContent = this.history.length;
    }
  }

  renderHistory() {
    const listContainer = document.getElementById('history-list');
    if (!listContainer) return;

    if (this.history.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted); font-size:0.88rem;">
          <i class="fa-solid fa-clock-rotate-left" style="font-size:2rem; margin-bottom:0.75rem; display:block; opacity:0.4;"></i>
          No calculations logged yet.<br>Engage any calculator to populate live history.
        </div>`;
      return;
    }

    listContainer.innerHTML = this.history.map(item => `
      <div class="history-card-item">
        <div class="history-top-meta">
          <span class="history-badge-tool">${item.tool}</span>
          <span class="history-timestamp">${item.timestamp}</span>
        </div>
        <div class="history-summary-text">${item.summary}</div>
      </div>
    `).join('');
  }

  clearHistory() {
    this.playSound('click');
    this.history = [];
    localStorage.removeItem(this.historyKey);
    this.renderHistory();
    this.updateHistoryBadge();
    this.showToast('Calculation history cleared');
  }

  showToast(message) {
    let stack = document.getElementById('toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'toast-stack';
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--accent-cyan);"></i> <span>${message}</span>`;
    stack.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  copyCode(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    navigator.clipboard.writeText(el.textContent);
    this.playSound('copy');

    // Visual button feedback
    const btn = document.querySelector(`[data-target="${elementId}"]`);
    if (btn) {
      const origHtml = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
      btn.style.background = 'var(--accent-emerald)';
      btn.style.color = '#000';
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.style.background = '';
        btn.style.color = '';
      }, 1800);
    }
    this.showToast('Python snippet copied to clipboard');
  }

  /* ========================================================================
     THE 12 COMPUTATIONAL & CODE ENGINES
     ======================================================================== */

  /* ------------------------------------------------------------------------
     TOOL 1: Identity Profile Studio Generator
     ------------------------------------------------------------------------ */
  generateProfile() {
    const name = document.getElementById('prof-name')?.value || 'Aslok';
    const role = document.getElementById('prof-role')?.value || 'Lead Systems Architect';
    const age = document.getElementById('prof-age')?.value || '24';
    const stack = document.getElementById('prof-stack')?.value || 'Python, Math Engines, WebGL';

    const resultBox = document.getElementById('prof-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="display:flex; align-items:center; gap:1.1rem;">
          <div style="width:52px; height:52px; border-radius:14px; background:var(--grad-primary); display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.35rem; color:#fff; box-shadow:0 0 18px rgba(0, 242, 254, 0.45);">
            ${name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-family:var(--font-display); font-weight:800; font-size:1.15rem; color:var(--text-pure);">${name}</div>
            <div style="font-size:0.82rem; color:var(--accent-cyan); font-weight:600;">${role} &bull; Age ${age}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px; font-family:var(--font-mono);">Tech: ${stack}</div>
          </div>
        </div>
      `;
    }

    const codeEl = document.getElementById('prof-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Identity Profile Engine
# ==========================================================
profile_data = {
    "name": "${name}",
    "role": "${role}",
    "age": ${age},
    "stack": "${stack}"
}

print(f"[*] Developer Badge: {profile_data['name']} [{profile_data['role']}]")
print(f"[*] Age: {profile_data['age']} | Primary Stack: {profile_data['stack']}")`;
    }

    this.logHistory('Profile Studio', `Badge generated for ${name} (${role})`);
  }

  /* ------------------------------------------------------------------------
     TOOL 2: Visual ASCII Pattern Lab
     ------------------------------------------------------------------------ */
  generatePattern() {
    const type = document.getElementById('pat-type')?.value || 'increasing';
    const rows = Math.min(Math.max(parseInt(document.getElementById('pat-rows')?.value) || 6, 1), 15);
    let patternStr = '';
    let pyCode = '';

    if (type === 'increasing') {
      for (let i = 1; i <= rows; i++) {
        patternStr += '*'.repeat(i) + '\n';
      }
      pyCode = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Increasing Star Pyramid
# ==========================================================
rows = ${rows}
for i in range(1, rows + 1):
    print("*" * i)`;
    } else if (type === 'decreasing') {
      for (let i = rows; i >= 1; i--) {
        patternStr += '*'.repeat(i) + '\n';
      }
      pyCode = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Decreasing Star Pyramid
# ==========================================================
rows = ${rows}
for i in range(rows, 0, -1):
    print("*" * i)`;
    } else if (type === 'diamond') {
      for (let i = 1; i <= rows; i++) {
        patternStr += ' '.repeat(rows - i) + '*'.repeat(2 * i - 1) + '\n';
      }
      for (let i = rows - 1; i >= 1; i--) {
        patternStr += ' '.repeat(rows - i) + '*'.repeat(2 * i - 1) + '\n';
      }
      pyCode = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Symmetrical Star Diamond
# ==========================================================
rows = ${rows}
for i in range(1, rows + 1):
    print(" " * (rows - i) + "*" * (2 * i - 1))
for i in range(rows - 1, 0, -1):
    print(" " * (rows - i) + "*" * (2 * i - 1))`;
    } else {
      for (let i = 1; i <= rows; i++) {
        let line = '';
        for (let j = 1; j <= i; j++) line += j + ' ';
        patternStr += line.trim() + '\n';
      }
      pyCode = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Sequential Number Pyramid
# ==========================================================
rows = ${rows}
for i in range(1, rows + 1):
    for j in range(1, i + 1):
        print(j, end=" ")
    print()`;
    }

    const resBox = document.getElementById('pat-result');
    if (resBox) resBox.textContent = patternStr;
    const codeEl = document.getElementById('pat-code');
    if (codeEl) codeEl.textContent = pyCode;

    this.logHistory('Pattern Lab', `Generated ${type} pattern (${rows} rows)`);
  }

  /* ------------------------------------------------------------------------
     TOOL 3: Exponent & Power Matrix
     ------------------------------------------------------------------------ */
  calcPower() {
    const base = parseFloat(document.getElementById('pow-base')?.value) || 0;
    const exp = parseFloat(document.getElementById('pow-exp')?.value) || 0;

    const resultVal = Math.pow(base, exp);
    const squareVal = Math.pow(base, 2);
    const cubeVal = Math.pow(base, 3);
    const sqrtVal = Math.sqrt(Math.abs(base)).toFixed(3);

    const resultBox = document.getElementById('pow-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">${base}<sup>${exp}</sup> = ${resultVal.toLocaleString()}</div>
        <div class="result-breakdown-text">Square: <strong>${squareVal.toLocaleString()}</strong> &bull; Cube: <strong>${cubeVal.toLocaleString()}</strong> &bull; √${base}: <strong>${sqrtVal}</strong></div>
      `;
    }

    const codeEl = document.getElementById('pow-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Exponent & Power Matrix
# ==========================================================
import math

base = ${base}
exp = ${exp}

power_result = math.pow(base, exp)
square = base ** 2
cube = base ** 3
sqrt_val = math.sqrt(abs(base))

print(f"{base}^{exp} = {power_result}")
print(f"Square: {square} | Cube: {cube} | Sqrt: {sqrt_val:.3f}")`;
    }

    this.logHistory('Power Matrix', `${base}^${exp} = ${resultVal.toLocaleString()}`);
  }

  /* ------------------------------------------------------------------------
     TOOL 4: Multi-Operand Math Suite
     ------------------------------------------------------------------------ */
  calcSumSuite() {
    const a = parseFloat(document.getElementById('sum-a')?.value) || 0;
    const b = parseFloat(document.getElementById('sum-b')?.value) || 0;

    const sum = a + b;
    const diff = a - b;
    const prod = a * b;
    const quot = b !== 0 ? (a / b).toFixed(3) : 'Undefined (Div by 0)';
    const avg = (sum / 2).toFixed(2);
    const mod = b !== 0 ? (a % b) : 'N/A';

    const resultBox = document.getElementById('sum-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">Sum: ${sum.toLocaleString()}</div>
        <div class="result-breakdown-text">Difference: <strong>${diff.toLocaleString()}</strong> &bull; Product: <strong>${prod.toLocaleString()}</strong> &bull; Quotient: <strong>${quot}</strong> &bull; Mod: <strong>${mod}</strong></div>
      `;
    }

    const codeEl = document.getElementById('sum-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Multi-Operand Math Suite
# ==========================================================
a = ${a}
b = ${b}

sum_res = a + b
diff_res = a - b
prod_res = a * b
quot_res = (a / b) if b != 0 else "Undefined"
mod_res = (a % b) if b != 0 else "Undefined"

print(f"Sum: {sum_res}")
print(f"Difference: {diff_res}")
print(f"Product: {prod_res}")
print(f"Quotient: {quot_res}")
print(f"Modulus: {mod_res}")`;
    }

    this.logHistory('Math Suite', `${a} & ${b} -> Sum: ${sum}`);
  }

  /* ------------------------------------------------------------------------
     TOOL 5: Spatial Length Converter
     ------------------------------------------------------------------------ */
  convertLength() {
    const val = parseFloat(document.getElementById('len-val')?.value) || 0;
    const unit = document.getElementById('len-from')?.value || 'km';

    let meters = 0;
    if (unit === 'km') meters = val * 1000;
    else if (unit === 'm') meters = val;
    else if (unit === 'cm') meters = val / 100;
    else if (unit === 'miles') meters = val * 1609.34;
    else if (unit === 'feet') meters = val * 0.3048;

    const km = (meters / 1000).toFixed(4);
    const cm = (meters * 100).toLocaleString();
    const miles = (meters / 1609.34).toFixed(4);
    const feet = (meters / 0.3048).toFixed(2);

    const resultBox = document.getElementById('len-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">${meters.toLocaleString()} Meters</div>
        <div class="result-breakdown-text">${km} Km &bull; ${miles} Miles &bull; ${feet} Feet &bull; ${cm} cm</div>
      `;
    }

    const codeEl = document.getElementById('len-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Spatial Length Converter
# ==========================================================
val = ${val}
unit = "${unit}"

conversions = {
    "km": 1000,
    "m": 1,
    "cm": 0.01,
    "miles": 1609.34,
    "feet": 0.3048
}

base_meters = val * conversions.get(unit, 1)

print(f"Base Meters: {base_meters:,.2f} m")
print(f"Kilometers: {base_meters / 1000:.4f} km")
print(f"Miles: {base_meters / 1609.34:.4f} mi")
print(f"Feet: {base_meters / 0.3048:.2f} ft")`;
    }

    this.logHistory('Length Engine', `${val} ${unit} = ${meters.toLocaleString()} m`);
  }

  /* ------------------------------------------------------------------------
     TOOL 6: Multiplication Matrix Studio
     ------------------------------------------------------------------------ */
  generateTable() {
    const num = parseInt(document.getElementById('tbl-num')?.value) || 8;
    const limit = Math.min(Math.max(parseInt(document.getElementById('tbl-limit')?.value) || 10, 1), 20);

    let resStr = '';
    for (let i = 1; i <= limit; i++) {
      resStr += `${num} × ${i} = ${num * i}\n`;
    }

    const tblRes = document.getElementById('tbl-result');
    if (tblRes) tblRes.textContent = resStr;

    const codeEl = document.getElementById('tbl-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Multiplication Matrix Studio
# ==========================================================
base_number = ${num}
multiplier_limit = ${limit}

print(f"=== Multiplication Matrix of {base_number} ===")
for i in range(1, multiplier_limit + 1):
    print(f"{base_number} x {i} = {base_number * i}")`;
    }

    this.logHistory('Multiplication Table', `Table of ${num} (up to ${limit})`);
  }

  /* ------------------------------------------------------------------------
     TOOL 7: Financial Growth Engine (Interest)
     ------------------------------------------------------------------------ */
  calcInterest() {
    const p = parseFloat(document.getElementById('si-p')?.value) || 0;
    const r = parseFloat(document.getElementById('si-r')?.value) || 0;
    const t = parseFloat(document.getElementById('si-t')?.value) || 0;

    const interest = (p * r * t) / 100;
    const total = p + interest;

    const resultBox = document.getElementById('si-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">Interest: $${interest.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        <div class="result-breakdown-text">Principal: <strong>$${p.toLocaleString()}</strong> &bull; Rate: <strong>${r}%</strong> &bull; Total Return: <strong>$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
      `;
    }

    const codeEl = document.getElementById('si-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Financial Growth Engine
# ==========================================================
principal = ${p}
rate = ${r}
years = ${t}

# Simple Interest Formula: (P * R * T) / 100
simple_interest = (principal * rate * years) / 100
total_maturity = principal + simple_interest

print(f"Principal Investment: \${principal:,.2f}")
print(f"Interest Earned: \${simple_interest:,.2f}")
print(f"Total Maturity Value: \${total_maturity:,.2f}")`;
    }

    this.logHistory('Financial Growth', `P: $${p}, R: ${r}%, Int: $${interest.toFixed(2)}`);
  }

  /* ------------------------------------------------------------------------
     TOOL 8: 2D Geometry: Rectangle Workbench
     ------------------------------------------------------------------------ */
  calcRectangle() {
    const l = Math.abs(parseFloat(document.getElementById('rect-l')?.value)) || 1;
    const w = Math.abs(parseFloat(document.getElementById('rect-w')?.value)) || 1;

    const area = l * w;
    const perimeter = 2 * (l + w);
    const diagonal = Math.sqrt(l * l + w * w).toFixed(2);

    // Update Blueprint SVG
    const svgRect = document.getElementById('svg-rect-shape');
    const svgText = document.getElementById('svg-rect-text');
    if (svgRect && svgText) {
      const maxDim = 140;
      const ratio = l / w;
      let drawWidth = maxDim;
      let drawHeight = maxDim / ratio;

      if (drawHeight > 75) {
        drawHeight = 75;
        drawWidth = 75 * ratio;
      }
      drawWidth = Math.min(Math.max(drawWidth, 36), 160);
      drawHeight = Math.min(Math.max(drawHeight, 24), 85);

      const x = (200 - drawWidth) / 2;
      const y = (110 - drawHeight) / 2;

      svgRect.setAttribute('x', x);
      svgRect.setAttribute('y', y);
      svgRect.setAttribute('width', drawWidth);
      svgRect.setAttribute('height', drawHeight);
      svgText.textContent = `${l} × ${w}`;
      svgText.setAttribute('x', 100);
      svgText.setAttribute('y', y + drawHeight / 2 + 5);
    }

    const resultBox = document.getElementById('rect-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">Area: ${area.toLocaleString()} sq units</div>
        <div class="result-breakdown-text">Perimeter: <strong>${perimeter.toLocaleString()}</strong> &bull; Diagonal: <strong>${diagonal}</strong></div>
      `;
    }

    const codeEl = document.getElementById('rect-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: 2D Rectangle Workbench
# ==========================================================
import math

length = ${l}
width = ${w}

area = length * width
perimeter = 2 * (length + width)
diagonal = math.sqrt(length**2 + width**2)

print(f"Rectangle Dimensions: {length} x {width}")
print(f"Area: {area} sq units")
print(f"Perimeter: {perimeter} units")
print(f"Diagonal: {diagonal:.2f} units")`;
    }

    this.logHistory('Rectangle 2D', `L:${l}, W:${w} -> Area:${area}`);
  }

  /* ------------------------------------------------------------------------
     TOOL 9: 2D Geometry: Triangle Workbench
     ------------------------------------------------------------------------ */
  calcTriangle() {
    const b = Math.abs(parseFloat(document.getElementById('tri-b')?.value)) || 1;
    const h = Math.abs(parseFloat(document.getElementById('tri-h')?.value)) || 1;

    const area = 0.5 * b * h;

    const resultBox = document.getElementById('tri-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">Area: ${area.toLocaleString()} sq units</div>
        <div class="result-breakdown-text">Formula: ½ × Base (${b}) × Height (${h})</div>
      `;
    }

    const svgText = document.getElementById('svg-tri-text');
    if (svgText) {
      svgText.textContent = `Area = ${area}`;
    }

    const codeEl = document.getElementById('tri-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: 2D Triangle Area Workbench
# ==========================================================
base = ${b}
height = ${h}

# Formula: Area = 0.5 * base * height
area = 0.5 * base * height

print(f"Base: {base} | Height: {height}")
print(f"Triangle Area: {area} sq units")`;
    }

    this.logHistory('Triangle 2D', `Base:${b}, Height:${h} -> Area:${area}`);
  }

  /* ------------------------------------------------------------------------
     TOOL 10: Academic Grade & GPA Analytics
     ------------------------------------------------------------------------ */
  addSubjectRow() {
    this.playSound('click');
    const container = document.getElementById('subject-list');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'subject-row';
    div.style = 'display:flex; gap:0.6rem; align-items:center;';
    div.innerHTML = `
      <input type="text" class="input-field sub-name" value="Elective Module" style="flex:2;">
      <input type="number" class="input-field sub-marks" value="85" placeholder="Marks" style="flex:1;">
      <button class="btn-danger-sm" onclick="this.parentElement.remove(); window.app.calcGrades();" title="Remove Subject">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;
    container.appendChild(div);
    this.calcGrades();
  }

  calcGrades() {
    const markInputs = document.querySelectorAll('.sub-marks');
    let totalMarks = 0;
    let count = 0;

    markInputs.forEach(input => {
      const val = parseFloat(input.value) || 0;
      totalMarks += val;
      count++;
    });

    const avg = count > 0 ? (totalMarks / count) : 0;
    let grade = 'F';
    let gpa = 0.0;
    let status = 'FAILED';

    if (avg >= 90) { grade = 'A+'; gpa = 4.0; status = 'PASSED (DISTINCTION)'; }
    else if (avg >= 80) { grade = 'A'; gpa = 3.8; status = 'PASSED (EXCELLENT)'; }
    else if (avg >= 70) { grade = 'B'; gpa = 3.2; status = 'PASSED (GOOD)'; }
    else if (avg >= 60) { grade = 'C'; gpa = 2.5; status = 'PASSED'; }
    else if (avg >= 50) { grade = 'D'; gpa = 2.0; status = 'PASSED'; }

    const resultBox = document.getElementById('grade-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">${avg.toFixed(2)}% (Grade: ${grade})</div>
        <div class="result-breakdown-text">Status: <strong>${status}</strong> &bull; Estimated GPA: <strong>${gpa.toFixed(1)} / 4.0</strong> (${count} Subjects)</div>
      `;
    }

    const codeEl = document.getElementById('grade-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Academic Grade & GPA Analytics
# ==========================================================
marks = [${Array.from(markInputs).map(i => i.value || 0).join(', ')}]

total = sum(marks)
avg_percentage = total / len(marks) if len(marks) > 0 else 0

if avg_percentage >= 90: grade = "A+"
elif avg_percentage >= 80: grade = "A"
elif avg_percentage >= 70: grade = "B"
elif avg_percentage >= 60: grade = "C"
else: grade = "F"

print(f"Total Subjects: {len(marks)}")
print(f"Average Percentage: {avg_percentage:.2f}%")
print(f"Final Grade: {grade}")`;
    }

    this.logHistory('Academic Analytics', `Avg: ${avg.toFixed(1)}% (Grade ${grade})`);
  }

  /* ------------------------------------------------------------------------
     TOOL 11: Commercial Savings Engine (Discount)
     ------------------------------------------------------------------------ */
  calcDiscount() {
    const price = parseFloat(document.getElementById('disc-price')?.value) || 0;
    const rate = parseFloat(document.getElementById('disc-rate')?.value) || 0;

    const savings = (price * rate) / 100;
    const finalPrice = price - savings;

    const resultBox = document.getElementById('disc-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">Final Price: $${finalPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        <div class="result-breakdown-text">Original: <strong>$${price.toLocaleString()}</strong> &bull; Discount: <strong>${rate}%</strong> &bull; You Save: <strong>$${savings.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
      `;
    }

    const codeEl = document.getElementById('disc-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: Commercial Savings & Discount
# ==========================================================
original_price = ${price}
discount_rate = ${rate}

savings = (original_price * discount_rate) / 100
final_price = original_price - savings

print(f"Original Price: \${original_price:,.2f}")
print(f"Discount Applied: {discount_rate}% (-\${savings:,.2f})")
print(f"Final Payable Price: \${final_price:,.2f}")`;
    }

    this.logHistory('Discount Engine', `Orig: $${price}, Saved: $${savings.toFixed(2)}`);
  }

  /* ------------------------------------------------------------------------
     TOOL 12: 3D Spatial Geometry: Cuboid Engine
     ------------------------------------------------------------------------ */
  calcCuboid() {
    const l = Math.abs(parseFloat(document.getElementById('cub-l')?.value)) || 1;
    const w = Math.abs(parseFloat(document.getElementById('cub-w')?.value)) || 1;
    const h = Math.abs(parseFloat(document.getElementById('cub-h')?.value)) || 1;

    const volume = l * w * h;
    const surfaceArea = 2 * (l * w + w * h + h * l);
    const diagonal = Math.sqrt(l * l + w * w + h * h).toFixed(2);

    // Dynamic 3D model scale update
    const model = document.getElementById('cuboid-model');
    if (model) {
      const maxVal = Math.max(l, w, h);
      const scaleX = (l / maxVal).toFixed(2);
      const scaleY = (h / maxVal).toFixed(2);
      const scaleZ = (w / maxVal).toFixed(2);
      model.style.transform = `scale3d(${scaleX}, ${scaleY}, ${scaleZ}) rotateX(-20deg) rotateY(35deg)`;
    }

    const resultBox = document.getElementById('cub-result');
    if (resultBox) {
      resultBox.innerHTML = `
        <div class="result-hero-metric">Volume: ${volume.toLocaleString()} cu units</div>
        <div class="result-breakdown-text">Surface Area: <strong>${surfaceArea.toLocaleString()}</strong> &bull; Space Diagonal: <strong>${diagonal}</strong></div>
      `;
    }

    const codeEl = document.getElementById('cub-code');
    if (codeEl) {
      codeEl.textContent = 
`# ==========================================================
# ASLOK WORLD CALCULATION: 3D Cuboid Spatial Engine
# ==========================================================
import math

length = ${l}
width = ${w}
height = ${h}

volume = length * width * height
surface_area = 2 * (length*width + width*height + height*length)
space_diagonal = math.sqrt(length**2 + width**2 + height**2)

print(f"Dimensions: {length} x {width} x {height}")
print(f"Volume: {volume} cubic units")
print(f"Surface Area: {surface_area} sq units")
print(f"Space Diagonal: {space_diagonal:.2f} units")`;
    }

    this.logHistory('3D Cuboid', `L:${l}, W:${w}, H:${h} -> Vol:${volume}`);
  }
}

// Instantiate Studio once DOM is Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AslokStudioApp();
});
