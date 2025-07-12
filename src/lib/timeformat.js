export class TimeFormat {

    static parseIntoFormat(prefix, current) {
        let diff = Math.abs(Date.now() - current);

        if(diff < 1000) {
            return "Jetzt";
        } else if(diff >= 1000 && diff < 1000 * 60) {
            const a = parseInt("" + diff / 1000);
            return prefix + " " + a + " Sekunde" + (a > 1 ? "n" : "");
        } else if(diff >= 1000 * 60 && diff < 1000 * 60 * 60) {
            const a = parseInt("" + diff / (1000 * 60));
            return prefix + " " + a + " Minute" + (a > 1 ? "n" : "");
        } else if(diff >= 1000 * 60 * 60 && diff < 1000 * 60 * 60 * 24) {
            const a = parseInt("" + diff / (1000 * 60 * 60));
            return prefix + " " + a + " Stunde" + (a > 1 ? "n" : "");
        } else {
            const a = parseInt("" + diff / (1000 * 60 * 60 * 24));
            return prefix + " " + a + " Tag" + (a > 1 ? "en" : "");
        }
    }
}
