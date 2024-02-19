Vue.component('board', {
    template:`
      <div class="product">
        <div class="addForm">
          <div v-if="form_show">
            <form @submit.prevent="onSubmit">
              <p v-if="errors.length">
                <b>Возникли следующие ошибки, пожалуйста, исправьте их!</b>
              <ul>
                <li v-for="error in errors">{{ error }}</li>
              </ul>
              </p>

              <p>
                <label for="name">Заголовок</label>
                <input id="name" v-model="name" type="text">
              </p>

              <p>
                <label for="desc">Описание задачи</label>
                <textarea id="desc" v-model="desc"></textarea>
              </p>

              <p>
                <label for="deadline">Дэдлайн</label>
                <input id="deadline" type="date" v-model="deadline">
              </p>

              <p>
                <input type="submit" value="Создать карточку" class="btn-create-card">
              </p>
            </form>
          </div>
        </div>

        <div class="columns-on-page">
          <div class="column">
            <h2 class="title-column">Запланированные задачи</h2>
            <button @click="showForm()">Создать</button>
            <div class="card" v-for="(task, index) in plannedTasks" :key="index">
              <div v-if="editedTaskIndex !== index || editedColumn !== 'plannedTasks'">
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.createdAt }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
                <p v-if="task.lastChange !== null">Последнее редактирование: {{ task.lastChange }}</p>
                <div class="card-btn">
                  <button @click="startEditing(index, 'plannedTasks')">Редактировать</button>
                  <button class="delete-button" @click="removeTask(index)">Удалить</button>
                  <button class="move-button" @click="moveToInProgress(task)">Переместить в работу</button>
                </div>
              </div>
              <div v-if="editedColumn === 'plannedTasks' && editedTaskIndex === index">
                <h3>Редактировать карточку</h3>
                <form @submit.prevent="finishEditing(editedTaskIndex)">
                  <p>
                    <label for="editTitle">Заголовок</label>
                    <input id="editTitle" type="text" v-model="editedTask.name">
                  </p>

                  <p>
                    <label for="editDesc">Описание задачи</label>
                    <textarea id="editDesc" v-model="editedTask.desc"></textarea>
                  </p>

                  <p>
                    <label for="editDeadline">Дэдлайн</label>
                    <input id="editDeadline" type="date" v-model="editedTask.deadline">
                  </p>

                  <button type="submit" >Сохранить</button>
                </form>
              </div>
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Задачи в работе</h2>
            <div class="card" v-for="(task, index) in progressTasks" :key="index">
              <div v-if="editedTaskIndex !== index || editedColumn !== 'progressTasks'">
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.createdAt }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
                <p v-if="task.lastChange !== null">Последнее редактирование: {{ task.lastChange }}</p>
                <p class="reasonReturn" v-if="task.reason_of_return !== null">Причина возврата: {{ task.reason_of_return }}</p>
                <button @click="startEditing(index, 'progressTasks')" :disabled="task.isBlock">Редактировать</button>
              </div>
              <div v-if="editedColumn === 'progressTasks' && editedTaskIndex === index">
                <h3>Редактировать карточку</h3>
                <form @submit.prevent="finishEditing(editedTaskIndex)">
                  <p>
                    <label for="editTitle">Заголовок</label>
                    <input id="editTitle" type="text" v-model="editedTask.name">
                  </p>

                  <p>
                    <label for="editDesc">Описание задачи</label>
                    <textarea id="editDesc" v-model="editedTask.desc"></textarea>
                  </p>

                  <p>
                    <label for="editDeadline">Дэдлайн</label>
                    <input id="editDeadline" type="date" v-model="editedTask.deadline">
                  </p>

                  <button type="submit" >Сохранить</button>
                </form>
              </div>
              <button class="move-button" @click="moveToTesting(task)" :disabled="task.isBlock">Отправить в тестирование</button>
              <button class="move-button" :disabled="task.isBlock">Сделать приоритетной</button>
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Тестирование</h2>
            <div class="card" v-for="(task, index) in testingTasks" :key="index">
              <div v-if="editedTaskIndex !== index || editedColumn !== 'testingTasks'">
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.createdAt }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
                <p v-if="task.lastChange !== null">Последнее редактирование: {{ task.lastChange }}</p>
                <button @click="startEditing(index, 'testingTasks')">Редактировать</button>
              </div>
              <div v-if="editedColumn === 'testingTasks' && editedTaskIndex === index">
                <h3>Редактировать карточку</h3>
                <form @submit.prevent="finishEditing(editedTaskIndex)">
                  <p>
                    <label for="editTitle">Заголовок</label>
                    <input id="editTitle" type="text" v-model="editedTask.name">
                  </p>

                  <p>
                    <label for="editDesc">Описание задачи</label>
                    <textarea id="editDesc" v-model="editedTask.desc"></textarea>
                  </p>

                  <p>
                    <label for="editDeadline">Дэдлайн</label>
                    <input id="editDeadline" type="date" v-model="editedTask.deadline">
                  </p>

                  <button type="submit" >Сохранить</button>
                </form>
              </div>
              <button class="move-button" @click="moveToCompleted(task)">Переместить в выполненное</button>
              <button class="move-button" @click="returnToInProgress(task, index)">Вернуть в работу</button>
              <label for="return"><br>Причина возврата:</label>
              <input class="return-reason-input" id="return" type="text" v-model="task.reason_of_return">
            </div>
          </div>

          <div class="column">
            <h2 class="title-column">Выполненные задачи</h2>
            <div class="card" v-for="(task, index) in completedTasks" :key="index">
              <div>
                <h3>Заголовок: {{ task.name_card }}</h3>
                <div class="line"></div>
                <p>Описание: {{ task.description }}</p>
                <p>Дата создания: {{ task.createdAt }}</p>
                <p>Дэдлайн: {{ task.data_line }}</p>
                <p v-if="task.lastChange !== null">Последнее редактирование: {{ task.lastChange }}</p>
                <p class="overdueDeadline" v-if="task.isOverdue">Задача просрочена</p>
                <p class="completedDeadline" v-else>Задача выполнена в срок</p>
              </div>
            </div>
          </div>
        </div>
        
        
        
      </div>
    `,
    data(){
        return {
            name: null,
            desc: null,
            form_show: false,
            deadline: null,
            plannedTasks: [],
            progressTasks: [],
            testingTasks: [],
            completedTasks: [],
            errors: [],
            editedTask: null,
            editedTaskIndex: null,
            editedColumn: null,
            priorityTask: null
        }
    },
    mounted() {
        if (localStorage.getItem('cards')) {
            const savedData = JSON.parse(localStorage.getItem('cards'));
            this.plannedTasks = savedData.plannedTasks;
            this.progressTasks = savedData.progressTasks;
            this.testingTasks = savedData.testingTasks;
            this.completedTasks = savedData.completedTasks;
        }
    },
    methods:{
        showForm() {
            this.form_show = true
        },
        // setPriorityTask(task) {
        //     this.priorityTask = task;
        //     this.progressTasks.forEach(t => t.isBlock = true);
        // },
        onSubmit() {
            this.errors = [];

            if (new Date(this.deadline) <= new Date(new Date().setDate(new Date().getDate()))) {
                alert('Недействительная дата дэдлайна (минимум должен быть - завтра)');
                return;
            }

            if(this.name && this.desc && this.deadline){
                this.plannedTasks.push({
                    name_card: this.name,
                    description: this.desc,
                    data_line: this.deadline,
                    createdAt: new Date().toLocaleString(),
                    lastChange: null,
                    isOverdue: false,
                    reason_of_return: null,
                    isBlock: false
                });
                this.name = null;
                this.desc = null;
                this.deadline = null;
            }else{
                if(!this.name) this.errors.push("Заголовок не может быть пустым!");
                if(!this.desc) this.errors.push("Описание не может быть пустым!");
                if(!this.deadline) this.errors.push("Дэдлайн не может быть пустым!");
            }

            this.form_show = false;

            localStorage.setItem('cards', JSON.stringify({
                plannedTasks: this.plannedTasks,
                progressTasks: this.progressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks
            }));
        },
        startEditing(index, column) {
            this.editedTaskIndex = index;
            this.editedColumn = column;

            if(this.editedColumn === 'plannedTasks'){
                this.editedTask = {
                    name: this.plannedTasks[index].name_card,
                    desc: this.plannedTasks[index].description,
                    deadline: this.plannedTasks[index].data_line,
                    createdAt: this.plannedTasks[index].createdAt
                };
            }
            else if(this.editedColumn === 'progressTasks'){
                this.editedTask = {
                    name: this.progressTasks[index].name_card,
                    desc: this.progressTasks[index].description,
                    deadline: this.progressTasks[index].data_line,
                    createdAt: this.progressTasks[index].createdAt,
                    reason_of_return: this.progressTasks[index].reason_of_return
                };
            }
            else if(this.editedColumn === 'testingTasks'){
                this.editedTask = {
                    name: this.testingTasks[index].name_card,
                    desc: this.testingTasks[index].description,
                    deadline: this.testingTasks[index].data_line,
                    createdAt: this.testingTasks[index].createdAt,
                    reason_of_return: this.progressTasks[index].reason_of_return
                };
            }
        },
        finishEditing(index) {
            if (this.editedColumn === 'plannedTasks') {
                this.plannedTasks[this.editedTaskIndex] = {
                    name_card: this.editedTask.name,
                    description: this.editedTask.desc,
                    data_line: this.editedTask.deadline,
                    createdAt: this.editedTask.createdAt,
                    lastChange: new Date().toLocaleString()
                };
            }
            else if (this.editedColumn === 'progressTasks') {
                this.progressTasks[this.editedTaskIndex] = {
                    name_card: this.editedTask.name,
                    description: this.editedTask.desc,
                    data_line: this.editedTask.deadline,
                    createdAt: this.editedTask.createdAt,
                    reason_of_return: this.editedTask.reason_of_return,
                    lastChange: new Date().toLocaleString()
                };
            }
            else if (this.editedColumn === 'testingTasks') {
                this.testingTasks[this.editedTaskIndex] = {
                    name_card: this.editedTask.name,
                    description: this.editedTask.desc,
                    data_line: this.editedTask.deadline,
                    createdAt: this.editedTask.createdAt,
                    reason_of_return: this.editedTask.reason_of_return,
                    lastChange: new Date().toLocaleString()
                };
            }

            localStorage.setItem('cards', JSON.stringify({
                plannedTasks: this.plannedTasks,
                progressTasks: this.progressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks
            }));

            this.editedTask = null;
            this.editedTaskIndex = null;
            this.editedColumn = null;
        },
        removeTask(taskIndex) {
            this.plannedTasks.splice(taskIndex, 1);

            localStorage.setItem('cards', JSON.stringify({
                plannedTasks: this.plannedTasks,
                progressTasks: this.progressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks
            }));
        },
        moveToInProgress(task) {
            const index_column1 = this.plannedTasks.indexOf(task)
            this.plannedTasks.splice(index_column1, 1);
            this.progressTasks.push(task);

            localStorage.setItem('cards', JSON.stringify({
                plannedTasks: this.plannedTasks,
                progressTasks: this.progressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks
            }));
        },
        moveToTesting(task) {
            const index_column2 = this.progressTasks.indexOf(task)
            this.progressTasks.splice(index_column2, 1);
            this.testingTasks.push(task);

            localStorage.setItem('cards', JSON.stringify({
                plannedTasks: this.plannedTasks,
                progressTasks: this.progressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks
            }));
        },
        returnToInProgress(task, taskIndex) {
            if (!this.testingTasks[taskIndex].reason_of_return) {
                alert('Необходимо указать причину возврата');
                return;
            }

            const index_return = this.testingTasks.indexOf(task)
            this.testingTasks.splice(index_return, 1);
            this.progressTasks.push(task);

            localStorage.setItem('cards', JSON.stringify({
                plannedTasks: this.plannedTasks,
                progressTasks: this.progressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks
            }));
        },
        moveToCompleted(task) {
            const index_column3 = this.testingTasks.indexOf(task)
            this.testingTasks.splice(index_column3, 1);
            if(new Date(task.deadline) < new Date()){
                task.isOverdue = true;
            }
            this.completedTasks.push(task);

            localStorage.setItem('cards', JSON.stringify({
                plannedTasks: this.plannedTasks,
                progressTasks: this.progressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks
            }));
        }
    }
})


new Vue({
    el: '#app',
    data(){
        return {}
    },
})