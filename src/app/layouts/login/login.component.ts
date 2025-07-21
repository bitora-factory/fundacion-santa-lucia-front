import { Component, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    DrawerModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PasswordModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input() visibleLogin: boolean = false;
  email: string = '';
  password: string = '';

  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);

  onLoginClick(): void {
    this._authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.show('Ingresó correctamente');
        console.log('login', response);
      },
      error: () => {
        this.show('Credenciales incorrectas');
      }
    });
  }

  show(message: string) {
    this._messageService.add({ severity: 'info', summary: 'Info', detail: message, life: 3000 });
  }
}
