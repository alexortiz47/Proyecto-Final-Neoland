import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import { PsicologosService } from '../psicologos.service';
import { Psicologo } from '../models/psicologo.model';
import { EspecialidadesService } from '../especialidades.service';


@Component({
  selector: 'app-logeado',
  templateUrl: './logeado.component.html',
  styleUrls: ['./logeado.component.css']
})
export class LogeadoComponent implements OnInit {

  especialidades: boolean;
  poblacion: boolean;

  perfilForm: FormGroup;

  arrEspecialidades: string[];
  arrPoblaciones: string[];
  arrIdEsp: number[]
  arrEspPsicologo: any[]

  token: string
  psicologoLogeado: Psicologo

  constructor(private router: Router, private psicologosService: PsicologosService, private especialidadesService: EspecialidadesService) {
    this.arrEspecialidades = [];
    this.arrPoblaciones = ['Infanto-Juvenil (0-16 años)', 'Adultos (>16 años)'];
    this.especialidades = false;
    this.arrIdEsp = []
    this.poblacion = false;
    this.token = localStorage.getItem('token') // Guardamos el token que esta en localstorage
    this.arrEspPsicologo = []
  }

  ngOnInit() {
    this.especialidadesService.getAllEspecialidades().then((res) => {
      // console.log(res)
      res.forEach(item => {
        this.arrEspecialidades.push(item.nombre)
        this.arrIdEsp.push(item.id)
      })
      this.psicologosService.getByToken(this.token).then((res) => {
        // console.log(res)
        this.psicologoLogeado = res

        this.perfilForm = new FormGroup({ // Generamos el formulario aquí, porque es donde se conocen los datos del psicologo
          nombre: new FormControl('', [
            Validators.required
          ]),
          apellidos: new FormControl('', [
            Validators.required
          ]),
          numColeg: new FormControl('', [
            Validators.required,
            Validators.pattern(/^([0-9]{3,5})[M]$/)
          ]),
          domicilio: new FormControl(this.psicologoLogeado.domicilio, [
            Validators.required
          ]),
          codPostal: new FormControl(this.psicologoLogeado.codPostal, [
            Validators.required,
            Validators.pattern(/^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/)
          ]),
          latitud: new FormControl(''),
          longitud: new FormControl(''),
          especialidades: this.buildEspecialidades(),
          poblacion: this.buildPoblaciones(),
          correo: new FormControl(this.psicologoLogeado.correo, [
            Validators.required,
            Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
          ]),
          correo_repeat: new FormControl(''),
          password: new FormControl('', [
            Validators.pattern(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,15})$/)
          ]),
          password_repeat: new FormControl('')
        }, [
          this.repeatPasswordValidator,
          this.repeatCorreoValidator
        ])

        this.especialidadesService.getEspByPsicologo(this.psicologoLogeado.id).then((res) => {
          console.log(res)
          this.arrEspPsicologo = res
        })

      })
    })
  }

  // Validaciones:
  repeatCorreoValidator(group: FormGroup) {
    let correo = group.controls['correo'].value
    let correo_repeat = group.controls['correo_repeat'].value

    return (correo == correo_repeat) ? null : { 'correo_repeat': 'El correo no coincide' }
  }

  repeatPasswordValidator(group: FormGroup) {
    let password = group.controls['password'].value
    let password_repeat = group.controls['password_repeat'].value

    return (password == password_repeat) ? null : { 'password_repeat': 'La contraseña no coincide' }
  }

  // Checkboxes de Especialidades y población:
  buildEspecialidades() {
    const values = this.arrEspecialidades.map(item => new FormControl(false))
    return new FormArray(values)
  }

  buildPoblaciones() {
    const values = this.arrPoblaciones.map(item => new FormControl(false))
    return new FormArray(values)
  }

  // Evento ngSubmit del formulario de Angular
  manejarPerfil() {

    let valueSubmit = Object.assign({}, this.perfilForm.value)

    valueSubmit = Object.assign(valueSubmit, {
      especialidades: valueSubmit.especialidades.map((v, i) => v ? this.arrIdEsp[i] : null).filter(v => v !== null),
      poblacion: valueSubmit.poblacion.map((v, i) => v ? this.arrPoblaciones[i].normalize('NFD') : null).filter(v => v !== null).join(', ')
    })
    console.log(valueSubmit)
    this.perfilForm.reset()
    // this.router.navigate(['inicioLog'])
  }

  // Mostrar u ocultar las especialidades y poblacion para cambiarlo
  cambiarEsp() {
    if(!this.especialidades){
      this.especialidades = true;
    }else{
      this.especialidades = false;
    }
  }

  cambiarPob() {
    if(!this.poblacion){
      this.poblacion = true;
    }else{
      this.poblacion = false;
    }
  }

}
