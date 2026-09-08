import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, pattern, required } from '@angular/forms/signals';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-authorization',
  imports: [FormField, FormField],
  templateUrl: './authorization.html',
  styleUrl: './authorization.scss',
})
export class Authorization {

  protected apiService : ApiService;
  
  constructor(apiService : ApiService){
    this.apiService = apiService;
  }


  loginModel = signal({
    email: '',
    password: ''
  });

  loginForm = form(
    this.loginModel,
    (schemaPath) => {
    required(schemaPath.email);
    pattern(schemaPath.email, /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i);
    required(schemaPath.password);
    })

  onSubmit(event: Event){
    event.preventDefault();
    this.apiService.login(this.loginModel())

    
  }
};

