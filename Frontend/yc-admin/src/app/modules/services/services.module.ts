import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ServicesListComponent } from './services-list/services-list.component';
import { ServiceFormComponent } from './service-form/service-form.component';

@NgModule({
  declarations: [ServicesListComponent, ServiceFormComponent],
  imports: [SharedModule, RouterModule.forChild([
    { path: '', component: ServicesListComponent },
    { path: 'new', component: ServiceFormComponent },
    { path: 'edit/:id', component: ServiceFormComponent }
  ])]
})
export class ServicesModule {}
