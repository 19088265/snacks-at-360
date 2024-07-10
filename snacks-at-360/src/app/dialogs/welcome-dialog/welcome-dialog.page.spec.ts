import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeDialogPage } from './welcome-dialog.page';

describe('WelcomeDialogPage', () => {
  let component: WelcomeDialogPage;
  let fixture: ComponentFixture<WelcomeDialogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeDialogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
