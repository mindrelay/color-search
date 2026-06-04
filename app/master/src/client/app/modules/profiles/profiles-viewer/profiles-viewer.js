import './scss/profiles-viewer.scss';
import template from './template/profiles-viewer.html';

export const profilesViewerCompName = 'profilesViewer';
export const profilesViewerComp = {
    template,
    controller: class ProfilesViewerCtrl {
        static get $inject() {
            return ['$scope', '$timeout', 'colorProfiles', 'colorService', 'popupDialog', 'usSpinnerService'];
        }

        constructor($scope, $timeout, colorProfiles, colorService, dialog, spinner) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this._colorService = colorService;
            this._dialog = dialog;
            this._spinner = spinner;
            this._step = 10;
            this._showIndex = 0;
            this._wordsAndColors = [];
            this.colorProfiles = colorProfiles;
            this.words = [];
            this.profileName = "";
            this.selectedProfile = null;
            this.searchWord = "";
            this.foundWord = null;
            this.selectedWord = null;

            this.$scope.$watch("$ctrl.searchWord", (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        this.findWordAndColor(newValue);
                    }
                },
            );

            this.$scope.$on("profilesUpdated", () => {
                if (this.selectedProfile) {
                    this.loadColorProfile(true);
                }
            });
        }

        loadColorProfile(update) {
            this._showIndex = update === true ? this._showIndex : 0;
            this._wordsAndColors = [];
            this.words = [];
            this.selectedProfile = null;
            this.selectedWord = null;
            this.colorProfiles.getColorProfile(this.profileName, (profile) => {
                this.selectedProfile = profile;
                const profileColors = [];
                for (const [word, color] of profile.colors) {
                    const adjustedColor = this._colorService.getColorInstance(color);
                    adjustedColor.interpolateS(profile.sPercentage).interpolateL(profile.lPercentage);
                    profileColors.push({ word, color: adjustedColor, type: "word" });
                }
                profileColors.sort((a, b) => {
                    if (a.word > b.word) {
                        return 1;
                    }
                    if (a.word < b.word) {
                        return -1;
                    }
                    return 0;
                });
                for (let i = 0, k = profileColors.length; i < k; i++) {
                    const current = profileColors[i];
                    const next = profileColors[i + 1];
                    let added = false;
                    if (i === 0) {
                        this._wordsAndColors.push({ word: current.word.charAt(0).toUpperCase(), type: "title" });
                        this._wordsAndColors.push(current);
                        added = true;
                    }
                    if (next && next.word.charAt(0) !== current.word.charAt(0)) {
                        if (!added) {
                            this._wordsAndColors.push(current);
                        }
                        this._wordsAndColors.push({ word: next.word.charAt(0).toUpperCase(), type: "title" });
                        added = true;
                    }
                    if (!added) {
                        this._wordsAndColors.push(current);
                    }
                }
                this.words = update === true ? this._wordsAndColors.slice(0, this._showIndex) :
                this._wordsAndColors.slice(0, this._step);
                this._showIndex += this._step;
                this.findWordAndColor(this.searchWord);
                this.$scope.$apply();
            });
        }

        findWordAndColor(word) {
            if (this.selectedProfile && this.selectedProfile.name) {
                const color = this.selectedProfile.getColor(word);
                if (color) {
                const adjustedColor = this._colorService.getColorInstance(color);
                adjustedColor.interpolateS(this.selectedProfile.sPercentage)
                .interpolateL(this.selectedProfile.lPercentage);
                this.foundWord = { word, color: adjustedColor };
                } else {
                    this.foundWord = null;
                }
            } else {
                this.foundWord = null;
            }
        }

        showMore() {
            this.words = this.words
            .concat(this._getWordsInInterval(this._showIndex,
            this._showIndex + this._step, this._wordsAndColors));
            this._showIndex += this._step;
        }

        clickHandler($event) {
            const target = $event.target;
            if (target.hasAttribute("word")) {
                $event.stopPropagation();
                const word = target.getAttribute("word");
                this.selectedWord = this.selectedWord === word ? null : word;
            } else if (target.hasAttribute("delete")) {
                $event.stopPropagation();
                const word = target.getAttribute("delete");
                this.deleteWordDialog(word);
            }
        }

        deleteWordDialog(word) {
            const self = this;
            this._dialog.confirmDialog(function () {
                this.yes = () => {
                    self.deleteWord(word);
                    self._dialog.close();
                };
                this.cancel = () => {
                    self._dialog.close();
                };
                this.title = '"delete word"';
            });
        }

        deleteWord(word) {
            this.selectedProfile.deleteWord(word);
            this.colorProfiles.updateColorProfile(this.selectedProfile, () => {
                this.foundWord = null;
                this.searchWord = "";
                this.loadColorProfile(true);
            });
        }

        countProfileWords() {
            return (this.selectedProfile && this.selectedProfile.countWords) ?
            this.selectedProfile.countWords() : 0;
        }

        _getWordsInInterval(start, end, words) {
            if (start >= 0 && start < words.length) {
                if (end > words.length) {
                    end = words.length;
                }
                return words.slice(start, end);
            }
            return [];
        }
    },
};
