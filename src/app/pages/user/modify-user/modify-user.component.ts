import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserServiceService } from '../../../services/user/user-service.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { userModel } from '../../../models/userModel';
import { realUserModel } from '../../../models/realUserModel';
import { CommonModule } from '@angular/common';
import { specialtyModel } from '../../../models/specialtyModel';
import { SpecialtyServiceService } from '../../../services/specialty/specialty-service.service';
import { RolServiceService } from '../../../services/rol/rol-service.service';
import { LevelServiceService } from '../../../services/level/level-service.service';
import { unityModel } from '../../../models/unityModel';
import { levelModel } from '../../../models/levelModel';
import { rolModel } from '../../../models/rolModel';

@Component({
  selector: 'app-modify-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatButton, MatDialogModule],
  templateUrl: './modify-user.component.html',
  styleUrl: './modify-user.component.css'
})
export class ModifyUserComponent {
  userError:string = "";
  newUserForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', Validators.required),
    password: new FormControl('1234', Validators.required),
    specialtyId: new FormControl(0, Validators.min(1)),
    centerId: new FormControl(0),
    levelId: new FormControl(0, Validators.min(1)),
    rolId: new FormControl(0, Validators.min(1)),
    unityId: new FormControl(0, Validators.min(1))
  });
  globalUser!:userModel;
  mode:number = 0;
  user!:realUserModel;
  submitButton:string="Crear";
  rolList!:rolModel[];
  levelList!: levelModel[];
  specialtyList!: specialtyModel[];
  unityList!: unityModel[];
  isDisabled: boolean;
  title:string="Añadir Nuevo Usuario";

  ///constructor
  constructor(public dialogRef: MatDialogRef<ModifyUserComponent>, private _userService:UserServiceService, 
              private _specialtyService:SpecialtyServiceService, private _rolService:RolServiceService,
              private _levelService:LevelServiceService){
                
    ReactiveFormsModule.withConfig({ callSetDisabledState: 'whenDisabledForLegacyCode' });

    var userString = localStorage.getItem('user');
    if(userString != null)
    {
      this.globalUser = JSON.parse(userString as string);
    }

    this.mode = Number(localStorage.getItem('mode'));
    this.isDisabled = this.mode == 1 && this.globalUser.rolName != "admin";
    this._specialtyService.getAllSpecialties(this.globalUser.centerId).subscribe({
      next:(specialtyData) => {
        if(specialtyData)
        {
          this.specialtyList =  specialtyData as specialtyModel[];
        }
        else
        {
          this.userError = 'Error. No se han podido obtener las especialidades.';
        }
      },
      error: (errorData => {
        this.userError = errorData;
      })
    });

    this._rolService.getAllRols().subscribe({
      next:(rolData) => {
        if(rolData)
        {
          this.rolList =  rolData as rolModel[];
        }
        else
        {
          this.userError = 'Error. No se han podido obtener los roles.';
        }
      },
      error: (errorData => {
        this.userError = errorData;
      })
    });

    this._levelService.getAllLevels().subscribe({
      next:(levelData) => {
        if(levelData)
        {
          this.levelList =  levelData as levelModel[];
        }
        else
        {
          this.userError = 'Error. No se han podido obtener los niveles.';
        }
      },
      error: (errorData => {
        this.userError = errorData;
      })
    });
  }

  ngOnInit(){
    //si el mode es 1 será modo edición, obtenemos los datos
    if(this.mode === 1)
    {
      this.submitButton = "Modificar";
      this.title = "Modificar Usuario";
      var idElement = Number(localStorage.getItem('idElement'));
      
      this._userService.getUser(idElement).subscribe({
        next:(userData) => {
          if(userData)
          {
            this.user = userData as realUserModel;
            this.newUserForm = new FormGroup({
              name: new FormControl(this.user.name, [Validators.required]),
              surname: new FormControl(this.user.surname, Validators.required),
              password: new FormControl(this.user.password, Validators.required),
              specialtyId: new FormControl(this.user.specialtyId, Validators.min(1)),
              centerId: new FormControl(this.user.centerId),
              levelId: new FormControl(this.user.levelId, Validators.min(1)),
              rolId: new FormControl(this.user.rolId, Validators.min(1)),
              unityId: new FormControl(this.user.unityId, Validators.min(1))
            });

            if(this.mode == 1 && this.globalUser.rolName != "admin")
            {
              this.newUserForm.get('name')?.disable();
              this.newUserForm.get('surname')?.disable();
            }

            var buttonParent = document.getElementById('levelDropdown');
            if(buttonParent !== null){
              var level = this.levelList.find(l => l.id == this.user.levelId);
              if(level !== undefined){
                buttonParent.textContent = level.name;
              }
            }

            var buttonParent = document.getElementById('rolDropdown');
            if(buttonParent !== null){
              var rol = this.rolList.find(l => l.id === this.user.rolId);
              if(rol !== undefined){
                buttonParent.textContent = rol.name;
              }
            }

            var buttonParent = document.getElementById('specialtyDropdown');
            if(buttonParent !== null){
              var specialty = this.specialtyList.find(l => l.id === this.user.specialtyId);
              console.log(specialty);
              if(specialty !== undefined){
                buttonParent.textContent = specialty.name;
                this.unityList = specialty.unities;
              }
            }

            var buttonParent = document.getElementById('unityDropdown');
            if(buttonParent !== null){
              var unity = this.unityList.find(l => l.id === this.user.unityId);
              if(unity !== undefined){
                buttonParent.textContent = unity.name;
              }
            }
          }
          else
          {
            this.userError = 'Error. Este usuario no existe.';
          }
        },
        error: (errorData => {
          this.userError = errorData;
        })
      });
    }
  }

  get name(){
    return this.newUserForm.controls['name'];
  }

  get surname(){
    return this.newUserForm.controls['surname'];
  }

  get password(){
    return this.newUserForm.controls['password'];
  }

  get rol(){
    return this.newUserForm.controls['rolId'];
  }

  get level(){
    return this.newUserForm.controls['levelId'];
  }

  get specialty(){
    return this.newUserForm.controls['specialtyId'];
  }

  get unity(){
    return this.newUserForm.controls['unityId'];
  }

  close() {
    this.dialogRef.close();
  }

  selectedSpecialty(element:any, idSpecialty:number)
  {
    this.newUserForm.controls.specialtyId.setValue(idSpecialty);
    var specialtyList = this.specialtyList.find(s => s.id === idSpecialty);
    if(specialtyList !== null && specialtyList !== undefined){
      this.unityList = specialtyList.unities;
    }
    var buttonParent = document.getElementById('specialtyDropdown');
    if(buttonParent !== null){
      buttonParent.textContent = element.textContent ;
    }
  }

  selectedUnity(element:any, idUnity:number)
  {
    this.newUserForm.controls.unityId.setValue(idUnity);
    var buttonParent = document.getElementById('unityDropdown');
    if(buttonParent !== null){
      buttonParent.textContent = element.textContent ;
    }
  }

  selectedLevel(element:any, idLevel:number)
  {
    this.newUserForm.controls.levelId.setValue(idLevel);
    var buttonParent = document.getElementById('levelDropdown');
    if(buttonParent !== null){
      buttonParent.textContent = element.textContent ;
    }
  }

  selectedRol(element:any,idRol:number)
  {
    this.newUserForm.controls.rolId.setValue(idRol);
    var buttonParent = document.getElementById('rolDropdown');
    if(buttonParent !== null){
      buttonParent.textContent = element.textContent ;
    }
  }


  save() {
    if(this.mode == 1 && this.globalUser.rolName != "admin")
    {
      this.newUserForm.get('name')?.enable();
      this.newUserForm.get('surname')?.enable();
    }
    if(this.newUserForm.valid){
      if(this.mode === 1){
        var modifyUser = this.newUserForm.value as realUserModel;
        this.user.name = modifyUser.name;
        this.user.surname = modifyUser.surname;
        this.user.password = modifyUser.password;
        this.user.specialtyId = modifyUser.specialtyId;
        this.user.rolId = modifyUser.rolId;
        this.user.levelId = modifyUser.levelId;
        this.user.unityId = modifyUser.unityId;
        this._userService.updateUser(this.user).subscribe({
          next:(userData) => {
            if(userData)
            {
              this.close();
            }
            else
            {
              this.userError = 'Error. No se ha podido actualizar el usuario.';
            }
          },
          error: (errorData => {
            this.userError = errorData;
          })
        });
      }
      else{
        this._userService.addUser(this.newUserForm.value as realUserModel, this.globalUser.centerId).subscribe({
          next:(userData) => {
            if(userData)
            {
              this.close();
            }
            else
            {
              this.userError = 'Error. Ya existe un usuario con ese nombre.';
            }
          },
          error: (errorData => {
            this.userError = errorData;
          })
        });
      }
    }
    else{
      this.newUserForm.markAllAsTouched();
      this.userError = "Error. Introduzca todos los datos.";
    }

    if(this.mode == 1 && this.globalUser.rolName != "admin")
      {
        this.newUserForm.get('name')?.disable();
        this.newUserForm.get('surname')?.disable();
      }
  }

  delete(id:number){
    this._userService.deleteUser(id).subscribe({
      next:(userData) => {
        if(userData)
        {
          this.close();
        }
        else
        {
          this.userError = 'Error. No se ha podido borrar el usuario.';
        }
      },
      error: (errorData => {
        this.userError = errorData;
      })
    });
  }
}
