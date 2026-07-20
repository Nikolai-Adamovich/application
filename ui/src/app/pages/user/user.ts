import { Component } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

@Component({
  selector: 'ui-user',
  templateUrl: './user.html',
  styleUrl: './user.scss',
  imports: [HlmButtonImports, HlmCardImports],
})
export default class User {}
