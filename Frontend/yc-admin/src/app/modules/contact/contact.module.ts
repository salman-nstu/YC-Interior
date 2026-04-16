import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ContactComponent } from './contact.component';

@NgModule({
  declarations: [ContactComponent],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: ContactComponent }])]
})
export class ContactModule {}
