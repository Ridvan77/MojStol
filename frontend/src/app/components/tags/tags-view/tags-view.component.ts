import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RestaurantTag, TagService } from '../../../Services/tag.service';

@Component({
  selector: 'app-tags-view',
  imports: [CommonModule, TranslateModule],
  templateUrl: './tags-view.component.html',
  styleUrl: './tags-view.component.css',
})
export class TagsViewComponent implements OnChanges {
  @Input() tags!: RestaurantTag[];

  myTags: any[] = [];

  tagService = inject(TagService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tags']) {
      this.myTags = [];

      this.fetchTags();
    }
  }

  fetchTags() {
    this.tagService.getAllTags().subscribe((tags) => {
      this.myTags = tags.filter((t) =>
        this.tags.some((tag) => t.tagID == tag.tagId)
      );
    });
  }
}
