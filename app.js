// Task class - with props
class Task {
    constructor(id, title, description, priority, duedate){
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.duedate = duedate;
    }
}

//UI 
class UI {
    static displayTasks(){
        // const tasks = [
        //     {
        //         id: 1,
        //         title: "Get the requirement",
        //         description: "The list of top level requirements",
        //         priority: "High",
        //         duedate: '10/12/2019'
        //     },
        //     {
        //         id: 2,
        //         title: "Create design document",
        //         description: "details for designing document for website",
        //         priority: "Medium",
        //         duedate: '1/1/2019'
        //     },
        //     {
        //         id:3,
        //         title: "Add a new screen",
        //         description: "details for task1",
        //         priority: "Low",
        //         duedate: '7/8/2019'
        //     }
        // ];

        const tasks = Store.getTasks();

        tasks.forEach(task => UI.addTaskToList(task));

        //set default value for duedate as Today
        document.querySelector('#duedate').valueAsDate = new Date();
    }

    static addTaskToList(task){
        const tableBody = document.querySelector('#task-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.priority}</td>
            <td>${ new Date(task.duedate).toLocaleDateString()}</td>
            <td><a href="#" class="btn mx-2 d-inline"><i class="fas fa-1x fa-edit text-info edit"></i></a> <a href="#" class="btn mx-2 d-inline"><i class="fas fa-trash-alt text-danger delete"></i></a> </td>
        `;

        tableBody.appendChild(row);

    }

    static editTask(el){

        if(el.classList.contains('edit')){
            const row = el.closest('tr');
            console.log(row.children[4].innerHTML);
    
            document.querySelector('#title').value = row.children[1].innerHTML;
            document.querySelector('#description').value = row.children[2].innerHTML;
            document.querySelector('#priority').value = row.children[3].innerHTML;
            var dDate = new Date(row.children[4].innerHTML);        
            document.querySelector('#duedate').valueAsDate = dDate;
    
            document.querySelector('.btn-primary').innerHTML = 'Update Task';
        }       
    }

    static deleteTask(el){
        //console.log(el);
        if(el.classList.contains('delete')){
            el.closest('tr').remove();    
            UI.showAlert('Task removed', 'info');
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.form-section');
        const form = document.querySelector('#task-form');        
        container.insertBefore(div, form);

        //hide after 3 secs
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static toggleTaskForm(el){
        const formSection = document.querySelector('.form-section');
        formSection.classList.toggle('d-none');

        if(formSection.classList.contains('d-none')){
            el.innerText = "Add New Task";
        }
        else{
            el.innerText = "Collapse Form";
        }        
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#description').value = '';
        document.querySelector('#priority').value = '';
        document.querySelector('#duedate').value = '';

        document.querySelector('.btn-primary').innerHTML = 'Add Task';

        //document.querySelector('.alert').remove();
    }
}

//storage
class Store{
    static getTasks(){
        let tasks;
        if(localStorage.getItem('tasks') === null){
            tasks = [];
        }
        else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
    }
    static addTask(task){
        const tasks = Store.getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    static removeTask(id){
       
        let tasks = Store.getTasks();
        tasks = tasks.filter(task => {
            console.log(task);
            return task.id != id
        });
        
        console.log('after: '+tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

   
}
////Events
//on DOM ready
document.addEventListener('DOMContentLoaded', UI.displayTasks);

//add a task
document.querySelector('#task-form').addEventListener('submit', (e) => {

    //prevent from post back on submit
    e.preventDefault();

    //get values from the form
    const title = document.querySelector('#title').value;
    const description = document.querySelector('#description').value;
    const priority = document.querySelector('#priority').value;
    const duedate = document.querySelector('#duedate').value;

    if(title === '' || description === '' || duedate === ''){
        UI.showAlert('Plese provide values for all the fields', 'danger');
    }
    else{
        const rows =  document.querySelectorAll('#task-list tr').length;
        const id = rows+1;
    
        //instaiate Task
        const newTask = new Task(id, title, description, priority, duedate);
        //console.log(newTask);
        //add a new row in tasks list in UI
        UI.addTaskToList(newTask);

        //update Store
        Store.addTask(newTask);
        
        //show success message
        UI.showAlert('Task has been created', 'success');
        //clear the fields
        UI.clearFields();

        
    }   

});

//on clear click
document.querySelector('.clear').addEventListener('click', (e) => {
    e.preventDefault(); 
    UI.clearFields();
});

//delete a task
document.querySelector('#task-list').addEventListener('click', e => {
    //remove from UI
    UI.deleteTask(e.target);
    //remove from store
    const id = e.target.closest('tr').children[0].innerText;
    Store.removeTask(id);
} );

//delete a task
document.querySelector('#task-list').addEventListener('click', e => UI.editTask(e.target));

document.querySelector('.add-task').addEventListener('click', e => UI.toggleTaskForm(e.target));