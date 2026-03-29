import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', loadComponent: () => import('./pages/start-here.component').then(m => m.StartHereComponent) },
  { path: 'monorepo', loadComponent: () => import('./pages/why-monorepo.component').then(m => m.WhyMonorepoComponent) },
  { path: 'pros-cons', loadComponent: () => import('./pages/trade-offs.component').then(m => m.TradeOffsComponent) },
  { path: 'case-effective', loadComponent: () => import('./pages/repo-proof.component').then(m => m.RepoProofComponent) },
  { path: 'case-ineffective', loadComponent: () => import('./pages/not-monorepo.component').then(m => m.NotMonorepoComponent) },
  { path: 'common-questions', loadComponent: () => import('./pages/implementation-walkthrough.component').then(m => m.ImplementationWalkthroughComponent) },
  { path: 'conclusion', loadComponent: () => import('./pages/conclusion.component').then(m => m.ConclusionComponent) },
  { path: '**', redirectTo: 'overview' },
];
