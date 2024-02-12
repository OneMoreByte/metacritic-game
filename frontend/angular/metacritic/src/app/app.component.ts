import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'metacritic';
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({textBoxes: this.fb.array([])});
  }

  get textBoxes(): FormArray {
    return this.form.get('textBoxes') as FormArray;
  }

  addTextBox() {
    this.textBoxes.push(this.fb.control(''));
  }

  onSubmit() {
    console.log("I'm submitting something for real");
  }
}
