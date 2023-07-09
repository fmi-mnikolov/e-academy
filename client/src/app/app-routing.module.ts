import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
