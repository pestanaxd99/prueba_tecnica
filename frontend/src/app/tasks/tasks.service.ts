import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Task, CreateTaskDto, UpdateTaskDto } from './task.model';

interface ApiResponse {
  success: boolean;
  data: Task[];
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  createTask(taskData: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.API_URL, taskData);
  }

  updateTask(id: number, taskData: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, taskData);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}