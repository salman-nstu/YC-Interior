import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({ selector: 'app-settings', template: `
  <div>
    <div class="page-header"><div><h1 class="page-title">Site Settings</h1><p class="page-subtitle">Configure your website settings</p></div></div>
    <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="form">
      <div class="grid-2" style="gap:24px;align-items:start">
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card"><div class="card-body">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:20px;color:var(--text-secondary)">General</h3>
            <div class="form-group"><label class="form-label">Site Name</label><input type="text" formControlName="siteName" class="form-control" id="settings-site-name" /></div>
            <div class="form-group"><label class="form-label">Email</label><input type="email" formControlName="email" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Phone</label><input type="text" formControlName="phone" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Address</label><textarea formControlName="address" class="form-control" rows="3"></textarea></div>
            <div class="form-group"><label class="form-label">Map Embed URL</label><input type="text" formControlName="mapEmbedUrl" class="form-control" /></div>
          </div></div>
          <div class="card"><div class="card-body">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:20px;color:var(--text-secondary)">Social Media</h3>
            <div class="form-group"><label class="form-label">Facebook URL</label><input type="text" formControlName="facebookUrl" class="form-control" /></div>
            <div class="form-group"><label class="form-label">Instagram URL</label><input type="text" formControlName="instagramUrl" class="form-control" /></div>
            <div class="form-group"><label class="form-label">LinkedIn URL</label><input type="text" formControlName="linkedinUrl" class="form-control" /></div>
          </div></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:20px">
          <div class="card"><div class="card-body"><h3 style="font-size:14px;font-weight:700;margin-bottom:16px">Logo</h3><app-media-picker [mediaId]="form.get('logoMediaId')?.value" category="settings" (mediaSelected)="form.patchValue({logoMediaId:$event})"></app-media-picker></div></div>
          <div class="card"><div class="card-body"><h3 style="font-size:14px;font-weight:700;margin-bottom:16px">Favicon</h3><app-media-picker [mediaId]="form.get('faviconMediaId')?.value" category="settings" (mediaSelected)="form.patchValue({faviconMediaId:$event})"></app-media-picker></div></div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:24px"><button type="submit" class="btn btn-primary" [disabled]="saving" id="save-settings-btn">{{saving?'Saving...':'💾 Save Settings'}}</button></div>
    </form>
  </div>
` })
export class SettingsComponent implements OnInit {
  form!: FormGroup; saving = false;
  constructor(private fb: FormBuilder, private api: ApiService, private toast: ToastService) {}
  ngOnInit() {
    this.form = this.fb.group({ siteName:[''], email:[''], phone:[''], address:[''], mapEmbedUrl:[''], facebookUrl:[''], instagramUrl:[''], linkedinUrl:[''], logoMediaId:[null], faviconMediaId:[null] });
    this.api.getSettings().subscribe(r => { if(r.success) this.form.patchValue(r.data); });
  }
  submit() { this.saving=true; this.api.updateSettings(this.form.value).subscribe({ next:()=>{this.toast.success('Settings saved!');this.saving=false;}, error:()=>{this.toast.error('Failed');this.saving=false;} }); }
}
