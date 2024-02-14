import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../todo';
import { TodoService } from '../todo.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <section class="modal-background" [class.hidden]="!modalVisible">
      <div class="modal">
        <div class="close">
          <span (click)="openModal()">X</span>
        </div>
        <div class="heading">{{ todo.name }}</div>
        <div class="date">
          <div class="label">Due date</div>
          <div class="due-date">
            {{ todo.due_date == '' ? '-' : todo.due_date }}
          </div>
        </div>
      </div>
    </section>

    <div class="todo-item">
      <div class="todo-details">
        <div class="todo-check">
          <input
            (click)="complete(todo)"
            type="checkbox"
            id="todo-checkbox"
            class="round-checkbox"
          />
          <p>{{ todo.name }}</p>
        </div>
      </div>
      <div class="todo-actions">
        <a (click)="openModal()">Learn More</a>
        <button [routerLink]="['/edit', todo.id]">Edit todo</button>
        <button (click)="deleteTodo(todo)">Delete</button>
      </div>
    </div>
  `,
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  @Input() todo!: Todo;
  modalVisible = false;
  @Output() onDelete = new EventEmitter<Todo>();
  @Output() onCheck = new EventEmitter<Todo>();
  todoService: TodoService = inject(TodoService);

  openModal() {
    this.modalVisible = !this.modalVisible;
  }

  deleteTodo(todo: Todo) {
    const todoToDelete: Todo = this.todo;
    this.onDelete.emit(todoToDelete);
  }

  complete(todo: Todo) {
    const checkedTodo: Todo = this.todo;
    this.onCheck.emit(checkedTodo);
  }
}
