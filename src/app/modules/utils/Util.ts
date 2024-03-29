export class Util {

    public static transformStringToNumber(string: string): number {
        let convertido: number = parseInt(string);
        if (!Number.isNaN(convertido)) return convertido;
        else return null;
    }

    public static isListEmpty(list: any[]): boolean {
        if (list == null || list == undefined) return true;
        else {
            if (list.length == 0) return true;
            else return false;
        }
    }

    public static isObjectEmpty(object: any): boolean {
        if (object == null || object == undefined) return true;
        return false;
    }

    public static isNotObjectEmpty(object: any): boolean {
        if (object == null || object == undefined) return false;
        return true;
    }

    public static isEmptyString(string: string): boolean {
        if (string != null && string != undefined && string != '') return false;
        return true;
    }

    public static isNotEmptyString(string: string): boolean {
        if (string != null && string != undefined && string != '') return true;
        return false;
    }

    public static isEmptyNumber(number: number): boolean {
        if (number != null && number != undefined) return false;
        return true;
    }

    public static isNotEmptyNumber(number: number): boolean {
        if (number != null && number != undefined) return true;
        return false;
    }

    public static isSomeAttributeFilled(object: any): boolean {
        if (Object.keys(object).some(k => !!object[k])) return true;
        return false;
    }

    public static getHojeUs(): string {
        let hoje = new Date();
        let year = hoje.getFullYear().toString();
        let monthPreOp = hoje.getMonth() + 1;
        let month = monthPreOp < 10 ? '0' + monthPreOp.toString() : monthPreOp.toString();
        let day = hoje.getDate() < 10 ? '0' + hoje.getDate().toString() : hoje.getDate().toString();
        return (year + '-' + month + '-' + day).toString();
    }
}