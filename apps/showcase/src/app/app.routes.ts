import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',           redirectTo: 'overview',   pathMatch: 'full' },
  { path: 'overview',   loadComponent: () => import('./pages/overview.component').then(m => m.OverviewComponent) },
  { path: 'ui-library', loadComponent: () => import('./pages/ui-library-demo.component').then(m => m.UiLibraryDemoComponent) },
  { path: 'forms',      loadComponent: () => import('./pages/validators-demo.component').then(m => m.ValidatorsDemoComponent) },
  { path: 'api-scenarios', loadComponent: () => import('./pages/api-scenarios-demo.component').then(m => m.ApiScenariosDemoComponent) },
  { path: 'flags',      loadComponent: () => import('./pages/flags-demo.component').then(m => m.FlagsDemoComponent) },

  { path: 'types',      loadComponent: () => import('./pages/types-demo.component').then(m => m.TypesDemoComponent) },
  { path: 'validators', loadComponent: () => import('./pages/validators-demo.component').then(m => m.ValidatorsDemoComponent) },
  { path: 'events',     loadComponent: () => import('./pages/events-demo.component').then(m => m.EventsDemoComponent) },
  { path: 'graph',      loadComponent: () => import('./pages/graph-demo.component').then(m => m.GraphDemoComponent) },
];
