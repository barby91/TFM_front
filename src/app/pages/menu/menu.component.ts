import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { userModel } from '../../models/userModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  user!: userModel;

  constructor(private router:Router){
    this.removeActiveClass();
    var userString = localStorage.getItem('user');
    var first = localStorage.getItem('first');
    if(first == "true"){
      localStorage.setItem('first', "false");
      window.location.reload();
    }
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
  }

  removeActiveClass()
  {
    var element = document.querySelector("li.active");
    if(element !== null)
    {
      element.className = element.className.replaceAll("active", "");
    }

    var currentElement = document.getElementById("inicioRef");
    if(currentElement !== null && currentElement.parentElement !== null){
      currentElement.parentElement.className = currentElement.parentElement.className + " active";
    }
  }

  users(){
    this.router.navigateByUrl('/users');
  }

  specialties(){
    this.router.navigateByUrl('/specialties');
  }

  commonUnities(){
    this.router.navigateByUrl('/commonUnity');
  }

  workingCalendar(){
    this.router.navigateByUrl('/calendar');
  }

  guardsCalendar(){
    this.router.navigateByUrl('/guard');
  }

  checkAskedHolidays(){
    this.router.navigateByUrl('/aproveCalendar');
  }
}