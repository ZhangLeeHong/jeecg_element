import index from "./baseTools/index"
import Pagination from './Pagination'


//button
import buttonAdd from "./button/buttonAdd"
import buttonDel from "./button/buttonDel"
import buttonDelMini from "./button/buttonDelMini"
import buttonEditMini from "./button/buttonEditMini"
import buttonFind from "./button/buttonFind"
import buttonFindMini from "./button/buttonFindMini"
import buttonRefresh from "./button/buttonRefresh"

export default (Vue) => {
  //分页
  Vue.component("Pagination", Pagination);
  //button
  Vue.component("buttonRefresh", buttonRefresh);
  Vue.component("buttonAdd", buttonAdd);
  Vue.component("buttonDel", buttonDel);
  Vue.component("buttonDelMini", buttonDelMini);
  Vue.component("buttonEditMini", buttonEditMini);
  Vue.component("buttonFind", buttonFind);
  Vue.component("buttonRefresh", buttonRefresh);
  Vue.component("buttonFindMini", buttonFindMini);

}
