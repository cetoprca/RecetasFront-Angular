export class TagData {
    name : string = "";

    constructor(name:string){
        this.name = name;
    }

    static empty(): TagData{
        return new TagData("");
    }
}
