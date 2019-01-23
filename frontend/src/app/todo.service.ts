import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface ToDo {
  id : string;
  text : string;
  state : string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http : HttpClient) {
  }

  getList() : Observable<ToDo[]> {
    return <Observable<ToDo[]>>this.http.get('/todos');
  }

  create(todo) : Observable<ToDo> {
    return <Observable<ToDo>>this.http.post('/todos', todo);
  }

  update(todo) : Observable<ToDo> {
    return <Observable<ToDo>>this.http.put('/todos/' + todo.id, todo);
  }
}
