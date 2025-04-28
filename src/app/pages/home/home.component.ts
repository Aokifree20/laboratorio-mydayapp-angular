import { Component, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  filter: 'all' | 'pending' | 'completed' = 'all';
  newTaskCrtl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getTasks();
    this.route.url.subscribe(() => {
      this.applyRouteFilter();
    });
  }

  getTasks() {
    const storage = localStorage.getItem('mydayapp-angular');
    if (storage) {
      this.tasks = JSON.parse(storage);
    }
  }

  changeHandler() {
    if (this.newTaskCrtl.valid) {
      const value = this.newTaskCrtl.value.trim();
      if (value !== '') {
        this.tasks.push({
          id: this.tasks.length + 1,
          title: value,
          completed: false,
          editing: false,
        });
        this.newTaskCrtl.setValue('');
        localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
      }
    }
  }

  updateTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
  }

  updateTaskEditingMode(index: number) {
    this.tasks[index].editing = !this.tasks[index].editing;
    //localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
  }

  updateTaskText(index: number, event: Event) {
    this.tasks[index].title = (event.target as HTMLInputElement).value.trim();
    this.updateTaskEditingMode(index);
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
  }

  deleteTask(id: number) {
    //console.log(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
  }

  detectTasksCompleted() {
    for (const task of this.tasks) {
      if (task.completed) {
        return true;
      }
    }
    return false;
  }

  totalTasksPending(): number {
    const allTasks = JSON.parse(localStorage.getItem('mydayapp-angular') || '[]');
    return allTasks.filter((task: Task) => !task.completed).length;
  }

  clearCompletedTasks() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
  }

  // changeFilter(filter: 'all' | 'pending' | 'completed') {
  //   this.filter = filter;
  //   this.applyFilter();
  // }
  
  private applyFilter(): void {
    this.getTasks(); // Obtener todas las tareas primero
    
    if (this.filter !== 'all') {
      this.tasks = this.tasks.filter(task => {
        return this.filter === 'pending' ? !task.completed : task.completed;
      });
    }
  }

  private applyRouteFilter(): void {
    //const path = window.location.pathname.split('/').pop();
    const path = this.router.url.split('/').pop();
    
    switch (path) {
      case 'pending':
        this.filter = 'pending';
        break;
      case 'completed':
        this.filter = 'completed';
        break;
      default:
        this.filter = 'all';
    }
  
    this.applyFilter();
  }
}
