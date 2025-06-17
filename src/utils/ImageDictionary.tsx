import { Dictionary, IDictionary } from "./Dictionary";

export interface IImage {
    onDoubleClick: () => void;
    id: string;
    title: string;
    row: number;
    col: number;
    component?: React.ComponentType<any>;
    src: string;
}


export interface IIconDictionary extends IDictionary {
    [key: string]: any;
    values(): IImage[];
    toLookup(): IIconDictionary;
}

export class IconDictionary extends Dictionary implements IIconDictionary {
    constructor(init: { key: string; value: IImage; }[]) {
        super(init);
    }
    
    add(key: string, value: IImage): void {
        super.add(key, value);
    }
    
    values(): IImage[] {
        return this._values as IImage[];
    }
    
    toLookup(): IIconDictionary {
        return this;
    }
}
