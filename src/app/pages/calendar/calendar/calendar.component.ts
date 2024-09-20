import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { userModel } from '../../../models/userModel';
import { PublicHolidayServiceService } from '../../../services/publicHoliday/public-holiday-service.service';
import { publicHolidayModel } from '../../../models/publicHolidayModel';
import { MatDialog } from '@angular/material/dialog';
import { AskedHolidayServiceService } from '../../../services/askedHoliday/asked-holiday-service.service';
import { askedHolidayModel } from '../../../models/askedHolidayModel';
import { ShowAskedHolidaysComponent } from '../show-asked-holidays/show-asked-holidays.component';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
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

  calendarError:string = "";
  weekendError:string = "";
  askedHolidayForm = new FormGroup({
    id:new FormControl(0),
    dateFrom: new FormControl('', Validators.required),
    dateTo: new FormControl('', Validators.required),
    period: new FormControl(moment().year().toString(), Validators.min(1)),
    statusDes: new FormControl('Solicitado'),
    idUser:new FormControl(0),
    idCenter:new FormControl(0)
  });
  globalUser!:userModel;
  startSelectedDate!: Date;
  endSelectedDate!: Date;
  clicks:number=0;
  periods:any[] =  [
                      {period:"current", value:moment().year().toString()},
                      {period:"previous", value:(moment().year()-1).toString()}
                    ];
  daysMonth:any[] = [];
  publicHolidaysYear: publicHolidayModel[] =[];
  isSave:boolean=false;
  typeAsked:string="Holiday";
  oldPeriod!:string | null;


  dateSelect: any;
  dateValue: any;

  constructor(private modal:MatDialog, private _publicHolidayService:PublicHolidayServiceService, private _askedHolidayService: AskedHolidayServiceService) {
    this.removeActiveClass();
    for(var element in this.totalMonths)
    {
      this.getDaysFromDate(this.totalMonths[element].num, 2024);
    }
    var userString = localStorage.getItem('user');
    if(userString !== null)
    {
      this.globalUser = JSON.parse(userString as string);
    };    

    this.askedHolidayForm = new FormGroup({
      id:new FormControl(0),
      dateFrom: new FormControl('', Validators.required),
      dateTo: new FormControl('', Validators.required),
      period: new FormControl(moment().year().toString(), Validators.min(1)),
      statusDes: new FormControl('Solicitado'),
      idUser:new FormControl(this.globalUser.id),
      idCenter: new FormControl(this.globalUser.centerId)
    });

    this.getPublicHoliday();
  }

  removeActiveClass()
  {
    var element = document.querySelector("li.active");
    if(element !== null)
    {
      element.className = element.className.replaceAll("active", "");
    }

    var currentElement = document.getElementById("calendarRef");
    if(currentElement !== null && currentElement.parentElement !== null){
      currentElement.parentElement.className = currentElement.parentElement.className + " active";
    }
  }

  getPublicHoliday(){
    this._publicHolidayService.getAllPublicHolidaysByCenter(this.globalUser.centerId).subscribe({
      next:(publicHolidayData) => {
        if(publicHolidayData)
        {
          this.publicHolidaysYear = publicHolidayData as publicHolidayModel[];
          this.paintPublicHolidays();          
          var NacionalPHElement = document.getElementById("lblNacionalPH");
          var RegionalPHElement = document.getElementById("lblRegionalPH");
          var LocalPHElement = document.getElementById("lblLocalPH");
          var colorNacionalPH = this.publicHolidaysYear.find(phy => phy.typeLabel === "Nacional");
          var colorRegionalPH = this.publicHolidaysYear.find(phy => phy.typeLabel === "Regional");
          var colorLocalPH = this.publicHolidaysYear.find(phy => phy.typeLabel === "Local");
          if(NacionalPHElement !== null && colorNacionalPH != null)
          {
            NacionalPHElement.setAttribute("style", "color:"+colorNacionalPH.colour);
          }
          if(RegionalPHElement !== null && colorRegionalPH != null)
          {
            RegionalPHElement.setAttribute("style", "color:"+colorRegionalPH.colour);
          }
          if(LocalPHElement !== null && colorLocalPH != null)
          {
            LocalPHElement.setAttribute("style", "color:"+colorLocalPH.colour);
          }
        }
        else
        {
          this.calendarError = "Se produjo un error al obtener los usuarios.";
        }
      },
      error: (errorData => {
        this.calendarError = errorData;
      })
    });
  }

  ngOnInit(): void {    
    var buttonParent = document.getElementById('periodDropdown');
    if(buttonParent !== null){
      var searchPeriod = this.periods.find(l => l.period === "current");
      if(searchPeriod !== undefined){
        buttonParent.textContent = searchPeriod.value;
      }
    }
  }

  radioChange(element:any){
    if(element.id.includes("Holiday")){
      this.typeAsked = "Holiday";
      this.askedHolidayForm.controls['period'].setValue(this.oldPeriod);
    }
    else{
      this.typeAsked = "Weekend";
      this.oldPeriod = this.askedHolidayForm.controls['period'].value;
      this.askedHolidayForm.controls['period'].setValue(this.typeAsked);
    }

    if(this.startSelectedDate != null){
      this.unselectedDays();
      this.clicks = 0;
      this.askedHolidayForm.controls['dateFrom'].setValue('');
      this.askedHolidayForm.controls['dateTo'].setValue('');
    }

    //borramos los días seleccionados de vacaciones
    for (let askedHolidayElement of this.globalUser.askedHolidays) {      
      var dateFrom = new Date(askedHolidayElement.dateFrom);
      var dateTo = new Date(askedHolidayElement.dateTo);
      var start = moment(dateFrom);
      var end = moment(dateTo);
      var diff = end.diff(start, 'days')+1 
      if(askedHolidayElement.statusDes === "Solicitado"){
        this.unPaintAskedHolidays(dateFrom.getDate() + "-" + (dateFrom.getMonth()+1),
                                dateTo.getDate() + "-" + (dateTo.getMonth()+1),
                                diff, dateFrom, " askedHoliday", " middleAskedHoliday");
      }
      else if(askedHolidayElement.statusDes === "Aprobado"){
        this.unPaintAskedHolidays(dateFrom.getDate() + "-" + (dateFrom.getMonth()+1),
                                dateTo.getDate() + "-" + (dateTo.getMonth()+1),
                                diff, dateFrom, " aprovedAskedHoliday", " middleAprovedAskedHoliday");
      }
    }

    this.checkChange();
  }

  checkChange(){
    var element = document.getElementById("seeAskedDays") as HTMLInputElement;

    for (let askedHolidayElement of this.globalUser.askedHolidays) {      
      var dateFrom = new Date(askedHolidayElement.dateFrom);
      var dateTo = new Date(askedHolidayElement.dateTo);
      var start = moment(dateFrom);
      var end = moment(dateTo);
      var diff = end.diff(start, 'days')+1 
      if(element.checked){
        //pintamos los días seleccionados de vacaciones
        if(askedHolidayElement.period === this.askedHolidayForm.controls['period'].value){
          if(askedHolidayElement.statusDes === "Solicitado"){
            this.paintAskedHolidays(dateFrom.getDate() + "-" + (dateFrom.getMonth()+1),
                                    dateTo.getDate() + "-" + (dateTo.getMonth()+1),
                                    diff, dateFrom, " askedHoliday", " middleAskedHoliday");
          }
          else if(askedHolidayElement.statusDes === "Aprobado"){
            this.paintAskedHolidays(dateFrom.getDate() + "-" + (dateFrom.getMonth()+1),
                                    dateTo.getDate() + "-" + (dateTo.getMonth()+1),
                                    diff, dateFrom, " aprovedAskedHoliday", " middleAprovedAskedHoliday");
          }
        }
      }
      else{
        //borramos los días seleccionados de vacaciones
        if(askedHolidayElement.statusDes === "Solicitado"){
          this.unPaintAskedHolidays(dateFrom.getDate() + "-" + (dateFrom.getMonth()+1),
                                  dateTo.getDate() + "-" + (dateTo.getMonth()+1),
                                  diff, dateFrom, " askedHoliday", " middleAskedHoliday");
        }
        else if(askedHolidayElement.statusDes === "Aprobado"){
          this.unPaintAskedHolidays(dateFrom.getDate() + "-" + (dateFrom.getMonth()+1),
                                  dateTo.getDate() + "-" + (dateTo.getMonth()+1),
                                  diff, dateFrom, " aprovedAskedHoliday", " middleAprovedAskedHoliday");
        }
      }
    }
  }

  paintAskedHolidays(idStartDate:string, idEndDate:string, diff:number, start:Date, className:string, className2:string){
    var dateElement = document.getElementById(idStartDate);
    if(dateElement != null){
      dateElement.className += className;
    }
    
    dateElement = document.getElementById(idEndDate);
    if(dateElement != null){
      dateElement.className += className;
    }

    var currentDate = new Date(start);
    for(var i = 1; i < diff-1; i++)
    {
      currentDate.setDate(currentDate.getDate() + 1);
      var id = currentDate.getDate() + "-" + (currentDate.getMonth()+1);
      var element = document.getElementById(id);
      if((element != null) &&
        (((this.typeAsked === "Holiday" && currentDate.getDay() != 0 && currentDate.getDay() != 6 &&
        !element.className.includes("publicHoliday")) ||
        (this.typeAsked === "Weekend" && (element.className.includes("publicHoliday") || 
                                            (currentDate.getDay() === 0 || currentDate.getDay() === 6)))))){
        element.className += className2;
      }
    }
  }

  unPaintAskedHolidays(idStartDate:string, idEndDate:string, diff:number, start:Date, className:string, className2:string){
    var dateElement = document.getElementById(idStartDate);
    if(dateElement != null){
      dateElement.className = dateElement.className.replace(className, " ");   
    }
    
    dateElement = document.getElementById(idEndDate);
    if(dateElement != null){
      dateElement.className = dateElement.className.replace(className, " ");
    }

    var currentDate = new Date(start);
    for(var i = 1; i < diff-1; i++)
    {
      currentDate.setDate(currentDate.getDate() + 1);
      var id = currentDate.getDate() + "-" + (currentDate.getMonth()+1);
      var element = document.getElementById(id);
      if(element != null){
        element.className = element.className.replace(className2, "");
      }
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

  paintPublicHolidays()
  {
    for(var i in this.publicHolidaysYear)
    {
      var day = moment(this.publicHolidaysYear[i].date).date();
      var month = moment(this.publicHolidaysYear[i].date).month()+1;
      
      var dayElement = document.getElementById(day + "-" + month);
      if(dayElement != null)
      {
        dayElement.setAttribute("style", "background-color:" + this.publicHolidaysYear[i].colour);        
        dayElement.className = dayElement.className + " publicHoliday";
      }
    }
  }

  clickDay(day:any, month:any) {
    var titleElement = document.getElementById("year")
    if(titleElement != null)
    {
      var selectedDate = new Date(Number(titleElement.textContent), 
                                  this.totalMonths.find(tm => tm.sp === month.sp).num-1,
                                  day);
      var selectedDayElement = document.getElementById(day+"-"+month.num);
      var paint = true;
      if(selectedDayElement != null)
      {
        var inputDateElement;
        
        //si procede, se despintan los días previamente seleccionados
        if(this.clicks === 0 && this.startSelectedDate != undefined){
          this.unselectedDays();
        }
        //solo pintamos si el día seleccionado corresponde
        if(((this.typeAsked === "Holiday" && selectedDate.getDay() != 0 && selectedDate.getDay() != 6 &&
             !selectedDayElement.className.includes("publicHoliday")) || 
            (this.typeAsked === "Weekend" && (selectedDayElement.className.includes("publicHoliday") ||
                                              (selectedDate.getDay() === 0 || selectedDate.getDay() === 6))))){
          if(this.clicks === 0){
            this.startSelectedDate = selectedDate;
            inputDateElement = (<HTMLInputElement>document.getElementById("InputStartDate1"));
            this.askedHolidayForm.controls['dateFrom'].setValue(moment(selectedDate).format('YYYY-MM-DD'));
            this.clicks = 1;
          }
          else{
            if(this.startSelectedDate <= selectedDate)
            {
              this.endSelectedDate = selectedDate;
              this.clicks = 0;
              inputDateElement = (<HTMLInputElement>document.getElementById("InputEndDate1"));
              this.askedHolidayForm.controls['dateTo'].setValue(moment(selectedDate).format('YYYY-MM-DD'));
              this.paintDays();
            }
            else{
              paint = false;
              alert('La fecha final debe ser posterior a la inicial');
            }
          }
          if(paint){
            if(inputDateElement != null){
              var inputDate = new Date (selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()+1);
              inputDateElement.valueAsDate = inputDate;
            }
            if(!selectedDayElement.className.includes("selected-day")){
              selectedDayElement.className += " selected-day";
            }
          }
        }
      }
    }
  }

  paintDays()
  {
    var start = moment(this.startSelectedDate);
    var end = moment(this.endSelectedDate);
    var diff = end.diff(start, 'days')+1 

    var currentDate = new Date(start.year(), start.month(), start.date());
    for(var i = 1; i < diff-1; i++)
    {
      currentDate.setDate(currentDate.getDate() + 1);
      var id = currentDate.getDate() + "-" + (currentDate.getMonth()+1);
      var element = document.getElementById(id);
      if(element != null && (
         (((this.typeAsked === "Holiday" && currentDate.getDay() != 0 && currentDate.getDay() != 6 &&
            !element.className.includes("publicHoliday")) ||
           (this.typeAsked === "Weekend" && (element.className.includes("publicHoliday") || 
                                             (currentDate.getDay() === 0 || currentDate.getDay() === 6)))))
        )) 
      {
        element.className += " middle-selected-day";
      }
    }
  }

  unselectedDays(){
    if(this.endSelectedDate === null){
      var id = this.startSelectedDate.getDate() + "-" + (this.startSelectedDate.getMonth()+1);
      var element = document.getElementById(id);
      if(element != null) 
      {
        element.className = element.className.replace (" selected-day", "");
      }
    }else{
      var start = moment(this.startSelectedDate);
      var end = moment(this.endSelectedDate);
      var diff = end.diff(start, 'days')+1

      var currentDate = new Date(start.year(), start.month(), start.date());
      for(var i = 0; i < diff; i++)
      {
        var id = currentDate.getDate() + "-" + (currentDate.getMonth()+1);
        var element = document.getElementById(id);
        if(element != null) 
        {
          element.className = element.className.replace (" selected-day", "");
          element.className = element.className.replace(" middle-selected-day", "");
        }
        currentDate.setDate(currentDate.getDate() + 1);      
      }
    }
  }

  selectedPeriod(element:any, idPeriod:string){
    var buttonParent = document.getElementById('periodDropdown');
    if(buttonParent !== null){
      var period = this.periods.find(l => l.period === idPeriod);
      if(period !== undefined){
        buttonParent.textContent = period.value;
        this.askedHolidayForm.controls['period'].setValue(period.value);
            
      }
    }
  }

  save(){
    this.isSave = true;
    
    var firstLastDay = document.getElementsByClassName('selected-day');
    var mediumDays = (document.getElementsByClassName('middle-selected-day'));
    var totalDays = firstLastDay.length + mediumDays.length;
    this.calendarError = "";
    this.openDialog(totalDays, this.typeAsked);
  }

  cancell(){
    const dialogRef = this.modal.open(ShowAskedHolidaysComponent, {
      width: '80%',
      height: '80%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result =>{
      window.location.reload();
    })
  }

  openDialog(totalDays:number, typeAsked:string):void{
    if(this.askedHolidayForm.valid)
    {
      var type = "";
      switch(typeAsked)
      {
        case "Holiday":
          type = "Vacaciones";
          break;
        case "Weekend":
          type = "Fin de semana";
          break;
      }

      localStorage.setItem("message", "Va a solicitar " + totalDays.toString() + " días de " + type);
      localStorage.setItem("title", "Va a pedir " + type);

      const dialogRef = this.modal.open(ConfirmDeleteComponent, {
        width: '350px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result === 'true'){
          this._askedHolidayService.addAskedHoliday(this.askedHolidayForm.value as askedHolidayModel).subscribe({
            next:(userLoggedData) => {
              if(userLoggedData) {
                this.globalUser = userLoggedData as userModel;
                localStorage.setItem("user", JSON.stringify(this.globalUser));
                window.location.reload();
              }
            },
            error: (errorData => {
              this.calendarError = errorData;
              this.unselectedDays();
              var inputDateElement = (<HTMLInputElement>document.getElementById("InputStartDate1"));
              if(inputDateElement != null){
                inputDateElement.valueAsDate = null;
                this.askedHolidayForm.controls["dateFrom"].setValue('');               
                this.askedHolidayForm.get("dateFrom")?.clearValidators();
              }
              inputDateElement = (<HTMLInputElement>document.getElementById("InputEndDate1"));
              if(inputDateElement != null){
                inputDateElement.valueAsDate = null;
                this.askedHolidayForm.controls["dateTo"].setValue('');                
                this.askedHolidayForm.get("dateTo")?.clearValidators();
              }
              
              this.askedHolidayForm.reset();                    
              this.askedHolidayForm.get("dateFrom")?.clearValidators();   
              this.askedHolidayForm.get("dateTo")?.clearValidators();
            })
          });
        }
      })
    }else{
        this.askedHolidayForm.markAllAsTouched();
        this.calendarError = "Error. Introduzca todos los datos.";
    }
  }

  daysInMonth(month:any):any[]{
    return this.daysMonth.find(dm => dm.mes === month.num).days;
  }

  get currentPeriod(){
    return this.periods.find(p => p.period=="current").value;
  }

  get previousPeriod(){
    return this.periods.find(p => p.period=="previous").value;
  }

  get userCurrentPeriodDays(){
    return this.globalUser.holidayCurrentPeriod;
  }

  get userPreviousPeriodDays(){
    return this.globalUser.holidayPreviousPeriod;
  }

  get userCurrentPeriodLeftDays(){
    return this.globalUser.holidayCurrentPeriod-this.globalUser.currentPeriodLeftDay;
  }

  get userPreviousPeriodLeftDays(){
    return this.globalUser.holidayPreviousPeriod-this.globalUser.previousPeriodLeftDay;
  }

  get startDate(){
    return this.askedHolidayForm.controls['dateFrom'];
  }

  get endDate(){
    return this.askedHolidayForm.controls['dateTo'];
  }
}