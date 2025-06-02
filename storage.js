
const TASK_KEY = 'tasks';

function getTasks(){
    const storedTasks = localStorage.getItem(TASK_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasks(tasks){
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}
