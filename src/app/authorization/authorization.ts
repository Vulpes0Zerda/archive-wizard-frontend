import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-authorization',
  imports: [FormField, FormField],
  templateUrl: './authorization.html',
  styleUrl: './authorization.scss',
})
export class Authorization {
  protected static pattern: String = "/^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+\-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;"

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
    required(schemaPath.password);
    },
    {
      submission: {
        action: (field)=> {return this.apiService.login({email: field().value().email, password: field().value().password})}
        }
      }
    }
  );
}
