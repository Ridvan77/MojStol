import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  RestaurantTagCreateDto,
  RestaurantTagService,
} from '../../../Services/restaurant-tag.service';
import { RestaurantTag, Tag, TagService } from '../../../Services/tag.service';

@Component({
  selector: 'app-tags-modal',
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './tags-modal.component.html',
  styleUrl: './tags-modal.component.css',
})
export class TagsModalComponent implements OnChanges {
  @Input() restaurantId!: number;

  @Input() openModal!: boolean;
  @Input() selectedTags!: RestaurantTag[];

  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();

  allTags: Tag[] = [];
  removeTags: number[] = [];
  removeRestaurantTags: number[] = [];
  newTags: number[] = [];

  tagService = inject(TagService);
  restaurantTagService = inject(RestaurantTagService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['openModal'] && this.openModal) {
      console.log(this.selectedTags);
      this.removeTags = [];
      this.removeRestaurantTags = [];
      this.newTags = [];

      this.fetchTags();
    }
  }

  isTagChosen(tagID: number): boolean {
    return this.selectedTags.some((st) => st.tagId === tagID);
  }

  selectTag(tagId: number) {
    const restaurantTagId = this.selectedTags.find(
      (st) => st.tagId == tagId
    )?.restaurantTagId;
    console.log('restaurantTagId: ', restaurantTagId);

    if (this.newTags.includes(tagId)) {
      this.newTags = this.newTags.filter((tagID) => tagID != tagId);
    } else if (this.removeTags.includes(tagId)) {
      this.removeTags = this.removeTags.filter((tagID) => tagID != tagId);
      this.removeRestaurantTags = this.removeRestaurantTags.filter(
        (rtId) => rtId != restaurantTagId!
      );
    } else if (this.selectedTags.some((st) => st.tagId == tagId)) {
      this.removeTags.push(tagId);
      this.removeRestaurantTags.push(restaurantTagId!);
    } else if (!this.newTags.includes(tagId)) {
      this.newTags.push(tagId);
    }

    console.log('New Tags:', this.newTags);
    console.log('Removed Tags:', this.removeTags);
    console.log('Removed Restaurant Tags:', this.removeRestaurantTags);
    console.log('Selected Tags:', this.selectedTags);
  }

  fetchTags() {
    this.tagService.getAllTags().subscribe((tags) => {
      this.allTags = tags;
      console.log(this.allTags);
    });
  }

  closeModal() {
    this.onClose.emit();
  }

  saveModal() {
    this.onSave.emit();
  }

  saveChanges() {
    if (this.newTags.length > 0) {
      let newCounter = 0;
      for (let i = 0; i < this.newTags.length; i++) {
        const tagId = this.newTags[i];

        const restaurantTagToSend: RestaurantTagCreateDto = {
          restaurantID: this.restaurantId,
          tagID: tagId,
        };
        this.restaurantTagService.create(restaurantTagToSend).subscribe((x) => {
          newCounter++;
          console.log('Adding tag: ', tagId);
          if (newCounter == this.newTags.length) {
            this.saveModal();
          }
        });
      }
    }
    if (this.removeRestaurantTags.length > 0) {
      let removeCounter = 0;
      for (let i = 0; i < this.removeRestaurantTags.length; i++) {
        const restaurantTagId = this.removeRestaurantTags[i];

        this.restaurantTagService.delete(restaurantTagId).subscribe((x) => {
          removeCounter++;
          console.log('Removing tag: ', restaurantTagId);
          if (removeCounter == this.removeTags.length) {
            this.saveModal();
          }
        });
      }
    }

    this.closeModal();
  }

  enableSave() {
    return this.newTags.length > 0 || this.removeRestaurantTags.length > 0;
  }
}
