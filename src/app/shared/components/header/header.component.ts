import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { userModel } from '../../../models/userModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
            RouterOutlet,
            CommonModule
           ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  visibleSidebar: any;
  user: userModel | undefined;

  ngOnInit(){
    if(window.location.href.includes('login') || window.location.href.endsWith('/'))
    {
      localStorage.setItem("visibleSidebar", "false")
      this.user = undefined;
      localStorage.setItem('user', JSON.stringify(this.user));
    }

    if(localStorage.getItem("visibleSidebar") === "false"){
      this.closesidebar();
    }

    var userString = localStorage.getItem('user');
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
  }
  
  sidebarmenu(){
    if(!window.location.href.includes('login')){
      this.closesidebar();
    }
  }

  closesidebar(){
    var sidebar = document.getElementById('sidebar');
    if(sidebar != null){
      if(sidebar.className.includes('active')){
        sidebar.className = sidebar.className.replace('active', '');
        localStorage.setItem("visibleSidebar", "true")
      }
      else{
        sidebar.className += 'active';
        localStorage.setItem("visibleSidebar", "false")
      }
    }
  }

  getUserName()
  {
    if(this.user != undefined){
      return this.user.nameSurname;
    }
    else{
      return "";
    }
  }

  getRolName(){
    if(this.user != undefined){
      return this.user.rolName;
    }
    else{
      return "";
    }
  }
}
