import { LaminasComponent } from './modals/laminas/laminas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {LOCALE_ID, NgModule, Pipe} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from '../app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { AngularFireModule } from '@angular/fire/compat';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es-MX';
import { AppRoutingModule } from './app-routing.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './login/login.component';
import {MatMenuModule} from '@angular/material/menu';
import { principalComponent } from './principal/principal.component';
import { AdministradorArticulosComponent } from './administrador-articulos/administrador-articulos.component';
import { MatDialogModule } from '@angular/material/dialog';
import { VerImagenComponent } from './modals/ver-imagen/ver-imagen.component';
import { ModificarArticuloUsuarioComponent } from './modals/modificar-articulo-usuario/modificar-articulo-usuario.component';
import { MatButtonModule } from '@angular/material/button';
import { ResumenComprasComponent } from './modals/resumen-compras/resumen-compras.component';
import { HistorialModificacionesComponent } from './modals/historial-modificaciones/historial-modificaciones.component';
import { AgregarArticuloComponent } from './modals/agregar-articulo/agregar-articulo.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { ResumenTurnoComponent } from './modals/resumen-turno/resumen-turno.component';
import { AgregarCategoriaComponent } from './modals/agregar-categoria/agregar-categoria.component';
import { AgregarMarcaComponent } from './modals/agregar-marca/agregar-marca.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SiguienteCompraComponent } from './siguiente-compra/siguiente-compra.component';
import { ArtículosAgotarseComponent } from './articulos-agotarse/articulos-agotarse.component';
import { VentasComponent } from './ventas/ventas.component';
import { AdministradorLaminasComponent } from './administrador-laminas/administrador-laminas.component';
import { MatSelectModule } from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PuntoVentaComponent } from './punto-venta/punto-venta.component';
import { SeleccionarArticuloComponent } from './modals/seleccionar-articulo/seleccionar-articulo.component';
import { AgregarStockComponent } from './modals/agregar-stock/agregar-stock.component';
import { FinanzasComponent } from './finanzas/finanzas.component';
import { ResumenDiaComponent } from './modals/resumen-dia/resumen-dia.component';
import { AgregarEgresoComponent } from './modals/agregar.egreso/agregar-egreso.component';
import { TerminalPuntoVentaComponent } from './terminal-punto-venta/terminal-punto-venta.component';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import { RegistrarArticuloComponent } from './modals/registrar-articulo/registrar-articulo.component';
import {MatStepperModule} from '@angular/material/stepper';
import { CerrarCajaComponent } from './modals/cerrar-caja/cerrar-caja.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgregarUsuarioRewardComponent } from './modals/agregar-usuario-reward/agregar-usuario-reward.component';
import {MatListModule} from '@angular/material/list';
registerLocaleData(locales, 'es-MX')

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    principalComponent,
    VentasComponent,
    AdministradorArticulosComponent,
    SiguienteCompraComponent,
    ArtículosAgotarseComponent,
    VerImagenComponent,
    ModificarArticuloUsuarioComponent,
    ResumenComprasComponent,
    HistorialModificacionesComponent,
    AgregarArticuloComponent,
    RegistrarArticuloComponent,
    AgregarUsuarioRewardComponent,
    ResumenTurnoComponent,
    ResumenDiaComponent,
    CerrarCajaComponent,
    AgregarStockComponent,
    AgregarCategoriaComponent,
    AgregarEgresoComponent,
    AgregarMarcaComponent,
    AdministradorLaminasComponent,
    LaminasComponent,
    SeleccionarArticuloComponent,
    PuntoVentaComponent,
    TopNavBarComponent,
    TerminalPuntoVentaComponent,
    FinanzasComponent,
    DashboardComponent
  ],
  imports: [
      AngularFireModule.initializeApp(environment.firebase),
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatCardModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatOptionModule,
      MatSidenavModule,
      MatToolbarModule,
      MatTableModule,
      MatStepperModule,
      MatSortModule,
      BrowserAnimationsModule,
      MatSidenavModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatIconModule,
      MatTableModule,
      MatCardModule,
      MatTooltipModule,
      MatOptionModule,
      MatPaginatorModule,
      FlexLayoutModule,
      MatAutocompleteModule,
      MatDialogModule,
      MatMenuModule,
      MatButtonModule,
      MatOptionModule,
      MatOptionModule,
      MatExpansionModule,
      MatCheckboxModule,
      MatSelectModule,
      MatTabsModule,
      MatBadgeModule,
      MatSlideToggleModule,
      MatProgressSpinnerModule,
      MatListModule
    ],
  bootstrap: [
    AppComponent,
  ],
  providers: [
      {provide: LOCALE_ID, useValue: 'es-MX'},
      DatePipe,
      VerImagenComponent,
      ModificarArticuloUsuarioComponent,
      ResumenComprasComponent,
      HistorialModificacionesComponent,
      AgregarArticuloComponent,
      RegistrarArticuloComponent,
      AgregarUsuarioRewardComponent,
      ResumenTurnoComponent,
      ResumenDiaComponent,
      CerrarCajaComponent,
      AgregarStockComponent,
      AgregarCategoriaComponent,
      AgregarEgresoComponent,
      AgregarMarcaComponent,
      LaminasComponent,
      SeleccionarArticuloComponent,
      DashboardComponent
  ],
  entryComponents: [
      
  ]
})
export class AppModule {
}
