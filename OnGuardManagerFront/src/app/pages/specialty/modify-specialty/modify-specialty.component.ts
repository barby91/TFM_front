import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { specialtyModel } from '../../../models/specialtyModel';
import { SpecialtyServiceService } from '../../../services/specialty/specialty-service.service';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { userModel } from '../../../models/userModel';
import { unityModel } from '../../../models/unityModel';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-modify-specialty',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButton, MatDialogModule],
  templateUrl: './modify-specialty.component.html',
  styleUrl: './modify-specialty.component.css'
})
export class ModifySpecialtyComponent {
  specialtyError:string = "";
  newSpecialtyForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required)
  });;
  user!:userModel;
  mode:number = 0;
  specialty!:specialtyModel;
  submitButton:string="Crear";
  title:string="Añadir Nueva Especialidad";

  ///constructor
  constructor(public dialogRef: MatDialogRef<ModifySpecialtyComponent>, private modal:MatDialog, private _specialtyService:SpecialtyServiceService){
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
      this.title = "Modificar Especialidad";
      var idElement = Number(localStorage.getItem('idElement'));
      this._specialtyService.getSpecialty(idElement).subscribe({
        next:(specialtyData) => {
          if(specialtyData)
          {
            this.specialty = specialtyData as specialtyModel;
            this.newSpecialtyForm = new FormGroup({
              name: new FormControl(this.specialty.name, [Validators.required]),
              description: new FormControl(this.specialty.description, Validators.required)
            });
          }
          else
          {
            this.specialtyError = 'Error. Esa especialidad no existe.';
          }
        },
        error: (errorData => {
          this.specialtyError = errorData;
        })
      });
    }
  }

  get name(){
    return this.newSpecialtyForm.controls['name'];
  }

  get description(){
    return this.newSpecialtyForm.controls['description'];
  }

  close() {
    this.dialogRef.close();
  }

  addRow(){
    var tr = "<tr> <td hidden>0</td>\
                   <td><input type=\"text\" class=\"form-control\" placeholder=\"nombre\"></td>\
                   <td><input type=\"text\" class=\"form-control\" placeholder=\"nombre\"></td> </tr>";
    var tableRef = (<HTMLTableElement>document.getElementById("unityTable")).tBodies[0];
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = tr;
  }

  removeRow(unity: unityModel){
    localStorage.setItem("message", "¿Está seguro que desea borrar la unidad " + unity.name + "?");
    localStorage.setItem("title", "Va a borrar una unidad");
    const dialogRef = this.modal.open(ConfirmDeleteComponent, {
      width: '350px',
      disableClose: true
      
    });

    dialogRef.afterClosed().subscribe(result => {
      this.specialtyError = "";
      if(result === 'true')
      {
        const index = this.specialty.unities.indexOf(unity);
        this.specialty.unities.splice(index, 1);
      }
      else
      {
        console.log('result es false');
      }
    });
  }

  save() {
    if(this.newSpecialtyForm.valid){
      if(this.mode === 1){
        var modifySpecialty = this.newSpecialtyForm.value as specialtyModel;
        this.specialty.name = modifySpecialty.name;
        this.specialty.description = modifySpecialty.description;
        var tableRef = (<HTMLTableElement>document.getElementById("unityTable")).tBodies[0];
        this.specialty.unities = [];
        for(var i = tableRef.children.length-1; i >= 0; i--)
        {
          var id = (<HTMLTableElement>tableRef.children[i].children[0]).innerText;
          var name = (<HTMLInputElement>tableRef.children[i].children[1].children[0]).value;
          var description = (<HTMLInputElement>tableRef.children[i].children[2].children[0]).value;     
          if(id === '0'){     
            tableRef.removeChild(tableRef.children[i]);    
          }   
          if(name != null && description != null){
            let unity = new unityModel(Number(id), name, description);     
            this.specialty.unities.push(unity);
          }
        }
        this._specialtyService.updateSpecialty(this.specialty).subscribe({
          next:(specialtyData) => {
            if(specialtyData)
            {
              this.close();
            }
            else
            {
              this.specialtyError = 'Error. No se ha podido actualizar la especialidad.';
            }
          },
          error: (errorData => {
            this.specialtyError = errorData;
          })
        });
      }
      else{
        var tableRef = (<HTMLTableElement>document.getElementById("unityTable")).tBodies[0];
        this.specialty = this.newSpecialtyForm.value as specialtyModel;
        this.specialty.unities = [];
        for(var i = tableRef.children.length-1; i >= 0; i--)
        {
          var id = (<HTMLTableElement>tableRef.children[i].children[0]).innerText;
          var name = (<HTMLInputElement>tableRef.children[i].children[1].children[0]).value;
          var description = (<HTMLInputElement>tableRef.children[i].children[2].children[0]).value;     
          if(id === '0'){     
            tableRef.removeChild(tableRef.children[i]);    
          }   
          if(name != null && description != null){
            let unity = new unityModel(Number(id), name, description);     
            this.specialty.unities.push(unity);
          }
        }
        this._specialtyService.addSpecialty(this.specialty, this.user.centerId).subscribe({
          next:(specialtyData) => {
            if(specialtyData)
            {
              this.close();
            }
            else
            {
              this.specialtyError = 'Error. Ya existe una especialidad con ese nombre.';
            }
          },
          error: (errorData => {
            this.specialtyError = errorData;
          })
        });
      }
    }
    else{
      this.newSpecialtyForm.markAllAsTouched();
      this.specialtyError = "Error. Introduzca todos los datos.";
    }
  }

  delete(id:number){
    this._specialtyService.deleteSpecialty(id).subscribe({
      next:(specialtyData) => {
        if(specialtyData)
        {
          this.close();
        }
        else
        {
          this.specialtyError = 'Error. No se ha podido borrar la especialidad.';
        }
      },
      error: (errorData => {
        this.specialtyError = errorData;
      })
    });
  }
}
