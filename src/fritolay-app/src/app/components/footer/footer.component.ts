import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  footerText = environment.footer?.text ?? '';
  footerLogo = environment.footer?.logo ?? '';
  hideOnRoutes: string[] = environment.footer?.hideOnRoutes ?? [];
  show = true;
  sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute(this.router.url);
    this.sub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.checkRoute(e.urlAfterRedirects ?? e.url);
    });
  }

  checkRoute(url: string) {
    // Normalizar ruta base
    const path = url.split('?')[0];
    this.show = !this.hideOnRoutes.includes(path);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
