import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs'; // <- rxjs from NPM

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
