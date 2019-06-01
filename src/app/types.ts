export type Patient={
    profilepic:string,
    name:string,
    age:string,
    severity:string,
    location:string,
    bloodGroup:string,
    lat:string,
    lon:string,
    status:String
}

export type Query = {
    patients: Patient[];
}