import { Injectable } from "@angular/core";
import { MapsAPILoader } from "@agm/core";

import { Observable } from "rxjs/Observable";

import "rxjs/add/observable/of";
import "rxjs/add/observable/bindCallback";
declare var google: any;
@Injectable()
export class PlacePredictionService {
    private autocompleteService;

    constructor(private mapsAPILoader: MapsAPILoader) {
      console.log('agm service was called')
        this.mapsAPILoader.load().then(() => {
            this.autocompleteService = new
                google.maps.places.AutocompleteService();
        });

    }

    // Wrapper for Google Places Autocomplete Prediction API, returns  observable

    getPlacePredictions(term: string): Observable<any[]> {
        return Observable.create(observer => {
            // API Call

            this.autocompleteService.getPlacePredictions({ input: term }, data => {
                let previousData: Array<any[]>;

                // Data validation

                if (data) {
                    console.log('data',data);
                    previousData = data;
                    observer.next(data);
                    observer.complete();
                }

                // If no data, emit previous data

                if (!data) {
                    console.log("PreviousData: ");
                    observer.next(previousData);
                    observer.complete();

                    // Error Handling

                } else {
                    observer.error(status);
                }

            });

        });

    }
}