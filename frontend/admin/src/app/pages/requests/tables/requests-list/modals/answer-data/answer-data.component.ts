import { ChangeDetectorRef, Component, Input, OnInit, output } from '@angular/core';
import { CommunicationService } from '../../../../../../common/services/communication.service';
import { AnswerService } from '../../../../../../common/services/answer.service';
import { GetAnswerInterface } from '../../../../../../common/interfaces/common.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { ProviderDataService } from '../../../../../providers/services/provider-data.service';

interface AnswerDataForTable {
  provider_name: string;
  answer_type: string;
  created_at: string;
}

@Component({
  selector: 'app-answer-data',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './answer-data.component.html',
  styleUrl: './answer-data.component.css',
  providers: [DatePipe]
})
export class AnswerDataComponent implements OnInit {
  answersData!: AnswerDataForTable[];
  @Input() requestId!: string;
  isAnswersDataLoaded = output<boolean>();
  toggleModalEmitter = output<string>();
  showActions = output<boolean>();

  constructor(
    private globalCommunication: CommunicationService,
    private answerService: AnswerService,
    private providerService: ProviderDataService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.getAnswersByRequest(this.requestId);
  }

  toggleModal(type: string){
    this.toggleModalEmitter.emit(type);
  }

  getAnswersByRequest(requestId: string) {
    this.globalCommunication.loading.emit(true);
    this.answerService.getAnswersByRequest(requestId).subscribe({
      next: async (answers) => {
        if (answers.length > 0) {
          try{
            const answersWithDetails = await Promise.all(
              answers.map(async (answer) => {
                const providerName = await this.getProvider(answer.renter_id);
                return {
                  provider_name: providerName,
                  answer_type: answer.answer_type,
                  created_at:
                  this.datePipe.transform(
                    answer.created_at,
                    'fullDate',
                    'es-ES'
                  ) || '',
                }
              })
            );

            this.answersData = answersWithDetails
            this.cdr.detectChanges();
          }catch(error){
            console.error('Error while processing answers:', error);
          }finally{
            this.globalCommunication.loading.emit(false);
          }
        } else {
          alert('Esta solicitud no tiene respuestas');
        }
        this.showActions.emit(false);
      },
      error: (error) => {
        alert('Esta solicitud no tiene respuestas');
        console.error('Error al obtener respuestas.', error);
        this.isAnswersDataLoaded.emit(false);
        this.globalCommunication.loading.emit(false);
      }
    });
  }

  async getProvider(id: string): Promise<string> {

    try {
      const provider = await firstValueFrom(
        this.providerService.getProviderWithId(id)
      );
      return provider.name;
    } catch {
      return 'Error al obtener el proveedor';
    }
  }
}
