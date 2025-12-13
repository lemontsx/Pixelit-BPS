/* theme.js
   Manages site themes: applies CSS variables and persists selection to localStorage
*/
(function(){
  const THEMES = {
    violet: {
      name: 'Violet',
      '--bg': '#6d0180',
      '--nav': '#6f057a',
      '--nav-shadow': '#61056b',
      '--panel': '#6f057a',
      '--panel-shadow': '#61056b',
      '--text': '#ffffff',
      '--dropdown-bg': '#ffe6fc',
      '--dropdown-text': '#000000',
      '--accent': 'purple'
    },
    ocean: {
      name: 'Ocean',
      '--bg': '#064273',
      '--nav': '#0a64a4',
      '--nav-shadow': '#053d66',
      '--panel': '#0a64a4',
      '--panel-shadow': '#053d66',
      '--text': '#e6f7ff',
      '--dropdown-bg': '#dff4ff',
      '--dropdown-text': '#012233',
      '--accent': '#00a8e8'
    },
    sunset: {
      name: 'Sunset',
      '--bg': '#ff8a65',
      '--nav': '#ff7043',
      '--nav-shadow': '#cc5a36',
      '--panel': '#ff7043',
      '--panel-shadow': '#cc5a36',
      '--text': '#2b1b17',
      '--dropdown-bg': '#fff0e6',
      '--dropdown-text': '#2b1b17',
      '--accent': '#ff5722'
    },
    forest: {
      name: 'Forest',
      '--bg': '#0b3d24',
      '--nav': '#11633b',
      '--nav-shadow': '#0a4a2d',
      '--panel': '#11633b',
      '--panel-shadow': '#0a4a2d',
      '--text': '#e6ffe9',
      '--dropdown-bg': '#e9fff1',
      '--dropdown-text': '#052512',
      '--accent': '#2e8b57'
    },
    midnight: {
      name: 'Midnight',
      '--bg': '#0b1020',
      '--nav': '#141827',
      '--nav-shadow': '#0a0d14',
      '--panel': '#141827',
      '--panel-shadow': '#0a0d14',
      '--text': '#dbe7ff',
      '--dropdown-bg': '#0f1724',
      '--dropdown-text': '#dbe7ff',
      '--accent': '#4c6ef5'
    }
  };

  function applyTheme(themeKey){
    const theme = THEMES[themeKey] || THEMES.violet;
    const root = document.documentElement;
    Object.keys(theme).forEach(k=>{
      if(k.startsWith('--')) root.style.setProperty(k, theme[k]);
    });
    root.dataset.currentTheme = themeKey;
  }

  function getStoredTheme(){
    return localStorage.getItem('siteTheme') || 'violet';
  }

  // public API
  window.setTheme = function(themeKey){
    applyTheme(themeKey);
    try{ localStorage.setItem('siteTheme', themeKey); } catch(e){}
    // notify listeners if any
    window.dispatchEvent(new CustomEvent('siteThemeChanged', { detail: { theme: themeKey } }));
  };

  window.getTheme = function(){ return getStoredTheme(); };

  // apply on load
  document.addEventListener('DOMContentLoaded', function(){
    const stored = getStoredTheme();
    applyTheme(stored);
  });

  // expose themes list
  window.__SITE_THEMES = Object.keys(THEMES).map(k=>({ key:k, name: THEMES[k].name }));
})();
