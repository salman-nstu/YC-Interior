import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [CommonModule, SettingsComponent, RouterModule.forChild([{ path: '', component: SettingsComponent }])]
})
export class SettingsModule {}
