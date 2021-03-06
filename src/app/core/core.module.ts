import { HomeModule } from './../pages/home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './../shared/shared.module';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSaverModule } from 'ngx-filesaver';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BrowserAnimationsModule,
    FileSaverModule,

    HomeModule,
  ],
  providers: [

  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
