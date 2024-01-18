import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(
      (item: any) =>
        item.name.toLowerCase().includes(searchText) ||
        item.email.toLowerCase().includes(searchText)
    );
  }
}
