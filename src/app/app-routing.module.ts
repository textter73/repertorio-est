import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TerminalPuntoVentaComponent } from './terminal-punto-venta/terminal-punto-venta.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'terminal-punto-venta', component: TerminalPuntoVentaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
