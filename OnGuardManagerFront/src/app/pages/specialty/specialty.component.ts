import { Component } from '@angular/core';
import { specialtyModel } from '../../models/specialtyModel';
import { Router } from '@angular/router';
import { SpecialtyServiceService } from '../../services/specialty/specialty-service.service';
import { ModifySpecialtyComponent } from './modify-specialty/modify-specialty.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../shared/components/confirm-delete/confirm-delete.component';
import { userModel } from '../../models/userModel';

@Component({
  selector: 'app-specialty',
  standalone: true,
  imports: [],
  templateUrl: './specialty.component.html',
  styleUrl: './specialty.component.css'
})
export class SpecialtyComponent {
  specialtyError:string = "";
  specialtyList: specialtyModel[] = []
  user!: userModel;  
  currentFile?: File;

  constructor(private router:Router, private modal:MatDialog, private _specialtyService:SpecialtyServiceService){
    var userString = localStorage.getItem('user');
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
  }

  ngOnInit():void{
    this.removeActiveClass();
    this.getAllSpecialties();
  }

  removeActiveClass()
  {
    var element = document.querySelector("li.active");
    if(element !== null)
    {
      element.className = element.className.replaceAll("active", "");
    }

    var currentElement = document.getElementById("sepecialtiesRef");
    if(currentElement !== null && currentElement.parentElement !== null){
      currentElement.parentElement.className = currentElement.parentElement.className + " active";
    }
  }

  getAllSpecialties() {
    this.specialtyError = "";
    this._specialtyService.getAllSpecialties(this.user.centerId).subscribe({
      next:(specialtyData) => {
        if(specialtyData)
        {
          this.specialtyList = specialtyData;
        }
        else
        {
          this.specialtyError = "Se produjo un error al obtener las especialidades.";
        }
      },
      error: (errorData => {
        this.specialtyError = errorData;
      })
    });
  }
  openDialog(mode:number, idElement:number):void{
    localStorage.setItem('mode', mode.toString());
    if(idElement !== 0){
      localStorage.setItem('idElement', idElement.toString());
    }
    const dialogRef = this.modal.open(ModifySpecialtyComponent, {
      width: '600px',
      height: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllSpecialties()
    })
  }

  delete(id:number):void{
    var specialtySelected = this.specialtyList.find(sl => sl.id === id);
    if(specialtySelected != null){
      localStorage.setItem("message", "¿Está seguro que desea borrar la especialidad " + specialtySelected.name + "?");
      localStorage.setItem("title", "Va a borrar una especialidad");
      const dialogRef = this.modal.open(ConfirmDeleteComponent, {
        width: '350px',
        disableClose: true
        
      });

      dialogRef.afterClosed().subscribe(result => {
        this.specialtyError = "";
        if(result === 'true')
        {
          console.log('result es true');
          this._specialtyService.deleteSpecialty(id).subscribe({
            next:(specialtyData) => {
              if(specialtyData)
              {
                this.getAllSpecialties();
              }
              else
              {
                this.specialtyError = "Se produjo un error al borrar la especialidad.";
              }
            },
            error: (errorData => {
              this.specialtyError = errorData;
            })
          });
        }
        else
        {
          console.log('result es false');
        }
      });
    }
  }

  selectFile(event: any): void {
    this.currentFile = event.target.files.item(0);
    this.upload();
  }

  upload(): void {
    if (this.currentFile) {
      this._specialtyService.addSpecialtyByFile(this.currentFile, this.user.centerId).subscribe({
        next: (userData) => {
          console.log(userData);
          if (userData) {
            this.getAllSpecialties();
          }
          else
          {
            this.specialtyError = userData;
          }
          this.resetInputFile();
        },
        error: (errorData) => {
          console.log(errorData);
          this.specialtyError = errorData;
          this.resetInputFile();
        },
      });
    }
  }

  resetInputFile(){
    this.currentFile = undefined;
          var input = <HTMLInputElement>document.getElementById("fileInput");
          if(input != null)
          {
            input.value = "";
          }
  }
}

