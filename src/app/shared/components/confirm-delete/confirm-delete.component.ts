import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [MatButton, MatDialogModule],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.css'
})
export class ConfirmDeleteComponent {
  message:string|null;
  title: string|null;

  constructor(){
    this.message = localStorage.getItem("message");
    this.title = localStorage.getItem("title");
  }

}
