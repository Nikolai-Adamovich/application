import { Component, type OnInit } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'ui-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [HlmButtonImports],
})
export default class Home implements OnInit {
  ngOnInit(): void {
    // Initialization logic goes here
  }
}
