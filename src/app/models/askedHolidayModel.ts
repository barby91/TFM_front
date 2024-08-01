import { pendingAskedHolidayModel } from "./pendingAskedHolidayModel"

export class askedHolidayModel{
    id!: number
    dateFrom!: string
    dateTo!: string
    period!: string
    statusDes!: string
    idUser!: number
    idCenter!: number

    pendingAskedHolidayToAskedHoliday(selectedHoliday: pendingAskedHolidayModel, status:string, idCenter:number)
    {
        this.id = selectedHoliday.id;
        this.dateFrom = selectedHoliday.dateFrom;
        this.dateTo = selectedHoliday.dateTo;
        this.period = selectedHoliday.period;
        this.statusDes = status;
        this.idUser = selectedHoliday.idUser;
        this.idCenter = idCenter
    }
}