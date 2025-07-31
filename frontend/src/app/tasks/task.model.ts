export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estatus: 'pendiente' | 'completado';
  creado_en: string;
}

export interface CreateTaskDto {
  titulo: string;
  descripcion?: string;
  estatus?: 'pendiente' | 'completado';
}

export interface UpdateTaskDto {
  titulo?: string;
  descripcion?: string;
  estatus?: 'pendiente' | 'completado';
}