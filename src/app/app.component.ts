import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoadingComponent,
    ConfirmDialogModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {  }
