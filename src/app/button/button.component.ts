import { Component, OnInit } from '@angular/core';
import { TimerService } from '../timer.service';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  private playPauseStopUnsubscribe: any;
  play: boolean;

 constructor(private timerService: TimerService) {
 }

 ngOnInit() {
     this.playPauseStopUnsubscribe = this.timerService.playPauseStop$.subscribe((res: any) => this.setPlay(res));
 }

 ngOnDestroy() {
     this.playPauseStopUnsubscribe.unsubscribe();
 }

 private setPlay(res: any) {
     (res.play) ? this.play = true : this.play = false;
 }

 playTimer() {
     this.timerService.playTimer();
 }

 pauseTimer() {
     this.timerService.pauseTimer();
 }

 stopTimer() {
     this.timerService.stopTimer();
 }
}
