import { SortOrder } from '../Enums'
import { StringExtensions } from '../Extensions/StringExtensions'
import * as fs from 'fs'
import { AdaptableBlotterLogger } from './AdaptableBlotterLogger';

export module Helper {
    export function getCharFromKey(event: JQueryKeyEventObject): string;
    export function getCharFromKey(event: KeyboardEvent): string;
    export function getCharFromKey(event: JQueryKeyEventObject | KeyboardEvent): string {
        if (event.which == null) {
            return String.fromCharCode(event.keyCode) // IE
        } else if (event.which != 0 && event.charCode != 0) {
            return String.fromCharCode(event.which)   // the rest
        } else {
            return null // special key
        }
    }

    export function getStringRepresentionFromKey(event: JQueryKeyEventObject | KeyboardEvent): string {
        if (event.key == null) {
            return event.char // IE
        } else {
            return event.key
        }
    }

    

   

    export function cloneObject(obj: any): any {
        return JSON.parse(JSON.stringify(obj))
    }

    export function sortArrayWithProperty(sortOrder: SortOrder, values: any[], sortProperty?: string): any[] {
        let newValues = [].concat(values)
        let direction = 1
        if (sortOrder == SortOrder.Descending) {
            direction = -1
        }
        if (sortProperty) {
            return newValues.sort((a, b) => {
                let aSortProperty = a[sortProperty]
                let bSortProperty = b[sortProperty]
                if (typeof (aSortProperty) == "string" && typeof (bSortProperty) == "string") {
                    return aSortProperty.localeCompare(bSortProperty) * direction
                } else {
                    return (aSortProperty < bSortProperty) ? -1 * direction : (aSortProperty > bSortProperty) ? 1 * direction : 0
                }
            });
        }
        else {
            return newValues.sort((a, b) => (a < b) ? -1 * direction : (a > b) ? 1 * direction : 0);
        }
    }
    export function sortArray(values: any[], sortOrder: SortOrder = SortOrder.Ascending): any[] {
        let newValues = [].concat(values)
        let direction = 1
        if (sortOrder == SortOrder.Descending) {
            direction = -1
        }
        return newValues.sort((a, b) => (a < b) ? -1 * direction : (a > b) ? 1 * direction : 0);
    }


    export function groupBy(array: Array<any>, prop: string): Array<any> {
        return array.reduce((acc, item) => {
            var key = item[prop];
            acc[key] = acc[key] || [];
            acc[key].push(item);
            return acc;
        }, {});
    }

    

    export function capitalize(string: string) {
        return (/[a-z]/.test(string) ? string : string.toLowerCase())
            .replace(/[\s\-_]*([^\s\-_])([^\s\-_]+)/g, replacer)
            .replace(/[A-Z]/g, ' $&')
            .trim();
    }

    function replacer(a: string, b: string, c: string) {
        return b.toUpperCase() + c;
    }

    // converts an array (or an array of arrays) to CSV
    export function convertArrayToCsv(array: any[], separator: string = " ' "): string {
        var csvContent = '';
        array.forEach(function (infoArray, index) {
            var line = [];
            var item: any
            var i;
            for (i = 0; i < infoArray.length; ++i) {
                item = infoArray[i];
                if (separator == ",") {
                    if (item.indexOf && (item.indexOf(',') !== -1 || item.indexOf('"') !== -1)) {
                        item = '"' + item.replace(/"/g, '""') + '"';
                    }
                }
                line.push(item);
            }
            csvContent += line.join(separator) + (index != array.length - 1 ? '\n' : '');
        });
        return csvContent;
    }

    export function createDownloadedFile(content: any, fileName: string, mimeType: string) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';

        if (navigator.msSaveBlob) { // IE10
            navigator.msSaveBlob(new Blob([content], {
                type: mimeType
            }), fileName);
        } else if (URL && 'download' in a) { //html5 A[download]
            a.href = URL.createObjectURL(new Blob([content], {
                type: mimeType
            }));
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
        }
    }

    // Copies a string to the clipboard. Must be called from within an 
    // event handler such as click. May return false if it failed, but
    // this is not always possible. Browser support for Chrome 43+, 
    // Firefox 42+, Safari 10+, Edge and IE 10+.
    // IE: The clipboard feature may be disabled by an administrator. By
    // default a prompt is shown the first time the clipboard is 
    // used (per session).
    export function copyToClipboard(text: string) {
        if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.width = '1px';
            textarea.style.height = '1px';
            textarea.style.top = '0px';
            textarea.style.left = '0px';
            textarea.style.position = 'absolute';
            textarea.style.opacity = '0.0';
            document.body.appendChild(textarea);
            textarea.select();
            textarea.focus();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                AdaptableBlotterLogger.LogWarning("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
        AdaptableBlotterLogger.LogWarning("Copy not available on this computer.");
    }

    export function ReturnItemCount(items: any[], itemName: string): string {
        if (items.length == 0) {
            return "No " + itemName + "s"
        }
        return (items.length == 1) ? "1 " + itemName : items.length + " " + itemName + "s"
    }

    export function IsInputNullOrEmpty(itemToCheck: any) {
        if (typeof (itemToCheck) == "string") {
            return StringExtensions.IsNullOrEmpty(itemToCheck)
        } else if (typeof (itemToCheck) == "number") {
            return StringExtensions.IsNullOrEmpty(itemToCheck.toString())
        } else if (itemToCheck instanceof (Date)) {
            return StringExtensions.IsNullOrEmpty(itemToCheck.toString())
        }
        return itemToCheck == null
    }

    export function IsInputNotNullOrEmpty(itemToCheck: any) {
        return !IsInputNullOrEmpty(itemToCheck);
    }

    export function ReadFileContents(fileName: string): string {
        // let contents: string = fs.readFileSync(fileName, { encoding: 'utf8' })
        return fileName;

    }


    export function areObjectsEqual(obj1: any, obj2: any) {
        // if both are null return true
        if (obj1 == null && obj2 == null) {
            return true;
        }

        if (obj1 != null && obj2 == null) {
            return false;
        }

        if (obj1 == null && obj2 != null) {
            return false;
        }

        //Loop through properties in object 1
        for (var p in obj1) {
            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
                return false;
            }

            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    if (!areObjectsEqual(obj1[p], obj2[p])) {
                        return false;
                    }
                    break;
                //Compare function code
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) {
                        return false;
                    }
                    break;
                //Compare values
                default:
                    if (obj1[p] != obj2[p]) {
                        return false;
                    }
                    break;
            }

            //Check object 2 for any extra properties
            for (let p2 in obj2) {
                if (typeof (obj1[p2]) == 'undefined') {
                    return false;
                }
            }
            return true;
        };
    }
}

