import { unityModel } from "./unityModel";

export interface specialtyModel{
    id:number,
    name:string,
    description:string,
    idCenter:number,
    totalUsers:number,
    unities:unityModel[]
}