import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostCategoriesComponent } from './post-categories/post-categories.component';

@NgModule({
  declarations: [PostsListComponent, PostFormComponent, PostCategoriesComponent],
  imports: [SharedModule, RouterModule.forChild([
    { path: '', component: PostsListComponent },
    { path: 'new', component: PostFormComponent },
    { path: 'edit/:id', component: PostFormComponent },
    { path: 'categories', component: PostCategoriesComponent }
  ])]
})
export class PostsModule {}
