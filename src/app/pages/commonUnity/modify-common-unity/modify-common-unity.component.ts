import { Component } from '@angular/core';
import { userModel } from '../../../models/userModel';
import { unityModel } from '../../../models/unityModel';
import { FormControl, FormGroup, MinValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonUnityService } from '../../../services/commonUnity/common-unity.service';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-modify-common-unity',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButton, ReactiveFormsModule],
  templateUrl: './modify-common-unity.component.html',
  styleUrl: './modify-common-unity.component.css'
})
export class ModifyCommonUnityComponent {
  commonUnityError:string = "";
  newUnityForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required),
    maxByDay: new FormControl(0, Validators.min(1)),
    maxByDayWeekend: new FormControl(0, Validators.min(1)),
    idCenter: new FormControl(0)
  });;
  user!:userModel;
  mode:number = 0;
  untiy!:unityModel;
  submitButton:string="Crear";
  title:string="Añadir Nueva Unidad Común";

  ///constructor
  constructor(public dialogRef: MatDialogRef<ModifyCommonUnityComponent>, private _commonUnityService:CommonUnityService){
  }

  ngOnInit(){
    var userString = localStorage.getItem('user');
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
    this.mode = Number(localStorage.getItem('mode'));

    //si el mode es 1 será modo edición, obtenemos los datos
    if(this.mode === 1)
    {
      this.submitButton = "Modificar";
      this.title = "Modificar Unidad Común";
      var idElement = Number(localStorage.getItem('idElement'));
      this._commonUnityService.getCommonUnity(idElement).subscribe({
        next:(unitycommonData) => {
          if(unitycommonData)
          {
            this.untiy = unitycommonData as unityModel;
            this.newUnityForm = new FormGroup({
              name: new FormControl(this.untiy.name, [Validators.required]),
              description: new FormControl(this.untiy.description, Validators.required),
              maxByDay: new FormControl(this.untiy.maxByDay, Validators.min(1)),
              maxByDayWeekend: new FormControl(this.untiy.maxByDayWeekend, Validators.min(1)),
              idCenter: new FormControl(this.user.centerId)
            });
          }
          else
          {
            this.commonUnityError = 'Error. Esa unidad no existe.';
          }
        },
        error: (errorData => {
          this.commonUnityError = errorData;
        })
      });
    }
  }

  get name(){
    return this.newUnityForm.controls['name'];
  }

  get description(){
    return this.newUnityForm.controls['description'];
  }

  get maxByDay(){
    return this.newUnityForm.controls['maxByDay'];
  }

  get maxByDayWeekend(){
    return this.newUnityForm.controls['maxByDayWeekend'];
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if(this.newUnityForm.valid){
      if(this.mode === 1){
        var modifyUnity = this.newUnityForm.value as unityModel;
        this.untiy.name = modifyUnity.name;
        this.untiy.description = modifyUnity.description;
        this.untiy.maxByDay = modifyUnity.maxByDay;
        this.untiy.maxByDayWeekend = modifyUnity.maxByDayWeekend;
        this._commonUnityService.updateCommonUnity(this.untiy).subscribe({
          next:(untiyData) => {
            if(untiyData)
            {
              this.close();
            }
            else
            {
              this.commonUnityError = 'Error. No se ha podido actualizar la unidad.';
            }
          },
          error: (errorData => {
            this.commonUnityError = errorData;
          })
        });
      }
      else{
        this.newUnityForm.controls['idCenter'].setValue(this.user.centerId);
        this._commonUnityService.addCommonUnity(this.newUnityForm.value as unityModel).subscribe({
          next:(specialtyData) => {
            if(specialtyData)
            {
              this.close();
            }
            else
            {
              this.commonUnityError = 'Error. Ya existe una unidad con ese nombre.';
            }
          },
          error: (errorData => {
            this.commonUnityError = errorData;
          })
        });
      }
    }
    else{
      this.newUnityForm.markAllAsTouched();
      this.commonUnityError = "Error. Introduzca todos los datos.";
    }
  }

  delete(id:number){
    this._commonUnityService.deleteCommonUnity(id).subscribe({
      next:(sunityData) => {
        if(sunityData)
        {
          this.close();
        }
        else
        {
          this.commonUnityError = 'Error. No se ha podido borrar la unidad.';
        }
      },
      error: (errorData => {
        this.commonUnityError = errorData;
      })
    });
  }
}
