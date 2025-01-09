import { Component, OnInit } from '@angular/core';
import { BaseFirebaseRepositoryService } from '../services/base-firebase-repository.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Prueba {
  id?: string;
  prueba: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  _pruebas: BehaviorSubject<Prueba[]> = new BehaviorSubject<Prueba[]>([]);
  pruebas$: Observable<Prueba[]> = this._pruebas.asObservable();
  private collectionName = 'PruebaFirebase';

  pruebaForm: FormGroup;
  isEditMode: boolean = false;
  editPruebaId: string | undefined = undefined;

  constructor(
    private firebaseSvc: BaseFirebaseRepositoryService<Prueba>,
    private fb: FormBuilder
  ) {
    this.pruebaForm = this.fb.group({
      prueba: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPruebas();
  }

  loadPruebas() {
    this.firebaseSvc.getAll(this.collectionName).subscribe((data) => {
      this._pruebas.next(data);
    });
  }

  addPrueba(newPrueba: Prueba) {
    this.firebaseSvc.addPrueba(this.collectionName, newPrueba).subscribe((data) => {
      this._pruebas.next([...this._pruebas.value, data]);
      this.resetForm();
    });
  }

  updatePrueba(prueba: Prueba) {
    if (prueba.id) {
      this.firebaseSvc.updatePrueba(this.collectionName, prueba.id, prueba).subscribe(() => {
        this.loadPruebas();
        this.resetForm();
      });
    }
  }

  deletePrueba(prueba: Prueba) {
    if (prueba.id) {
      this.firebaseSvc.deletePrueba(this.collectionName, prueba.id).subscribe(() => {
        this.loadPruebas();
      });
    }
  }

  setEditPrueba(prueba: Prueba) {
    this.pruebaForm.setValue({ prueba: prueba.prueba });
    this.isEditMode = true;
    this.editPruebaId = prueba.id;
  }

  resetForm() {
    this.pruebaForm.reset();
    this.isEditMode = false;
    this.editPruebaId = undefined;
  }

  onSubmit() {
    if (this.isEditMode && this.editPruebaId) {
      const updatedPrueba: Prueba = { ...this.pruebaForm.value, id: this.editPruebaId };
      this.updatePrueba(updatedPrueba);
    } else {
      this.addPrueba(this.pruebaForm.value);
    }
  }
}