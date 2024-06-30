import { Component } from '@angular/core';
import { userModel } from '../../../models/userModel';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AskedHolidayServiceService } from '../../../services/askedHoliday/asked-holiday-service.service';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { MatButton } from '@angular/material/button';
import { CommonModule, JsonPipe } from '@angular/common';
import { askedHolidayModel } from '../../../models/askedHolidayModel';

@Component({
  selector: 'app-show-asked-holidays',
  standalone: true,
  imports: [MatButton, MatDialogModule, CommonModule],
  templateUrl: './show-asked-holidays.component.html',
  styleUrl: './show-asked-holidays.component.css'
})
export class ShowAskedHolidaysComponent {
  user!: userModel;
  askedHolidayError:string = "";
  seeAsked:boolean;
  seeAproved:boolean;
  seeCancelled:boolean;
  filteredAskedHolidayList:askedHolidayModel[];
  
  constructor(private modal:MatDialog, private _askedHolidayService:AskedHolidayServiceService){
    var userString = localStorage.getItem('user');
    this.seeAsked = true;
    this.seeAproved = true;
    this.seeCancelled = true;
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
    this.filteredAskedHolidayList = this.user.askedHolidays;
  }

  checkChange(element:any){
    if(element.id.includes("Aproved")){
      console.log("check aproved");
      this.seeAproved = !this.seeAproved 
    }
    if(element.id.includes("Asked")){
      console.log("check asked");
      this.seeAsked = !this.seeAsked
    }
    if(element.id.includes("Cancelled")){
      console.log("check cancelled");
      this.seeCancelled = !this.seeCancelled;
    }

    this.filterAskedHoliday();
  }

  delete(id:number):void{
    var selectedHoliday = this.user.askedHolidays.find(ah => ah.id === id);
    if(selectedHoliday != null){
      var type = "las Vacaciones del periodo " + selectedHoliday.period;
      if(selectedHoliday.period === "Weekend"){
        type = "el fin de semana";
      }
      localStorage.setItem("message", "Va a cancelar " + type +
                                      " del día " + new Date(selectedHoliday.dateFrom).toLocaleDateString("es-ES") + 
                                      " al día " + new Date(selectedHoliday.dateTo).toLocaleDateString("es-ES") 
                                      + ".\n¿Está seguro?")
      
      localStorage.setItem("title", "Va a cancelar una solicitud");
      const dialogRef = this.modal.open(ConfirmDeleteComponent, {
        width: '350px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        this.askedHolidayError = "";
        if(result === 'true')
        {
          if(selectedHoliday != null){
            selectedHoliday.statusDes = "Cancelado";
            this._askedHolidayService.updateAskedHoliday(selectedHoliday).subscribe({
              next:(userLoggedData) => {
                  if(userLoggedData)
                  {
                    this.user = userLoggedData as userModel;
                    localStorage.setItem("user", JSON.stringify(this.user));
                    this.filteredAskedHolidayList = this.user.askedHolidays;
                    this.filterAskedHoliday();
                  }
                  else
                  {
                    this.askedHolidayError = "Se produjo un error al cancelar la solicitud.";
                  }
                },
                error: (errorData => {
                  this.askedHolidayError = errorData;
                })
            });
          }
          else
          {
            this.askedHolidayError = "No se ha podido actualizar la solicitud";
          }
        }
      })
    }
  }

  filterAskedHoliday()
  {
    //filtramos el listado
    this.filteredAskedHolidayList = this.user.askedHolidays
    if(!this.seeAproved) {
      this.filteredAskedHolidayList = this.filteredAskedHolidayList.filter(pa => pa.statusDes != "Aprobado");
    }
    if(!this.seeAsked) {
      this.filteredAskedHolidayList = this.filteredAskedHolidayList.filter(pa => pa.statusDes != "Solicitado");
    }
    if(!this.seeCancelled) {
      this.filteredAskedHolidayList = this.filteredAskedHolidayList.filter(pa => pa.statusDes != "Cancelado");
    }
  }
}
