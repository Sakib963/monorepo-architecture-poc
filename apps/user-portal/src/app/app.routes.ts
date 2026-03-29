import { Route } from '@angular/router';

export const appRoutes: Route[] = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{
		path: 'dashboard',
		loadComponent: () => import('./pages/dashboard-page.component').then((module) => module.DashboardPageComponent),
	},
	{
		path: 'profile',
		loadComponent: () => import('./pages/profile-page.component').then((module) => module.ProfilePageComponent),
	},
	{
		path: 'accounts',
		loadComponent: () => import('./pages/accounts-page.component').then((module) => module.AccountsPageComponent),
	},
	{
		path: 'transactions',
		loadComponent: () => import('./pages/transactions-page.component').then((module) => module.TransactionsPageComponent),
	},
	{
		path: 'notifications',
		loadComponent: () => import('./pages/notifications-page.component').then((module) => module.NotificationsPageComponent),
	},
	{ path: '**', redirectTo: 'dashboard' },
];
