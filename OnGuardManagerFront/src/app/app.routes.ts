import { Routes } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { LoginComponent } from './auth/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { SpecialtyComponent } from './pages/specialty/specialty.component';
import { CalendarComponent } from './pages/calendar/calendar/calendar.component';
import { AproveAskedHolidayComponent } from './pages/calendar/aprove-asked-holiday/aprove-asked-holiday.component';
import { CommonUnityComponent } from './pages/commonUnity/commonUnity.component';
import { GuardComponent } from './pages/guards/guard/guard.component';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch: 'full'},
    {path:'login', component:LoginComponent},
    {path:'inicio', component:MenuComponent},
    {path:'users', component:UserComponent},
    {path:'specialties', component:SpecialtyComponent},
    {path:'calendar', component:CalendarComponent},
    {path:'aproveCalendar', component:AproveAskedHolidayComponent},
    {path:'commonUnity', component:CommonUnityComponent},
    {path:'guard', component:GuardComponent}
];
