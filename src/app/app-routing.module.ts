import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorArticulosComponent } from './administrador-articulos/administrador-articulos.component';
import { AdministradorLaminasComponent } from './administrador-laminas/administrador-laminas.component';
import { ArtículosAgotarseComponent } from './articulos-agotarse/articulos-agotarse.component';
import { LoginComponent } from './login/login.component';
import { principalComponent } from './principal/principal.component';
import { SiguienteCompraComponent } from './siguiente-compra/siguiente-compra.component';
import { VentasComponent } from './ventas/ventas.component';
import { PuntoVentaComponent } from './punto-venta/punto-venta.component';
import { FinanzasComponent } from './finanzas/finanzas.component';
import { TerminalPuntoVentaComponent } from './terminal-punto-venta/terminal-punto-venta.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  //{ path: 'inicio', component: principalComponent },
  { path: 'administrador-articulos', component: AdministradorArticulosComponent },
  { path: 'siguiente-compra', component: SiguienteCompraComponent },
  { path: 'articulos-agotarse', component: ArtículosAgotarseComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'administrador-laminas', component: AdministradorLaminasComponent },
  { path: 'punto-venta', component: PuntoVentaComponent },
  { path: 'finanzas', component: FinanzasComponent},
  { path: 'terminal-punto-venta', component: TerminalPuntoVentaComponent},
  { path: 'dashboard', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
