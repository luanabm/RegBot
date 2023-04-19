import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { BrowserModule } from '@angular/platform-browser';


const routes: Routes = [
  {path:'',component:ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  BrowserModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
