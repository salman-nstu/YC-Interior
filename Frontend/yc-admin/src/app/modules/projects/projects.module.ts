import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectCategoriesComponent } from './project-categories/project-categories.component';

@NgModule({
  declarations: [ProjectsListComponent, ProjectFormComponent, ProjectCategoriesComponent],
  imports: [SharedModule, RouterModule.forChild([
    { path: '', component: ProjectsListComponent },
    { path: 'new', component: ProjectFormComponent },
    { path: 'edit/:id', component: ProjectFormComponent },
    { path: 'categories', component: ProjectCategoriesComponent }
  ])]
})
export class ProjectsModule {}
