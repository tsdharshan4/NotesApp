import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewChecked, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit, AfterViewChecked {

  @Input('title')title! : string;
  @Input('body')body! : string;
  @Input('link')link! : string;

  @Output('delete') deleteEvent : EventEmitter<void> = new EventEmitter();

  @ViewChild('bodyText') bodyText! : ElementRef<HTMLElement>;
  @ViewChild('truncator') truncator!: ElementRef<HTMLElement>;

  constructor( private renderer : Renderer2) { }

  ngOnInit() {


  }
  ngAfterViewChecked(){


    let style = window.getComputedStyle(this.bodyText.nativeElement,null);
    let viewableHeight = parseInt(style.getPropertyValue("height"),10);

    if(this.bodyText.nativeElement.scrollHeight>viewableHeight){
      this.renderer.setStyle(this.truncator.nativeElement,'display','block');
    }
    else{
      this.renderer.setStyle(this.truncator.nativeElement,'display','none');
    }
  }
  onDelete(){
    this.deleteEvent.emit();
  }

}
