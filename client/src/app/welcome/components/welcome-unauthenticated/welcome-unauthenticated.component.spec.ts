import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WelcomeUnauthenticatedComponent } from './welcome-unauthenticated.component';

describe('WelcomeUnauthenticatedComponent', () => {
  let component: WelcomeUnauthenticatedComponent;
  let fixture: ComponentFixture<WelcomeUnauthenticatedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeUnauthenticatedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeUnauthenticatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
