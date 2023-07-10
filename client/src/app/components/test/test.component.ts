import { Component, Input } from '@angular/core';
import { Test } from 'src/app/models/test';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  @Input()
  test!: Test;
}
