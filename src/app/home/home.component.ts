import { Component, inject, ViewChild } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import { CommonModule } from '@angular/common';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TodoComponent, ReactiveFormsModule],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Search" #filter />
        <button
          class="primary"
          type="button"
          (click)="filterResults(filter.value)"
        >
          Search
        </button>
      </form>
    </section>
    <div class="add-task" (click)="openModal()">
      <div>+</div>
      <span>Add todo</span>
    </div>
    <section class="form-container" [class.hidden]="!modalVisible">
      <form [formGroup]="addForm">
        <input
          id="task-name"
          type="text"
          placeholder="Task name"
          formControlName="taskName"
        />
        <input id="due-date" type="date" formControlName="dueDate" />
        <div>
          <button (click)="submitForm()" type="submit" class="primary">
            Add task
          </button>
          <button (click)="openModal()">Cancel</button>
        </div>
      </form>
    </section>

    <section class="results">
      <h1>Todos</h1>
      <app-todo
        (onCheck)="complete($event)"
        (onDelete)="deleteTodo($event)"
        *ngFor="let todo of filteredTodoList"
        [todo]="todo"
      >
      </app-todo>
    </section>
  `,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  modalVisible = false;
  todoList: Todo[] = [];
  filteredTodoList: Todo[] = [];
  todoService: TodoService = inject(TodoService);

  addForm = new FormGroup({
    taskName: new FormControl(''),
    dueDate: new FormControl(''),
  });

  constructor() {
    this.todoService.getAllTodos().then((todoList: Todo[]) => {
      this.todoList = todoList;
      this.filteredTodoList = todoList;
    });
  }

  openModal() {
    this.modalVisible = !this.modalVisible;
  }

  submitForm() {
    if (this.addForm.value.taskName == '') {
      alert('taskname empty');
      return;
    }
    this.todoService
      .submitTask(
        this.addForm.value.taskName ?? '',
        this.addForm.value.dueDate ?? ''
      )
      .then((todoList: Todo[]) => {
        this.todoList = todoList;
        this.filteredTodoList = todoList;
      });
    this.openModal();
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredTodoList = this.todoList;
      return;
    }

    this.filteredTodoList = this.todoList.filter((todo) =>
      todo?.name.toLowerCase().includes(text.toLowerCase())
    );
  }

  deleteTodo(todo: Todo) {
    this.todoService.delete(todo.id).then((todoList: Todo[]) => {
      this.todoList = todoList;
      this.filteredTodoList = todoList;
    });
  }

  complete(todo: Todo) {
    this.todoService.complete(todo).then((todoList: Todo[]) => {
      this.todoList = todoList;
      this.filteredTodoList = todoList;
    });
  }
}
