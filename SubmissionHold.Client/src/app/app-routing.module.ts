import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
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
    path: 'admin/submission-detail',
    loadChildren: () => import('./admin/pages/submission-detail/submission-detail.module').then( m => m.SubmissionDetailPageModule)
  },
  {
    path: 'admin/my-votes',
    loadChildren: () => import('./admin/pages/my-votes/my-votes.module').then( m => m.MyVotesPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
