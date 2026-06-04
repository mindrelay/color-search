export default class Utils {

    concatColorArraysToMap(conflictColors, singleColors) {
        let colors = [];
        conflictColors.forEach((item) => {
            colors.push({ word: item.word, color: item.selected });
        });
        colors = colors.concat(singleColors);
        const colorMap = this.convertColorArrayToMap(colors);
        return colorMap;
    }

    convertColorArrayToMap(arr) {
        const colorMap = new Map();
        for (let i = 0, k = arr.length; i < k; i++) {
            colorMap.set(arr[i].word, arr[i].color);
        }
        return colorMap;
    }
}
