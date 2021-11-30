import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionsService } from '../service/questions.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name:string = "";
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter: number = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$ : any;
  progress: string = "0";

  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionsJson()
    .subscribe(res => {
      this.questionList = res.questions;
    })
  }

  nextQuestion = () => this.currentQuestion ++;
  previousQuestion = () => this.currentQuestion --;

  answer(currentQno:number, option: any){
    if(option.correct){
      this.points += 10;
      this.correctAnswer ++;
      this.currentQuestion ++;
      this.getProgressPercentage();
      this.resetCounter();

    } else {
      this.points -= 10;
      this.incorrectAnswer ++;
      this.currentQuestion ++; 
      this.getProgressPercentage();
      this.resetCounter();
    }
  }

  startCounter(){
    this.interval$ = interval(1000)
    .subscribe(val => {
      this.counter --;
      if(this.counter===0){
        this.currentQuestion++;
        this.points-=10;
        this.counter = 60;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe()
    }, 600000);
  };

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter = 0;
  };

  resetCounter(){
    this.stopCounter();
    this.counter = 60;
    this.startCounter();    
  }

  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.progress = "0";    
    this.currentQuestion = 0;
  }

  getProgressPercentage(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress
  }

}
