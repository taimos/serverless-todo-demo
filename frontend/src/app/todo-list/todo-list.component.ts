import {Component, OnInit} from '@angular/core';
import {ToDo, TodoService} from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {

  todos : ToDo[];
  text : string;

  private static nextState(state) {
    switch (state) {
      case 'OPEN':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'DONE';
      default:
        return 'DONE';
    }
  }

  constructor(private todoService : TodoService) {
  }

  ngOnInit() {
    this.todoService.getList().subscribe((list) => {
      console.log(list);
      this.todos = list;
    });
  }

  proceed(todo) {
    if (!todo) {
      return;
    }
    this.updateTodo(todo, TodoListComponent.nextState(todo.state));
  }

  reopen(todo) {
    if (!todo) {
      return;
    }
    this.updateTodo(todo, 'OPEN');
  }

  updateTodo(todo, newState) {
    const toSave = JSON.parse(JSON.stringify(todo));
    toSave.state = newState;
    this.todoService.update(toSave).subscribe(() => {
      this.ngOnInit();
    });
  }

  create() {
    const todo = {
      text: this.text,
      state: 'OPEN'
    };
    this.todoService.create(todo).subscribe(() => {
      this.ngOnInit();
    });
  }

}
