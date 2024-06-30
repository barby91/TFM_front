import { pendingAskedHolidayModel } from "./pendingAskedHolidayModel"

export class askedHolidayModel{
    id!: number
    dateFrom!: string
    dateTo!: string
    period!: string
    statusDes!: string
    idUser!: number

    pendingAskedHolidayToAskedHoliday(selectedHoliday: pendingAskedHolidayModel, status:string)
    {
        this.id = selectedHoliday.id;
        this.dateFrom = selectedHoliday.dateFrom;
        this.dateTo = selectedHoliday.dateTo;
        this.period = selectedHoliday.period;
        this.statusDes = status;
        this.idUser = selectedHoliday.idUser;
    }
}