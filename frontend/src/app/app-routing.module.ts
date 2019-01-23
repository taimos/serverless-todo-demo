import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TodoListComponent} from './todo-list/todo-list.component';

const routes : Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'todolist'},
  {path: 'todolist', component: TodoListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
