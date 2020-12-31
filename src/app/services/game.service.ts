import { Observable, of } from 'rxjs';
import { IGameSettings } from './../models/models';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gameSettings: IGameSettings;

  getGameSettings(): Observable<IGameSettings | null> {
    return of(this.gameSettings);
  }

  setGameSettings(gameSettings: IGameSettings): void {
    this.gameSettings = gameSettings;
  }

  parseJSON(json: string): IGameSettings {

    console.log(json);
    const resGameSettings = JSON.parse(json);

    return resGameSettings;
  }
}
