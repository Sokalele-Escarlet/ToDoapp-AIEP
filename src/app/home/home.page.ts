import { Component, OnInit } from '@angular/core';
import { ServiceDatabase } from '../services/service.database';

// Interfaz para la Tarea (Task)
interface Task {
  id: number | null;
  title: string;
  description: string;
  category: string;
  priority: 'baja' | 'media' | 'alta';
  status: 'pendiente' | 'completada';
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  
  // Definiciones estáticas para Categoría y Prioridad (usados en HTML)
  public categories = ['Trabajo', 'Estudios', 'Hogar', 'Personal', 'Otro'];
  public priorities: Task['priority'][] = ['baja', 'media', 'alta'];

  people: Task[] = []; // Renombrado lógicamente a 'tasks' pero mantenemos 'people' para no cambiar mucho el código
  
  // Objeto para la tarea actual
  person: Task = {
    id: null,
    title: "",
    description: "",
    category: this.categories[0], // Valor por defecto
    priority: 'media',            // Valor por defecto
    status: 'pendiente'
  };
  
  isEditing: boolean = false;
  
  // Variables para Filtrado (Requerimiento 2)
  filterCategory: string = '';
  filterPriority: string = '';


  constructor(private dbService: ServiceDatabase) { }

  async ngOnInit() {
    await this.dbService.initDB();
    this.loadPeople();
  }

  // Se actualiza para usar filtros
  async loadPeople() {
    let tasks: Task[] = [];
    
    if (this.filterCategory) {
      tasks = await this.dbService.getFilteredTasks('category', this.filterCategory) as Task[];
    } else if (this.filterPriority) {
      tasks = await this.dbService.getFilteredTasks('priority', this.filterPriority) as Task[];
    } else {
      tasks = await this.dbService.getPeople() as Task[]; 
    }
    
    // Opcional: ordenar las tareas para que las pendientes vayan primero
    this.people = tasks.sort((a, b) => {
        if (a.status === 'pendiente' && b.status === 'completada') return -1;
        if (a.status === 'completada' && b.status === 'pendiente') return 1;
        // Ordenar por prioridad si el estado es el mismo
        const priorityOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  async savePerson() {
    // Validar título antes de guardar
    if (!this.person.title) {
        // En un entorno real, usarías un Toast o Modal de Ionic. Aquí solo un console.error.
        console.error("El título de la tarea es obligatorio.");
        return; 
    }
    
    if (this.isEditing && this.person.id !== null) {
      // Requerimiento 3: Actualizar tarea con los 4 campos editables
      await this.dbService.updatePerson(
        this.person.id, 
        this.person.title, 
        this.person.description, 
        this.person.category, 
        this.person.priority
      );
      this.isEditing = false;
    } else {
      // Requerimiento 1: Agregar tarea
      await this.dbService.addPerson(
        this.person.title, 
        this.person.description, 
        this.person.category, 
        this.person.priority
      );
    }
    
    // Limpiar campos después de guardar/actualizar
    this.resetForm();
    this.loadPeople();
  }
  
  // Nueva función para reiniciar el formulario
  resetForm() {
    this.person = {
      id: null,
      title: "",
      description: "",
      category: this.categories[0],
      priority: 'media',
      status: 'pendiente'
    };
    this.isEditing = false;
  }
  
  editPerson(personToEdit: Task) {
    // Copiar los datos de la tarea a editar (Deep copy si fuera más complejo, pero aquí basta)
    this.person = { ...personToEdit }; 
    this.isEditing = true;
  }
  
  // Requerimiento 4: Marcar como completada
  async toggleTaskStatus(task: Task) {
      const newStatus = task.status === 'pendiente' ? 'completada' : 'pendiente';
      if (task.id !== null) {
          await this.dbService.updateTaskStatus(task.id, newStatus);
          this.loadPeople();
      }
  }

  // Requerimiento 5: Eliminar tarea
  async deletePerson(id: number | null) {
    if (id !== null) {
      await this.dbService.deletePerson(id);
      this.loadPeople();
    }
  }
}