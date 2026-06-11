const Format = {
  money(amount) {
    return '¥' + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  date(dateStr, withTime = false) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = n => String(n).padStart(2, '0');
    const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    if (withTime) {
      return `${base} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }
    return base;
  },

  relativeTime(dateStr) {
    const now = Date.now();
    const past = new Date(dateStr).getTime();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    if (diff < 2592000) return Math.floor(diff / 86400) + '天前';
    return this.date(dateStr);
  },

  monthLabel(year, month) {
    return `${year}年${String(month).padStart(2, '0')}月`;
  }
};
