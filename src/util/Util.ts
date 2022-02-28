import Civilisation from "../models/Civilisation";
import Action from "../constants/Action";
import {DraftEvent} from "../types/DraftEvent";
import PlayerEvent from "../models/PlayerEvent";
import AdminEvent from "../models/AdminEvent";
import Turn from "../models/Turn";
import ActionType from "../constants/ActionType";
import GameVersion from "../constants/GameVersion";
import {Validator} from "../models/Validator";
import {DraftsStore} from "../models/DraftsStore";
import Exclusivity from "../constants/Exclusivity";
import i18next from 'i18next';
import Player from "../constants/Player";

const CHARACTERS: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export const Util = {
    notUndefined(...args: any[]): boolean {
        for (const arg of args) {
            if (arg === undefined) {
                return false;
            }
        }
        return true;
    },

    getIdFromUrl(): string {
        const match: RegExpMatchArray | null = window.location.pathname.match(/\/(?:draft|spectate)\/([A-Za-z]+)\/?.*/);
        if (match !== null) {
            return match[1];
        }
        alert('Could not get draft ID from url');
        return '';
    },

    isPick(action: Action): boolean {
        return (action === Action.PICK);
    },

    isNonglobalBan(turn: Turn): boolean {
        return (turn.action === Action.BAN && turn.exclusivity !== Exclusivity.GLOBAL);
    },

    isSnipe(action: Action): boolean {
        return (action === Action.SNIPE);
    },

    isPlayerEvent(event: DraftEvent): event is PlayerEvent {
        return (event as PlayerEvent).civilisation !== undefined;
    },

    isAdminEvent(event: DraftEvent): event is AdminEvent {
        return !(event as AdminEvent).hasOwnProperty('civilisation');
    },

    isHidden(turn: Turn): boolean {
        return (turn.hidden);
    },

    getHiddenCivilisationForActionType(actionType: ActionType): Civilisation {
        switch (actionType) {
            case ActionType.PICK:
                return Civilisation.HIDDEN_PICK;
            case ActionType.BAN:
                return Civilisation.HIDDEN_BAN;
            case ActionType.SNIPE:
                return Civilisation.HIDDEN_SNIPE;
            case ActionType.STEAL:
                return Civilisation.HIDDEN_STEAL;
            default:
                return Civilisation.HIDDEN;
        }
    },

    isTechnicalCivilisation(civilisation: Civilisation): boolean {
        return civilisation.gameVersion === GameVersion.TECHNICAL;
    },

    isRandomCivilisation(civilisation: Civilisation): boolean {
        return civilisation.name.toUpperCase() === "RANDOM";
    },

    getRandomCivilisation(civilisationsList: Civilisation[]): Civilisation {
        const maxCivilisationIndex = civilisationsList.length;
        const randomCivIndex = Math.floor(Math.random() * maxCivilisationIndex);
        return civilisationsList.splice(randomCivIndex, 1)[0];
    },

    setRandomCivilisationIfNeeded(playerEvent: PlayerEvent, draftId: string,
                                  draftStore: DraftsStore, civilisationsList: Civilisation[], round: number = 100): PlayerEvent {
        if (round < 0) {
            return new PlayerEvent(playerEvent.player, playerEvent.actionType, Civilisation.HIDDEN, playerEvent.executingPlayer);
        }
        if (Util.isRandomCivilisation(playerEvent.civilisation)) {
            const randomCiv = Util.getRandomCivilisation(civilisationsList);
            const playerEventForValidation = new PlayerEvent(playerEvent.player, playerEvent.actionType, randomCiv, playerEvent.executingPlayer);
            const errors = Validator.checkAllValidations(draftId, draftStore, playerEventForValidation);
            if (errors.length === 0) {
                playerEvent.civilisation = randomCiv;
                playerEvent.civilisation.isRandomlyChosenCiv = true;
                return playerEvent;
            } else {
                return this.setRandomCivilisationIfNeeded(playerEvent, draftId, draftStore, civilisationsList, round - 1);
            }
        }
        return playerEvent;
    },

    newDraftId(): string {
        let id: string = '';
        for (let i = 0; i < 5; i++) {
            id += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
        }
        return id;
    },

    isValidPresetId(input: any): boolean {
        if (typeof input !== "string") {
            return false;
        }
        return input.match(new RegExp(`^[A-Za-z0-9_]+$`)) !== null;
    },

    randomChar(): string {
        return CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    },

    buildValidationErrorMessage(data: any): string {
        if (data.hasOwnProperty('message')) {
            return data.message;
        }
        let message = i18next.t('validationFailed') + '\n';
        for (let validationError of data.validationErrors) {
            message += `\n${validationError}: ${i18next.t('errors.' + validationError)}`;
        }
        return message;
    },

    sanitizeDraftId(draftIdRaw: any) {
        if (typeof draftIdRaw === "string") {
            return draftIdRaw.replace(new RegExp(`[^${CHARACTERS}]`, 'g'), '_');
        }
        return '__invalid__';
    },

    sanitizeRole(roleRaw: Player) {
        if (roleRaw === Player.GUEST) {
            return Player.GUEST;
        }
        if (roleRaw === Player.HOST) {
            return Player.HOST;
        }
        if (roleRaw === Player.MASTER) {
            return Player.MASTER;
        }
        return Player.NONE;
    },

    getAssignedRole(socket: SocketIO.Socket, roomHost: string, roomGuest: string, roomMaster: string): Player {
        let assignedRole: Player = Player.NONE;
        if (Object.keys(socket.rooms).includes(roomHost)) {
            assignedRole = Player.HOST;
        } else if (Object.keys(socket.rooms).includes(roomGuest)) {
            assignedRole = Player.GUEST;
        } else if (Object.keys(socket.rooms).includes(roomMaster)) {
            assignedRole = Player.MASTER;
        }
        return assignedRole;
    },

    isRequestFromLocalhost(req: any) {
        const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        return ip === '::ffff:127.0.0.1' || ip === '::1';
    },

    getIconStyleFromLocalStorage(defaultIfError: string = 'units'): string {
        try {
            return localStorage.getItem('iconStyle') || defaultIfError;
        } catch (e) {
            return defaultIfError;
        }
    },

    writeIconStyleToLocalStorage(iconStyle: string) {
        try {
            localStorage.setItem('iconStyle', iconStyle);
        } catch (e) {
            // ignore
        }
    },
};
