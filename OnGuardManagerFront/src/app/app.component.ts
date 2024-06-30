import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SidebarMenuComponent } from './shared/components/sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HttpClientModule, 
    SidebarMenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  static visibleSidebar: any = false;
  title = 'OnGuardManagerFront';
}
