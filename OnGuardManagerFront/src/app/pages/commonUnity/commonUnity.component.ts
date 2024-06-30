import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModifyCommonUnityComponent } from './modify-common-unity/modify-common-unity.component';
import { userModel } from '../../models/userModel';
import { unityModel } from '../../models/unityModel';
import { ConfirmDeleteComponent } from '../../shared/components/confirm-delete/confirm-delete.component';
import { CommonUnityService } from '../../services/commonUnity/common-unity.service';

@Component({
  selector: 'app-unity',
  standalone: true,
  imports: [],
  templateUrl: './commonUnity.component.html',
  styleUrl: './commonUnity.component.css'
})
export class CommonUnityComponent {
  commonUnityError:string = "";
  commonUnityList: unityModel[] = []
  user!: userModel;  
  currentFile?: File;

  constructor(private modal:MatDialog, private _unityService:CommonUnityService){
    var userString = localStorage.getItem('user');
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
  }

  ngOnInit():void{
    this.removeActiveClass();
    this.getAllCommonUnities();
  }

  removeActiveClass()
  {
    var element = document.querySelector("li.active");
    if(element !== null)
    {
      element.className = element.className.replaceAll("active", "");
    }

    var currentElement = document.getElementById("commonUnityRef");
    if(currentElement !== null && currentElement.parentElement !== null){
      currentElement.parentElement.className = currentElement.parentElement.className + " active";
    }
  }

  getAllCommonUnities() {
    this.commonUnityError = "";
    this._unityService.getAllCommonUnity().subscribe({
      next:(commonUnityData) => {
        if(commonUnityData)
        {
          this.commonUnityList = commonUnityData;
        }
        else
        {
          this.commonUnityError = "Se produjo un error al obtener las unidades comunes.";
        }
      },
      error: (errorData => {
        this.commonUnityError = errorData;
      })
    });
  }
  openDialog(mode:number, idElement:number):void{
    localStorage.setItem('mode', mode.toString());
    if(idElement !== 0){
      localStorage.setItem('idElement', idElement.toString());
    }
    const dialogRef = this.modal.open(ModifyCommonUnityComponent, {
      width: '400px',
      height: '300px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllCommonUnities()
    })
  }

  delete(id:number):void{
    var specialtySelected = this.commonUnityList.find(cul => cul.id === id);
    if(specialtySelected != null){
      localStorage.setItem("message", "¿Está seguro que desea borrar la unidad " + specialtySelected.name + "?");
      localStorage.setItem("title", "Va a borrar una unidad");
      const dialogRef = this.modal.open(ConfirmDeleteComponent, {
        width: '350px',
        disableClose: true
        
      });

      dialogRef.afterClosed().subscribe(result => {
        this.commonUnityError = "";
        if(result === 'true')
        {
          this._unityService.deleteCommonUnity(id).subscribe({
            next:(commonUnityData) => {
              if(commonUnityData)
              {
                this.getAllCommonUnities();
              }
              else
              {
                this.commonUnityError = "Se produjo un error al borrar la unidad.";
              }
            },
            error: (errorData => {
              this.commonUnityError = errorData;
            })
          });
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
      this._unityService.addCommonUnityByFile(this.currentFile, this.user.centerId).subscribe({
        next: (commonUnityData) => {
          if (commonUnityData) {
            this.getAllCommonUnities();
          }
          else
          {
            this.commonUnityError = commonUnityData;
          }
          this.resetInputFile();
        },
        error: (errorData) => {
          this.commonUnityError = errorData;
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
