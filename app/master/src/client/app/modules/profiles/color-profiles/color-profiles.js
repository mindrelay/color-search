import './scss/color-profiles.scss';
import template from './template/color-profiles.html';
import Utils from '../classes/Utils';

export const colorProfilesCompName = 'colorProfiles';
export const colorProfilesComp = {
    template,
    bindings: {
        colors: '<',
        onLoadProfile: '&',
    },
    controller: class ColorProfilesCtrl {
        static get $inject() {
            return ['$rootScope', '$scope', '$timeout', 'colorProfiles', 'colorService', 'textColors', 'popupDialog'];
        }

        constructor($rootScope, $scope, $timeout, colorProfiles,
            colorService, textColors, dialog) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this._colorService = colorService;
            this._textColors = textColors;
            this._dialog = dialog;
            this._mode = "";
            this._utils = new Utils();
            this._singleColors = [];
            this.colorProfiles = colorProfiles;
            this.openCreateProfile = false;
            this.openConflicts = false;
            this.newProfileName = "";
            this.colorProfiles = colorProfiles;
            this.conflictColors = [];

            this.$scope.$on("colorsChainged", () => {
                this.$timeout(() => {
                    const profile = this.colorProfiles.loadedProfile;
                    if (profile) {
                        this._checkColorConflicts(profile.colors);
                        this.$scope.$apply();
                    }
                }, 0, false);
            });
        }

        $onInit() {
            this.colorProfiles.init(() => {
                this.$scope.$apply();
            });
        }

        updateProfileDialog() {
            const self = this;
            this._resetColorConflicts();
            if (this.colorProfiles.loadedProfile) {
                this._dialog.confirmDialog(function () {
                    this.yes = () => {
                        self.updateProfile();
                        self._dialog.close();
                    };
                    this.cancel = () => {
                        self._dialog.close();
                    };
                    this.title = '"update profile"';
                });
            }
        }

        applyProfileDialog() {
            const self = this;
            if (this.colorProfiles.loadedProfile) {
                this._dialog.confirmDialog(function () {
                    this.yes = () => {
                        self.applyProfile();
                        self._dialog.close();
                    };
                    this.cancel = () => {
                        self._dialog.close();
                    };
                    this.title = '"apply profile"';
                });
            }
        }

        deleteProfileDialog() {
            const self = this;
            if (this.colorProfiles.loadedProfile) {
                this._dialog.confirmDialog(function () {
                    this.yes = () => {
                        self.deleteProfile();
                        self._dialog.close();
                    };
                    this.cancel = () => {
                        self._dialog.close();
                    };
                    this.title = '"delete profile"';
                });
            }
        }

        toggleNewProfile() {
            this.openCreateProfile = !this.openCreateProfile;
        }

        haveProfiles() {
            return this.colorProfiles.profileNames.length > 0;
        }

        selectProfile() {
            if (this.colorProfiles.loadedProfile) {
                this.colorProfiles.loadColorProfile(this.colorProfiles.loadedProfile.name);
            }
        }

        saveProfile() {
            const name = this.newProfileName;
            this._resetColorConflicts();
            this._mode = "create";
            if (name && name.trim().length > 0) {
                this._checkColorConflicts();
                if (this.conflictColors.length < 1) {
                    const colors = this._utils.convertColorArrayToMap(this._singleColors);
                    this.createColorProfile(name, colors);
                } else {
                    this.openConflicts = true;
                }
            }
        }

        applyProfile() {
            const profile = this.colorProfiles.loadedProfile;
            this._resetColorConflicts();
            if (profile && profile.name) {
                this.onLoadProfile({
                    colors: profile.colors,
                    sPercentage: profile.sPercentage,
                    lPercentage: profile.lPercentage,
                });
            }
        }

        updateProfile() {
            const profile = this.colorProfiles.loadedProfile;
            this._mode = "update";
            if (profile) {
                this._checkColorConflicts(profile.colors);
                this.openConflicts = this.conflictColors.length > 0;
                if (this.conflictColors.length < 1) {
                    const colors = this._utils.convertColorArrayToMap(this._singleColors);
                    this.updateColorProfile(profile.name, colors);
                }
            }
        }

        deleteProfile() {
            const profile = this.colorProfiles.loadedProfile;
            this.colorProfiles.deleteColorProfile(profile.name, () => {
                this.$scope.$apply();
                this.$rootScope.$broadcast("profilesUpdated");
            });
        }

        solveColorConflicts() {
            const colors = this._utils
            .concatColorArraysToMap(this.conflictColors, this._singleColors);
            switch (this._mode) {
                case 'update': {
                    const name = this.colorProfiles.loadedProfile.name;
                    if (name && colors.size > 0) {
                        this.updateColorProfile(name, colors);
                        this._resetColorConflicts();
                        this._mode = "";
                    }
                } break;
                case 'create': {
                    const name = this.newProfileName;
                    if (name) {
                        this.createColorProfile(name, colors);
                        this._resetColorConflicts();
                        this._mode = "";
                    }
                } break;
                default: break;
            }
        }

        abortSolveColorConflicts() {
            this.openConflicts = false;
        }

        createColorProfile(name, colors) {
            for (const [word, color] of colors) {
                if (!color.isSet()) {
                    colors.delete(word);
                }
            }
            this.colorProfiles.createColorProfile(name, colors,
            this._textColors.sPercentage, this._textColors.lPercentage, () => {
                this.newProfileName = "";
                this.colorProfiles.loadColorProfile(name, () => {
                    this.openCreateProfile = false;
                    this.$scope.$apply();
                });
            });
        }

        updateColorProfile(name, colors) {
            for (const [word, color] of colors) {
                if (!color.isSet()) {
                    colors.delete(word);
                }
            }
            this.colorProfiles.updateColorProfile(colors, this._textColors.sPercentage,
                this._textColors.lPercentage, () => {
                this._resetColorConflicts();
                this.$timeout(() => {
                    this.$rootScope.$broadcast("profilesUpdated");
                }, 0, false);
            });
        }

        _resetColorConflicts() {
            this.conflictColors = [];
            this._singleColors = [];
            this.openConflicts = false;
        }

        _checkColorConflicts(colors) {
            this._resetColorConflicts();
            const colorsMapTemp = new Map();
            for (const [word, mapColors] of this.colors) {
                const colorsArray = mapColors.getValuesArray();
                const colorSet = this._colorService.getColorSetInstance();
                for (let i = 0; i < colorsArray.length; i++) {
                    colorSet.add(colorsArray[i]);
                }
                colorsMapTemp.set(word, colorSet);
            }

            if (colors) {
                for (const [word, color] of colors) {
                    const c = this._colorService.getColorInstance(color);
                    const entry = colorsMapTemp.get(word);
                    if (entry) {
                        entry.add(c);
                    } else {
                        const colorSet = this._colorService.getColorSetInstance();
                        colorSet.add(c);
                        colorsMapTemp.set(word, colorSet);
                    }
                }
            }

            for (const [word, mapColors] of colorsMapTemp) {
                const colorsToWordArray = mapColors.getValuesArray();
                if (colorsToWordArray.length > 1) {
                    const sel = colorsToWordArray[0];
                    this.conflictColors.push({ word, selected: sel, colors: colorsToWordArray });
                } else {
                    const color = colorsToWordArray[0];
                    this._singleColors.push({ word, color });
                }
            }
        }
    },
};
