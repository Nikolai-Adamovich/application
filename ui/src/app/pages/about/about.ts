import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'ui-about',
  templateUrl: './about.html',
  styleUrl: './about.scss',
  imports: [HlmButtonImports, HlmCardImports, RouterLink],
})
export default class About {}
