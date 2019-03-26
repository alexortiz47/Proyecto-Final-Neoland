import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Pregunta } from '../models/pregunta.model';

@Component({
  selector: 'pregunta',
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent implements OnInit {

  @Input() pregunta: Pregunta
  @Input() preguntaId: number
  @Output() respuesta = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  // Método que emite un objeto con el id de la pregunta y el valor de la respuesta (numérico)
  radioSelect($event) {
    // console.log($event.target.value)
    this.respuesta.emit({
      preguntaId: this.preguntaId,
      value: $event.target.value
    })
  }

}
