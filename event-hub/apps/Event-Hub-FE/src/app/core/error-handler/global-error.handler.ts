import { ErrorHandler, inject, Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private snackBar = inject(MatSnackBar);

  handleError(error: any): void {
    console.error('Error:', error);
    const message = error.message || 'An unexpected error occurred';
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }
}