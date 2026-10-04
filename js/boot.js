/** Apply saved appearance before the first paint. */
(() => {
  // Resolve from this script, never from the depth of the current HTML page.
  window.veloraSiteURL = new URL('../', document.currentScript.src).href;
  try {
    const root=document.documentElement, mode=localStorage.getItem('nexa-theme') || 'system';
    const theme=mode==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):mode;
    root.classList.toggle('dark',theme==='dark');root.dataset.theme=theme;root.style.colorScheme=theme;
    root.lang=localStorage.getItem('nexa-locale')||'en';root.dir=localStorage.getItem('nexa-direction')||(root.lang==='ar'?'rtl':'ltr');
    const light={blue:'#2563eb',indigo:'#4f46e5',violet:'#7c3aed',emerald:'#047857',teal:'#087f70',rose:'#be185d',orange:'#c2410c',slate:'#475569'};
    const dark={blue:'#60a5fa',indigo:'#a5b4fc',violet:'#c4b5fd',emerald:'#6ee7b7',teal:'#5eead4',rose:'#fda4af',orange:'#fdba74',slate:'#cbd5e1'};
    const fonts={inter:'"Inter", system-ui, sans-serif',manrope:'"Manrope", system-ui, sans-serif',roboto:'"Roboto", system-ui, sans-serif',jakarta:'"Plus Jakarta Sans", system-ui, sans-serif',work:'"Work Sans", system-ui, sans-serif',system:'system-ui, sans-serif',humanist:'"Trebuchet MS", sans-serif',classic:'Georgia, serif',mono:'ui-monospace, monospace'};
    root.style.setProperty('--brand',(theme==='dark'?dark:light)[localStorage.getItem('nexa-accent')]||(theme==='dark'?dark:light).teal);
    root.style.setProperty('--font-family',fonts[localStorage.getItem('nexa-font')]||fonts.work);
    root.dataset.density=localStorage.getItem('nexa-density')||'comfortable';root.dataset.radius=localStorage.getItem('nexa-radius')||'medium';
    const defaults={surface:'outlined',navigationColor:'colorful',chartPalette:'spectrum',motion:'full',textSize:'default',sidebarSize:'default',headerTone:'solid'};
    Object.keys(defaults).forEach(key=>{root.dataset[key]=localStorage.getItem('nexa-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()))||defaults[key];});
  } catch { /* Preferences remain usable without persistent storage. */ }
})();
