/*  Melvor Idle Combat Simulator

    Modified Copyright (C) <2020, 2021> <G. Miclotte>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(() => {

    const reqs = [
        'util',
    ];

    const setup = () => {

        const MICSR = window.MICSR;

        /**
         * class ShowModifiers is copied from Melvor Show Modifiers v0.2.3, latest version can be found at:
         * https://raw.githubusercontent.com/gmiclotte/melvor-scripts/master/Show-Modifiers/Show-Modifiers.js
         * TODO: instead of copying it, pull it as a required file or something? No idea how to go about that.
         */
        // start of ShowModifiers copy
        MICSR.ShowModifiers = class {

            constructor(name, logName, check = true) {
                this.name = name;
                this.logName = logName;
                // increased - decreased
                this.creasedModifiers = {
                    // modifiers that do not directly relate to skilling
                    misc: [
                        'BankSpace',
                        'BankSpaceShop',
                    ],
                    // modifiers that relate to both combat and non-combat skilling
                    skilling: [
                        'ChanceToPreservePotionCharge',
                        'ChanceToDoubleItemsGlobal',
                        'GPFromSales',
                        'GPGlobal',
                        'GlobalSkillXP',
                        'HiddenSkillLevel',
                        'PotionChargesFlat',
                        'SkillXP',
                        'SummoningChargePreservation',
                    ],
                    // modifiers that only relate to combat and are not classified in a finer group
                    combat: [
                        'AttackRolls',
                        'ChanceToDoubleLootCombat',
                        'DamageToAllMonsters',
                        'DamageToBosses',
                        'DamageToCombatAreaMonsters',
                        'DamageToDungeonMonsters',
                        'GPFromMonsters',
                        'GPFromMonstersFlat',
                        'GlobalAccuracy',
                        'MaxHitFlat',
                        'MaxHitPercent',
                        'MaxHitpoints',
                        'MinHitBasedOnMaxHit',
                        'MonsterRespawnTimer',
                        'AttackInterval',
                        'AttackIntervalPercent',
                        'ChanceToApplyBurn',
                        'GPOnEnemyHit',
                        'BleedLifesteal',
                        'BurnLifesteal',
                        'PoisonLifesteal',
                        'FlatMinHit',
                        'DamageTaken',
                        'GlobalEvasion',
                    ],
                    // modifiers that relate to healing
                    hitpoints: [
                        'AutoEatEfficiency',
                        'AutoEatHPLimit',
                        'AutoEatThreshold',
                        'FoodHealingValue',
                        'HPRegenFlat',
                        'HitpointRegeneration',
                        'Lifesteal',
                        'FlatMaxHitpoints',
                    ],
                    // modifiers that relate to defence
                    defence: [
                        'DamageReduction',
                        'MagicEvasion',
                        'MeleeEvasion',
                        'RangedEvasion',
                        'ReflectDamage',
                        'FlatReflectDamage',
                        'RolledReflectDamage',
                        'DamageReductionPercent',
                    ],
                    // modifiers that relate to using melee attacks
                    attack: [],
                    strength: [],
                    melee: [
                        'MeleeAccuracyBonus',
                        'MeleeStrengthBonus',
                        'MeleeMaxHit',
                        'MeleeLifesteal',
                        'MeleeCritChance',
                        'MeleeCritMult',
                    ],
                    // modifiers that relate to using ranged attacks
                    ranged: [
                        'AmmoPreservation',
                        'RangedAccuracyBonus',
                        'RangedStrengthBonus',
                        'RangedMaxHit',
                        'RangedLifesteal',
                        'RangedCritChance',
                        'RangedCritMult',
                    ],
                    // modifiers that relate to using magic attacks
                    magic: [
                        'MagicAccuracyBonus',
                        'MagicDamageBonus',
                        'MinAirSpellDmg',
                        'MaxAirSpellDmg',
                        'MinEarthSpellDmg',
                        'MaxEarthSpellDmg',
                        'MinFireSpellDmg',
                        'MaxFireSpellDmg',
                        'MinWaterSpellDmg',
                        'MaxWaterSpellDmg',
                        'RunePreservation',
                        'MagicMaxHit',
                        'MagicLifesteal',
                        'MagicCritChance',
                        'MagicCritMult',
                    ],
                    // modifiers that relate to slayer tasks, areas, or monsters
                    slayer: [
                        'DamageToSlayerAreaMonsters',
                        'DamageToSlayerTasks',
                        'SlayerAreaEffectNegationFlat',
                        'SlayerCoins',
                        'SlayerTaskLength',
                    ],
                    // modifiers that relate to prayer
                    prayer: [
                        'ChanceToPreservePrayerPoints',
                        'FlatPrayerCostReduction',
                        'PrayerCost',
                    ],
                    // modifiers that apply to general non-combat skilling
                    nonCombat: [
                        'ChanceToDoubleItemsSkill',
                        'SkillInterval',
                        'SkillIntervalPercent',
                        'ChanceAdditionalSkillResource',
                    ],
                    production: [
                        'GlobalPreservationChance',
                        'SkillPreservationChance',
                    ],
                    mastery: [
                        'GlobalMasteryXP',
                        'MasteryXP',
                    ],
                    // specific skills
                    agility: [
                        'GPFromAgility',
                        'AgilityObstacleCost',
                    ],
                    altMagic: [
                        'AltMagicSkillXP',
                    ],
                    cooking: [],
                    crafting: [],
                    farming: [
                        'ChanceDoubleHarvest',
                        'FarmingYield',
                    ],
                    firemaking: [],
                    fishing: [],
                    fletching: [],
                    herblore: [
                        'ChanceRandomPotionHerblore',
                    ],
                    mining: [
                        'ChanceNoDamageMining',
                        'ChanceToDoubleOres',
                        'MiningNodeHP',
                    ],
                    runecrafting: [
                        'ChanceForElementalRune',
                        'ElementalRuneGain',
                        'AdditionalRunecraftCountRunes',
                    ],
                    smithing: [
                        'SeeingGoldChance',
                    ],
                    summoning: [],
                    nonCBSummoning: [
                        'SummoningShardCost',
                        'SummoningCreationCharges',
                    ],
                    thieving: [
                        'ChanceToDoubleLootThieving',
                        'GPFromThieving',
                        'GPFromThievingFlat',
                    ],
                    woodcutting: [
                        'BirdNestDropRate',
                    ],
                    // golbin raid
                    golbinRaid: [],
                    // aprilFools
                    aprilFools: [],
                    // modifiers that are not actually implemented in the game
                    unimplemented: [
                        'MaxStamina',
                        'StaminaCost',
                        'StaminaPerObstacle',
                        'StaminaPreservationChance',
                    ],
                }

                // unique modifiers, i.e. not in+de creased
                this.singletonModifiers = {
                    misc: [
                        'autoSlayerUnlocked',
                        'dungeonEquipmentSwapping',
                        'increasedEquipmentSets',
                    ],
                    skilling: [
                        'allowSignetDrops',
                        'increasedMasteryPoolProgress',
                    ],
                    combat: [
                        'meleeProtection',
                        'rangedProtection',
                        'magicProtection',
                        'curseImmunity',
                        'stunImmunity',
                        'sleepImmunity',
                        'burnImmunity',
                        'poisonImmunity',
                        'bleedImmunity',
                        'debuffImmunity',
                        'increasedRebirthChance',
                        'decreasedDragonBreathDamage',
                        'increasedMeleeStunThreshold',
                        'increasedRuneProvision',
                        'increasedChanceToConvertSeedDrops',
                        'bonusCoalOnDungeonCompletion',
                        'bypassSlayerItems',
                        'itemProtection',
                        'autoLooting',
                        'autoBurying',
                        'increasedCombatStoppingThreshold',
                        'increasedGPMultiplierPer1MGP',
                        'increasedGPMultiplierCap',
                        'increasedGPMultiplierMin',
                        'allowAttackAugmentingMagic',
                        'summoningSynergy_0_1',
                        'summoningSynergy_0_6',
                        'summoningSynergy_0_7',
                        'summoningSynergy_0_8',
                        'summoningSynergy_0_12',
                        'summoningSynergy_0_13',
                        'summoningSynergy_0_14',
                        'summoningSynergy_0_15',
                        'summoningSynergy_1_2',
                        'summoningSynergy_1_8',
                        'summoningSynergy_1_12',
                        'summoningSynergy_1_13',
                        'summoningSynergy_1_14',
                        'summoningSynergy_1_15',
                        'summoningSynergy_2_13',
                        'summoningSynergy_2_15',
                        'summoningSynergy_6_13',
                        'summoningSynergy_7_13',
                        'summoningSynergy_8_13',
                        'summoningSynergy_12_13',
                        'summoningSynergy_12_14',
                        'summoningSynergy_13_14',
                    ],
                    hitpoints: [],
                    defence: [],
                    attack: [],
                    strength: [],
                    melee: [
                        'summoningSynergy_6_7',
                        'summoningSynergy_6_12',
                        'summoningSynergy_6_14',
                        'summoningSynergy_6_15',
                    ],
                    ranged: [
                        'summoningSynergy_7_8',
                        'summoningSynergy_7_12',
                        'summoningSynergy_7_14',
                        'summoningSynergy_7_15',
                    ],
                    magic: [
                        'increasedConfusion',
                        'increasedDecay',
                        'summoningSynergy_6_8',
                        'summoningSynergy_8_14',
                    ],
                    slayer: [
                        'summoningSynergy_2_12',
                        'summoningSynergy_8_12',
                    ],
                    prayer: [
                        'increasedRedemptionPercent',
                        'increasedRedemptionThreshold',
                    ],
                    nonCombat: [
                        'increasedOffItemChance',
                        'doubleItemsSkill',
                    ],
                    production: [],
                    mastery: [],
                    // specific skills
                    agility: [],
                    altMagic: [],
                    cooking: [
                        'decreasedFoodBurnChance',
                        'decreasedSecondaryFoodBurnChance',
                        'summoningSynergy_3_9',
                        'summoningSynergy_4_9',
                        'summoningSynergy_9_17',
                        'summoningSynergy_9_18',
                        'summoningSynergy_9_19',
                    ],
                    crafting: [
                        'summoningSynergy_5_16',
                        'summoningSynergy_9_16',
                        'summoningSynergy_10_16',
                        'summoningSynergy_16_17',
                        'summoningSynergy_16_18',],
                    farming: [
                        'freeCompost',
                        'increasedCompostPreservationChance',
                    ],
                    firemaking: [
                        'freeBonfires',
                        'increasedFiremakingCoalChance',
                        'summoningSynergy_3_19',
                        'summoningSynergy_4_19',
                        'summoningSynergy_9_19',
                        'summoningSynergy_16_19',
                        'summoningSynergy_18_19',
                    ],
                    fishing: [
                        'summoningSynergy_3_5',
                        'summoningSynergy_4_5',
                        'summoningSynergy_5_9',
                        'summoningSynergy_5_18',],
                    fletching: [],
                    herblore: [],
                    mining: [
                        'increasedMiningGemChance',
                        'doubleOresMining',
                        'increasedBonusCoalMining',
                        'summoningSynergy_4_5',
                        'summoningSynergy_4_10',
                        'summoningSynergy_4_16',
                        'summoningSynergy_4_17',
                        'summoningSynergy_4_18',
                    ],
                    runecrafting: [
                        'summoningSynergy_3_10',
                        'summoningSynergy_5_10',
                        'summoningSynergy_9_10',
                        'summoningSynergy_10_17',
                        'summoningSynergy_10_18',
                        'summoningSynergy_10_19',],
                    smithing: [
                        'decreasedSmithingCoalCost',
                        'summoningSynergy_5_17',
                        'summoningSynergy_9_17',
                        'summoningSynergy_10_17',
                        'summoningSynergy_17_18',
                        'summoningSynergy_17_19',
                    ],
                    summoning: [],
                    nonCBSummoning: [],
                    thieving: [
                        'increasedThievingSuccessRate',
                        'increasedThievingSuccessCap',
                        'summoningSynergy_3_11',
                        'summoningSynergy_4_11',
                        'summoningSynergy_5_11',
                        'summoningSynergy_9_11',
                        'summoningSynergy_10_11',
                        'summoningSynergy_11_16',
                        'summoningSynergy_11_17',
                        'summoningSynergy_11_18',
                        'summoningSynergy_11_19',
                    ],
                    woodcutting: [
                        'increasedTreeCutLimit',
                        'summoningSynergy_3_4',
                        'summoningSynergy_3_16',
                        'summoningSynergy_3_17',
                        'summoningSynergy_3_18',
                        'summoningSynergy_3_19',
                    ],
                    // golbin raid modifiers
                    golbinRaid: [
                        'golbinRaidIncreasedMaximumAmmo',
                        'golbinRaidIncreasedMaximumRunes',
                        'golbinRaidIncreasedMinimumFood',
                        'golbinRaidIncreasedPrayerLevel',
                        'golbinRaidIncreasedPrayerPointsStart',
                        'golbinRaidIncreasedPrayerPointsWave',
                        'golbinRaidIncreasedStartingRuneCount',
                        'golbinRaidPassiveSlotUnlocked',
                        'golbinRaidPrayerUnlocked',
                        'golbinRaidStartingWeapon',
                        'golbinRaidWaveSkipCostReduction',
                    ],
                    // chaos mode modifiers
                    aprilFools: [
                        'aprilFoolsIncreasedMovementSpeed',
                        'aprilFoolsDecreasedMovementSpeed',
                        'aprilFoolsIncreasedTeleportCost',
                        'aprilFoolsDecreasedTeleportCost',
                        'aprilFoolsIncreasedUpdateDelay',
                        'aprilFoolsDecreasedUpdateDelay',
                        'aprilFoolsIncreasedLemonGang',
                        'aprilFoolsDecreasedLemonGang',
                        'aprilFoolsIncreasedCarrotGang',
                        'aprilFoolsDecreasedCarrotGang',
                    ],
                    unimplemented: [],
                }

                if (check) {
                    this.checkUnknownModifiers();
                }

                // map of relevant modifiers per tag
                this.relevantModifiers = {};

                // all
                this.relevantModifiers.all = this.getModifierNames(
                    Object.getOwnPropertyNames(this.creasedModifiers),
                    Object.getOwnPropertyNames(SKILLS).map(x => Number(x)),
                );

                // misc
                this.relevantModifiers.misc = this.getModifierNames(['misc'], []);

                // golbin raid
                this.relevantModifiers.golbin = this.getModifierNames(['golbinRaid'], []);

                // all combat
                this.relevantModifiers.combat = this.getModifierNames(
                    [
                        'skilling',
                        'combat',
                    ],
                    [
                        CONSTANTS.skill.Attack,
                        CONSTANTS.skill.Strength,
                        CONSTANTS.skill.Ranged,
                        CONSTANTS.skill.Magic,
                        CONSTANTS.skill.Defence,
                        CONSTANTS.skill.Hitpoints,
                        CONSTANTS.skill.Prayer,
                        CONSTANTS.skill.Slayer,
                        CONSTANTS.skill.Summoning,
                    ],
                );

                // melee combat
                this.relevantModifiers.melee = this.getModifierNames(
                    [
                        'skilling',
                        'combat',
                    ],
                    [
                        CONSTANTS.skill.Attack,
                        CONSTANTS.skill.Strength,
                        CONSTANTS.skill.Defence,
                        CONSTANTS.skill.Hitpoints,
                        CONSTANTS.skill.Prayer,
                        CONSTANTS.skill.Slayer,
                        CONSTANTS.skill.Summoning,
                    ],
                );

                // ranged combat
                this.relevantModifiers.ranged = this.getModifierNames(
                    [
                        'skilling',
                        'combat',
                    ],
                    [
                        CONSTANTS.skill.Ranged,
                        CONSTANTS.skill.Defence,
                        CONSTANTS.skill.Hitpoints,
                        CONSTANTS.skill.Prayer,
                        CONSTANTS.skill.Slayer,
                        CONSTANTS.skill.Summoning,
                    ],
                );

                // magic combat
                this.relevantModifiers.magic = this.getModifierNames(
                    [
                        'skilling',
                        'combat',
                        'hitpoints',
                    ],
                    [
                        CONSTANTS.skill.Magic,
                        CONSTANTS.skill.Defence,
                        CONSTANTS.skill.Hitpoints,
                        CONSTANTS.skill.Prayer,
                        CONSTANTS.skill.Slayer,
                        CONSTANTS.skill.Summoning,
                    ],
                );

                // slayer
                this.relevantModifiers.slayer = this.getModifierNames(
                    [
                        'skilling',
                    ],
                    [
                        CONSTANTS.skill.Slayer,
                    ],
                );

                // gathering skills
                this.gatheringSkills = ['Woodcutting', 'Fishing', 'Mining', 'Thieving', 'Farming', 'Agility'];
                this.gatheringSkills.forEach(name => {
                    this.relevantModifiers[name] = this.getModifierNames(
                        [
                            'skilling',
                            'nonCombat',
                            'mastery',
                        ],
                        [
                            CONSTANTS.skill[name]
                        ],
                    );
                    const lname = name.toLowerCase();
                    if (this.creasedModifiers[lname] !== undefined) {
                        this.relevantModifiers[name].names.push(this.creasedModifiers[lname]);
                    }
                    if (this.singletonModifiers[lname] !== undefined) {
                        this.relevantModifiers[name].names.push(this.singletonModifiers[lname]);
                    }
                });

                // production skills
                this.productionSkills = ['Firemaking', 'Cooking', 'Smithing', 'Fletching', 'Crafting', 'Runecrafting', 'Herblore', 'Summoning'];
                this.productionSkills.forEach(name => {
                    const setNames = [
                        'skilling',
                        'nonCombat',
                        'production',
                        'mastery',
                    ];
                    if (name === 'Summoning') {
                        setNames.push('nonCBSummoning');
                    }
                    this.relevantModifiers[name] = this.getModifierNames(
                        setNames,
                        [
                            CONSTANTS.skill[name]
                        ],
                    );
                });

                // whatever alt magic is
                this.relevantModifiers.altMagic = this.getModifierNames(
                    [
                        'skilling',
                        'nonCombat',
                        'altMagic',
                    ],
                    [],
                );

                // golbin raid
                this.relevantModifiers.golbinRaid = this.getModifierNames(
                    ['golbinRaid'],
                    [],
                );
            }

            log(...args) {
                console.log(`${this.logName}:`, ...args);
            }

            checkUnknownModifiers() {
                // list of known modifiers
                this.knownModifiers = {};
                for (const subset in this.creasedModifiers) {
                    this.creasedModifiers[subset].forEach(modifier => {
                        this.knownModifiers[`increased${modifier}`] = true;
                        this.knownModifiers[`decreased${modifier}`] = true;
                    });
                }
                for (const subset in this.singletonModifiers) {
                    this.singletonModifiers[subset].forEach(modifier => {
                        this.knownModifiers[modifier] = true;
                    });
                }

                // check for unknown modifiers
                const modifierNames = [
                    ...Object.getOwnPropertyNames(player.modifiers),
                    // player.modifiers.skillModifiers
                    ...Object.getOwnPropertyNames(modifierData).filter(x => modifierData[x].isSkill),
                ];
                let hasUnknownModifiers = false;
                modifierNames.forEach(modifier => {
                    if (modifier === 'skillModifiers') {
                        return;
                    }
                    if (this.knownModifiers[modifier]) {
                        return;
                    }
                    hasUnknownModifiers = true;
                    this.log(`unknown modifier ${modifier}`);
                });
                if (!hasUnknownModifiers) {
                    this.log('no unknown modifiers detected!')
                }

                // check for non-existent modifiers
                let hasNonExistentModifiers = false;
                for (const modifier in this.knownModifiers) {
                    if (!modifierNames.includes(modifier)) {
                        hasNonExistentModifiers = true;
                        this.log(`non-existent modifier ${modifier}`);
                    }
                }
                if (!hasNonExistentModifiers) {
                    this.log('no non-existent modifiers detected!')
                }
            }

            getModifierNames(setNames, skillIDs) {
                // add skill based on skillID
                skillIDs.forEach(id => {
                    if (!setNames.includes(skillName[id])) {
                        setNames.push(skillName[id].toLowerCase());
                    }
                });
                // add melee based on att/str skillID
                if (skillIDs.includes(CONSTANTS.skill.Attack) || skillIDs.includes(CONSTANTS.skill.Strength)) {
                    if (!setNames.includes('melee')) {
                        setNames.push('melee');
                    }
                }

                // gather modifiers
                return {
                    names: [...new Set([
                        ...setNames.map(name => this.creasedModifiers[name]).reduce((a, x) => [...a, ...x], []),
                        ...setNames.map(name => this.singletonModifiers[name]).reduce((a, x) => [...a, ...x], []),
                    ])],
                    skillIDs: skillIDs,
                };
            }

            printUniqueModifier(modifier, value, skillID) {
                if (!value) {
                    return [];
                }
                // convert to array if required
                const valueToPrint = skillID !== undefined ? [skillID, value] : value;
                return [printPlayerModifier(modifier, valueToPrint)];
            }

            printDiffModifier(modifier, value, skillID = undefined) {
                // compute difference
                if (!value) {
                    return [];
                }
                // store if value is positive or negative
                const positive = value > 0;
                // take absolute value
                let valueToPrint = positive ? value : -value;
                // convert to array if required
                valueToPrint = skillID !== undefined ? [skillID, valueToPrint] : valueToPrint;
                // print increased or decreased
                if (positive) {
                    return [printPlayerModifier('increased' + modifier, valueToPrint)];
                }
                return [printPlayerModifier('decreased' + modifier, valueToPrint)];
            }

            getModifierValue(modifiers, modifier, skillID = undefined) {
                if (!this.isSkillModifier(modifier)) {
                    return this.getSimpleModifier(modifiers, modifier);
                }
                return this.getSkillModifier(modifiers, modifier, skillID);
            }

            getSimpleModifier(modifiers, modifier) {
                // unique
                if (this.isUniqueModifier(modifier)) {
                    return modifiers[modifier];
                }
                // creased
                let increased = modifiers['increased' + modifier];
                if (!increased) {
                    increased = 0;
                }
                let decreased = modifiers['decreased' + modifier];
                if (!decreased) {
                    decreased = 0;
                }
                return increased - decreased;
            }

            getSkillModifier(modifiers, modifier, skillID) {
                const skillModifiers = modifiers.skillModifiers ? modifiers.skillModifiers : modifiers;
                // unique
                if (this.isUniqueModifier(modifier)) {
                    const map = this.skillModifierMapAux(skillModifiers, modifier);
                    return this.skillModifierAux(map, skillID);
                }
                // creased
                const increased = this.skillModifierMapAux(skillModifiers, 'increased' + modifier);
                const decreased = this.skillModifierMapAux(skillModifiers, 'decreased' + modifier);
                return this.skillModifierAux(increased, skillID) - this.skillModifierAux(decreased, skillID);
            }

            skillModifierMapAux(map, skillID) {
                if (!map) {
                    return [];
                }
                let tmp;
                if (map.constructor.name === 'Map') {
                    tmp = map.get(skillID);
                } else {
                    tmp = map[skillID];
                }
                return tmp ? tmp : [];
            }

            skillModifierAux(map, skillID) {
                if (!map || map.length === 0) {
                    return 0;
                }
                if (map.constructor.name === 'Map') {
                    const value = map.get(skillID);
                    if (!value) {
                        return 0
                    }
                    return value;
                }
                return map.filter(x => x[0] === skillID)
                    .map(x => x[1])
                    .reduce((a, b) => a + b, 0);
            }

            printModifier(modifiers, modifier, skillIDs) {
                if (!this.isSkillModifier(modifier)) {
                    const value = this.getSimpleModifier(modifiers, modifier);
                    if (this.isUniqueModifier(modifier)) {
                        // unique
                        return this.printUniqueModifier(modifier, value);
                    }
                    // creased
                    return this.printDiffModifier(modifier, value);
                }
                // skillModifiers
                return skillIDs.map(skillID => {
                    const value = this.getSkillModifier(modifiers, modifier, skillID);
                    if (this.isUniqueModifier(modifier)) {
                        // unique
                        return this.printUniqueModifier(modifier, value, skillID);
                    }
                    // creased
                    return this.printDiffModifier(modifier, value, skillID);
                }).reduce((a, b) => a.concat(b), []);
            }

            isUniqueModifier(modifier) {
                return modifierData[modifier] !== undefined;
            }

            isSkillModifier(modifier) {
                if (this.isUniqueModifier(modifier)) {
                    return modifierData[modifier].isSkill;
                }
                const data = modifierData['increased' + modifier];
                if (data === undefined) {
                    // this.log(`Unknown modifier ${modifier}`);
                    return false;
                }
                return data.isSkill;
            }

            printRelevantModifiers(modifiers, tag) {
                const relevantNames = this.relevantModifiers[tag].names;
                const skillIDs = this.relevantModifiers[tag].skillIDs;
                const toPrint = [];
                relevantNames.forEach(name => {
                    this.printModifier(modifiers, name, skillIDs).forEach(result => toPrint.push(result));
                });
                return toPrint;
            }

            makeTagButton(tag, text, icon) {
                return '<div class="dropdown d-inline-block ml-2">'
                    + '<button type="button" '
                    + 'class="btn btn-sm btn-dual text-combat-smoke" '
                    + 'id="page-header-modifiers" '
                    + `onclick="window.${this.name}.replaceRelevantModifiersHtml(player.modifiers, '${text}', '${tag}');" `
                    + 'aria-haspopup="true" '
                    + 'aria-expanded="true">'
                    + `<img class="skill-icon-xxs" src="${icon}">`
                    + '</button>'
                    + '</div>';
            }

            replaceRelevantModifiersHtml(modifiers, text, tag) {
                $('#show-modifiers').replaceWith(this.printRelevantModifiersHtml(modifiers, text, tag));
            }

            printRelevantModifiersHtml(modifiers, text, tag, id = 'show-modifiers') {
                let passives = `<div id="${id}"><br/>`;
                passives += `<h5 class=\"font-w400 font-size-sm mb-1\">${text}</h5><br/>`;
                this.printRelevantModifiers(modifiers, tag).forEach(toPrint => {
                    passives += `<h5 class=\"font-w400 font-size-sm mb-1 ${toPrint[1]}\">${toPrint[0]}</h5>`;
                });
                passives += '</div>';
                return passives;
            }

            showRelevantModifiers(modifiers, text, tag = 'all') {
                let passives = `<h5 class=\"font-w600 font-size-sm mb-1 text-combat-smoke\">${text}</h5><h5 class=\"font-w600 font-size-sm mb-3 text-warning\"></h5>`;
                passives += `<h5 class="font-w600 font-size-sm mb-3 text-warning"><small>(Does not include non-modifier effects)</small></h5>`;
                passives += this.makeTagButton('all', 'All Modifiers', 'assets/media/main/completion_log.svg');
                passives += this.makeTagButton('golbinRaid', 'Golbin Raid', 'assets/media/main/raid_coins.svg');
                passives += this.makeTagButton('combat', 'Combat', 'assets/media/skills/combat/combat.svg');
                passives += this.makeTagButton('melee', 'Melee', 'assets/media/skills/attack/attack.svg');
                passives += this.makeTagButton('ranged', 'Ranged', 'assets/media/skills/ranged/ranged.svg');
                passives += this.makeTagButton('magic', 'Combat Magic', 'assets/media/skills/combat/spellbook.svg');
                passives += this.makeTagButton('slayer', 'Slayer', 'assets/media/skills/slayer/slayer.svg');
                passives += '<br/>';
                this.gatheringSkills.forEach(skill => passives += this.makeTagButton(skill, skill, `assets/media/skills/${skill.toLowerCase()}/${skill.toLowerCase()}.svg`));
                passives += '<br/>';
                this.productionSkills.forEach(skill => passives += this.makeTagButton(skill, skill, `assets/media/skills/${skill.toLowerCase()}/${skill.toLowerCase()}.svg`));
                passives += this.makeTagButton('altMagic', 'Alt. Magic', 'assets/media/skills/magic/magic.svg');
                passives += this.printRelevantModifiersHtml(modifiers, 'All Modifiers', tag);
                Swal.fire({
                    html: passives,
                });
            }
        }
        // end of ShowModifiers copy

        // equipment stats are non-passive stats that apply to combat
        MICSR.modifierNames = {
            // general modifiers
            ChanceToDoubleItemsGlobal: {implemented: true},
            ChanceToPreservePotionCharge: {implemented: true},
            SummoningChargePreservation: {implemented: true},
            GPFromSales: {implemented: false}, // kind of iffy to implement, you might change setup to sell items
            GPGlobal: {implemented: true},
            GPOnEnemyHit: {implemented: true},
            GlobalSkillXP: {implemented: true},
            HiddenSkillLevel: {implemented: true},
            PotionChargesFlat: {implemented: true},
            SkillXP: {implemented: true},
            // modifiers that only relate to combat and are not classified in a finer group
            AttackRolls: {implemented: true},
            ChanceToDoubleLootCombat: {implemented: true},
            DamageToAllMonsters: {implemented: true},
            DamageToBosses: {implemented: true},
            DamageToCombatAreaMonsters: {implemented: true},
            DamageToDungeonMonsters: {implemented: true},
            GPFromMonsters: {implemented: true},
            GPFromMonstersFlat: {implemented: true},
            GlobalAccuracy: {implemented: true},
            MaxHitFlat: {implemented: true},
            MaxHitPercent: {implemented: true},
            MaxHitpoints: {implemented: true},
            MinHitBasedOnMaxHit: {implemented: true},
            MonsterRespawnTimer: {implemented: true},
            AttackInterval: {implemented: false},
            AttackIntervalPercent: {implemented: false},
            ChanceToApplyBurn: {implemented: true},
            // modifiers that relate to healing
            AutoEatEfficiency: {implemented: true},
            AutoEatHPLimit: {implemented: true},
            AutoEatThreshold: {implemented: true},
            FoodHealingValue: {implemented: true},
            HPRegenFlat: {implemented: true},
            HitpointRegeneration: {implemented: true},
            Lifesteal: {implemented: false}, // not implemented in game
            // modifiers that relate to defence
            DamageReduction: {implemented: true},
            MagicEvasion: {implemented: true},
            MeleeEvasion: {implemented: true},
            RangedEvasion: {implemented: true},
            ReflectDamage: {implemented: false}, // not implemented in game
            // modifiers that relate to using melee attacks
            MeleeAccuracyBonus: {implemented: true},
            MeleeStrengthBonus: {implemented: true},
            // modifiers that relate to using ranged attacks
            AmmoPreservation: {implemented: true},
            RangedAccuracyBonus: {implemented: true},
            RangedStrengthBonus: {implemented: true},
            // modifiers that relate to using magic attacks
            MagicAccuracyBonus: {implemented: true},
            MagicDamageBonus: {implemented: true},
            MinAirSpellDmg: {implemented: true},
            MinEarthSpellDmg: {implemented: true},
            MinFireSpellDmg: {implemented: true},
            MinWaterSpellDmg: {implemented: true},
            RunePreservation: {implemented: true},
            // modifiers that relate to slayer tasks, areas, or monsters
            DamageToSlayerAreaMonsters: {implemented: true},
            DamageToSlayerTasks: {implemented: true},
            SlayerAreaEffectNegationFlat: {implemented: true},
            SlayerCoins: {implemented: true},
            SlayerTaskLength: {implemented: true},
            // modifiers that relate to prayer
            ChanceToPreservePrayerPoints: {implemented: true},
            FlatPrayerCostReduction: {implemented: true},
        }

        MICSR.showModifiersInstance = new MICSR.ShowModifiers('', 'MICSR');

        // check for combat modifiers that do not have an implemented check
        if (MICSR.isDev) {
            MICSR.showModifiersInstance.relevantModifiers.combat.names.forEach(set => {
                Object.getOwnPropertyNames(set).forEach(modifier => {
                    if (MICSR.modifierNames[modifier] === undefined) {
                        MICSR.warn(`Combat modifier ${modifier} has no implementation check.`);
                    }
                });
            });
        }

        // report stats that have an implemented check, but are not implemented
        MICSR.checkImplemented(MICSR.modifierNames, 'Player combat modifier');
    }

    let loadCounter = 0;
    const waitLoadOrder = (reqs, setup, id) => {
        if (characterSelected && !characterLoading) {
            loadCounter++;
        }
        if (loadCounter > 100) {
            console.log('Failed to load ' + id);
            return;
        }
        // check requirements
        let reqMet = characterSelected && !characterLoading;
        if (window.MICSR === undefined) {
            reqMet = false;
            console.log(id + ' is waiting for the MICSR object');
        } else {
            for (const req of reqs) {
                if (window.MICSR.loadedFiles[req]) {
                    continue;
                }
                reqMet = false;
                // not defined yet: try again later
                if (loadCounter === 1) {
                    window.MICSR.log(id + ' is waiting for ' + req);
                }
            }
        }
        if (!reqMet) {
            setTimeout(() => waitLoadOrder(reqs, setup, id), 50);
            return;
        }
        // requirements met
        window.MICSR.log('setting up ' + id);
        setup();
        // mark as loaded
        window.MICSR.loadedFiles[id] = true;
    }
    waitLoadOrder(reqs, setup, 'modifierNames');

})();