import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  password = '';
  username = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
  const userData = {
    username: this.username,
    password: this.password
  };

  this.authService.register(userData).subscribe({
    next: (res) => {
      console.log('Регистрация успешна', res);
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Ошибка при регистрации', err);
    }
  });
}
}
