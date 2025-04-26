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
  filter: string = 'all';
  newTaskCrtl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3)],
  });

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getTasks();
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

  totalTasksPending() {
    let total = 0;
    for (const task of this.tasks) {
      if (!task.completed) {
        total++;
      }
    }
    return total;
  }

  clearCompletedTasks() {
    this.tasks = this.tasks.filter((task) => !task.completed);
    localStorage.setItem('mydayapp-angular', JSON.stringify(this.tasks));
  }

  changeFilter() {
    this.filter = this.route.snapshot.queryParamMap.get('filter') || 'all';
    this.getTasks();
    
    this.tasks = this.tasks.filter((task) => {
      if (this.filter === 'all') {
        return true;
      }
      if (this.filter === 'pending') {
        return !task.completed;
      }
      return task.completed;
    });
  }
}
