import { askedHolidayModel } from "./askedHolidayModel"

export interface pendingAskedHolidayModel{
    id:number
    dateFrom:string
    dateTo:string
    period:string
    nameSurname:string
    idUser:number
    statusDesc:string
}