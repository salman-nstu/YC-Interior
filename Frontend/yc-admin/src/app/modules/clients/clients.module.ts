import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ClientsComponent } from './clients.component';

@NgModule({
  declarations: [ClientsComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: ClientsComponent }])]
})
export class ClientsModule {}
