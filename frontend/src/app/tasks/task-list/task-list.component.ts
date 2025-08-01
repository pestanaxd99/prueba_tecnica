import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],

})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  isLoading = true;
  totalTasks = 0;
  filterStatus: 'all' | 'pendiente' | 'completado' = 'all';

  constructor(private tasksService: TasksService, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loadTasks();
  }

  shouldShowTooltip(title: string): boolean {
  return title.length > 30;
}

  loadTasks() {
    this.isLoading = true;
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: () => {
        this.tasks = [];
        this.isLoading = false;
      }
    });
  }

  get filteredTasks() {
    if (this.filterStatus === 'all') return this.tasks;
    return this.tasks.filter(task => task.estatus === this.filterStatus);
  }

  deleteTask(id: number) {
    if (confirm('¿Estás seguro de eliminar esta tarea permanentemente?')) {
      this.tasksService.deleteTask(id).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== id);
          this.snackBar.open('Tarea eliminada correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.snackBar.open('Error al eliminar la tarea', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  editTask(taskId: number) {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('Sesión cerrada correctamente', 'Cerrar', { duration: 3000 });
  }
}