import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { HeadManager } from "@/lib/head";

import Home from "@/pages/home";
import Projects from "@/pages/projects";
import ProjectPage from "@/pages/project";
import Services from "@/pages/services";
import ServicePage from "@/pages/service";
import Documents from "@/pages/documents";
import Contacts from "@/pages/contacts";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

/** Маршруты сайта: внутренние ссылки — с завершающим слэшем, поэтому
 *  каждая страница регистрируется в двух видах («/projects» и «/projects/»). */
const ROUTES: { path: string; component: ComponentType }[] = [
  { path: "/", component: Home },
  { path: "/projects", component: Projects },
  { path: "/projects/:slug", component: ProjectPage },
  { path: "/services", component: Services },
  { path: "/services/:slug", component: ServicePage },
  { path: "/documents", component: Documents },
  { path: "/contacts", component: Contacts },
];

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HeadManager />
          <Switch>
            {ROUTES.flatMap(({ path, component }) => {
              const variants = path === "/" ? ["/"] : [path, path + "/"];
              return variants.map((variant) => (
                <Route key={variant} path={variant} component={component} />
              ));
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
