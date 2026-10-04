import { createElement, Fragment } from '../runtime/dom.js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore
} from "../runtime/dom.js";
import { CheckCircle2, CircleAlert, X } from "../vendor/icons.js";
import { accents, darkAccents, fonts } from "../config/app.js";
import {
  appearanceDefaults,
  appearanceOptions
} from "../config/appearance.js";
import { LocaleProvider } from "../i18n/provider.js";
import { usePreference } from "../lib/client-store.js";
const UIContext = createContext(null);
const subscribeSystem = (listener) => {
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};
export function UIProvider({ children }) {
  return createElement(LocaleProvider, null, createElement(PreferencesProvider, null, children));
}
function PreferencesProvider({ children }) {
  const darkSystem = useSyncExternalStore(
    subscribeSystem,
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false
  );
  const [accent, setAccent, readAccent] = usePreference(
    "nexa-accent",
    "teal",
    Object.keys(accents)
  );
  const [font, setFont, readFont] = usePreference(
    "nexa-font",
    "work",
    Object.keys(fonts)
  );
  const [density, setDensity, readDensity] = usePreference(
    "nexa-density",
    "comfortable",
    ["comfortable", "compact", "dense"]
  );
  const [radius, setRadius, readRadius] = usePreference(
    "nexa-radius",
    "medium",
    ["square", "small", "medium", "large"]
  );
  const [width, setWidth] = usePreference("nexa-width", "fluid", [
    "fluid",
    "boxed"
  ]);
  const [header, setHeader] = usePreference("nexa-header", "fixed", [
    "fixed",
    "static"
  ]);
  const [theme, setTheme, readTheme] = usePreference(
    "nexa-theme",
    "system",
    ["light", "dark", "system"]
  );
  const [sidebarVariant, setSidebarVariant] = usePreference(
    "nexa-sidebar",
    "default",
    ["default", "dark", "compact", "mini", "hover", "hidden", "offcanvas"]
  );
  const [direction, setDirection, readDirection] = usePreference(
    "nexa-direction",
    "ltr",
    ["ltr", "rtl"]
  );
  const [surface, setSurface, readSurface] = usePreference(
    "nexa-surface",
    appearanceDefaults.surface,
    appearanceOptions.surface
  );
  const [navigationColor, setNavigationColor, readNavigationColor] = usePreference(
    "nexa-navigation-color",
    appearanceDefaults.navigationColor,
    appearanceOptions.navigationColor
  );
  const [chartPalette, setChartPalette, readChartPalette] = usePreference(
    "nexa-chart-palette",
    appearanceDefaults.chartPalette,
    appearanceOptions.chartPalette
  );
  const [motion, setMotion, readMotion] = usePreference(
    "nexa-motion",
    appearanceDefaults.motion,
    appearanceOptions.motion
  );
  const [textSize, setTextSize, readTextSize] = usePreference(
    "nexa-text-size",
    appearanceDefaults.textSize,
    appearanceOptions.textSize
  );
  const [sidebarSize, setSidebarSize, readSidebarSize] = usePreference(
    "nexa-sidebar-size",
    appearanceDefaults.sidebarSize,
    appearanceOptions.sidebarSize
  );
  const [headerTone, setHeaderTone, readHeaderTone] = usePreference(
    "nexa-header-tone",
    appearanceDefaults.headerTone,
    appearanceOptions.headerTone
  );
  const appearance = {
    surface,
    navigationColor,
    chartPalette,
    motion,
    textSize,
    sidebarSize,
    headerTone
  };
  function setAppearance(key, value2) {
    switch (key) {
      case "surface":
        setSurface(value2);
        break;
      case "navigationColor":
        setNavigationColor(value2);
        break;
      case "chartPalette":
        setChartPalette(value2);
        break;
      case "motion":
        setMotion(value2);
        break;
      case "textSize":
        setTextSize(value2);
        break;
      case "sidebarSize":
        setSidebarSize(value2);
        break;
      case "headerTone":
        setHeaderTone(value2);
        break;
    }
  }
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.surface = readSurface();
    root.dataset.navigationColor = readNavigationColor();
    root.dataset.chartPalette = readChartPalette();
    root.dataset.motion = readMotion();
    root.dataset.textSize = readTextSize();
    root.dataset.sidebarSize = readSidebarSize();
    root.dataset.headerTone = readHeaderTone();
  }, [
    surface,
    navigationColor,
    chartPalette,
    motion,
    textSize,
    sidebarSize,
    headerTone,
    readSurface,
    readNavigationColor,
    readChartPalette,
    readMotion,
    readTextSize,
    readSidebarSize,
    readHeaderTone
  ]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const notify = useCallback(
    (message, tone = "success") => setToast({ message, tone }),
    []
  );
  const resolvedTheme = theme === "system" ? darkSystem ? "dark" : "light" : theme;
  useEffect(() => {
    const mode = readTheme();
    const current = mode === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : mode;
    document.documentElement.classList.toggle("dark", current === "dark");
    document.documentElement.dataset.theme = current;
    document.documentElement.style.colorScheme = current;
  }, [theme, readTheme, darkSystem]);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.accent = readAccent();
    const liveMode = readTheme();
    const dark = liveMode === "dark" || liveMode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.style.setProperty(
      "--brand",
      (dark ? darkAccents : accents)[readAccent()]
    );
    root.style.setProperty("--font-family", fonts[readFont()]);
    root.dataset.density = readDensity();
    root.dataset.radius = readRadius();
  }, [
    accent,
    font,
    density,
    radius,
    resolvedTheme,
    readTheme,
    readAccent,
    readFont,
    readDensity,
    readRadius
  ]);
  useEffect(() => {
    document.documentElement.dir = readDirection();
  }, [direction, readDirection]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const value = {
    appearance,
    setAppearance,
    resolvedTheme,
    accent,
    setAccent,
    font,
    setFont,
    density,
    setDensity,
    radius,
    setRadius,
    width,
    setWidth,
    header,
    setHeader,
    theme,
    setTheme,
    toggleTheme: () => setTheme(resolvedTheme === "light" ? "dark" : "light"),
    sidebarVariant,
    setSidebarVariant,
    direction,
    setDirection,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    customizerOpen,
    setCustomizerOpen,
    notify
  };
  return createElement(UIContext.Provider, { value }, children, toast ? createElement(
    "div",
    {
      role: "status",
      className: "surface fixed bottom-5 end-5 z-[150] flex max-w-[calc(100vw-40px)] items-start gap-3 rounded-lg px-4 py-3 shadow-xl"
    },
    createElement(
      "span",
      {
        className: toast.tone === "error" ? "text-danger" : "text-brand"
      },
      toast.tone === "error" ? createElement(CircleAlert, { size: 20 }) : createElement(CheckCircle2, { size: 20 })
    ),
    createElement("p", { className: "text-sm" }, toast.message),
    createElement(
      "button",
      {
        "aria-label": "Dismiss message",
        onClick: () => setToast(null),
        className: "ms-2 text-muted"
      },
      createElement(X, { size: 16 })
    )
  ) : null);
}
export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
}
