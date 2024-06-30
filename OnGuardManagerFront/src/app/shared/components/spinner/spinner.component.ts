import { Component, inject } from '@angular/core';
import { SpinnerServiceService } from '../../../services/spinner/spinner-service.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  private readonly spinnerService = inject(SpinnerServiceService);

  isLoading = this.spinnerService.isLoading;
  
}
