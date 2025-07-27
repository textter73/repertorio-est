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
import { MatDialogModule } from '@angular/material/dialog';
import { VerImagenComponent } from './modals/ver-imagen/ver-imagen.component';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { TerminalPuntoVentaComponent } from './terminal-punto-venta/terminal-punto-venta.component';
import { TopNavBarComponent } from './top-nav-bar/top-nav-bar.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatListModule} from '@angular/material/list';
registerLocaleData(locales, 'es-MX')

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    VerImagenComponent,
    TopNavBarComponent,
    TerminalPuntoVentaComponent
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
  ],
  entryComponents: [
      
  ]
})
export class AppModule {
}
