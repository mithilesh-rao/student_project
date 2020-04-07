const { Component } = owl;
const { xml } = owl.tags;
const { whenReady } = owl.utils;
const { useRef, useState } = owl.hooks;

// Owl Components
const TASK_TEMPLATE = xml /* xml */`
    <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
        <input type="checkbox" t-att-checked="props.task.isCompleted" t-on-click="toggleTask"/>
        <span><t t-esc="props.task.title"/></span>
        <span class="delete" t-on-click="deleteTask">🗑</span>
    </div>`;

class Task extends Component
{
    static template = TASK_TEMPLATE;
    static props = ["task"];

    toggleTask()
    {
    this.trigger('toggle-task', {id: this.props.task.id});
}
deleteTask()
{
    this.trigger('delete-task', {id: this.props.task.id});
}
}

const APP_TEMPLATE = xml /* xml */`
   <div class="todo-app">
   <input placeholder="Enter a new task" t-on-keyup="addTask" t-ref="add-input"/>
   <div class="task-list" t-on-toggle-task="toggleTask" t-on-delete-task="deleteTask">
       <t t-foreach="tasks" t-as="task" t-key="task.id">
           <Task task="task"/>
       </t>
   </div>
</div>`;



class App extends Component
{
    static template = APP_TEMPLATE;
    static components = { Task };
    // in App
inputRef = useRef("add-input");
mounted() {
   this.inputRef.el.focus();
}
nextId = 1;
tasks = useState([]);

  addTask(ev) {
    // 13 is keycode for ENTER
    if (ev.keyCode === 13)
    {
        const title = ev.target.value.trim();
        ev.target.value = "";
        if (title)
        {
            const newTask = {
                id: this.nextId++,
                title: title,
                isCompleted: false,
            };
            this.tasks.push(newTask);
        }
    }}

    toggleTask(ev)
    {
   const task = this.tasks.find(t => t.id === ev.detail.id);
   task.isCompleted = !task.isCompleted;
}
deleteTask(ev)
{
    const index = this.tasks.findIndex(t => t.id === ev.detail.id);
    this.tasks.splice(index, 1);
}
}


// Setup code
function setup() {
    owl.config.mode = "dev";
    const app = new App();
    app.mount(document.body);
}

whenReady(setup);

