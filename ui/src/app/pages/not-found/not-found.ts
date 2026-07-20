import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'ui-not-found',
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
  imports: [HlmButtonImports, RouterLink],
})
export default class NotFound {}
