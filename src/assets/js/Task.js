export class Task{
    constructor(id, text,priority,createdAt){
        this.id=id;
        this.text=text;
        this.priority=priority;
        this.completed=false;
        this.createdAt=createdAt;
       

}
toggleCompleted(){
    this.completed = !this.completed
}
}