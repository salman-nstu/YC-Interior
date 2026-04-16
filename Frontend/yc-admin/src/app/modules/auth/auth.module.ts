import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [CommonModule, LoginComponent, RouterModule.forChild([{ path: 'login', component: LoginComponent }])]
})
export class AuthModule {}
