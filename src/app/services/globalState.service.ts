import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";


const initialState = {
  company: 'Gas Tomza México',
  phone: '',
  email: '',
  facebook: ''
};

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  private _state = new BehaviorSubject<any>(this.loadStateFromLocalStorage());
  state$ = this._state.asObservable();

  constructor() {}

  private loadStateFromLocalStorage() {
    const state = localStorage.getItem('globalState');
    console.log(state)
    return state ? JSON.parse(state) : this.getInitialState();
  }

  private getInitialState() {
    return initialState;
  }

  private saveStateToLocalStorage(state: any) {
    localStorage.setItem('globalState', JSON.stringify(state));
  }

  getState() {
    return this._state.getValue();
  }

  setState(state: any) {
    const updateState = {...this.getState(), ...state};
    this._state.next(updateState);
    this.saveStateToLocalStorage(updateState);
  }

  resetState() {
    this._state.next(initialState);
    this.saveStateToLocalStorage(initialState);
  }
}
