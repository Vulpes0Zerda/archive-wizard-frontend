import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-authorization',
  imports: [ReactiveFormsModule],
  templateUrl: './authorization.html',
  styleUrl: './authorization.scss',
})
export class Authorization {
  emailControl = new FormControl();
  passwordControl = new FormControl();
}
