import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectCategoriesComponent } from './project-categories/project-categories.component';

@NgModule({
  imports: [CommonModule, ProjectsListComponent, ProjectFormComponent, ProjectCategoriesComponent, RouterModule.forChild([
    { path: '', component: ProjectsListComponent },
    { path: 'new', component: ProjectFormComponent },
    { path: 'edit/:id', component: ProjectFormComponent },
    { path: 'categories', component: ProjectCategoriesComponent }
  ])]
})
export class ProjectsModule {}
