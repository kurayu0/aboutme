/**
 * Ayush Thakur - Portfolio & COA Architecture Suite
 * UID: 25BAI10052 | Chandigarh University
 * High-Performance Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initAmbientMeshTracker();
  initNavigation();
  initHeroAluWorkbench();
  initSimpleCoaConverter();
  initProjectFilters();
  initContactForm();
  initCvDownload();
  initCopyrightYear();
});

/* ===================================================================
   1. THEME MANAGER (Obsidian / Emerald / Titanium)
   =================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themes = ['obsidian', 'emerald', 'titanium'];
  const themeNames = {
    obsidian: 'Obsidian Cobalt',
    emerald: 'Emerald Terminal',
    titanium: 'Midnight Titanium'
  };

  const savedTheme = localStorage.getItem('ayush_portfolio_theme') || 'obsidian';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'obsidian';
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex];

      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('ayush_portfolio_theme', nextTheme);
      showToast(`Switched theme to ${themeNames[nextTheme]}`);
    });
  }
}

/* ===================================================================
   2. AMBIENT MESH MOUSE TRACKER
   =================================================================== */
function initAmbientMeshTracker() {
  const ambientMesh = document.getElementById('ambientMesh');
  if (!ambientMesh || window.innerWidth < 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = 250;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
  }, { passive: true });

  function renderAmbient() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    ambientMesh.style.transform = `translate3d(calc(-50% + ${(currentX - window.innerWidth / 2) * 0.15}px), ${currentY * 0.25}px, 0)`;
    requestAnimationFrame(renderAmbient);
  }

  requestAnimationFrame(renderAmbient);
}

/* ===================================================================
   3. RESPONSIVE NAVIGATION & SCROLL SPY
   =================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });
}

/* ===================================================================
   4. HERO SYSTEM ARCHITECTURE & ALU WORKBENCH
   =================================================================== */
function initHeroAluWorkbench() {
  const aluButtons = document.querySelectorAll('.alu-btn');
  const heroRegA = document.getElementById('heroRegA');
  const heroRegB = document.getElementById('heroRegB');
  const heroRegAcc = document.getElementById('heroRegAcc');
  const heroRegFlags = document.getElementById('heroRegFlags');
  const heroAluOpName = document.getElementById('heroAluOpName');
  const heroAluFormula = document.getElementById('heroAluFormula');

  if (!aluButtons.length) return;

  const regAVal = 0b10101010; // 170
  const regBVal = 0b01010101; // 85

  function updateAlu(op) {
    let result = 0;
    let opTitle = '';
    let formula = '';
    let carryFlag = 0;

    switch (op) {
      case 'AND':
        result = regAVal & regBVal;
        opTitle = 'Bitwise AND (&)';
        formula = `RegA & RegB = ${result} (0x${result.toString(16).toUpperCase()})`;
        break;
      case 'OR':
        result = regAVal | regBVal;
        opTitle = 'Bitwise OR (|)';
        formula = `RegA | RegB = ${result} (0x${result.toString(16).toUpperCase()})`;
        break;
      case 'ADD':
        const sum = regAVal + regBVal;
        carryFlag = sum > 255 ? 1 : 0;
        result = sum & 0xFF;
        opTitle = 'Addition (+ carry)';
        formula = `RegA + RegB = ${sum} (0x${sum.toString(16).toUpperCase()})`;
        break;
      case 'XOR':
        result = regAVal ^ regBVal;
        opTitle = 'Bitwise XOR (^)';
        formula = `RegA ^ RegB = ${result} (0x${result.toString(16).toUpperCase()})`;
        break;
    }

    const binStr = result.toString(2).padStart(8, '0');
    const zeroFlag = result === 0 ? 1 : 0;
    const signFlag = (result & 0x80) ? 1 : 0;

    heroRegAcc.textContent = `0b${binStr} [${result}]`;
    heroRegFlags.textContent = `Z:${zeroFlag} • C:${carryFlag} • S:${signFlag}`;
    heroAluOpName.textContent = opTitle;
    heroAluFormula.textContent = formula;
  }

  aluButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      aluButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const op = btn.getAttribute('data-op');
      updateAlu(op);
    });
  });

  // Initial calculation
  updateAlu('OR');
}

/* ===================================================================
   5. COMPLETE & ROBUST COA NUMBER SYSTEM CONVERTER
   =================================================================== */
