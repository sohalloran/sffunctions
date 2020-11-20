import { LightningElement, track, wire } from "lwc";
import correlation from "@salesforce/apex/FunctionApex.correlation";

export default class Correlation extends LightningElement {
  results;
  error;

  @wire(correlation)
  wiredResults({ error, data }) {
    if (data) {
      this.results = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
    }
  }
}
