import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgStyle} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgForOf, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'metacritic';
  aggregateScore: number = 7.0;
  form: FormGroup;
  boxStyles = {
    'width': '50%',
    'box-sizing': 'border-box',
    'padding': '10px',
    'border': '1px solid black'
  };
  containerStyles = {
    'display': 'flex',
    'justify-content': 'space-between'
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {textBoxes: this.fb.array([]),scoreBoxes: this.fb.array([])}
    );
  }

  get textBoxes(): FormArray {
    return this.form.get('textBoxes') as FormArray;
  }

  get scoreBoxes(): FormArray {
    return this.form.get('scoreBoxes') as FormArray;
  }

  addTextBox() {
    this.textBoxes.push(this.fb.control(''));
    this.scoreBoxes.push(this.fb.control(''));
  }

  onSubmit() {
    let iteration = 0;
    this.scoreBoxes.controls.forEach((score) => {
      this.aggregateScore = parseFloat(score.value);
    });
  }
}
