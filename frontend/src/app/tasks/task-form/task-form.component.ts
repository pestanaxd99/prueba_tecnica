import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon'; // <-- Añade esta línea
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <-- Añade esta línea
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule,
    MatIconModule, // <-- Añade esta línea
    MatProgressSpinnerModule // <-- Añade esta línea
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId?: number;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      estatus: ['pendiente', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: number) {
    this.isLoading = true;
    this.tasksService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        const task = tasks.find((t: Task) => t.id === id);
        if (task) {
          this.taskForm.patchValue({
            titulo: task.titulo,
            descripcion: task.descripcion,
            estatus: task.estatus
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Error al cargar la tarea', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.isLoading = true;
      const taskData = this.taskForm.value;

      const operation = this.isEditMode && this.taskId
        ? this.tasksService.updateTask(this.taskId, taskData)
        : this.tasksService.createTask(taskData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Tarea ${this.isEditMode ? 'actualizada' : 'creada'} correctamente`,
            'Cerrar',
            { duration: 3000 }
          );
          this.router.navigate(['/tasks']);
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open(
            'Error al guardar la tarea',
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
    }
  }
}