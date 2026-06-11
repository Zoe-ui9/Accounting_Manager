const App = {
  _currentUser: null,
  _categories: null,

  init(requireAuth = true) {
    this._loadTheme();
    this._loadCategories();
    if (requireAuth) {
      this._checkAuth();
    }
  },

  _loadTheme() {
    const dark = Storage.get('darkMode', false);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = !current;
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
    Storage.set('darkMode', next);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = next ? '☀️' : '🌙';
  },

  _loadCategories() {
    this._categories = {
      income: [
        { id: 'salary', name: '工资', icon: '💰', color: '#22c55e' },
        { id: 'bonus', name: '奖金', icon: '🧧', color: '#16a34a' },
        { id: 'investment', name: '投资收益', icon: '📈', color: '#15803d' },
        { id: 'parttime', name: '兼职', icon: '💼', color: '#4ade80' },
        { id: 'gift', name: '礼金', icon: '🎁', color: '#86efac' },
        { id: 'refund', name: '退款', icon: '↩', color: '#6ee7b7' },
        { id: 'other_income', name: '其他收入', icon: '💵', color: '#bbf7d0' }
      ],
      expense: [
        { id: 'food', name: '餐饮', icon: '🍜', color: '#ef4444' },
        { id: 'transport', name: '交通', icon: '🚌', color: '#f97316' },
        { id: 'shopping', name: '购物', icon: '🛒', color: '#f59e0b' },
        { id: 'housing', name: '房租', icon: '🏠', color: '#e11d48' },
        { id: 'utilities', name: '水电', icon: '💡', color: '#dc2626' },
        { id: 'entertainment', name: '娱乐', icon: '🎮', color: '#a855f7' },
        { id: 'education', name: '教育', icon: '📚', color: '#6366f1' },
        { id: 'medical', name: '医疗', icon: '🏥', color: '#ec4899' },
        { id: 'communication', name: '通讯', icon: '📱', color: '#14b8a6' },
        { id: 'beauty', name: '美容', icon: '💄', color: '#d946ef' },
        { id: 'social', name: '社交', icon: '🎉', color: '#f43f5e' },
        { id: 'daily', name: '日用', icon: '🧴', color: '#eab308' },
        { id: 'travel', name: '旅行', icon: '✈', color: '#06b6d4' },
        { id: 'pets', name: '宠物', icon: '🐱', color: '#8b5cf6' },
        { id: 'other_expense', name: '其他支出', icon: '💸', color: '#6b7280' }
      ]
    };
  },

  getCategories(type) {
    if (!this._categories) return [];
    return this._categories[type] || [];
  },

  getCategoryIcon(type, categoryId) {
    const cats = this.getCategories(type);
    const found = cats.find(c => c.id === categoryId);
    return found ? found.icon : '📌';
  },

  getCategoryName(type, categoryId) {
    const cats = this.getCategories(type);
    const found = cats.find(c => c.id === categoryId);
    return found ? found.name : categoryId;
  },

  _checkAuth() {
    this._currentUser = Storage.get('currentUser');
    if (!this._currentUser) {
      window.location.href = 'login.html';
    }
  },

  getUser() {
    return this._currentUser || Storage.get('currentUser');
  },

  isLoggedIn() {
    return !!Storage.get('currentUser');
  },

  logout() {
    Storage.remove('currentUser');
    window.location.href = 'login.html';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  generateLayout(title, currentPage) {
    const dark = Storage.get('darkMode', false);
    const user = this.getUser();
    const themeIcon = dark ? '☀️' : '🌙';
    const initial = user ? user.username.charAt(0).toUpperCase() : 'U';

    const navItems = [
      { page: 'index', label: '仪表盘', icon: '📊', href: 'index.html' },
      { page: 'list', label: '收支明细', icon: '📋', href: 'list.html' },
      { page: 'add', label: '记一笔', icon: '✏️', href: 'add.html' },
      { page: 'statistics', label: '统计分析', icon: '📈', href: 'statistics.html' },
      { page: 'budget', label: '预算管理', icon: '🎯', href: 'budget.html' },
      { page: 'center', label: '个人中心', icon: '👤', href: 'center.html' }
    ];

    const sidebarHTML = `
      <div class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="logo-icon">💰</div>
          <span class="logo-text">记账管家</span>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-section-title">主菜单</div>
            ${navItems.map(item => `
              <a class="nav-item ${currentPage === item.page ? 'active' : ''}" href="${item.href}">
                <span class="nav-icon">${item.icon}</span>
                ${item.label}
              </a>
            `).join('')}
          </div>
        </nav>
        <div class="sidebar-footer">
          <div style="font-size:12px;color:var(--text-muted);text-align:center;">
            © 2025 记账管家
          </div>
        </div>
      </div>
      <div class="sidebar-overlay" id="sidebarOverlay"></div>
    `;

    const headerHTML = `
      <header class="top-header">
        <div class="header-left">
          <button class="menu-toggle" id="menuToggle" title="菜单">☰</button>
          <span class="header-breadcrumb">${title}</span>
        </div>
        <div class="header-right">
          <button class="theme-toggle" id="themeToggle" title="切换主题">
            <span id="themeIcon">${themeIcon}</span>
          </button>
          <div class="user-menu">
            <div class="user-avatar">${initial}</div>
            <div class="dropdown">
              <a class="dropdown-item" href="center.html">👤 个人中心</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#" id="logoutBtn">🚪 退出登录</a>
            </div>
          </div>
        </div>
      </header>
    `;

    const mainArea = document.getElementById('mainArea');
    if (mainArea) {
      mainArea.innerHTML = sidebarHTML + headerHTML + '<main class="main-content" id="mainContent"></main>';
    }

    this._bindLayoutEvents();
  },

  _bindLayoutEvents() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggleTheme());
    }

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (menuToggle && sidebar && overlay) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
      });
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  },

  initDefaultData() {
    if (!Storage.get('users')) {
      Storage.set('users', [
        { id: 1, username: 'demo', password: '123456', phone: '13800138000', createdAt: '2025-01-01' }
      ]);
    }
    if (!Storage.get('transactions')) {
      Storage.set('transactions', []);
    }
    if (!Storage.get('budgets')) {
      Storage.set('budgets', {});
    }
  }
};
