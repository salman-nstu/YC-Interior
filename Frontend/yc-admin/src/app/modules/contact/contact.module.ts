import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';\nimport { RouterModule } from '@angular/router';
import { ContactComponent } from './contact.component';

@NgModule({
  imports: [CommonModule, ContactComponent, RouterModule.forChild([{ path: '', component: ContactComponent }])]
})
export class ContactModule {}
