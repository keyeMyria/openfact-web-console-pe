import { SearchCriteriaFilter } from './search-criteria-filter.model';
import { OrderBy } from './order-by.model';
import { Paging } from './paging.model';

export class SearchCriteria {
    filterText: String;
    filters: Array<SearchCriteriaFilter>;
    orders: Array<OrderBy>;
    paging: Paging;
}
