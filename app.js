let tasks = getTasks();
let currentFilter = 'all';
let searchQuery = '';
let draggedTaskId = null;

const input = document.querySelector('#input-box');
const addBtn = document.querySelector('#add-button');

addBtn.addEventListener('click', () => {
    const text = input.value.trim()

    if(text === '')return;
     
    const newTask ={
        id: Date.now().toString(),
        text,
        isCompleted: false
    };

    tasks.push(newTask);
    saveTasks(tasks);
    renderAllTasks(tasks, currentFilter, searchQuery);
    clearInput();
});

const taskList = document.querySelector('#list-container');
taskList.addEventListener('click', (event) => {
    const target = event.target;
    const taskItem = target.closest('.task-item');
    if(!taskItem)return;

    const taskId = taskItem.getAttribute('data-id');

    if(target.classList.contains('complete-btn')){
        toggleTaskComplete(taskId);
    }else if(target.classList.contains('delete-btn')){
        deleteTask(taskId);
    }
});

taskList.addEventListener('dragstart', (e) => {
    const taskItem = e.target.closest('.task-item');
    if(taskItem) {
        draggedTaskId = taskItem.getAttribute('data-id');
        taskItem.classList.add('dragging');
    }
});

taskList.addEventListener('dragend', (e)=>{
    const taskItem = e.target.closest('.task-item');
    if(taskItem) {
        taskItem.classList.remove('dragging');
    }
});

taskList.addEventListener('dragover', (e)=> {
    e.preventDefault();
})

taskList.addEventListener('drop',(e)=>{
    e.preventDefault();
    const targetItem = e.target.closest('.task-item');
    if(!targetItem || draggedTaskId === null){
        console.log('Drop failed')
        return;
    };

    const targetId = targetItem.getAttribute('data-id');
    if(!targetId){
        console.log('Drop failed: targetId not found');
        return;
    }
    if(draggedTaskId !== targetId){
        reorderTasks(draggedTaskId, targetId)
    }
    draggedTaskId = null;
});
    
function reorderTasks(draggedId, targetId) {
    const fromIndex = tasks.findIndex(t => t.id === draggedId);
    const toIndex = tasks.findIndex(t => t.id === targetId);
    if(fromIndex < 0 || toIndex < 0)return;
    const [movedTask] = tasks.splice(fromIndex, 1);
    tasks.splice(toIndex, 0, movedTask);
    
    saveTasks(tasks);
    renderAllTasks(tasks, currentFilter, searchQuery);
}

function enableEditing(textElement, taskId){
    const input = document.createElement('input');
    input.type = 'text';
    input.value = textElement.textContent;
    input.classList.add('edit-input');
    textElement.replaceWith(input);
    input.focus();

    input.addEventListener('blur', ()=> finishEditing(input, taskId));
    input,addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            finishEditing(input, taskId);
        }
    });
}
function finishEditing(input, taskId) {
    const updatedText = input.value.trim();
    if(updatedText === '')return;
    const task = tasks.find(t => t.id === taskId);
    if(!task)return;

    task.text = updatedText;
    saveTasks(tasks);
    renderAllTasks(tasks, currentFilter, searchQuery)
}


function toggleTaskComplete(id){
    const task = tasks.find(t => t.id === id);
    if(!task)return;
    task.isCompleted = !task.isCompleted;
    searchInput.value = '';
    searchQuery = '';
    saveTasks(tasks);

    renderAllTasks(tasks, currentFilter, searchQuery);
}

function deleteTask(id){
    tasks = tasks.filter(t => t.id !== id);
    searchInput.value = '';
    searchQuery = '';
    saveTasks(tasks);

    renderAllTasks(tasks, currentFilter, searchQuery);
}

const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        searchInput.value = '';
        searchQuery = '';
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderAllTasks(tasks, currentFilter, searchQuery);
    });
});

const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim();
    renderAllTasks(tasks, currentFilter, searchQuery);
});

