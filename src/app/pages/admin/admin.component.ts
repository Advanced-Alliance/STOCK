import { OpenFileDialogComponent } from './open-file-dialog/open-file-dialog.component';
import { GameService } from './../../services/game.service';
import { AdminService } from './admin.service';
import { BaseComponent } from './../../core/base.component';
import { Component, OnInit } from '@angular/core';
import { IGameSettings, OrderBy, IQuestion, IAnswer } from './../../models/models';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends BaseComponent implements OnInit {

  gameName: string;
  createDate = Date.now();
  currentQuestion = 0;
  showQuestionsText = true;
  unsavedChanges = true;
  selectedIndex = 0;

  teamLeftName?: string | null;
  teamRightName?: string | null;

  questions: IQuestion[] = [];
  /**
   * Костыль, необходимый чтобы отслеживать положение вопроса
   * с именем "+ Добавить" и не учитывать его в игре.
   * Если равен -1, то считается, что фиктивного вопроса нет.
   */
  fakeQuestionPos = 1;
  readonly maxQuestions = 6;
  readonly minQuestions = 1;

  constructor(
    private adminService: AdminService,
    private gameService: GameService,
    public dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.initNewGame();
  }

  private initNewGame() {
    this.gameName = 'Новая игра';
    this.questions = [
      {
        stageName: 'Простая игра',
        orderBy: OrderBy.none,
        enable: true,
        answers: [...this.getDefaultAnswers()],
      },
      this.getAddTab(),
    ];
  }

  private getAddTab(): IQuestion {

    const question = {
      stageName: '+ Добавить',
      orderBy: OrderBy.none,
      enable: true,
      answers: [...this.getDefaultAnswers()],
    };
    return question;
  }


  private getDefaultAnswers(): IAnswer[] {
    const answers = [
      {
        name: 'Частый ответ',
        points: 60,
      },
      {
        name: 'Средний ответ',
        points: 30,
      },
      {
        name: 'Редкий ответ',
        points: 10,
      },
    ]
    return answers;
  }

  private getChanges(): IGameSettings {
    const questions = this.questions;
    if (this.fakeQuestionPos >= 0) {
      delete questions[this.fakeQuestionPos];
    }

    const editorData: IGameSettings = {
      createDate: this.createDate,
      lastEditQuestion: this.currentQuestion,
      gameSettings: {
        name: this.gameName,
        commonPoints: 0,
        currentStage: 0,
        maxFails: 3,
        showQuestionsText: this.showQuestionsText,
        teamLeft: {
          name: this.teamLeftName,
          points: 0,
          fails: 0,
        },
        teamRight: {
          name: this.teamRightName,
          points: 0,
          fails: 0,
        },
        questions: questions,
      }
    };
    return editorData;
  }

  saveChanges(): void {
    this.unsavedChanges = false;
    this.gameService.setGameSettings(this.getChanges());
    this.gameService.getGameSettings().pipe(
      this.unsubscribeOnDestroy
    ).subscribe((gameSettings) => {
      this.adminService.downloadSettingsFile(gameSettings);
    });
  }

  /**
   *  @deprecated
   */
  loadFromFile(): void {
    const dialogRef = this.dialog.open(OpenFileDialogComponent);

    dialogRef.afterClosed()
      .subscribe((gameSettings: IGameSettings) => {
        console.log(gameSettings);
      });
  }

  onFileSelected(): void {
    const inputNode: any = document.querySelector('#fileInput');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const json = e.target.result;
        const gameSettings = this.gameService.parseJSON(json);
        this.unsavedChanges = false;
      };

      reader.readAsText(inputNode.files[0]);
    }
  }

  onSelectedTabChange($event: MatTabChangeEvent): void {
    this.unsavedChanges = true;
    if (
      $event.index === this.fakeQuestionPos
    ) {
      this.fakeQuestionPos++;
      this.questions[$event.index].stageName = `Вопрос ${$event.index + 1}`;
      if (this.fakeQuestionPos === this.maxQuestions) {
        this.fakeQuestionPos = -1;
      } else {
        this.questions.push(this.getAddTab());
      }
    }
  }

  onQuestionDelete(index: number): void {

    const lastTab = (this.fakeQuestionPos > 0)
      ? this.fakeQuestionPos - 1
      : this.questions.length;

    if (lastTab === this.selectedIndex) this.selectedIndex--;


    // this.questions.splice(index, 1);
    // if (this.fakeQuestionPos < 0) {
    //   this.fakeQuestionPos = this.maxQuestions - 1;
    //   this.questions.push(this.getAddTab());
    // }
    // this.fakeQuestionPos--;
  }

}