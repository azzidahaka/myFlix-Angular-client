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
  // Retrieve user data from localStorage
  user = JSON.parse(localStorage.getItem('user') || '{}');
  // Array to hold favorite movies
  favoriteMovies: any[] = [];
  // Create a copy of the user object for the form
  @Input() updatedUser = { ...this.user };

  constructor(
    public fetchApiData: FetchApiDataService, // Inject the FetchApiDataService to make API calls
    public snackBar: MatSnackBar, // Inject MatSnackBar to display notifications
    public router: Router // Inject Router to navigate between routes
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.getFavoriteMovies(); // Fetch favorite movies when the component is initialized
  }

  // Update user information
  updateUser(): void {
    console.log('user', this.updatedUser);
    this.fetchApiData
      .editUser(this.user.UserName, this.updatedUser)
      .subscribe((resp) => {
        // Update the user object with the new values
        this.user = { ...this.updatedUser };
        // Store the updated user data in localStorage
        localStorage.setItem('user', JSON.stringify(this.updatedUser));
      });
  }

  // Fetch all movies and filter favorite movies
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
      // Filter the favorite movies based on the user's favorite movie IDs
      this.favoriteMovies = allMovies.filter((movie: any) =>
        favoriteMovieIds.includes(movie._id)
      );
    });
  }

  // Remove a movie from the user's list of favorite movies
  deleteMovie(username: string, movieId: string): void {
    this.fetchApiData
      .deleteFavoriteMovie(username, movieId)
      .subscribe((result) => {
        // Update the user object with the new values
        this.user = result;
        // Store the updated user data in localStorage
        localStorage.setItem('user', JSON.stringify(this.user));
        this.snackBar.open('deleted successfully', '', {
          duration: 2000,
        });
        // Refresh the favorite movies list
        this.getFavoriteMovies();
      });
  }

  // Delete the user's account
  deleteUser(): void {
    this.fetchApiData
      .deleteUser(this.user.UserName)
      .subscribe((resp: any) => {});
    this.snackBar.open('Your profile has been deleted', '', {
      duration: 2000,
    });
    // Log out the user after deleting the account
    this.logout();
  }

  // Log out the user and navigate to the welcome page
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
