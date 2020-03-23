import Pagination from './Pagination'

//input
import fuzzyInput from './input/fuzzyInput'

export default (Vue) => {
    Vue.component("Pagination", Pagination);
    Vue.component("fuzzyInput", fuzzyInput);
}
