import { Component } from '@angular/core';
import { pendingAskedHolidayModel } from '../../../models/pendingAskedHolidayModel';
import { MatDialog } from '@angular/material/dialog';
import { AskedHolidayServiceService } from '../../../services/askedHoliday/asked-holiday-service.service';
import { userModel } from '../../../models/userModel';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { askedHolidayModel } from '../../../models/askedHolidayModel';

@Component({
  selector: 'app-aprove-asked-holiday',
  standalone: true,
  imports: [],
  templateUrl: './aprove-asked-holiday.component.html',
  styleUrl: './aprove-asked-holiday.component.css'
})
export class AproveAskedHolidayComponent {
  pendingAskedHolidayError:string = "";
  user!: userModel;
  pendingAskingHolidayList!: pendingAskedHolidayModel[];

  constructor(private modal:MatDialog, private _askedHolidayService:AskedHolidayServiceService){
    this.removeActiveClass();
    var userString = localStorage.getItem('user');
    if(userString !== null)
    {
      this.user = JSON.parse(userString as string);
    }
    _askedHolidayService.getAllAskedHolidaysByCenterId(this.user.centerId, this.user.id).subscribe({
      next:(pendingAskedHolidayData) => {
          if(pendingAskedHolidayData)
          {
            this.pendingAskingHolidayList = pendingAskedHolidayData
          }
          else
          {
            this.pendingAskedHolidayError = "Se produjo un error al cancelar la solicitud.";
          }
        },
        error: (errorData => {
          this.pendingAskedHolidayError = errorData;
        })
    });
  }

  removeActiveClass()
  {
    var element = document.querySelector("li.active");
    if(element !== null)
    {
      element.className = element.className.replaceAll("active", "");
    }

    var currentElement = document.getElementById("aproveCalendarRef");
    if(currentElement !== null && currentElement.parentElement !== null){
      currentElement.parentElement.className = currentElement.parentElement.className + " active";
    }
  }
  changeStatus(id:number, status:string, ){
    var selectedHoliday = this.pendingAskingHolidayList.find(ah => ah.id === id);
    if(selectedHoliday != null){
      var periodMessage = "las vacaciones del periodo " + selectedHoliday.period;
      var startMessage = "";
      if (selectedHoliday.period === "Weekend"){
        periodMessage = "el fin de semana ";
      }
      
      if(status === "Aprobado"){
        startMessage = "Va a aprobar ";
      } else{
        startMessage = "Va a cancelar ";
      }

      localStorage.setItem("message", startMessage + periodMessage + 
                                      " del día " + new Date(selectedHoliday.dateFrom).toLocaleDateString("es-ES") + 
                                      " al día " + new Date(selectedHoliday.dateTo).toLocaleDateString("es-ES") 
                                      + ".\n¿Está seguro?");

      localStorage.setItem("title", startMessage + "una solicitud");
    
      const dialogRef = this.modal.open(ConfirmDeleteComponent, {
        width: '350px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        this.pendingAskedHolidayError = "";
        if(result === 'true')
        {
          if(selectedHoliday != null){
            var selectedHolidayModel = new askedHolidayModel();
            selectedHolidayModel.pendingAskedHolidayToAskedHoliday(selectedHoliday, status, this.user.centerId);
            this._askedHolidayService.updateAskedHoliday(selectedHolidayModel).subscribe({
              next:(userLoggedData) => {
                if(userLoggedData)
                {
                  window.location.reload();
                }
                else
                {
                  this.pendingAskedHolidayError = "Se produjo un error al aceptar la solicitud.";
                }
              },
              error: (errorData => {
                this.pendingAskedHolidayError = errorData;
              })
            });
          } else {
            this.pendingAskedHolidayError = "No se ha podido actualizar la solicitud";
          }
        }
      })        
    }
    else
    {
      this.pendingAskedHolidayError = "No se ha podido actualizar la solicitud";
    }
  }
}