import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterOutlet],
  template: `
    <section class="form-container">
      <form [formGroup]="addForm">
        <input
          autofocus
          value="{{ todo?.name }}"
          id="task-name"
          type="text"
          placeholder="Task name"
          #taskName
          formControlName="taskName"
        />
        <input
          value="{{ todo?.due_date }}"
          id="due-date"
          type="date"
          #due_date
          formControlName="dueDate"
        />
        <div>
          <button
            (click)="submitForm(taskName.value, due_date.value)"
            type="submit"
            class="primary"
          >
            Save
          </button>
          <button [routerLink]="['/']">Cancel</button>
        </div>
      </form>
    </section>
  `,
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  todoService = inject(TodoService);
  todo: Todo | undefined;

  addForm = new FormGroup({
    taskName: new FormControl(''),
    dueDate: new FormControl(''),
  });

  constructor() {
    const todoId = parseInt(this.route.snapshot.params['id'], 10);
    this.todoService.getTodoById(todoId).then((todo) => {
      this.todo = todo;
    });
  }

  submitForm(taskName: string, due_date: string) {
    const todo = this.todo ? this.todo : { id: null };
    this.todoService.editTask(todo.id, taskName, due_date);
  }
}
