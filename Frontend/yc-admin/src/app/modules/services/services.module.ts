import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';

@NgModule({
  imports: [CommonModule, ServicesListComponent, ServiceFormComponent, RouterModule.forChild([
    { path: '', component: ServicesListComponent },
    { path: 'new', component: ServiceFormComponent },
    { path: 'edit/:id', component: ServiceFormComponent }
  ])]
})
export class ServicesModule {}
