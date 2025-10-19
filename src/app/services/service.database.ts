import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';


@Injectable({
  providedIn: 'root'
})
export class ServiceDatabase {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  async initDB() {
    const sqlite = CapacitorSQLite;
    const dbName = 'todoDB'; // Renombramos la DB
    this.db = await this.sqlite.createConnection(dbName, false, 'no-encryption', 1, false);

    await this.db.open();

    // Requerimiento 1: Crear la tabla con los 5 campos
    const query = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        priority TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pendiente'
      );`;

    await this.db.execute(query);
  }

  // Requerimiento 2: Listar todas las tareas
  async getPeople() {
    const res = await this.db.query('SELECT * FROM tasks');
    return res.values ?? [];
  }
  
  // Nuevo método para filtrar (Requerimiento 2 - Opcional)
  async getFilteredTasks(filterType: 'category' | 'priority', value: string) {
    if (!value) return this.getPeople();
    
    // Usamos el nombre de la columna para la consulta. Esto es seguro si 'filterType'
    // solo toma los valores definidos ('category' o 'priority').
    const query = 'SELECT * FROM tasks WHERE ${filterType} = ?;';
    const res = await this.db.query(query, [value]);
    return res.values ?? [];
  }

  // Requerimiento 1: Añadir Tarea (Ahora con 5 campos)
  async addPerson(title: string, description: string, category: string, priority: string) {
    const stmt = 'INSERT INTO tasks(title, description, category, priority, status) VALUES(?, ?, ?, ?, ?)';
    // Por defecto, el estado es 'pendiente'
    await this.db.run(stmt, [title, description, category, priority, 'pendiente']);
  }

  // Requerimiento 3: Actualizar Tarea (Actualiza todos los campos menos el id)
  async updatePerson(id: number, title: string, description: string, category: string, priority: string) {
    const stmt = 'UPDATE tasks SET title=?, description=?, category=?, priority=? WHERE id=?';
    await this.db.run(stmt, [title, description, category, priority, id]);
  }

  // Requerimiento 4: Marcar Tarea como Completada (Actualiza solo el estado)
  async updateTaskStatus(id: number, status: 'pendiente' | 'completada') {
    const stmt = 'UPDATE tasks SET status=? WHERE id=?';
    await this.db.run(stmt, [status, id]);
  }
  
  // Requerimiento 5: Eliminar Tarea
  async deletePerson(id: number) {
    const stmt = 'DELETE FROM tasks WHERE id=?';
    await this.db.run(stmt, [id]);
  }
}