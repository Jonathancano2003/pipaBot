import { Component, Inject, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  nuevoPrompt: string = '';
  promptSeleccionado: any = null;
  historialPrompts: any[] = [];
  errorMensaje: string = '';
  successMensaje: string = '';

  constructor(@Inject(AdminService) private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarPromptActual();
    this.cargarHistorialPrompts();
  }

  mostrarMensajesTemporalmente(success: string = '', error: string = '') {
    this.successMensaje = success;
    this.errorMensaje = error;
    setTimeout(() => {
      this.successMensaje = '';
      this.errorMensaje = '';
    }, 4000);
  }

  cargarPromptActual() {
    this.adminService.getPrompt().subscribe((data: any) => {
      this.nuevoPrompt = data.prompt;
    });
  }

  cargarHistorialPrompts() {
    this.adminService.getPromptHistory().subscribe((data: any) => {
      this.historialPrompts = data;
    });
  }

  guardarPrompt() {
    this.errorMensaje = '';
    const nuevo = this.nuevoPrompt.trim();

    if (!nuevo) {
      this.mostrarMensajesTemporalmente('', 'No puedes guardar un prompt vacío.');
      return;
    }

    const yaExiste = this.historialPrompts.some(p => p.content.trim() === nuevo);
    if (yaExiste) {
      this.mostrarMensajesTemporalmente('', 'Este prompt ya está guardado.');
      return;
    }

    this.adminService.setPrompt(nuevo).subscribe({
      next: () => {
        this.cargarHistorialPrompts();
        this.mostrarMensajesTemporalmente('Prompt guardado correctamente.');
      },
      error: err => {
        this.mostrarMensajesTemporalmente('', err.error?.error || 'Hubo un problema al guardar el prompt.');
      }
    });
  }

  reiniciarPrompt() {
    this.adminService.resetPrompt().subscribe(
      (data: any) => {
        this.nuevoPrompt = data.prompt;
        this.mostrarMensajesTemporalmente('Prompt restaurado por defecto.');
      },
      () => {
        this.mostrarMensajesTemporalmente('', 'Hubo un problema al restaurar el prompt por defecto.');
      }
    );
  }

  cargarPromptSeleccionado() {
    this.nuevoPrompt = this.promptSeleccionado?.content || '';
  }

  borrarTextarea() {
    this.nuevoPrompt = '';
    this.mostrarMensajesTemporalmente('Contenido borrado.');
  }

  eliminarPromptSeleccionado() {
    if (!this.promptSeleccionado?.id) {
      this.mostrarMensajesTemporalmente('', 'Selecciona un prompt para eliminar.');
      return;
    }

    this.adminService.deletePrompt(this.promptSeleccionado.id).subscribe(
      () => {
        this.promptSeleccionado = null;
        this.cargarHistorialPrompts();
        this.mostrarMensajesTemporalmente('Prompt eliminado correctamente.');
      },
      () => {
        this.mostrarMensajesTemporalmente('', 'No se pudo eliminar el prompt.');
      }
    );
  }
}
