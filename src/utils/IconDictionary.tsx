import { Dictionary } from "./Dictionary";

// export interfaces et classes Dictionary
export interface IDictionary {
    add(key: string, value: any): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    keys(): string[];
    values(): any[];
}

export interface IIcon {
    onDoubleClick: () => void;
    id: string;
    title: string;
    row: number;
    col: number;
    component?: React.ComponentType<any>;
    color?: string;
    src?: string;
    draggable?:boolean;
}


export interface IIconDictionary extends IDictionary {
    [key: string]: any;
    values(): IIcon[];
    toLookup(): IIconDictionary;
}

export class IconDictionary extends Dictionary implements IIconDictionary {
    constructor(init: { key: string; value: IIcon; }[]) {
        super(init);
    }
    
    add(key: string, value: IIcon): void {
        super.add(key, value);
    }
    
    values(): IIcon[] {
        return this._values as IIcon[];
    }
    
    toLookup(): IIconDictionary {
        return this;
    }
}
