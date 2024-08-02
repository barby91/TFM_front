import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { userModel } from '../../../models/userModel';
import { dayGuardModel } from '../../../models/dayGuardModel';
import { request } from '../../../models/request';
import { OnGuardServiceService } from '../../../services/onguard/on-guard-service.service';


@Component({
  selector: 'app-guard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './guard.component.html',
  styleUrl: './guard.component.css'
})
export class GuardComponent {
  isButtonDisabled:boolean;
  isError:boolean;
  week: any = [
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo"
  ];
  totalMonths: any[]=[{sp: "Enero", en: "January", num: 1},
						   {sp: "Febrero", en: "February", num: 2},
						   {sp: "Marzo", en: "March", num: 3},
						   {sp: "Abril", en: "April", num: 4},
						   {sp: "Mayo", en: "May", num: 5},
						   {sp: "Junio", en: "June", num: 6},
						   {sp: "Julio", en: "July", num: 7},
						   {sp: "Agosto", en: "August", num: 8},
						   {sp: "Septiembre", en: "September", num: 9},
						   {sp: "Octubre", en: "October", num: 10},
						   {sp: "Noviembre", en: "November", num: 11},
						   {sp: "Diciembre", en: "Dicember", num: 12}];
  leftMonths: any[]=[{sp: "  -  ", en: "  -  ", num: 0}];
  daysMonth:any[] = [];
  dateSelect: any;  
  dayGuardsYear: dayGuardModel[] =[];
  globalUser!:userModel;
  year: number;
  seeGuards:number; //1: mis guardias; 2: mis guardias y las de mis compañeros; 3: todas las guardias

  calculateGuardError:string = "";
  calculateGuardForm = new FormGroup({
    groupOfWeeks: new FormControl(0),
    idCenter: new FormControl(0),
    idSpecialty: new FormControl(0)
  });

  constructor(private _guardService:OnGuardServiceService) {
    this.isButtonDisabled = false;
    this.isError = false;
    this.seeGuards = 3;
    this.removeActiveClass();
    var currentMonth = moment().month()+1;
    this.year = moment().year();
    for(var element in this.totalMonths)
    {
      this.getDaysFromDate(this.totalMonths[element].num, this.year);
    }

    let totalDaysYear: number = this.daysInYear(this.year);
      let firstDay: Date = new Date(this.year, 0, 1);
      let lastDay: Date = new Date(this.year, 0, 1);
      let now : Date = new Date(this.year, moment().month(), moment().date());
      if (firstDay.getDay() !== 1) {
          let daysToAdd: number = ((1 - firstDay.getDay() + 7) % 7);
          firstDay.setDate(firstDay.getDate() + daysToAdd);
      }

      let daysAssigned = 0;
      while (daysAssigned <= (totalDaysYear/30)) {
        lastDay.setDate(firstDay.getDate() + 29)
        daysAssigned++;
        console.log("primer día" + firstDay.toLocaleDateString());
        console.log("ultimo día" + lastDay.toLocaleDateString());
        if(lastDay >= now && firstDay >= now)
        {
          this.leftMonths.push({sp: firstDay.toLocaleDateString() + " - " + lastDay.toLocaleDateString(), en: firstDay.toLocaleDateString() + " - " + lastDay.toLocaleDateString(), num: daysAssigned});
        }
        firstDay.setDate(firstDay.getDate() + 30);
      }

    var userString = localStorage.getItem('user');
    if(userString !== null)
    {
      this.globalUser = JSON.parse(userString as string);
    }; 

    this.calculateGuardForm.controls.idCenter.setValue(this.globalUser.centerId);
  }

  daysInYear(year:number) {
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
  }
  removeActiveClass()
  {
    var element = document.querySelector("li.active");
    if(element !== null)
    {
      element.className = element.className.replaceAll("active", "");
    }

    var currentElement = document.getElementById("guardRef");
    if(currentElement !== null && currentElement.parentElement !== null){
      currentElement.parentElement.className = currentElement.parentElement.className + " active";
    }
  }

