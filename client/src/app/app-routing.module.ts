import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'admin/users',
    loadChildren: () => import('./admin/pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'admin/submissions',
    loadChildren: () => import('./admin/pages/submissions/submissions.module').then( m => m.SubmissionsPageModule)
  },
  {
    path: 'admin/settings',
    loadChildren: () => import('./admin/pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'admin/submissions/:id',
    loadChildren: () => import('./admin/pages/submission-detail/submission-detail.module').then( m => m.SubmissionDetailPageModule)
  },
  {
    path: 'admin/labeled-submissions',
    loadChildren: () => import('./admin/pages/labeled-submissions/labeled-submissions.module').then( m => m.LabeledSubmissionsPageModule)
  },
  {
    path: 'admin/my-votes',
    loadChildren: () => import('./admin/pages/my-votes/my-votes.module').then( m => m.MyVotesPageModule)
  },
  {
    path: 'submission',
    loadChildren: () => import('./submission/submission.module').then( m => m.SubmissionPageModule),
    canLoad: [ AuthGuard ]
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'callback',
    loadChildren: () => import('./callback/callback.module').then( m => m.CallbackPageModule)
  },
  {
    path: 'logout',
    loadChildren: () => import('./logout/logout.module').then( m => m.LogoutPageModule)
  },
  {
    path: 'admin/settings/festival/:id',
    loadChildren: () => import('./admin/pages/settings-festival-detail/settings-festival-detail.module').then( m => m.SettingsFestivalDetailPageModule)
  },
  {
    path: 'submission-success',
    loadChildren: () => import('./submission-success/submission-success.module').then( m => m.SubmissionSuccessPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
