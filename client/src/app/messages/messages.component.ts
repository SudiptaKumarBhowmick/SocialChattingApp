import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService, private confirmService: ConfirmService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages(){
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(message => {
      this.messages = message.result;
      this.pagination = message.pagination;
      this.loading = false;
    })
  }

  deleteMessage(id: number) {
    this.confirmService.confirm('Confirm Message', 'If you delete the message, it cannot be undone').subscribe(result => {
      if (result) {
        this.messageService.deleteMessage(id).subscribe(response => {
          this.messages.splice(this.messages.findIndex(i => i.id === id), 1);
        })
      }
    })
  }

  pageChanged(event: any){
    this.pageNumber = event.page;
    this.loadMessages();
  }

}
