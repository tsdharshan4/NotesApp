import { animate, query, stagger, style, transition, trigger, } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Note } from '../Models/note.model';
import { NotesService } from '../shared/notes.service';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations : [
    trigger('itemAnim',[
      transition('void => *',[
        style({
          height:0,
          opacity:0,
          transform: 'scale(0.85)',
          'margin-bottom':0,
          paddingTop : 0,
          paddingBottom : 0,
          paddingRight : 0,
          paddingLeft : 0
        }),
        animate('50ms',style({
          height:'*',
          'margin-bottom':'*',
          paddingTop :'*',
          paddingBottom : '*',
          paddingRight : '*',
          paddingLeft : '*'
        })),
        animate(68)
      ]),
      transition('* => void',[
        animate(50,style({
          transform: 'scale(1)',
          opacity :0.75
        })),
        animate('120ms ease-out',style({
          transform:'scale(0.68)',
          opacity:0,
        })),
        animate('150ms ease-out',style({
          height:0,
          'margin-bottom':0,
          paddingTop :0,
          paddingBottom : 0,
          paddingRight : 0,
          paddingLeft : 0,
        }))
      ])
    ]),
    trigger('listAnim',[
      transition('* => *',[
        query(':enter',[
          style({
            opacity:0,
            height:0,

          }),
          stagger(100,[
            animate('0.2s ease')
          ])
        ],{
          optional:true
        })
      ])
    ])
  ]
})
export class NotesListComponent implements OnInit {

  notes : Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();
  @ViewChild('filterInput') filterInputRef! : ElementRef;

  constructor(private noteService: NotesService) { }

  ngOnInit(): void {

    this.notes = this.noteService.getAll();
    //this.filteredNotes = this.notes;
    this.filter2('');
  }
  deleteNote(note : Note){
    let noteId = this.noteService.getId(note);
    this.noteService.delete(noteId);
    this.filter2(this.filterInputRef.nativeElement.value.toString());
  }
  generateNoteUrl(note:Note){
    let noteId = this.noteService.getId(note);
    return noteId
  }
  filter(event : Event){
    let query: string;
    console.log((event.target as HTMLInputElement).value);
    query = typeof((event.target as HTMLInputElement)) === undefined ? '' : (event.target as HTMLInputElement).value.toString();
    let results : Note[] = new Array<Note>();
    query = query.toLowerCase().trim();
    console.log(query);
    let terms: string[] = query.split(' ');
    terms = this.removeDuplicates(terms);
    terms.forEach(term => {
      let result : Note[] = this.matchingNotes(term);
      results = [...results, ...result]
    });
    let uniqueResults = this.removeDuplicates(results);
    this.filteredNotes = uniqueResults;

  }
  filter2(query:string){

    let results : Note[] = new Array<Note>();
    query = query.toLowerCase().trim();
    console.log(query);
    let terms: string[] = query.split(' ');
    terms = this.removeDuplicates(terms);
    terms.forEach(term => {
      let result : Note[] = this.matchingNotes(term);
      results = [...results, ...result]
    });
    let uniqueResults = this.removeDuplicates(results);
    this.filteredNotes = uniqueResults;


  }
  removeDuplicates(arr:Array<any>): Array<any>{
    let uniquesValues : Set<any> = new Set<any>();
    arr.forEach(e => uniquesValues.add(e));
    return Array.from(uniquesValues);
  }

  matchingNotes(query:any){
    query = query.toLowerCase().trim();
    let matchingNotes = this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query)){
        return true;
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }
      else{
        return false;
      }
    })
    return matchingNotes;
  }

}
