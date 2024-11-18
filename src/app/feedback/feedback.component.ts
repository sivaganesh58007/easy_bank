import { Component, OnInit } from '@angular/core';

import { FeedbackService } from '../services/feedback.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {
  selectedEmoji: number | null = null;
  comment: string = '';

  constructor(private feedbackService: FeedbackService) {}

  selectEmoji(rating: number): void {
    this.selectedEmoji = rating;
  }

  submitFeedback(): void {
    if (this.selectedEmoji && this.comment) {
      const feedbackData = {
        rating: this.selectedEmoji,
        comment: this.comment
      };

      this.feedbackService.submitFeedback(feedbackData).subscribe(response => {
        alert('Feedback added successfully');
        this.selectedEmoji = null;
        this.comment = '';
      });
    } else {
      alert('Please select a rating and add a comment.');
    }
  }
}