/**
 * Application bootstrap.
 *
 * Zoneless, standalone. No NgModules, no NgRx. Signals are the sole state
 * management primitive.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
