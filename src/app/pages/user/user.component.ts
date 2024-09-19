import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../services/user/user-service.service';
import { userModel } from '../../models/userModel';
import { specialtyModel } from '../../models/specialtyModel';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../../shared/components/confirm-delete/confirm-delete.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UploadFilesService } from '../../services/files/upload-files.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  userError:string = "";
  userList: userModel[] = []
  user!: userModel;
  currentFile?: File;
  fileInfos?: Observable<any>;

  constructor(private router:Router, private modal:MatDialog, private _userService:UserServiceService, private _uploadService:UploadFilesService){
    var userString = localStorage.getItem('user');
    if(userString != null)
    {
      this.user = JSON.parse(userString as string);
    }
  }

  ngOnInit():void{
    this.removeActiveClass();
    this.getAllUsers()
    this.fileInfos = this._uploadService.getFiles();
  }

  removeActiveClass()
  {
    var element = document.querySelector("li.active");
    if(element !== null)
    {
      element.className = element.className.replaceAll("active", "");
    }

    var currentElement = document.getElementById("usersRef");
    if(currentElement !== null && currentElement.parentElement !== null){
      currentElement.parentElement.className = currentElement.parentElement.className + " active";
    }
  }
  
  getAllUsers() {
    this.userError = "";
    this._userService.getAllUser(this.user.centerId).subscribe({
      next:(userData) => {
        if(userData)
        {
          this.userList = userData;
          if(this.user.rolName !== "admin"){
            this.userList = this.userList.filter(ul => ul.id === this.user.id);
          }
        }
        else
        {
          this.userError = "Se produjo un error al obtener los usuarios.";
        }
      },
      error: (errorData => {
        this.userError = errorData;
      })
    });
  }

  getSpecialty(specialty:specialtyModel):string{
    if (specialty !== null ){
       return specialty.name;
    }else{
      return '';
    }
  }

  openDialog(mode:number, idElement:number):void{
    localStorage.setItem('mode', mode.toString());
    console.log(idElement);
    if(idElement !== 0){
      localStorage.setItem('idElement', idElement.toString());
    }
    const dialogRef = this.modal.open(ModifyUserComponent, {
      width: '350px',
      height: '45em',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllUsers()
    })
  }

  delete(id:number):void{
    var userSelected = this.userList.find(ul => ul.id === id);
    if(userSelected != null){
      localStorage.setItem("message", "¿Está seguro que desea borrar el usuario " + userSelected.nameSurname + "?");
      localStorage.setItem("title", "Va a borrar un usuario");
      const dialogRef = this.modal.open(ConfirmDeleteComponent, {
        width: '350px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        this.userError = "";
        if(result === 'true')
        {
          this._userService.deleteUser(id).subscribe({
            next:(userData) => {
              if(userData)
              {
                this.getAllUsers();
              }
              else
              {
                this.userError = "Se produjo un error al borrar el usuario.";
              }
            },
            error: (errorData => {
              this.userError = errorData;
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
      this._userService.addUserByFile(this.currentFile, this.user.centerId).subscribe({
        next: (userData) => {
          console.log(userData);
          if (userData) {
            this.getAllUsers();
          }
          else
          {
            this.userError = userData;
          }
          this.resetInputFile();
        },
        error: (errorData) => {
          this.userError = errorData;
          this.resetInputFile();
        }
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
  get globalUserId(){
    return this.user.id;
  }
}
