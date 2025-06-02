function renderTask(task){
const taskList = document.querySelector('#list-container');
const li = document.createElement('li');
li.draggable = true;
li.setAttribute('data-id', task.id);
li.classList.add('task-item');

const taskText = document.createElement('span');
taskText.textContent = task.text;
if(task.isCompleted) {
    taskText.classList.add('completed');
}
taskText.addEventListener('dblclick', ()=>{
    enableEditing(taskText, task.id)
});
li.appendChild(taskText);
const completeBtn = document.createElement('button');
completeBtn.textContent = task.isCompleted ? 'Undo' : 'Complete';
completeBtn.classList.add('complete-btn');
completeBtn.setAttribute('aria-label', 'Mark task as complete')
const deleteBtn = document.createElement('button');
deleteBtn.textContent = 'Delete';
deleteBtn.classList.add('delete-btn');
deleteBtn.setAttribute('aria-label', 'Delete this task');

li.appendChild(completeBtn);
li.appendChild(deleteBtn);
taskList.appendChild(li);

}

function renderAllTasks(tasks, filter = 'all', search = '') {
    const taskList = document.querySelector('#list-container');
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'all'|| (filter === 'active' && !task.isCompleted) ||
        (filter === 'completed' && task.isCompleted)
        const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filteredTasks.forEach(task => renderTask(task));
}

function clearInput() {
    const inputBox =document.querySelector('#input-box');
    inputBox.value = '';
    inputBox.focus();
}


        