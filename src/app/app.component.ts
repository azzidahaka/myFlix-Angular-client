import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'myFlix-Angular-client';
  showMenuBar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.showMenuBar = event.url !== '/welcome';
      });
    // Check the initial route after a short delay to ensure the router is ready
    setTimeout(() => {
      this.checkRoute(this.router.url);
    }, 0);
  }

  checkRoute(url: string): void {
    this.showMenuBar = url !== '/welcome';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
