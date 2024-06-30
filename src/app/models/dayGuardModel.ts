import { userModel } from "./userModel"

export interface dayGuardModel{
    id:number
    day:string
    assignedUsers:userModel[]
}