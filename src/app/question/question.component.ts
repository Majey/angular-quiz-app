import { Component, OnInit } from '@angular/core';
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

  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions()
  }

  getAllQuestions(){
    this.questionService.getQuestionsJson()
    .subscribe(res => {
      this.questionList = res.questions;
    })
  }

  nextQuestion(){
    if (this.currentQuestion<8){
      this.currentQuestion ++
    }
  }
  previousQuestion(){
    if (this.currentQuestion>0){
      this.currentQuestion --
    }
  }

}
