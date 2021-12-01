import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  isEqualGreaterThanZero:boolean = true;
  isCounterGreaterThan30secs: boolean = true;
  counter: number = 60;
  correctAnswer: number = 0;
  incorrectAnswer: number = 0;
  interval$ : any;
  progress: string = "0";
  isQuizCompleted: boolean= false;

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
    if(currentQno === this.questionList.length){
      this.isQuizCompleted = true;
      this.stopCounter();
    }

    if(option.correct){
      this.points += 10;
      this.correctAnswer ++;
      setTimeout(() => {
        this.currentQuestion ++;
        this.getProgressPercentage();
        this.resetCounter();   
        this.isLessThanZiro();     
      }, 500);

    } else {
      setTimeout(() => {
        this.incorrectAnswer ++;
        this.currentQuestion ++; 
        this.getProgressPercentage();
        this.resetCounter();        
      }, 500);

      this.points -= 10;
      this.isLessThanZiro();        
    }
  }

  startCounter(){
    this.isLessThanZiro();

    this.interval$ = interval(1000)
    .subscribe(val => {
      this.counter --;    
      if(this.counter===0){
        this.currentQuestion++;
        this.incorrectAnswer ++;
        this.points-=10;
        this.counter = 60;
        this.getProgressPercentage();
        this.isCounterGreaterThan30secs = true;
      } 
      if(this.points < 0){
        this.isEqualGreaterThanZero = false;
      }
      if(this.counter < 30){
        this.isCounterGreaterThan30secs = false
      }
      if(this.currentQuestion === this.questionList.length){
        this.isQuizCompleted = true;
        this.stopCounter();
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
    if(this.counter < 30){
      this.isCounterGreaterThan30secs = false
    }
  }

  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.isLessThanZiro();
    this.counter = 60;
    this.progress = "0";    
    this.currentQuestion = 0;
  }

  getProgressPercentage(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress
  }

  isLessThanZiro(){
    if(this.points < 0){
      this.isEqualGreaterThanZero = false;
    }else{
      this.isEqualGreaterThanZero =true;
    }
  }
}
