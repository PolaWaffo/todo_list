import { Task } from "./Task.js";

export class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = "toutes";
        this.searchQuery = "";
        this.currentPage = 1;
        this.tasksPerPage = 5;
        this.nextId = 1;

        this.editingTaskId = null;
        this.deleteTaskId = null;

        this.darkMode = "light";
        this.currentSort = "date-desc";
    }

    initializeElements() {
        this.taskInput = document.querySelector("#task");
        this.menu = document.querySelector("#menu");
        this.todoForm = document.querySelector("#todoForm");
        this.priorityInput = document.querySelector("#priority");
        this.submitBtn = document.querySelector("#submitBtn");
        this.dueDateInput = document.querySelector("#dueDate");
        this.searchInput = document.querySelector("#search");
        this.taskList = document.querySelector("#taskList");

        this.totalCount = document.querySelector("#total");
        this.completedCount = document.querySelector("#termine");
        this.pendingCount = document.querySelector("#attente");

        this.prevBtn = document.querySelector("#prevBtn");
        this.nextBtn = document.querySelector("#nextBtn");
        this.pageInfo = document.querySelector("#pageInfo");

        this.allTasksBtn = document.querySelector("#allTasks");
        this.pendingTasksBtn = document.querySelector("#pendingTasks");
        this.completedTasksBtn = document.querySelector("#completedTasks");

        this.sortInput = document.querySelector("#sort");

       
        this.editModal = document.querySelector("#editModal");
        this.editTaskInput = document.querySelector("#editTaskInput");
        this.editPriorityInput =
            document.querySelector("#editPriorityInput");

        this.deleteModal = document.querySelector("#deleteModal");
        this.deleteMessage = document.querySelector("#deleteMessage");

        this.cancelEditBtn =
            document.querySelector("#cancelEditBtn");

        this.cancelDeleteBtn =
            document.querySelector("#cancelDeleteBtn");

        this.deleteBtn =
            document.querySelector("#deleteBtn");

        this.saveEditBtn =
            document.querySelector("#saveEditBtn");

        this.notification =
            document.querySelector("#notification");
    }

    setupEventListeners() {
       
        this.todoForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.addTask();
        });

    
        this.searchInput.addEventListener("input", () => {
            this.searchQuery = this.searchInput.value;
            this.currentPage = 1;
            this.renderTasks();
        });

        this.menu.addEventListener("click", () => {
            this.toggleDarkMode();
        });

     
        this.sortInput.addEventListener("change", () => {
            this.currentSort = this.sortInput.value;
            this.currentPage = 1;
            this.renderTasks();
        });

        this.allTasksBtn.addEventListener("click", (e) => {
            e.preventDefault();

            this.currentFilter = "toutes";

            this.allTasksBtn.classList.add(
                "bg-primary",
                "text-white"
            );

            this.pendingTasksBtn.classList.remove(
                "bg-primary",
                "text-white"
            );

            this.completedTasksBtn.classList.remove(
                "bg-primary",
                "text-white"
            );

            this.currentPage = 1;

            this.renderTasks();
        });

        this.pendingTasksBtn.addEventListener("click", (e) => {
            e.preventDefault();

            this.currentFilter = "attente";

            this.allTasksBtn.classList.remove(
                "bg-primary",
                "text-white"
            );

            this.pendingTasksBtn.classList.add(
                "bg-primary",
                "text-white"
            );

            this.completedTasksBtn.classList.remove(
                "bg-primary",
                "text-white"
            );

            this.currentPage = 1;

            this.renderTasks();
        });

        
        this.completedTasksBtn.addEventListener("click", (e) => {
            e.preventDefault();

            this.currentFilter = "terminees";

            this.allTasksBtn.classList.remove(
                "bg-primary",
                "text-white"
            );

            this.completedTasksBtn.classList.add(
                "bg-primary",
                "text-white"
            );

            this.pendingTasksBtn.classList.remove(
                "bg-primary",
                "text-white"
            );

            this.currentPage = 1;

            this.renderTasks();
        });


        this.prevBtn.addEventListener("click", () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTasks();
            }
        });

    
        this.nextBtn.addEventListener("click", () => {
            const totalPages = this.getTotalPages();

            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTasks();
            }
        });

   
        this.cancelEditBtn.addEventListener("click", () => {
            this.closeEditModal();
        });

    
        this.cancelDeleteBtn.addEventListener("click", () => {
            this.closeDeleteModal();
        });

      
        this.deleteBtn.addEventListener("click", () => {
            if (this.deleteTaskId === null) {
                return;
            }

            this.deleteTask(this.deleteTaskId);
            this.closeDeleteModal();
        });

      
        this.saveEditBtn.addEventListener("click", () => {
            this.saveTaskEdit();
        });
    }

  

    addTask() {
        const text = this.taskInput.value.trim();
        const priority = this.priorityInput.value;
        const dueDate = this.dueDateInput.value || null;

        if (text === "") {
            this.showNotification("Aucune tâche ajoutée");
            return;
        }

        const existData = this.tasks.find(
            (task) =>
                task.text.toLowerCase() === text.toLowerCase()
        );

        if (existData) {
            this.showNotification("La tâche existe déjà");
            return;
        }

        const task = new Task(
            this.nextId,
            text,
            priority,
            new Date(),
            dueDate
        );

        this.tasks.push(task);

        this.nextId++;

        this.taskInput.value = "";
        this.priorityInput.value = "facile";
        this.dueDateInput.value = "";

        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        this.showNotification("Tâche ajoutée avec succès");
    }


    deleteTask(id) {
        const taskIndex = this.tasks.findIndex(
            (task) => task.id === id
        );

        if (taskIndex === -1) {
            return;
        }

        this.tasks.splice(taskIndex, 1);

        const totalPages = this.getTotalPages();

        if (
            totalPages > 0 &&
            this.currentPage > totalPages
        ) {
            this.currentPage = totalPages;
        }

        if (totalPages === 0) {
            this.currentPage = 1;
        }

        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        this.showNotification("Tâche supprimée");
    }



    openDeleteModal(id) {
        const task = this.tasks.find(
            (task) => task.id === id
        );

        if (!task) {
            return;
        }

        this.deleteTaskId = id;

        if (this.deleteMessage) {
            this.deleteMessage.textContent =
                `Voulez-vous supprimer la tâche "${task.text}" ?`;
        }

        this.deleteModal.classList.remove("hidden");
        this.deleteModal.classList.add("flex");
    }



    closeDeleteModal() {
        this.deleteModal.classList.add("hidden");
        this.deleteModal.classList.remove("flex");

     
        this.deleteTaskId = null;
    }

 

    toggleComplete(id) {
        const task = this.tasks.find(
            (task) => task.id === id
        );

        if (!task) {
            return;
        }

        task.toggleCompleted();

        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        if (task.completed) {
            this.showNotification("Tâche terminée");
        } else {
            this.showNotification(
                "Tâche remise en attente"
            );
        }
    }


    openEditModal(id) {
        const task = this.tasks.find(
            (task) => task.id === id
        );

        if (!task) {
            return;
        }

        this.editingTaskId = id;

        this.editTaskInput.value = task.text;
        this.editPriorityInput.value = task.priority;

        this.editModal.classList.remove("hidden");
        this.editModal.classList.add("flex");
    }



    closeEditModal() {
        this.editModal.classList.add("hidden");
        this.editModal.classList.remove("flex");

        this.editingTaskId = null;
    }


    saveTaskEdit() {
        const task = this.tasks.find(
            (task) => task.id === this.editingTaskId
        );

        if (!task) {
            return;
        }

        const text = this.editTaskInput.value.trim();
        const priority = this.editPriorityInput.value;

        if (text === "") {
            this.showNotification(
                "La tâche ne peut pas être vide"
            );
            return;
        }

        const duplicate = this.tasks.find(
            (item) =>
                item.id !== this.editingTaskId &&
                item.text.toLowerCase() === text.toLowerCase()
        );

        if (duplicate) {
            this.showNotification(
                "Cette tâche existe déjà"
            );
            return;
        }

        task.text = text;
        task.priority = priority;

        this.saveTasks();

        this.closeEditModal();

        this.renderTasks();

        this.showNotification("Tâche modifiée");
    }



    getFilteredTasks() {
        let filteredTasks = [...this.tasks];

        if (this.currentFilter === "attente") {
            filteredTasks = filteredTasks.filter(
                (task) => !task.completed
            );
        }

        if (this.currentFilter === "terminees") {
            filteredTasks = filteredTasks.filter(
                (task) => task.completed
            );
        }

        if (this.searchQuery.trim() !== "") {
            const search =
                this.searchQuery.toLowerCase().trim();

            filteredTasks = filteredTasks.filter(
                (task) =>
                    task.text
                        .toLowerCase()
                        .includes(search)
            );
        }

        return this.sortTasks(filteredTasks);
    }


    sortTasks(tasks) {
        if (this.currentSort === "date-asc") {
            return tasks.sort(
                (a, b) =>
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
            );
        }

        if (this.currentSort === "date-desc") {
            return tasks.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );
        }

        if (this.currentSort === "priority") {
            const priorityOrder = {
                facile: 1,
                moyenne: 2,
                difficile: 3
            };

            return tasks.sort(
                (a, b) =>
                    priorityOrder[b.priority] -
                    priorityOrder[a.priority]
            );
        }

        if (this.currentSort === "due-date") {
            return tasks.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;

                return (
                    new Date(a.dueDate) -
                    new Date(b.dueDate)
                );
            });
        }

        return tasks;
    }


    getPaginatedTasks() {
        const filteredTasks =
            this.getFilteredTasks();

        const start =
            (this.currentPage - 1) *
            this.tasksPerPage;

        const end =
            start + this.tasksPerPage;

        return filteredTasks.slice(start, end);
    }

    getTotalPages() {
        const filteredTasks =
            this.getFilteredTasks();

        return Math.ceil(
            filteredTasks.length /
            this.tasksPerPage
        );
    }

 

    renderTasks() {
        const tasks =
            this.getPaginatedTasks();

        this.taskList.innerHTML = "";

        if (tasks.length === 0) {
            const div =
                document.createElement("div");

            const icon =
                document.createElement("i");

            const text =
                document.createElement("p");

            div.className =
                "flex flex-col justify-center items-center p-10";

            icon.className =
                "fa-solid fa-list-check text-4xl mb-3";

            text.textContent =
                this.tasks.length === 0
                    ? "Aucune tâche pour le moment"
                    : "Aucune tâche correspondante";

            div.appendChild(icon);
            div.appendChild(text);

            this.taskList.appendChild(div);

            this.updatePagination();
            this.updateStats();

            return;
        }

        tasks.forEach((task) => {
            const div =
                document.createElement("div");

            const content =
                document.createElement("div");

            const checkbox =
                document.createElement("input");

            const text =
                document.createElement("p");

            const priority =
                document.createElement("span");

            const date =
                document.createElement("small");

            const actions =
                document.createElement("div");

            const editBtn =
                document.createElement("button");

            const deleteBtn =
                document.createElement("button");

            const editIcon =
                document.createElement("i");

            const deleteIcon =
                document.createElement("i");

          
            div.className =
                "flex items-center justify-between p-4 border-b border-gray-500 even:bg-amber-500/20";

            content.className =
                "flex items-center gap-3";

        
            actions.className =
                "flex gap-3";

            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.className="accent-success"

    
            text.textContent = task.text;

            priority.textContent =
                task.priority;

            priority.className =
                "text-xs px-2 py-1 rounded bg-gray-100 dark:bg-success";

            if (task.dueDate) {
                date.textContent =
                    `Échéance : ${this.formatDate(
                        task.dueDate
                    )}`;

                date.className =
                    "text-xs text-gray-500";
            }

          
            editIcon.className =
                "fa-solid fa-pen text-green-500";

            deleteIcon.className =
                "fa-solid fa-trash text-red-500";

            editBtn.type = "button";
            deleteBtn.type = "button";

            editBtn.appendChild(editIcon);
            deleteBtn.appendChild(deleteIcon);

        
            checkbox.addEventListener(
                "change",
                () => {
                    this.toggleComplete(task.id);
                }
            );


            editBtn.addEventListener(
                "click",
                () => {
                    this.openEditModal(task.id);
                }
            );

      
            deleteBtn.addEventListener(
                "click",
                () => {
                    this.openDeleteModal(task.id);
                }
            );

            if (task.completed) {
                text.classList.add(
                    "line-through",
                    "opacity-50"
                );
            }

  
            content.appendChild(checkbox);
            content.appendChild(text);
            content.appendChild(priority);

            if (task.dueDate) {
                content.appendChild(date);
            }

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            div.appendChild(content);
            div.appendChild(actions);

            this.taskList.appendChild(div);
        });

        this.updatePagination();
        this.updateStats();
        this.checkDueDates();
    }


    updatePagination() {
        const totalPages =
            this.getTotalPages();

        if (totalPages === 0) {
            this.currentPage = 1;

            this.prevBtn.disabled = true;
            this.nextBtn.disabled = true;

            this.pageInfo.textContent =
                "Page 1 / 1";

            return;
        }

        if (this.currentPage > totalPages) {
            this.currentPage = totalPages;
        }

        this.prevBtn.disabled =
            this.currentPage === 1;

        this.nextBtn.disabled =
            this.currentPage === totalPages;

        this.pageInfo.textContent =
            `Page ${this.currentPage} / ${totalPages}`;
    }

  

    updateStats() {
        const totalTasks =
            this.tasks.length;

        const completedTasks =
            this.tasks.filter(
                (task) => task.completed
            );

        const pendingTasks =
            this.tasks.filter(
                (task) => !task.completed
            );

        this.totalCount.textContent =
            totalTasks;

        this.completedCount.textContent =
            completedTasks.length;

        this.pendingCount.textContent =
            pendingTasks.length;
    }



    showNotification(message) {
        this.notification.textContent =
            message;

        this.notification.classList.remove(
            "hidden"
        );

        setTimeout(() => {
            this.notification.classList.add(
                "hidden"
            );
        }, 3000);
    }

 

    toggleDarkMode() {
        this.darkMode =
            this.darkMode === "light"
                ? "dark"
                : "light";

        document.documentElement.dataset.theme =
            this.darkMode;

        this.menu.classList.toggle("active");

        this.saveDarkModePreference();
    }

 

    saveTasks() {
        localStorage.setItem(
            "tasks",
            JSON.stringify(this.tasks)
        );
    }

    loadTasks() {
        const savedTasks =
            localStorage.getItem("tasks");

        if (!savedTasks) {
            return;
        }

        try {
            const parsedTasks =
                JSON.parse(savedTasks);

            this.tasks =
                parsedTasks.map((task) => {
                    const newTask =
                        new Task(
                            task.id,
                            task.text,
                            task.priority,
                            new Date(task.createdAt),
                            task.dueDate || null
                        );

                    newTask.completed =
                        task.completed;

                    return newTask;
                });

            if (this.tasks.length > 0) {
                this.nextId =
                    Math.max(
                        ...this.tasks.map(
                            (task) => task.id
                        )
                    ) + 1;
            }
        } catch (error) {
            console.error(
                "Erreur lors du chargement des tâches",
                error
            );

            localStorage.removeItem("tasks");

            this.tasks = [];
        }
    }



    saveDarkModePreference() {
        localStorage.setItem(
            "darkMode",
            this.darkMode
        );
    }

    loadDarkModePreference() {
        const savedMode =
            localStorage.getItem("darkMode");

        if (
            savedMode === "dark" ||
            savedMode === "light"
        ) {
            this.darkMode = savedMode;
        }

        document.documentElement.dataset.theme =
            this.darkMode;
    }



    formatDate(date) {
        return new Date(date).toLocaleDateString(
            "fr-FR"
        );
    }

   
    checkDueDates() {
        const now = new Date();

        this.tasks.forEach((task) => {
            if (!task.dueDate || task.completed) {
                return;
            }

            const dueDate =
                new Date(task.dueDate);

            const difference =
                dueDate - now;

            const oneDay =
                24 * 60 * 60 * 1000;

            if (
                difference > 0 &&
                difference <= oneDay
            ) {
                console.log(
                    `Rappel : "${task.text}" arrive bientôt à échéance.`
                );
            }

            if (difference < 0) {
                console.log(
                    `La tâche "${task.text}" est en retard.`
                );
            }
        });
    }

    init() {
        this.initializeElements();

        this.loadTasks();
        this.loadDarkModePreference();

        this.setupEventListeners();

        this.renderTasks();
        this.updateStats();
        this.updatePagination();
    }
}