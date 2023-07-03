export class Mask {

    public static cpfMask(string: string): string {
        if (string.length >= 3 && string.charAt(3) != '.') {
            string = [string.slice(0, 3), '.', string.slice(3)].join('')
        }
        if (string.length >= 7 && string.charAt(7) != '.') {
            string = [string.slice(0, 7), '.', string.slice(7)].join('')
        }
        if (string.length >= 11 && string.charAt(11) != '-') {
            string = [string.slice(0, 11), '-', string.slice(11)].join('')
        }
        return string.replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%;':*?<>{}]/g, "").replace(/[^0-9.-]/g, '').trim();
    }

    public static cnpjMask(string: string): string {
        if (string.length >= 2 && string.charAt(2) != '.') {
            string = [string.slice(0, 2), '.', string.slice(2)].join('')
        }
        if (string.length >= 6 && string.charAt(6) != '.') {
            string = [string.slice(0, 6), '.', string.slice(6)].join('')
        }
        if (string.length >= 10 && string.charAt(10) != '/') {
            string = [string.slice(0, 10), '/', string.slice(10)].join('')
        }
        if (string.length >= 15 && string.charAt(15) != '-') {
            string = [string.slice(0, 15), '-', string.slice(15)].join('')
        }
        return string.replace(/[&\\\#,+@=!"_ªº¹²³£¢¬()$~%;':*?<>{}]/g, "").replace(/[^0-9./-]/g, '').trim();
    }

    public static evpMask(string: string): string {
        if (string.length >= 7 && string.charAt(7) != '-') {
            string = [string.slice(0, 7), '-', string.slice(7)].join('')
        }
        if (string.length >= 12 && string.charAt(12) != '-') {
            string = [string.slice(0, 12), '-', string.slice(12)].join('')
        }
        if (string.length >= 17 && string.charAt(17) != '-') {
            string = [string.slice(0, 17), '-', string.slice(17)].join('')
        }
        if (string.length >= 22 && string.charAt(22) != '-') {
            string = [string.slice(0, 22), '-', string.slice(22)].join('')
        }
        return string.replace(/[&\/\\#,+@=!"_ªº¹²³£¢¬()$~%.;':*?<>{}]/g, "").replace(/[^0-9.-]/g, '').trim();
    }


}