  getDaysFromDate(month:number, year:number){
    const startDate = moment.utc(`${year}/${month}/01`)
    const endDate = startDate.clone().endOf('month')
    this.dateSelect = moment();

    const diffDays = endDate.diff(startDate, 'days', true)
    const numberDays = Math.round(diffDays);

    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any) => {      
      a = parseInt(a) + 1;
      const dayObject = moment(`${year}-${month}-${a}`);
      return {
        name: dayObject.format("dddd"),
        value: a,
        indexWeek: dayObject.isoWeekday()
      };
    });

    var newDaysMonth = {"mes": month, "days": arrayDays};
    this.daysMonth.push(newDaysMonth);
  }

  daysInMonth(month:any):any[]{
    return this.daysMonth.find(dm => dm.mes === month.num).days;
  } 

  selectedMonth(element:any,groupOfWeeks:number)
  {
    this.calculateGuardForm.controls.groupOfWeeks.setValue(groupOfWeeks);
    var buttonParent = document.getElementById('monthDropdown');
    if(buttonParent !== null){
      buttonParent.textContent = element.textContent ;
    }
  }

  calculateGuard()
  {
    this.calculateGuardError = "";
    this.isError = false;
    this.isButtonDisabled = true;
    this._guardService.calculateGuards(this.calculateGuardForm.value as request).subscribe({
      next:(dayGuard) => {
        this.isButtonDisabled = false;
      },
      error: (errorData => {        
        this.isButtonDisabled = false;
        this.isError = true;
        this.calculateGuardError = errorData;
      })
    });
  }

  checkChange(element:any){
    if(element.id.includes("Mates")){
      console.log("mias y compañeros");
      this.seeGuards = 2;
    }
    else if(element.id.includes("MyGuards")){
      console.log("mías");
      this.seeGuards = 1;
    }
    if(element.id.includes("AllGuards")){
      console.log("todas");
      this.seeGuards = 3;
    }

    this.showGuards();
  }

  showGuards()
  {
    var paint = true;
    let matesNames = [] as string[];
    this.calculateGuardError = "";
    this.isError = false;
    this._guardService.getGuardAssigment(this.globalUser.centerId).subscribe({
      next:(dayGuard) => {
        if(dayGuard)
        {
          this.dayGuardsYear = dayGuard as dayGuardModel[];
          var dateElement = document.getElementById("calendar");
            if(dateElement != null){
              dateElement.hidden = false;
            }
          for (let dayGuard of this.dayGuardsYear)
          {
            //comprobamos si hay que pintar el día
            switch(this.seeGuards)
            {
              case 1:
                //ver mis guardias
                if(dayGuard.assignedUsers.find(au => au.nameSurname.startsWith(this.globalUser.nameSurname)) != null)
                {
                  paint = true;
                }
                else
                {
                  paint = false;
                }
                break;
              case 2:
                //ver mis guardias y las de mis compañeros
                if(dayGuard.assignedUsers.find(au => au.nameSurname.startsWith(this.globalUser.nameSurname)) != null)
                {
                  paint = true;
                  let date = new Date(dayGuard.day);
                  if(date.getMonth() >= (new Date()).getMonth())
                  {
                    for(let usr of dayGuard.assignedUsers){
                      if(matesNames.find(mn => mn == usr.nameSurname) == null)
                      {
                        matesNames.push(usr.nameSurname);
                      }
                    }
                  }
                }
                else
                {
                  paint = false;
                }
                
                for(let usr of dayGuard.assignedUsers){
                  console.log(matesNames);
                  if(matesNames.find(mn => mn == usr.nameSurname) != null)
                  {
                    paint = true;
                    break;
                  }
                }
                
                break;
              default:
                paint = true;
                break;
            }
            var dayParent = document.getElementById(dayGuard.day);
            if(dayParent != null){
              dayParent.children[0].innerHTML ="";
              if(paint)
              {
                for(let usr of dayGuard.assignedUsers){
                  var label = document.createElement("label");
                  //var color = "background-color: "+ usr.color + ";";
                  //label.setAttribute("style", color);
                  label.textContent = usr.nameSurname;
                  label.id = dayGuard.day + "-" + usr.nameSurname;
                  dayParent.children[0].appendChild(label);
                }
              }
            }
          }
        }
        else
        {
          this.isError = true;
          this.calculateGuardError = "Se produjo un error al obtener las guardias del año.";
        }
      },
      error: (errorData => {
        this.isError = true;
        this.calculateGuardError = errorData;
      })
    });
  }

  get groupOfWeeks(){
    return this.calculateGuardForm.controls['groupOfWeeks'];
  }

}
