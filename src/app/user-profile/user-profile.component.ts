import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user') || '{}');
  favoriteMovies: any[] = [];
  @Input() updatedUser = this.user;
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,

    public router: Router
  ) {}

  ngOnInit(): void {
    this.getFavoriteMovies();
  }

  updateUser(): void {
    console.log(this.updatedUser);
    this.fetchApiData.editUser(this.updatedUser).subscribe((resp) => {
      localStorage.setItem('user', JSON.stringify(this.updatedUser));
    });
    // console.log('up', localStorage.getItem('token'));
    console.log('local', localStorage.getItem('user'));
    // console.log('user2', this.user);
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result) => {
      const favoriteMovieIds = this.user.FavoriteMovies || [];
      const allMovies = result;
      console.log('id', this.user);
      if (!Array.isArray(favoriteMovieIds)) {
        console.error('FavoriteMovies is not an array');
        return;
      }
      console.log(allMovies);
      this.favoriteMovies = allMovies.filter((movie: any) =>
        favoriteMovieIds.includes(movie._id)
      );
    });
  }

  deleteMovie(username: string, movieId: string): void {
    this.fetchApiData
      .deleteFavoriteMovie(username, movieId)
      .subscribe((result) => {
        this.user = result;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.snackBar.open('deleted successfully', '', {
          duration: 2000,
        });
        this.getFavoriteMovies();
      });
  }

  deleteUser(): void {
    this.fetchApiData
      .deleteUser(this.user.UserName)
      .subscribe((resp: any) => {});
    console.log('user deleted');
    this.snackBar.open('Your porfile has been deleted', '', {
      duration: 2000,
    });
    this.logout();
  }

  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
