import {setupShowHideToggle, commentformat} from "./comments";
import {fetchImageUrl, extractBears, loadBears} from "./bearContentAPi";
import {searchHilighter} from "./searchBar";

setupShowHideToggle();
commentformat();
loadBears();
searchHilighter();