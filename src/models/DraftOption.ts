export interface ImageUrls {
    readonly unit: string;
    readonly emblem: string;
    readonly animated_left: string;
    readonly animated_right: string;
}

enum Name {
    HIDDEN_PICK = "HIDDEN_PICK",
    HIDDEN_BAN = "HIDDEN_BAN",
    HIDDEN_SNIPE = "HIDDEN_SNIPE",
    HIDDEN_STEAL = "HIDDEN_STEAL",
    HIDDEN = "HIDDEN",
    RANDOM = "RANDOM",
}

class DraftOption {

    public static readonly HIDDEN_PICK: DraftOption = new DraftOption(Name.HIDDEN_PICK);
    public static readonly HIDDEN_BAN: DraftOption = new DraftOption(Name.HIDDEN_BAN);
    public static readonly HIDDEN_SNIPE: DraftOption = new DraftOption(Name.HIDDEN_SNIPE);
    public static readonly HIDDEN_STEAL: DraftOption = new DraftOption(Name.HIDDEN_STEAL);
    public static readonly HIDDEN: DraftOption = new DraftOption(Name.HIDDEN);
    public static readonly RANDOM: DraftOption = new DraftOption(Name.RANDOM);
    public static readonly TECHNICAL_DRAFT_OPTIONS: DraftOption[] = [
        DraftOption.HIDDEN_PICK,
        DraftOption.HIDDEN_BAN,
        DraftOption.HIDDEN_SNIPE,
        DraftOption.HIDDEN_STEAL,
        DraftOption.HIDDEN,
    ];

    public readonly id: string;
    public readonly name: string;
    public readonly imageUrls: ImageUrls;
    public readonly i18nPrefix: string;


    constructor(id: string, name: string = id, imageUrls: ImageUrls = DraftOption.defaultImageUrlsForCivilisation(id), i18nPrefix = 'civs.') {
        this.id = id;
        this.name = name;
        this.imageUrls = imageUrls;
        this.i18nPrefix = i18nPrefix;
    }

    public static defaultImageUrlsForCivilisation(name: string): ImageUrls {
        return {
            unit: `/images/civs/${name.toLowerCase()}.png`,
            emblem: `/images/civemblems/${name.toLowerCase()}.png`,
            animated_left: `/images/units-animated/${name.toLowerCase()}-left.apng`,
            animated_right: `/images/units-animated/${name.toLowerCase()}-right.apng`,
        }
    }

    public static equals(first: DraftOption, second: DraftOption) {
        return first.id === second.id
            && first.name === second.name
            && first.imageUrls.unit === second.imageUrls.unit
            && first.imageUrls.emblem === second.imageUrls.emblem
            && first.imageUrls.animated_left === second.imageUrls.animated_left
            && first.imageUrls.animated_right === second.imageUrls.animated_right;
    }

}

export default DraftOption;