function initSimpleCoaConverter() {
  const inputEl = document.getElementById('primaryConverterInput');
  const sourceSelect = document.getElementById('sourceRadixSelect');
  const targetSelect = document.getElementById('targetRadixSelect');
  const swapBtn = document.getElementById('swapRadixBtn');
  const convertBtn = document.getElementById('convertBtn');
  const copyBtn = document.getElementById('copyResultBtn');
  const outputEl = document.getElementById('primaryConverterOutput');
  const validationNotice = document.getElementById('validationNotice');
  const outputDigitCounter = document.getElementById('outputDigitCounter');
  const resetBtn = document.getElementById('resetConverterBtn');

  // Simultaneous readout elements
  const matrixValDec = document.getElementById('matrixValDec');
  const matrixValBin = document.getElementById('matrixValBin');
  const matrixValOct = document.getElementById('matrixValOct');
  const matrixValHex = document.getElementById('matrixValHex');
  const readoutCards = document.querySelectorAll('.readout-card');

  // Presets
  const presetPills = document.querySelectorAll('.preset-pill');

  if (!inputEl || !sourceSelect || !targetSelect) return;

  const RADIX_MAP = {
    binary: 2,
    octal: 8,
    decimal: 10,
    hexadecimal: 16
  };

  const RADIX_NAMES = {
    binary: 'Binary (Base 2)',
    octal: 'Octal (Base 8)',
    decimal: 'Decimal (Base 10)',
    hexadecimal: 'Hexadecimal (Base 16)'
  };

  const VALID_CHAR_REGEX = {
    binary: /^[01]$/,
    octal: /^[0-7]$/,
    decimal: /^[0-9]$/,
    hexadecimal: /^[0-9a-fA-F]$/
  };

  const HINTS = {
    binary: 'Valid symbols: 0 and 1 only (Prefix 0b and spaces supported)',
    octal: 'Valid symbols: 0 to 7 (Prefix 0o supported)',
    decimal: 'Valid symbols: 0 to 9 (Fractions & negatives supported)',
    hexadecimal: 'Valid symbols: 0 to 9, A to F (Prefix 0x supported)'
  };

  // Clean raw user input string (strip spaces, underscores, commas, prefixes/suffixes)
  function sanitizeInput(raw, srcType) {
    if (!raw) return '';
    let s = raw.trim().replace(/[\s_,]/g, '');

    // Check negative
    let isNeg = false;
    if (s.startsWith('-')) {
      isNeg = true;
      s = s.slice(1);
    } else if (s.startsWith('+')) {
      s = s.slice(1);
    }

    // Strip standard computer science prefixes & suffixes
    if (srcType === 'binary') {
      if (s.toLowerCase().startsWith('0b')) s = s.slice(2);
      if (s.toLowerCase().endsWith('b') && s.length > 1) s = s.slice(0, -1);
    } else if (srcType === 'hexadecimal') {
      if (s.toLowerCase().startsWith('0x')) s = s.slice(2);
      else if (s.startsWith('#')) s = s.slice(1);
      if (s.toLowerCase().endsWith('h') && s.length > 1) s = s.slice(0, -1);
    } else if (srcType === 'octal') {
      if (s.toLowerCase().startsWith('0o')) s = s.slice(2);
      if (s.toLowerCase().endsWith('o') && s.length > 1) s = s.slice(0, -1);
    }

    return (isNeg ? '-' : '') + s;
  }

  // Parse sanitized number into { intVal: BigInt, fracVal: Number, isNeg: Boolean, hasFrac: Boolean }
  function parseNumber(s, radix, srcType) {
    if (!s) return null;

    let isNeg = s.startsWith('-');
    let clean = isNeg ? s.slice(1) : s;

    if (!clean) return null;

    const parts = clean.split('.');
    if (parts.length > 2) {
      throw new Error('Multiple radix points (.) encountered');
    }

    const intStr = parts[0];
    const fracStr = parts.length === 2 ? parts[1] : '';

    // Validate characters
    const charRegex = VALID_CHAR_REGEX[srcType];
    for (let i = 0; i < intStr.length; i++) {
      if (!charRegex.test(intStr[i])) {
        throw new Error(`Invalid symbol '${intStr[i]}' for ${RADIX_NAMES[srcType]}`);
      }
    }
    for (let i = 0; i < fracStr.length; i++) {
      if (!charRegex.test(fracStr[i])) {
        throw new Error(`Invalid fractional symbol '${fracStr[i]}' for ${RADIX_NAMES[srcType]}`);
      }
    }

    // BigInt for integer part
    let intVal = 0n;
    const bigRadix = BigInt(radix);
    for (let i = 0; i < intStr.length; i++) {
      const ch = intStr[i].toUpperCase();
      let dVal = ch >= '0' && ch <= '9' ? BigInt(ch.charCodeAt(0) - 48) : BigInt(ch.charCodeAt(0) - 65 + 10);
      intVal = intVal * bigRadix + dVal;
    }

    // Fraction evaluation
    let fracVal = 0.0;
    if (fracStr) {
      let divisor = radix;
      for (let i = 0; i < fracStr.length; i++) {
        const ch = fracStr[i].toUpperCase();
        let dVal = ch >= '0' && ch <= '9' ? ch.charCodeAt(0) - 48 : ch.charCodeAt(0) - 65 + 10;
        fracVal += dVal / divisor;
        divisor *= radix;
      }
    }

    return {
      intVal: isNeg ? -intVal : intVal,
      absIntVal: intVal,
      fracVal,
      isNeg,
      hasFrac: !!fracStr
    };
  }

  // Format parsed number into target radix string
  function formatToRadix(parsed, targetRadix, maxFracDigits = 8) {
    const chars = '0123456789ABCDEF';
    const bigRadix = BigInt(targetRadix);

    // Format integer part
    let intStr = '';
    if (parsed.absIntVal === 0n) {
      intStr = '0';
    } else {
      let n = parsed.absIntVal;
      const digits = [];
      while (n > 0n) {
        const rem = Number(n % bigRadix);
        digits.push(chars[rem]);
        n = n / bigRadix;
      }
      intStr = digits.reverse().join('');
    }

    // Format fractional part
    let fracStr = '';
    if (parsed.fracVal > 1e-12) {
      let curr = parsed.fracVal;
      const fDigits = [];
      for (let i = 0; i < maxFracDigits; i++) {
        curr *= targetRadix;
        const d = Math.floor(curr);
        fDigits.push(chars[d]);
        curr -= d;
        if (curr < 1e-12) break;
      }
      fracStr = '.' + fDigits.join('');
    }

    const prefix = parsed.isNeg && (parsed.absIntVal > 0n || parsed.fracVal > 0) ? '-' : '';
    return prefix + intStr + fracStr;
  }

  function convert() {
    const rawVal = inputEl.value;
    const srcType = sourceSelect.value;
    const tgtType = targetSelect.value;
    const srcRadix = RADIX_MAP[srcType];
    const tgtRadix = RADIX_MAP[tgtType];

    const cleanInput = sanitizeInput(rawVal, srcType);

    if (!cleanInput || cleanInput === '-') {
      inputEl.classList.remove('is-invalid');
      validationNotice.textContent = HINTS[srcType];
      validationNotice.className = 'simple-validation-hint';
      outputEl.textContent = '0';
      if (outputDigitCounter) outputDigitCounter.textContent = 'Length: 0';
      if (matrixValDec) matrixValDec.textContent = '0';
      if (matrixValBin) matrixValBin.textContent = '0';
      if (matrixValOct) matrixValOct.textContent = '0';
      if (matrixValHex) matrixValHex.textContent = '0';
      return;
    }

    try {
      const parsed = parseNumber(cleanInput, srcRadix, srcType);
      if (!parsed) return;

      inputEl.classList.remove('is-invalid');
      validationNotice.textContent = HINTS[srcType];
      validationNotice.className = 'simple-validation-hint';

      const targetResult = formatToRadix(parsed, tgtRadix);
      outputEl.textContent = targetResult;

      // Update digit counter
      if (outputDigitCounter) {
        const cleanLen = targetResult.replace(/[-.]/g, '').length;
        const unit = tgtType === 'binary' ? 'bits' : 'digits';
        outputDigitCounter.textContent = `Length: ${cleanLen} ${unit}`;
      }

      // Update 4 simultaneous readouts
      if (matrixValDec) matrixValDec.textContent = formatToRadix(parsed, 10);
      if (matrixValBin) matrixValBin.textContent = formatToRadix(parsed, 2);
      if (matrixValOct) matrixValOct.textContent = formatToRadix(parsed, 8);
      if (matrixValHex) matrixValHex.textContent = formatToRadix(parsed, 16);
    } catch (err) {
      inputEl.classList.add('is-invalid');
      validationNotice.textContent = `⚠️ ${err.message}`;
      validationNotice.className = 'simple-validation-hint error';
      outputEl.textContent = '---';
      if (outputDigitCounter) outputDigitCounter.textContent = 'Invalid input';
    }
  }

  // Smart Radix selection (prevent From == To)
  sourceSelect.addEventListener('change', () => {
    if (sourceSelect.value === targetSelect.value) {
      const complements = {
        decimal: 'binary',
        binary: 'decimal',
        hexadecimal: 'decimal',
        octal: 'decimal'
      };
      targetSelect.value = complements[sourceSelect.value] || 'decimal';
    }
    validationNotice.textContent = HINTS[sourceSelect.value];
    convert();
  });

  targetSelect.addEventListener('change', () => {
    if (targetSelect.value === sourceSelect.value) {
      const complements = {
        decimal: 'binary',
        binary: 'decimal',
        hexadecimal: 'binary',
        octal: 'binary'
      };
      sourceSelect.value = complements[targetSelect.value] || 'decimal';
    }
    convert();
  });

  // Swap Bases
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const curSrc = sourceSelect.value;
      const curTgt = targetSelect.value;
      sourceSelect.value = curTgt;
      targetSelect.value = curSrc;

      const curOut = outputEl.textContent.trim();
      if (curOut && curOut !== '---' && curOut !== '0') {
        inputEl.value = curOut;
      }
      convert();
      showToast(`Swapped: ${RADIX_NAMES[curTgt]} ↔ ${RADIX_NAMES[curSrc]}`);
    });
  }

  // Convert Button
  if (convertBtn) {
    convertBtn.addEventListener('click', () => {
      convert();
      showToast('✓ Conversion evaluated');
    });
  }

  // Presets
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = pill.getAttribute('data-val');
      const from = pill.getAttribute('data-from');
      const to = pill.getAttribute('data-to');

      if (from) sourceSelect.value = from;
      if (to) targetSelect.value = to;
      inputEl.value = val;

      convert();
      showToast(`Loaded ${val} (${from.toUpperCase()} ➔ ${to.toUpperCase()})`);
    });
  });

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      inputEl.value = '';
      convert();
      inputEl.focus();
      showToast('Converter cleared');
    });
  }

  // Copy Main Result
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = outputEl.textContent.trim();
      if (!text || text === '---') {
        showToast('No valid result to copy');
        return;
      }
      copyTextToClipboard(text, `Copied "${text}" to clipboard!`);
    });
  }

  // Readout Cards (Click card sets as target base & copies)
  readoutCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-copy-target');
      const targetElem = document.getElementById(targetId);
      const cardBase = card.getAttribute('data-base');

      if (cardBase && targetSelect.value !== cardBase) {
        targetSelect.value = cardBase;
        convert();
      }

      if (targetElem) {
        const val = targetElem.textContent.trim();
        const baseLabel = card.querySelector('.readout-base')?.textContent || 'Value';
        copyTextToClipboard(val, `Copied ${baseLabel}: ${val}`);
      }
    });
  });

  function copyTextToClipboard(text, toastMsg) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(toastMsg);
    }).catch(() => {
      const tmp = document.createElement('input');
      tmp.value = text;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
      showToast(toastMsg);
    });
  }

  // Keydown shortcuts: Enter to convert, '/' to focus
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      convert();
      showToast('✓ Converted');
    }
  });

  inputEl.addEventListener('input', convert);

  // Initial conversion
  convert();
}

/* ===================================================================
   6. PROJECT CATEGORY FILTERING
   =================================================================== */
function initProjectFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const repoCards = document.querySelectorAll('.repo-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      repoCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ===================================================================
   7. CONTACT FORM SUBMISSION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName').value;
    showToast(`✓ Thank you ${name}! Your inquiry has been recorded.`);
    form.reset();
  });
}

/* ===================================================================
   8. CV DOWNLOAD FEEDBACK
   =================================================================== */
function initCvDownload() {
  const cvBtn = document.getElementById('downloadCvBtn');
  if (!cvBtn) return;

  cvBtn.addEventListener('click', (e) => {
    const href = cvBtn.getAttribute('href');
    if (href.startsWith('#') || href.includes('placeholder')) {
      e.preventDefault();
      showToast('📄 Place updated PDF in "assets/cv.pdf" to serve your direct resume!');
    } else {
      showToast('📄 Downloading Curriculum Vitae (cv.pdf)...');
    }
  });
}

/* ===================================================================
   9. TOAST NOTIFICATION UTILITY
   =================================================================== */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastNoticeText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ===================================================================
   10. COPYRIGHT AUTO-YEAR
   =================================================================== */
function initCopyrightYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
