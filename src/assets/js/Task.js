export class Task{
    constructor(id, text,priority,createdAt,dueDate){
        this.id=id;
        this.text=text;
        this.priority=priority;
        this.completed=false;
        this.dueDate=dueDate;
        this.createdAt=createdAt;
       

}
toggleCompleted(){
    this.completed = !this.completed
}
}