import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { userModel } from '../../../models/userModel';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [RouterOutlet,
            RouterLink,
            HeaderComponent,
            CommonModule,
            SpinnerComponent],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.css'
})
export class SidebarMenuComponent {
  
  user!: userModel;

  ngOnInit(){
    var userString = localStorage.getItem('user');
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
  }
}
