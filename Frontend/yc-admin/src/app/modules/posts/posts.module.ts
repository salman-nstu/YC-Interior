import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostCategoriesComponent } from './post-categories/post-categories.component';

@NgModule({
  imports: [CommonModule, PostsListComponent, PostFormComponent, PostCategoriesComponent, RouterModule.forChild([
    { path: '', component: PostsListComponent },
    { path: 'new', component: PostFormComponent },
    { path: 'edit/:id', component: PostFormComponent },
    { path: 'categories', component: PostCategoriesComponent }
  ])]
})
export class PostsModule {}
