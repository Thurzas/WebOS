export interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}


export class Dictionary implements IDictionary {
    [key: string]: any;
    protected _keys: string[] = [];
    protected _values: any[] = [];
   
    constructor(init: { key: string; value: any; }[]) {
        for (let x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }
    
    add(key: string, value: any): void {
        if (!this.containsKey(key)) {
            this._keys.push(key);
            this._values.push(value);
        } else {
            const index = this._keys.indexOf(key);
            this._values[index] = value;
        }
        this[key] = value;
    }
    
    remove(key: string): void {
        const index = this._keys.indexOf(key);
        if (index !== -1) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
            delete this[key];
        }
    }
    
    keys(): string[] {
        return [...this._keys];
    }
    
    values(): any[] {
        return [...this._values];
    }
    
    containsKey(key: string): boolean {
        return typeof this[key] !== "undefined";
    }
    
    toLookup(): IDictionary {
        return this;
    }
}


