import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'metacritic' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('metacritic');
  });

  it('should allow name entry', () => {
    // Initial change detection
    const fixture = TestBed.createComponent(AppComponent);
    const debugElement = fixture.debugElement;
    fixture.detectChanges();

    //Click button and run change detection again
    const addPlayerButton = debugElement.query(By.css('button#addPlayer'));
    addPlayerButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const box = fixture.debugElement.query(By.css('input'));

    //Enter input and ensure it shows up
    const input = box.nativeElement;
    input.value = "Henry";
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.form.get('textBoxes')?.value[0]).toEqual("Henry")
  });

  it('should update aggregate score on submit', () => {
    // Set tests to "unroll"
    const testCases = [7, 3.0, 9.0];

    testCases.forEach((scoreGuess: number) => {
      const fixture = TestBed.createComponent(AppComponent);
      const debugElement = fixture.debugElement;
      fixture.detectChanges();
      //Click button and run change detection again
      const addPlayerButton = debugElement.query(By.css('button#addPlayer'));
      addPlayerButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      const scoreBox: DebugElement = fixture.debugElement.queryAll(By.css('input'))[1];
      const scoreInput = scoreBox.nativeElement;
      scoreInput.value = scoreGuess;
      scoreInput.dispatchEvent(new Event('input'));
      debugElement.query(By.css('button#submit')).triggerEventHandler('click', null);
      fixture.detectChanges();
      const app: AppComponent = fixture.componentInstance;
      expect(app.aggregateScore).toEqual(scoreGuess);
    });
  });
});
