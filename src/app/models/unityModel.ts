export class unityModel{
    id:number;
    name:string;
    description:string;
    maxByDay:number;
    maxByDayWeekend:number;
    idCenter:number | undefined;

    constructor(id: number, name:string, description:string, maxByDay:number, maxByDayWeekend:number){
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxByDay = maxByDay;
        this.maxByDayWeekend = maxByDayWeekend;
    }
}