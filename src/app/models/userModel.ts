import { askedHolidayModel } from './askedHolidayModel';

export interface userModel{
    id:number,
    nameSurname:string,
    email:string,
    holidayCurrentPeriod:number,
    holidayPreviousPeriod:number,
    currentPeriodLeftDay:number,
    previousPeriodLeftDay:number,
    askedHolidays:askedHolidayModel[],
    rolName:string,
    centerName:string,
    centerId:number,
    specialtyName:string,
    unityName:string,
    levelName: string,
    //color: string
}