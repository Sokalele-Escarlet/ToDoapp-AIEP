import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { ServiceDatabase } from '../services/service.database'; // <-- IMPORTAR EL SERVICIO

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [ServiceDatabase] // <-- AÑADIR EL SERVICIO COMO PROVIDER
})
export class HomePageModule {}