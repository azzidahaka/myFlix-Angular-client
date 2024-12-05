import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  // Retrieve user data from localStorage
  user = JSON.parse(localStorage.getItem('user') || '{}');
  // Retrieve token from localStorage
  token = localStorage.getItem('token');
  // Array to hold all movies
  movies: any[] = [];
  // Array to hold favorite movie IDs
  favoriteMovies: string[] = this.user.FavoriteMovies || [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit(): void {
    this.getMovies();
    console.log('Token1:', this.token);
  }

  // Fetch all movies from the API using the fetchApiData service
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  // Navigate to the user's profile page
  myProfile(): void {
    this.router.navigate(['profile']);
  }

  // Check if a movie is in the user's list of favorite movies
  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  // Add or remove a movie from the user's list of favorite movies
  markFavorite(movieId: any): void {
    if (this.isFavorite(movieId)) {
      // If the movie is already a favorite, remove it
      this.fetchApiData
        .deleteFavoriteMovie(this.user.UserName, movieId)
        .subscribe((resp) => {
          // Update the favoriteMovies array by filtering out the movie
          this.favoriteMovies = this.favoriteMovies.filter(
            (id) => id !== movieId
          );
          // Update the user data in localStorage
          localStorage.setItem('user', JSON.stringify(resp));
          // Trigger change detection to update the UI
          this.cdr.detectChanges();
        });
    } else {
      // If the movie is not a favorite, add it
      this.fetchApiData
        .addFavoriteMovie(this.user.UserName, movieId)
        .subscribe((resp) => {
          // Add the movie ID to the favoriteMovies array
          this.favoriteMovies.push(movieId);
          // Update the user data in localStorage
          localStorage.setItem('user', JSON.stringify(resp));
          // Trigger change detection to update the UI
          this.cdr.detectChanges();
        });
    }
  }

  // Use the dialog-box component to show information about the movie genre
  showGenre(movie: any): void {
    console.log('genre', movie.Genre.Description);
    this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Movie Information',
        name: movie.Genre.Name,
        description: movie.Genre.Description,
        type: 'genre',
      },
    });
  }

  // Use the dialog-box component to show information about the movie director
  showDirector(director: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Director Information',
        name: director.Name,
        bio: director.Bio,
        birth: director.Birth,
        death: director.Death,
        type: 'director',
      },
    });
  }

  // Use the dialog-box component to show the movie synopsis
  showSummary(synopsis: any): void {
    this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Movie Synopsis',
        synopsis: synopsis,
        type: 'Description',
      },
    });
  }
}
