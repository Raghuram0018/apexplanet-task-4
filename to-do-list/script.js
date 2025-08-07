document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Selectors
    const openAddTaskModalBtn = document.getElementById('open-add-task-modal-btn');
    const addTaskModal = document.getElementById('add-task-modal');
    const addTaskForm = document.getElementById('add-task-form');
    const todoInput = document.getElementById('todo-input');
    const taskDescriptionInput = document.getElementById('task-description-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const recurrenceInput = document.getElementById('recurrence-input');
    const todoList = document.getElementById('todo-list');
    const taskCount = document.getElementById('task-count');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search-input');
    const sortByDateBtn = document.getElementById('sort-by-date-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');
    const dashboardModal = document.getElementById('dashboard-modal');
    const activityLogBtn = document.getElementById('activity-log-btn');
    const activityLogModal = document.getElementById('activity-log-modal');
    const activityLogList = document.getElementById('activity-log-list');
    const menuToggle = document.getElementById('menu-toggle');
    const appLayout = document.querySelector('.app-layout');
    const projectList = document.getElementById('project-list');
    const newProjectInput = document.getElementById('new-project-input');
    const addProjectBtn = document.getElementById('add-project-btn');
    const currentProjectName = document.getElementById('current-project-name');
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    const importBtn = document.getElementById('import-btn');
    const exportBtn = document.getElementById('export-btn');
    const importFileInput = document.getElementById('import-file-input');
    const voiceBtns = document.querySelectorAll('.voice-btn');

    // State Management
    let state = {};
    let history = [];
    let historyIndex = -1;
    let priorityChart = null;
    let currentFilter = 'all';
    
    // Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
    }

    // ---- Modal Handling ----
    const openModal = (modal) => modal.classList.add('visible');
    const closeModal = (modal) => modal.classList.remove('visible');

    // ---- State & History Management ----
    const loadState = () => {
        const savedState = JSON.parse(localStorage.getItem('todoAppState'));
        if (savedState && savedState.projects && savedState.projects.length > 0) {
            state = savedState;
        } else {
            const initialProjectId = Date.now();
            state = {
                projects: [{ id: initialProjectId, name: 'Inbox', tasks: [], archivedTasks: [] }],
                activityLog: [],
                currentProjectId: initialProjectId
            };
        }
        saveHistory(false);
    };

    const saveStateToStorage = () => localStorage.setItem('todoAppState', JSON.stringify(state));

    const saveHistory = (log = true) => {
        history = history.slice(0, historyIndex + 1);
        history.push(JSON.parse(JSON.stringify(state)));
        historyIndex++;
        if (log) saveStateToStorage();
        updateUndoRedoButtons();
    };

    const undo = () => {
        if (historyIndex > 0) {
            historyIndex--;
            state = JSON.parse(JSON.stringify(history[historyIndex]));
            saveStateToStorage();
            renderAll();
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            state = JSON.parse(JSON.stringify(history[historyIndex]));
            saveStateToStorage();
            renderAll();
        }
    };

    const updateUndoRedoButtons = () => {
        undoBtn.disabled = historyIndex <= 0;
        redoBtn.disabled = historyIndex >= history.length - 1;
    };

    const logActivity = (message) => {
        state.activityLog.unshift({ message, timestamp: new Date() });
        if (state.activityLog.length > 100) state.activityLog.pop();
    };

    // ---- Core Application Logic ----
    const renderAll = () => {
        renderProjects();
        renderTasks();
        updateUndoRedoButtons();
    };

    const renderProjects = () => {
        projectList.innerHTML = '';
        state.projects.forEach(project => {
            const li = document.createElement('li');
            li.className = `project-item ${project.id === state.currentProjectId ? 'active' : ''}`;
            li.dataset.id = project.id;
            li.innerHTML = `<span>${project.name}</span>${state.projects.length > 1 ? '<button class="delete-project-btn action-btn" title="Delete Project"><i class="fas fa-trash-alt"></i></button>' : ''}`;
            projectList.appendChild(li);
        });
        const currentProject = state.projects.find(p => p.id === state.currentProjectId);
        currentProjectName.textContent = currentProject ? currentProject.name : 'No Project Selected';
    };

    const renderTasks = () => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (!project) {
            todoList.innerHTML = '<li class="empty-list-item">Select a project to see tasks.</li>';
            updateTaskCount();
            return;
        }

        todoList.innerHTML = '';
        let tasksToRender = [];
        const searchTerm = searchInput.value.toLowerCase();

        if (currentFilter === 'archived') tasksToRender = project.archivedTasks || [];
        else {
            tasksToRender = project.tasks || [];
            if (currentFilter === 'pending') tasksToRender = tasksToRender.filter(t => !t.completed);
            if (currentFilter === 'completed') tasksToRender = tasksToRender.filter(t => t.completed);
        }

        if (searchTerm) tasksToRender = tasksToRender.filter(t => t.text.toLowerCase().includes(searchTerm));
        if (tasksToRender.length === 0) todoList.innerHTML = '<li class="empty-list-item" style="border:none; background:transparent;">No tasks found.</li>';
        else tasksToRender.forEach(task => todoList.appendChild(createTaskElement(task)));

        updateTaskCount();
    };

    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = `priority-${task.priority} ${task.completed ? 'completed' : ''}`;

        const now = new Date();
        if (task.dueDate && !task.completed) {
            const dueDate = new Date(task.dueDate);
            if (dueDate < now) li.classList.add('overdue');
            else if (dueDate - now < 24 * 60 * 60 * 1000) li.classList.add('due-soon');
        }

        let actionsHtml = '';
        if (currentFilter === 'archived') {
            actionsHtml = `
                <button class="action-btn unarchive-btn" title="Unarchive"><i class="fas fa-box-open"></i></button>
                <button class="action-btn delete-btn" title="Delete Permanently"><i class="fas fa-trash"></i></button>
            `;
        } else {
            actionsHtml = `
                <button class="action-btn complete-btn" title="Complete"><i class="fas fa-check"></i></button>
                <button class="action-btn archive-btn" title="Archive"><i class="fas fa-archive"></i></button>
            `;
        }

        li.innerHTML = `
            <div class="task-main">
                <div class="task-details">
                    <span class="task-text">${task.text}</span>
                    <div class="task-meta">
                        ${task.dueDate ? `<span class="due-date"><i class="fas fa-calendar-alt"></i> ${new Date(task.dueDate).toLocaleString()}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    ${actionsHtml}
                </div>
            </div>
            <div class="task-description-section">
                <div class="task-description" contenteditable="false">${task.description || ''}</div>
            </div>
            <div class="subtask-section"></div>
        `;
        
        const subtaskSection = li.querySelector('.subtask-section');
        if (task.subtasks && task.subtasks.length > 0) {
            const completedCount = task.subtasks.filter(st => st.completed).length;
            const progress = (completedCount / task.subtasks.length) * 100;
            const progressBar = `<div class="progress-bar"><div class="progress-bar-fill" style="width: ${progress}%"></div></div>`;
            subtaskSection.innerHTML = progressBar;

            const subtaskList = document.createElement('ul');
            subtaskList.className = 'subtask-list';
            task.subtasks.forEach(st => {
                const subtaskItem = document.createElement('li');
                subtaskItem.className = `subtask-item ${st.completed ? 'completed' : ''}`;
                subtaskItem.dataset.subtaskId = st.id;
                subtaskItem.innerHTML = `<input type="checkbox" ${st.completed ? 'checked' : ''}> <span>${st.text}</span>`;
                subtaskList.appendChild(subtaskItem);
            });
            subtaskSection.appendChild(subtaskList);
        }
        
        const addSubtaskWrapper = document.createElement('div');
        addSubtaskWrapper.className = 'add-subtask-wrapper';
        addSubtaskWrapper.innerHTML = `
            <input type="text" class="subtask-add-input" placeholder="Add subtask...">
            <button class="subtask-add-btn action-btn"><i class="fas fa-plus"></i></button>
        `;
        subtaskSection.appendChild(addSubtaskWrapper);

        return li;
    };

    const updateTaskCount = () => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        const count = project ? (project.tasks || []).filter(t => !t.completed).length : 0;
        taskCount.textContent = count;
    };

    // ---- Action Functions ----
    const addTask = (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (!text) return;
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (!project) return;

        project.tasks.push({
            id: Date.now(), text, completed: false,
            description: taskDescriptionInput.value.trim(),
            priority: priorityInput.value, dueDate: dueDateInput.value,
            recurrence: recurrenceInput.value, subtasks: [], notificationSent: false
        });

        logActivity(`Task "${text}" added.`);
        saveHistory();
        renderTasks();
        addTaskForm.reset();
        closeModal(addTaskModal);
    };

    const addProject = (name) => {
        if (!name) return;
        const newProjectId = Date.now();
        state.projects.push({ id: newProjectId, name, tasks: [], archivedTasks: [] });
        state.currentProjectId = newProjectId;
        logActivity(`Project "${name}" created.`);
        saveHistory();
        renderAll();
    };
    
    const deleteProject = (projectId) => {
        const project = state.projects.find(p => p.id === projectId);
        if (!project || !confirm(`Are you sure you want to delete project "${project.name}" and all its tasks? This cannot be undone.`)) return;
        
        state.projects = state.projects.filter(p => p.id !== projectId);
        logActivity(`Project "${project.name}" deleted.`);
        
        if (state.currentProjectId === projectId) {
            state.currentProjectId = state.projects.length > 0 ? state.projects[0].id : null;
        }
        
        saveHistory();
        renderAll();
    };
    
    const toggleComplete = (taskId) => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            logActivity(`Task "${task.text}" marked as ${task.completed ? 'complete' : 'pending'}.`);
            saveHistory();
            renderTasks();
        }
    };

    const archiveTask = (taskId) => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        const taskIndex = project.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            const [taskToArchive] = project.tasks.splice(taskIndex, 1);
            if (!project.archivedTasks) project.archivedTasks = [];
            project.archivedTasks.push(taskToArchive);
            logActivity(`Task "${taskToArchive.text}" archived.`);
            saveHistory();
            renderTasks();
        }
    };
    
    const unarchiveTask = (taskId) => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        const taskIndex = project.archivedTasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            const [taskToUnarchive] = project.archivedTasks.splice(taskIndex, 1);
            project.tasks.push(taskToUnarchive);
            logActivity(`Task "${taskToUnarchive.text}" restored from archive.`);
            saveHistory();
            renderTasks();
        }
    };

    const deleteTaskPermanently = (taskId) => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (confirm('Are you sure you want to permanently delete this task?')) {
            const taskIndex = project.archivedTasks.findIndex(t => t.id === taskId);
            if (taskIndex > -1) {
                const [deletedTask] = project.archivedTasks.splice(taskIndex, 1);
                logActivity(`Task "${deletedTask.text}" permanently deleted.`);
                saveHistory();
                renderTasks();
            }
        }
    };
    
    const addSubtask = (taskId, text) => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        const task = project.tasks.find(t => t.id === taskId);
        if (task && text) {
            if (!task.subtasks) task.subtasks = [];
            task.subtasks.push({ id: Date.now(), text, completed: false });
            logActivity(`Subtask added to "${task.text}".`);
            saveHistory();
            renderTasks();
        }
    };

    const toggleSubtask = (taskId, subtaskId) => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        const task = project.tasks.find(t => t.id === taskId);
        const subtask = task?.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
            subtask.completed = !subtask.completed;
            saveHistory();
            renderTasks();
        }
    };

    const updateDescription = (taskId, description) => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
            task.description = description;
            logActivity(`Description for "${task.text}" updated.`);
            saveHistory();
        }
    };
    
    const sortTasksByDate = () => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (!project) return;

        project.tasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
        });

        logActivity(`Tasks in "${project.name}" sorted by due date.`);
        saveHistory();
        renderTasks();
    };
    
    const updateDashboard = () => {
        const allTasks = state.projects.flatMap(p => [...(p.tasks || []), ...(p.archivedTasks || [])]);
        const completedTasks = allTasks.filter(t => t.completed);
        const pendingTasks = allTasks.filter(t => !t.completed);

        document.getElementById('completed-count').textContent = completedTasks.length;
        document.getElementById('pending-stat-count').textContent = pendingTasks.length;

        const completionDates = {};
        completedTasks.forEach(t => {
            const date = new Date(t.dueDate || t.id).toLocaleDateString();
            completionDates[date] = (completionDates[date] || 0) + 1;
        });
        const productiveDay = Object.keys(completionDates).reduce((a, b) => completionDates[a] > completionDates[b] ? a : b, "-");
        document.getElementById('productive-day').textContent = productiveDay;

        const priorities = { low: 0, medium: 0, high: 0 };
        allTasks.forEach(t => {
            if (t.priority) priorities[t.priority]++;
        });
        
        const ctx = document.getElementById('priority-chart').getContext('2d');
        if(priorityChart) priorityChart.destroy();
        priorityChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Low', 'Medium', 'High'],
                datasets: [{
                    data: [priorities.low, priorities.medium, priorities.high],
                    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    };
    
    // ---- Import / Export ----
    const exportProject = () => {
        const project = state.projects.find(p => p.id === state.currentProjectId);
        if (!project) return alert('No project selected to export.');
        
        const dataStr = JSON.stringify(project.tasks, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `${project.name.replace(/\s+/g, '_')}_tasks.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        logActivity(`Project "${project.name}" exported.`);
    };

    const importTasks = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (!Array.isArray(importedTasks)) throw new Error("Invalid JSON format.");

                const project = state.projects.find(p => p.id === state.currentProjectId);
                if (!project) return alert('No project selected to import into.');
                
                project.tasks.push(...importedTasks);
                logActivity(`${importedTasks.length} tasks imported into "${project.name}".`);
                saveHistory();
                renderTasks();
            } catch (error) {
                alert('Failed to import tasks. Please check the file format.');
            }
        };
        reader.readAsText(file);
        importFileInput.value = ''; // Reset input
    };

    // ---- Event Listeners ----
    openAddTaskModalBtn.addEventListener('click', () => openModal(addTaskModal));
    addTaskForm.addEventListener('submit', addTask);

    document.querySelectorAll('.modal').forEach(modal => {
        modal.querySelector('.close-btn')?.addEventListener('click', () => closeModal(modal));
        modal.querySelector('.btn-cancel')?.addEventListener('click', () => closeModal(modal));
    });

    addProjectBtn.addEventListener('click', () => { addProject(newProjectInput.value.trim()); newProjectInput.value = ''; });
    newProjectInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { addProject(newProjectInput.value.trim()); newProjectInput.value = ''; } });
    
    projectList.addEventListener('click', (e) => {
        const projectItem = e.target.closest('.project-item');
        if (!projectItem) return;
        const projectId = Number(projectItem.dataset.id);
        if (e.target.closest('.delete-project-btn')) {
            deleteProject(projectId);
        } else {
            state.currentProjectId = projectId;
            renderAll();
        }
    });

    todoList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('li');
        if (!taskItem) return;
        const taskId = Number(taskItem.dataset.id);

        if (e.target.closest('.complete-btn')) toggleComplete(taskId);
        if (e.target.closest('.archive-btn')) archiveTask(taskId);
        if (e.target.closest('.unarchive-btn')) unarchiveTask(taskId);
        if (e.target.closest('.delete-btn')) deleteTaskPermanently(taskId);

        if (e.target.matches('.subtask-item input[type="checkbox"]')) {
            const subtaskId = Number(e.target.closest('.subtask-item').dataset.subtaskId);
            toggleSubtask(taskId, subtaskId);
        }

        if (e.target.closest('.subtask-add-btn')) {
            const input = taskItem.querySelector('.subtask-add-input');
            addSubtask(taskId, input.value.trim());
            input.value = '';
        }
        
        if (e.target.matches('.task-description')) {
            e.target.contentEditable = true;
            e.target.focus();
        }
    });
    
    todoList.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.matches('.subtask-add-input')) {
            e.preventDefault();
            const taskId = Number(e.target.closest('li').dataset.id);
            addSubtask(taskId, e.target.value.trim());
            e.target.value = '';
        }
    });

    todoList.addEventListener('blur', (e) => {
        if (e.target.matches('.task-description')) {
            e.target.contentEditable = false;
            const taskId = Number(e.target.closest('li').dataset.id);
            updateDescription(taskId, e.target.innerHTML);
        }
    }, true);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    
    importBtn.addEventListener('click', () => importFileInput.click());
    exportBtn.addEventListener('click', exportProject);
    importFileInput.addEventListener('change', importTasks);
    
    if (recognition) {
        voiceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const targetInput = document.getElementById(targetId);
                recognition.start();
                btn.classList.add('recording');

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    if (targetId === 'task-description-input' && transcript.toLowerCase().startsWith('add subtask')) {
                        const subtaskText = transcript.substring(12).trim();
                        console.log(`Voice command to add subtask: ${subtaskText}`);
                    } else {
                        targetInput.value = transcript;
                    }
                };
                
                recognition.onend = () => {
                    btn.classList.remove('recording');
                };
            });
        });
    }

    searchInput.addEventListener('input', renderTasks);
    sortByDateBtn.addEventListener('click', sortTasksByDate);

    activityLogBtn.addEventListener('click', () => {
        activityLogList.innerHTML = state.activityLog.map(log => 
            `<li>${log.message} <div class="log-time">${new Date(log.timestamp).toLocaleString()}</div></li>`
        ).join('');
        openModal(activityLogModal);
    });

    dashboardBtn.addEventListener('click', () => {
        updateDashboard();
        openModal(dashboardModal);
    });

    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    menuToggle.addEventListener('click', () => appLayout.classList.toggle('sidebar-open'));
    themeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('todoAppTheme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // ---- Initial Load ----
    const applyTheme = () => {
        if (localStorage.getItem('todoAppTheme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
    };

    applyTheme();
    loadState();
    renderAll();
});
