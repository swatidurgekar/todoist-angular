import { Injectable } from '@angular/core';
import { Todo } from './todo';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  url = 'http://localhost:3000/todos';
  completedUrl = 'http://localhost:3000/completed';

  constructor(private router: Router) {}

  async getAllTodos(): Promise<Todo[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  async submitTask(taskName: string, due_date: string) {
    // console.log(`task received: taskName: ${taskName}.`);
    const prevdata = await fetch(this.url);
    const prevres = (await prevdata.json()) ?? [];
    const id = prevres[prevres.length - 1].id;
    const todo = {
      id: String(Number(id) + 1),
      name: taskName,
      due_date: due_date,
    };

    await fetch(`${this.url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async editTask(todoId: Number | null, taskName: string, due_date: string) {
    const todo = {
      id: todoId,
      name: taskName,
      due_date: due_date,
    };
    await fetch(`${this.url}/${todoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    const data = await fetch(this.url);
    this.router.navigate(['/']);
    return (await data.json()) ?? [];
  }

  async delete(todoId: Number) {
    await fetch(`${this.url}/${todoId}`, {
      method: 'DELETE',
    });
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async complete(todo: Todo) {
    await fetch(`${this.url}/${todo.id}`, {
      method: 'DELETE',
    });
    const data = await fetch(this.url);
    await fetch(`${this.completedUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    return (await data.json()) ?? [];
    // console.log(res);
  }
}
