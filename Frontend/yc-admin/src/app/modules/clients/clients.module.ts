import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientsComponent } from './clients.component';

@NgModule({
  imports: [CommonModule, ClientsComponent, RouterModule.forChild([{ path: '', component: ClientsComponent }])]
})
export class ClientsModule {}
