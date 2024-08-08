import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewUsersPage } from './view-users.page';

describe('ViewUsersPage', () => {
  let component: ViewUsersPage;
  let fixture: ComponentFixture<ViewUsersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
