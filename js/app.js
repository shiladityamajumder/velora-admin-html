import { createElement as h, mount } from './runtime/dom.js';
import { usePathname } from './runtime/navigation.js';
import { UIProvider } from './components/ui-provider.js';
import { AppShell } from './components/app-shell.js';
import Dashboard from './app/(workspace)/dashboard/[slug]/page.js';
import Apps from './app/(workspace)/apps/[slug]/page.js';
import Tasks from './app/(workspace)/apps/tasks/[[...segments]]/page.js';
import Library from './app/(workspace)/library/[[...segments]]/page.js';
import Domain from './app/(workspace)/[domain]/[[...segments]]/page.js';
import Settings from './app/(workspace)/settings/[section]/page.js';
import Auth from './app/auth/[slug]/page.js';
import ErrorPage from './app/error-pages/[slug]/page.js';
import NotFound from './app/not-found.js';
import Template from './app/(workspace)/template/page.js';
import Docs from './app/(workspace)/docs/page.js';
import Components from './app/(workspace)/components/page.js';
import Forms from './app/(workspace)/forms/page.js';
import Charts from './app/(workspace)/charts/page.js';
import Tables from './app/(workspace)/tables/page.js';
import AdvancedTables from './app/(workspace)/tables/advanced/page.js';
import Profile from './app/(workspace)/profile/page.js';
import Layouts from './app/(workspace)/layouts/page.js';
const fixed = { '/template':Template, '/docs':Docs, '/components':Components, '/forms':Forms, '/charts':Charts, '/tables':Tables, '/tables/advanced':AdvancedTables, '/profile':Profile, '/layouts':Layouts };
function Page() {
  const path = usePathname(), parts = path.slice(1).split('/');
  let content;
  try {
    if (fixed[path]) content = h(fixed[path], {key:path});
    else if (parts[0] === 'auth' && parts.length === 2) return Auth({params:{slug:parts[1]}});
    else if (parts[0] === 'error-pages' && parts.length === 2) return ErrorPage({params:{slug:parts[1]}});
    else if (parts[0] === 'dashboard' && parts.length === 2) content = Dashboard({params:{slug:parts[1]}});
    else if (parts[0] === 'apps' && parts[1] === 'tasks') content = Tasks({params:{segments:parts.slice(2)}});
    else if (parts[0] === 'apps' && parts.length === 2) content = Apps({params:{slug:parts[1]}});
    else if (parts[0] === 'library') content = Library({params:{segments:parts.slice(1)}});
    else if (parts[0] === 'settings' && parts.length === 2) content = Settings({params:{section:parts[1]}});
    else content = Domain({params:{domain:parts[0], segments:parts.slice(1)}});
  } catch (error) { if (error.message === 'VELORA_NOT_FOUND') return h(NotFound); throw error; }
  return h(AppShell, null, h('div', {key:path, style:{display:'contents'}}, content));
}
const application = h(UIProvider, null, h(Page));
mount(document.getElementById('app'), () => application);
