import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HeadManager } from "@/lib/head";

import Home from "@/pages/home";
import ProjectPage from "@/pages/project";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

/**
 * Маршруты сайта. Пока это главная страница и один объект – страница-образец;
 * остальные объекты добавляются так же: запись в content/projects.ts + page: true.
 * Внутренние ссылки идут со слэшем на конце, поэтому путь регистрируется в двух видах.
 */
const ROUTES: { path: string; component: ComponentType }[] = [
  { path: "/", component: Home },
  { path: "/projects/:slug", component: ProjectPage },
];

/** Переход по ссылке с якорем (например «/#projects») прокручивает страницу к разделу */
function HashScroller() {
  const [location] = useLocation();
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, [location]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HashScroller />
          <HeadManager />
          <Switch>
            {ROUTES.flatMap(({ path, component }) => {
              const variants = path === "/" ? ["/"] : [path, path + "/"];
              return variants.map((variant) => <Route key={variant} path={variant} component={component} />);
            })}
            {["/404", "/404/"].map((p) => (
              <Route key={p} path={p} component={NotFound} />
            ))}
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
