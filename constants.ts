

import { CharacterProfile, TraitType } from './types';

export const STATIC_INFO: Record<string, { title: string; content: string }> = {
  // Traits
  [TraitType.Agility]: { 
    title: "Agility", 
    content: "Agility measures your speed, balance, and coordination.\n\nUsage:\n• Sprinting, leaping, and climbing.\n• Balancing on precarious surfaces.\n• Firing ranged weapons (Bows/Crossbows).\n• Dodging area of effect attacks." 
  },
  [TraitType.Strength]: { 
    title: "Strength", 
    content: "Strength measures your raw physical power and athleticism.\n\nUsage:\n• Lifting heavy objects or smashing doors.\n• Grappling or shoving enemies.\n• Wielding heavy melee weapons.\n• Enduring physical hardship." 
  },
  [TraitType.Finesse]: { 
    title: "Finesse", 
    content: "Finesse measures your manual dexterity and precision.\n\nUsage:\n• Picking locks and disarming traps.\n• Performing slight-of-hand.\n• Hiding and moving silently.\n• Wielding light, precise weapons." 
  },
  [TraitType.Instinct]: { 
    title: "Instinct", 
    content: "Instinct measures your intuition and situational awareness.\n\nUsage:\n• Sensing danger or hidden enemies.\n• Navigating wilderness or tracking.\n• Reading someone's true intentions.\n• Reacting quickly to surprises." 
  },
  [TraitType.Presence]: { 
    title: "Presence", 
    content: "Presence measures your charisma and force of personality.\n\nUsage:\n• Charming or persuading others.\n• Intimidating or commanding respect.\n• Performing for a crowd.\n• Casting magic related to the soul or emotion." 
  },
  [TraitType.Knowledge]: { 
    title: "Knowledge", 
    content: "Knowledge measures your intellect, logic, and education.\n\nUsage:\n• Recalling lore and history.\n• Analyzing magical effects.\n• Treating wounds and medicine.\n• Comprehending languages or codes." 
  },

  // Stats & Vitals
  "Evasion": { 
    title: "Evasion Score", 
    content: "Your Evasion Score represents your passive defense. Enemies must roll equal to or higher than this number to hit you with an attack.\n\nIt is typically calculated as:\nClass Base Value + (Agility, Strength, or Finesse)." 
  },
  "Damage": { 
    title: "Health & Damage Thresholds", 
    content: "Daggerheart uses Damage Thresholds rather than subtracting HP directly.\n\nWhen you take damage:\n1. Compare the damage amount to your Thresholds.\n2. **< Minor**: Mark Stress (or 1 HP if Stress is full).\n3. **Minor - Major**: Mark 1 HP.\n4. **Major - Severe**: Mark 2 HP.\n5. **≥ Severe**: Mark 3 HP.\n\nIf you mark your last HP box, you make a Death Move." 
  },
  "Armor": { 
    title: "Armor Slots", 
    content: "Armor protects you from physical harm.\n\n• **Armor Score**: How much damage your armor absorbs (e.g., 5).\n• **Armor Slots**: How many times you can use your armor.\n\nReaction: When you take damage, you can spend 1 Armor Slot to reduce the incoming damage total by your Armor Score." 
  },
  "Stress": { 
    title: "Stress", 
    content: "Stress represents fatigue, mental strain, or minor scrapes.\n\nUsage:\n• **Pay Cost**: Many abilities require spending Stress.\n• **Push Yourself**: Mark Stress to help an ally (+1d6 to them).\n• **Absorb Damage**: Damage below your Minor Threshold marks Stress instead of HP.\n\nIf your Stress is full and you must take more, you mark 1 HP instead." 
  },
  "Hope": { 
    title: "Hope", 
    content: "Hope is a resource representing momentum, luck, and resolve.\n\nGaining Hope:\n• Roll with Hope (Hope Die ≥ Fear Die).\n\nSpending Hope:\n• **Use Ability**: Pay the Hope cost of a card.\n• **Help Ally**: Spend 1 Hope to give an ally +1d12 to their roll.\n• **Advantage**: Spend 1 Hope to give yourself Advantage (+1d6) on a roll." 
  },
  "Gold": { 
    title: "Gold & Wealth", 
    content: "Wealth in Daggerheart can be tracked loosely or specifically.\n\n• **Handful**: Small change, a meal, a drink.\n• **Bag**: A weapon, a night at a good inn, a bribe.\n• **Chest**: A horse, a cart, a masterwork item.\n\nPlayers usually start with a few gold pieces or a 'Bag' worth of funds." 
  },

  // Sections
  "Class Features": { 
    title: "Class & Subclass", 
    content: "Your **Class** defines your core role (e.g., Warrior, Wizard) and sets your Damage Thresholds and Trait selections.\n\nYour **Subclass** (selected at Level 1) grants you a specific Foundation Card and unique abilities that define your playstyle (e.g., a 'Slayer' Warrior vs a 'Knight' Warrior)." 
  },
  "Weapons": { 
    title: "Weapons Rules", 
    content: "**Trait**: The stat you add to the attack roll (e.g., Strength).\n**Range**:\n• Melee: Touch/Reach.\n• Close: Within a few paces/thrown.\n• Far: Line of sight/bowshot.\n**Type**:\n• Physical: Blocked by Armor.\n• Magic: Often ignores Armor or requires specific resistance." 
  },
  "Abilities": { 
    title: "Abilities Rules", 
    content: "Abilities come from your Class, Subclass, and Domain Cards.\n\n**Active**: Requires an action token to use in combat.\n**Passive**: Always in effect.\n**Recall**: Some cards can be 'recalled' to your hand, removing them from play to regain resources or cooldowns." 
  },
  "Experiences": { 
    title: "Experiences", 
    content: "Experiences are narrative tags describing your background (e.g., 'Ex-Soldier', 'Raised by Wolves').\n\nMechanic: When making a roll where an Experience is relevant, you can spend **1 Hope** to add the Experience value (usually +2) to your roll." 
  },
  "Inventory": { 
    title: "Inventory", 
    content: "Inventory management in Daggerheart focuses on loadout and utility.\n\n• **Items**: Standard gear.\n• **Gold**: Tracked in Handfuls (10g), Bags (100g), and Chests (1000g)." 
  }
};

export const COMMON_ITEMS = {
  "Consumables": [
    "Healing Potion (Minor)", "Healing Potion (Major)", "Antidote", "Rations (1 day)", "Bandages", "Stress Potion"
  ],
  "Light & Camping": [
    "Torch", "Lantern", "Oil Flask", "Bedroll", "Flint and Steel", "Tent (Small)", "Waterskin"
  ],
  "Tools": [
    "Rope (50ft)", "Crowbar", "Grappling Hook", "Lockpicks", "Compass", "Shovel", "Whistle"
  ],
  "Valuables": [
    "Bag of Gold", "Handful of Gold", "Gemstone", "Strange Relic"
  ]
};

export const EXAMPLE_EXPERIENCES = {
  "Background": [
    "Street Urchin", "Noble Scion", "Hermit", "Soldier", "Scholar", "Criminal", "Entertainer", "Sailor"
  ],
  "Training": [
    "Master Swordsman", "Arcane Scholar", "Stealth Expert", "Survivalist", "Medic", "Diplomat"
  ],
  "Quirks & History": [
    "Raised by Wolves", "Cursed by a Witch", "Sole Survivor", "Dragon Slayer", "Wanted Fugitive", "Haunted"
  ]
};

export const CLASS_DOMAINS: Record<string, string[]> = {
    "Bard": ["Grace", "Codex"],
    "Druid": ["Sage", "Arcana"],
    "Guardian": ["Valor", "Blade"],
    "Ranger": ["Bone", "Sage"],
    "Rogue": ["Midnight", "Grace"],
    "Seraph": ["Splendor", "Valor"],
    "Sorcerer": ["Arcana", "Midnight"],
    "Warrior": ["Blade", "Bone"],
    "Wizard": ["Codex", "Splendor"]
};

export const DOMAIN_DESCRIPTIONS: Record<string, { description: string, classes: string }> = {
    "Arcana": { 
        description: "The domain of innate and instinctual magic. Those who choose this path tap into the raw, enigmatic forces of the realms to manipulate both their own energy and the elements. Arcana offers wielders a volatile power, but it is incredibly potent when correctly channeled.", 
        classes: "Druid, Sorcerer" 
    },
    "Blade": { 
        description: "The domain of weapon mastery. Whether by steel, bow, or perhaps a more specialized arm, those who follow this path have the skill to cut short the lives of others. Wielders of Blade dedicate themselves to achieving inexorable power over death.", 
        classes: "Guardian, Warrior" 
    },
    "Bone": { 
        description: "The domain of tactics and the body. Practitioners of this domain have an uncanny control over their own physical abilities and an eye for predicting the behaviors of others in combat. Adherents to Bone gain an unparalleled understanding of bodies and their movements.", 
        classes: "Ranger, Warrior" 
    },
    "Codex": { 
        description: "The domain of intensive magical study. Those who seek magical knowledge turn to the equations of power recorded in books, written on scrolls, etched into walls, or tattooed on bodies. Codex offers a commanding and versatile understanding of magic to devotees who pursue knowledge beyond the boundaries of common wisdom.", 
        classes: "Bard, Wizard" 
    },
    "Grace": { 
        description: "The domain of charisma. Through rapturous storytelling, charming spells, or a shroud of lies, those who channel this power define the realities of their adversaries, bending perception to their will. Grace offers its wielders raw magnetism and mastery over language.", 
        classes: "Bard, Rogue" 
    },
    "Midnight": { 
        description: "The domain of shadows and secrecy. Whether by clever tricks, deft magic, or the cloak of night, those who channel these forces practice the art of obscurity and can uncover sequestered treasures. Midnight offers practitioners the power to control and create enigmas.", 
        classes: "Rogue, Sorcerer" 
    },
    "Sage": { 
        description: "The domain of the natural world. Those who walk this path tap into the unfettered power of the earth and its creatures to unleash raw magic. Sage grants its adherents the vitality of a blooming flower and the ferocity of a ravenous predator.", 
        classes: "Druid, Ranger" 
    },
    "Splendor": { 
        description: "The domain of life. Through this magic, followers gain the ability to heal and, to an extent, control death. Splendor offers its disciples the magnificent ability to both give and end life.", 
        classes: "Seraph, Wizard" 
    },
    "Valor": { 
        description: "The domain of protection. Whether through attack or defense, those who choose this discipline channel formidable strength to protect their allies in battle. Valor offers great power to those who raise their shields in defense of others.", 
        classes: "Guardian, Seraph" 
    }
};

export const DOMAIN_RESOURCES: Record<string, { icon: string, colorBg: string }> = {
  "Arcana": { icon: "https://i.imgur.com/OZgsbP7.png", colorBg: "bg-[#783B8D]" },
  "Blade": { icon: "https://i.imgur.com/nB6E2pV.png", colorBg: "bg-[#AD2A2F]" },
  "Bone": { icon: "https://i.imgur.com/6cqhBpV.png", colorBg: "bg-[#C8D0D4]" },
  "Codex": { icon: "https://i.imgur.com/C2R8z6F.png", colorBg: "bg-[#376CBC]" },
  "Grace": { icon: "https://i.imgur.com/oi5h7h2.png", colorBg: "bg-[#C22684]" },
  "Midnight": { icon: "https://i.imgur.com/dIMFZTZ.png", colorBg: "bg-[#363A37]" },
  "Sage": { icon: "https://i.imgur.com/l0RmBU8.png", colorBg: "bg-[#287841]" },
  "Splendor": { icon: "https://i.imgur.com/nLAVlZh.png", colorBg: "bg-[#DFC514]" },
  "Valor": { icon: "https://i.imgur.com/JxCX0Zg.png", colorBg: "bg-[#D8611C]" },
};

export interface DomainCardData {
    domain: string;
    level: number;
    name: string;
    type: string; // Spell, Ability, Grimoire
    cost: string; // "1 Hope", "0"
    description: string;
}

export const ALL_DOMAIN_CARDS: DomainCardData[] = [

// Arcana
    { domain: "Arcana", level: 1, name: "Rune Ward", type: "Spell", cost: "0", description: "Personal trinket infused with protective magic. Ward's holder can spend Hope to reduce damage by 1d8.", imageUrl: "https://i.imgur.com/GZBI3yM.jpeg" },
    { domain: "Arcana", level: 1, name: "Unleash Chaos", type: "Spell", cost: "1 Hope", description: "Channel raw energy dealing d10s equal to tokens spent as magic damage.", imageUrl: "https://i.imgur.com/Kg0hIZA.jpeg" },
    { domain: "Arcana", level: 1, name: "Wall Walk", type: "Spell", cost: "1 Hope", description: "Spend Hope to allow creature to climb walls and ceilings as easily as walking.", imageUrl: "https://i.imgur.com/iwtbBuJ.jpeg" },
    { domain: "Arcana", level: 2, name: "Cinder Grasp", type: "Spell", cost: "1 Hope", description: "Target bursts into flames, takes 1d20+3 magic damage, and is temporarily On Fire.", imageUrl: "https://i.imgur.com/kmcQWyB.jpeg" },
    { domain: "Arcana", level: 2, name: "Floating Eye", type: "Spell", cost: "0", description: "Create small floating orb you can move and see through.", imageUrl: "https://i.imgur.com/Dxmu5ln.jpeg" },
    { domain: "Arcana", level: 3, name: "Counterspell", type: "Spell", cost: "2 Hope", description: "Interrupt a magical effect with reaction roll.", imageUrl: "https://i.imgur.com/guDsRxT.jpeg" },
    { domain: "Arcana", level: 3, name: "Flight", type: "Spell", cost: "1 Hope", description: "Gain ability to fly with tokens equal to Agility.", imageUrl: "https://i.imgur.com/BtxvXpW.jpeg" },
    { domain: "Arcana", level: 4, name: "Blink Out", type: "Spell", cost: "1 Hope", description: "Teleport to a point you can see within Far range.", imageUrl: "https://i.imgur.com/xDwmyvt.jpeg" },
    { domain: "Arcana", level: 4, name: "Preservation Blast", type: "Spell", cost: "2 Hope", description: "Force all targets within Melee range back to Far range dealing d8+3 magic damage.", imageUrl: "https://i.imgur.com/6XYocsp.jpeg" },
    { domain: "Arcana", level: 5, name: "Chain Lightning", type: "Spell", cost: "1 Hope", description: "Unleash lightning on all targets within Close range dealing 2d8+4 magic damage.", imageUrl: "https://i.imgur.com/7KS643y.jpeg" },
    { domain: "Arcana", level: 5, name: "Premonition", type: "Spell", cost: "2 Hope", description: "After GM conveys consequences, rescind move and make another move instead.", imageUrl: "https://i.imgur.com/4XI9lU3.jpeg" },
    { domain: "Arcana", level: 6, name: "Rift Walker", type: "Spell", cost: "2 Hope", description: "Place arcane marking to create rift portals.", imageUrl: "https://i.imgur.com/69TSKiM.jpeg" },
    { domain: "Arcana", level: 6, name: "Telekinesis", type: "Spell", cost: "0", description: "Move target anywhere within Far range with Spellcast Roll.", imageUrl: "https://i.imgur.com/SnNd10P.jpeg" },
    { domain: "Arcana", level: 7, name: "Arcana-Touched", type: "Ability", cost: "2 Hope", description: "When 4+ Arcana cards, gain +1 Spellcast and can switch Hope/Fear dice results.", imageUrl: "https://i.imgur.com/KxPPZS1.jpeg" },
    { domain: "Arcana", level: 7, name: "Cloaking Blast", type: "Spell", cost: "2 Hope", description: "After successful Spellcast, spend Hope to become Cloaked.", imageUrl: "https://i.imgur.com/nVqQ1Fd.jpeg" },
    { domain: "Arcana", level: 8, name: "Arcane Reflection", type: "Spell", cost: "1 Hope", description: "When taking magic damage, roll d6s to potentially reflect attack.", imageUrl: "https://i.imgur.com/lYSL3A3.jpeg" },
    { domain: "Arcana", level: 8, name: "Confusing Aura", type: "Spell", cost: "2 Hope", description: "Create illusion layers that cause attacks against you to fail.", imageUrl: "https://i.imgur.com/Ogni8ZG.jpeg" },
    { domain: "Arcana", level: 9, name: "Earthquake", type: "Spell", cost: "2 Hope", description: "All targets within Very Far range take 3d10+8 physical damage and become Vulnerable.", imageUrl: "https://i.imgur.com/LWZ4LBQ.jpeg" },
    { domain: "Arcana", level: 9, name: "Sensory Projection", type: "Spell", cost: "0", description: "See and hear any place you have been before.", imageUrl: "https://i.imgur.com/jbbSyXl.jpeg" },
    { domain: "Arcana", level: 10, name: "Adjust Reality", type: "Spell", cost: "5 Hope", description: "Spend 5 Hope to change roll result to plausible result of choice.", imageUrl: "https://i.imgur.com/yST68FT.jpeg" },
    { domain: "Arcana", level: 10, name: "Falling Sky", type: "Spell", cost: "1 Hope", description: "Make shards of arcana rain down dealing 1d20+2 magic damage per Stress.", imageUrl: "https://i.imgur.com/yFmPMHH.jpeg" },

    // Blade
    { domain: "Blade", level: 1, name: "Get Back Up", type: "Ability", cost: "1 Hope", description: "When taking Severe damage, mark Stress to reduce severity by one threshold.", imageUrl: "https://i.imgur.com/IiTwkM0.jpeg" },
    { domain: "Blade", level: 1, name: "Not Good Enough", type: "Ability", cost: "1 Hope", description: "Reroll any 1s or 2s on damage dice.", imageUrl: "https://i.imgur.com/91xKmak.jpeg" },
    { domain: "Blade", level: 1, name: "Whirlwind", type: "Ability", cost: "0", description: "On successful attack, spend Hope to attack all targets within Very Close range for half damage.", imageUrl: "https://i.imgur.com/es3zmgT.jpeg" },
    { domain: "Blade", level: 2, name: "A Soldier's Bond", type: "Ability", cost: "1 Hope", description: "When complimenting ally's skill, both gain 3 Hope.", imageUrl: "https://i.imgur.com/HUxrR5R.jpeg" },
    { domain: "Blade", level: 2, name: "Reckless", type: "Ability", cost: "1 Hope", description: "Mark Stress to gain advantage on attack.", imageUrl: "https://i.imgur.com/FfMALaw.jpeg" },
    { domain: "Blade", level: 3, name: "Scramble", type: "Ability", cost: "1 Hope", description: "When creature within Melee would deal damage, avoid attack and move out of range.", imageUrl: "https://i.imgur.com/E2xF9zJ.jpeg" },
    { domain: "Blade", level: 3, name: "Versatile Fighter", type: "Ability", cost: "1 Hope", description: "Use different trait for equipped weapon. Mark Stress to use max damage die.", imageUrl: "https://i.imgur.com/FUY5XGo.jpeg" },
    { domain: "Blade", level: 4, name: "Deadly Focus", type: "Ability", cost: "2 Hope", description: "Gain +1 Proficiency bonus against target until attacking another.", imageUrl: "https://i.imgur.com/xygbvdC.jpeg" },
    { domain: "Blade", level: 4, name: "Fortified Armor", type: "Ability", cost: "0", description: "While wearing armor, gain +2 to damage thresholds.", imageUrl: "https://i.imgur.com/dEA6XAd.jpeg" },
    { domain: "Blade", level: 5, name: "Champion's Edge", type: "Ability", cost: "1 Hope", description: "On critical success, spend Hope to clear HP/Armor or force additional HP marks.", imageUrl: "https://i.imgur.com/hq4NZsG.jpeg" },
    { domain: "Blade", level: 5, name: "Vitality", type: "Ability", cost: "0", description: "Permanently gain two of: Stress slot, Hit Point slot, or +2 damage thresholds.", imageUrl: "https://i.imgur.com/DrFbRU0.jpeg" },
    { domain: "Blade", level: 6, name: "Battle-Hardened", type: "Ability", cost: "2 Hope", description: "When making Death Move, spend Hope to clear Hit Point instead.", imageUrl: "https://i.imgur.com/0NPLFGN.jpeg" },
    { domain: "Blade", level: 6, name: "Rage Up", type: "Ability", cost: "1 Hope", description: "Before attack, mark Stress to gain bonus equal to twice Strength.", imageUrl: "https://i.imgur.com/2WR3UgD.jpeg" },
    { domain: "Blade", level: 7, name: "Blade-Touched", type: "Ability", cost: "1 Hope", description: "When 4+ Blade cards, gain +2 attack rolls and +4 Severe threshold.", imageUrl: "https://i.imgur.com/uR22jzh.jpeg" },
    { domain: "Blade", level: 7, name: "Glancing Blow", type: "Ability", cost: "1 Hope", description: "When attack fails, mark Stress to deal weapon damage using half Proficiency.", imageUrl: "https://i.imgur.com/PILhIxY.jpeg" },
    { domain: "Blade", level: 8, name: "Battle Cry", type: "Ability", cost: "2 Hope", description: "While charging, call lets allies clear Stress and gain Hope, gain advantage.", imageUrl: "https://i.imgur.com/EKqS9bN.jpeg" },
    { domain: "Blade", level: 8, name: "Frenzy", type: "Ability", cost: "3 Hope", description: "Go into Frenzy: can't use Armor Slots, gain +10 damage and +8 Severe threshold.", imageUrl: "https://i.imgur.com/bFoY2x4.jpeg" },
    { domain: "Blade", level: 9, name: "Gore and Glory", type: "Ability", cost: "2 Hope", description: "On critical success or defeating enemy, gain Hope or clear Stress.", imageUrl: "https://i.imgur.com/HcbZWsx.jpeg" },
    { domain: "Blade", level: 9, name: "Reaper's Strike", type: "Ability", cost: "3 Hope", description: "Spend Hope to force target to mark 5 Hit Points.", imageUrl: "https://i.imgur.com/GfJMJ3F.jpeg" },
    { domain: "Blade", level: 10, name: "Battle Monster", type: "Ability", cost: "0", description: "Mark 4 Stress to force target to mark HP equal to your marked HP.", imageUrl: "https://i.imgur.com/uWpS4QT.jpeg" },
    { domain: "Blade", level: 10, name: "Onslaught", type: "Ability", cost: "3 Hope", description: "Never deal damage below Major threshold (minimum 2 HP).", imageUrl: "https://i.imgur.com/vTxhyj4.jpeg" },

    // Bone
    { domain: "Bone", level: 1, name: "Deft Maneuvers", type: "Ability", cost: "0", description: "Mark Stress to sprint within Far range without roll. Gain +1 attack if ending in Melee. ", imageUrl: "https://i.imgur.com/fZWuwDe.jpeg" },
    { domain: "Bone", level: 1, name: "I See It Coming", type: "Ability", cost: "1 Hope", description: "When targeted by attack beyond Melee, mark Stress to roll d4 and add to Evasion.", imageUrl: "https://i.imgur.com/QuKa6JX.jpeg" },
    { domain: "Bone", level: 1, name: "Untouchable", type: "Ability", cost: "1 Hope", description: "Gain bonus to Evasion equal to half your Agility.", imageUrl: "https://i.imgur.com/HXgczBq.jpeg" },
    { domain: "Bone", level: 2, name: "Ferocity", type: "Ability", cost: "2 Hope", description: "When causing damage, spend 2 Hope to increase Evasion by HP marked.", imageUrl: "https://i.imgur.com/37uSUG3.jpeg" },
    { domain: "Bone", level: 2, name: "Strategic Approach", type: "Ability", cost: "1 Hope", description: "After rest, place tokens equal to Knowledge. Spend for advantage or d8 damage.", imageUrl: "https://i.imgur.com/r6EXr1L.jpeg" },
    { domain: "Bone", level: 3, name: "Brace", type: "Ability", cost: "1 Hope", description: "When marking Armor Slot, mark Stress to mark additional Armor Slot.", imageUrl: "https://i.imgur.com/zucNTf0.jpeg" },
    { domain: "Bone", level: 3, name: "Tactician", type: "Ability", cost: "1 Hope", description: "When Helping Ally, they can use your Experiences. Tag Team Roll with d20 as Hope.", imageUrl: "https://i.imgur.com/egbtWzh.jpeg" },
    { domain: "Bone", level: 4, name: "Boost", type: "Ability", cost: "1 Hope", description: "Mark Stress to boost off ally, perform aerial attack with advantage and d10 bonus.", imageUrl: "https://i.imgur.com/EKLuHvL.jpeg" },
    { domain: "Bone", level: 4, name: "Redirect", type: "Ability", cost: "1 Hope", description: "When attack beyond Melee fails, roll d6s to potentially redirect to adversary.", imageUrl: "https://i.imgur.com/I2PWEH8.jpeg" },
    { domain: "Bone", level: 5, name: "Know Thy Enemy", type: "Ability", cost: "1 Hope", description: "Make Instinct Roll against creature to learn HP, Difficulty, tactics, or features.", imageUrl: "https://i.imgur.com/YRH5Zl7.jpeg" },
    { domain: "Bone", level: 5, name: "Signature Move", type: "Ability", cost: "1 Hope", description: "Name signature move. When performing, roll d20 as Hope Die.", imageUrl: "https://i.imgur.com/eXTBg66.jpeg" },
    { domain: "Bone", level: 6, name: "Rapid Riposte", type: "Ability", cost: "0", description: "When Melee attack fails, mark Stress to deal weapon damage to attacker.", imageUrl: "https://i.imgur.com/7wuENHL.jpeg" },
    { domain: "Bone", level: 6, name: "Recovery", type: "Ability", cost: "1 Hope", description: "During short rest, choose long rest downtime move instead.", imageUrl: "https://i.imgur.com/va5WrzT.jpeg" },
    { domain: "Bone", level: 7, name: "Bone-Touched", type: "Ability", cost: "2 Hope", description: "When 4+ Bone cards, gain +1 Agility and can spend 3 Hope to negate attack.", imageUrl: "https://i.imgur.com/E34kjpb.jpeg" },
    { domain: "Bone", level: 7, name: "Cruel Precision", type: "Ability", cost: "1 Hope", description: "On successful weapon attack, gain bonus equal to Finesse or Agility.", imageUrl: "https://i.imgur.com/0AkyAUk.jpeg" },
    { domain: "Bone", level: 8, name: "Breaking Blow", type: "Ability", cost: "3 Hope", description: "On successful attack, next attack on same target deals extra 2d12 damage.", imageUrl: "https://i.imgur.com/XUbCrR0.jpeg" },
    { domain: "Bone", level: 8, name: "Wrangle", type: "Ability", cost: "1 Hope", description: "Make Agility Roll to move targets and allies to another point within range.", imageUrl: "https://i.imgur.com/cyKCPDx.jpeg" },
    { domain: "Bone", level: 9, name: "On The Brink", type: "Ability", cost: "1 Hope", description: "When you have 2 or fewer unmarked HP, you don't take Minor damage.", imageUrl: "https://i.imgur.com/3AZ2JTY.jpeg" },
    { domain: "Bone", level: 9, name: "Splintering Strike", type: "Ability", cost: "3 Hope", description: "Spend Hope to attack all adversaries within weapon range, redistribute damage.", imageUrl: "https://i.imgur.com/MUrOclE.jpeg" },
    { domain: "Bone", level: 10, name: "Deathrun", type: "Ability", cost: "1 Hope", description: "Spend 3 Hope to run straight path within Far range, attacking all adversaries.", imageUrl: "https://i.imgur.com/NER1Vn1.jpeg" },
    { domain: "Bone", level: 10, name: "Swift Step", type: "Ability", cost: "2 Hope", description: "When attack fails, clear Stress. If can't, gain Hope.", imageUrl: "https://i.imgur.com/jO70YWC.jpeg" },

    // Codex
    { domain: "Codex", level: 1, name: "Book of Ava", type: "Grimoire", cost: "2 Hope", description: "Contains Power Push, Tava's Armor, and Ice Spike spells.", imageUrl: "https://i.imgur.com/sSwW7RU.jpeg" },
    { domain: "Codex", level: 1, name: "Book of Illiat", type: "Grimoire", cost: "2 Hope", description: "Contains Slumber, Arcane Barrage, and Telepathy spells.", imageUrl: "https://i.imgur.com/ylFABS7.jpeg" },
    { domain: "Codex", level: 1, name: "Book of Tyfar", type: "Grimoire", cost: "2 Hope", description: "Contains Wild Flame, Magic Hand, and Mysterious Mist spells.", imageUrl: "https://i.imgur.com/Lgbjlbt.jpeg" },
    { domain: "Codex", level: 2, name: "Book of Sitil", type: "Grimoire", cost: "2 Hope", description: "Contains Adjust Appearance, Parallela, and Illusion spells.", imageUrl: "https://i.imgur.com/FqYI9hh.jpeg" },
    { domain: "Codex", level: 2, name: "Book of Vagras", type: "Grimoire", cost: "2 Hope", description: "Contains Runic Lock, Arcane Door, and Reveal spells.", imageUrl: "https://i.imgur.com/tu934HP.jpeg" },
    { domain: "Codex", level: 3, name: "Book of Korvax", type: "Grimoire", cost: "2 Hope", description: "Contains Levitation, Recant, and Rune Circle spells.", imageUrl: "https://i.imgur.com/y9cq1aP.jpeg" },
    { domain: "Codex", level: 3, name: "Book of Norai", type: "Grimoire", cost: "2 Hope", description: "Contains Mystic Tether and Fireball spells.", imageUrl: "https://i.imgur.com/UaPw193.jpeg" },
    { domain: "Codex", level: 4, name: "Book of Exota", type: "Grimoire", cost: "3 Hope", description: "Contains Repudiate and Create Construct spells.", imageUrl: "https://i.imgur.com/r8uGtNZ.jpeg" },
    { domain: "Codex", level: 4, name: "Book of Grynn", type: "Grimoire", cost: "2 Hope", description: "Contains Arcane Deflection, Time Lock, and Wall of Flame spells.", imageUrl: "https://i.imgur.com/nsQE6K7.jpeg" },
    { domain: "Codex", level: 5, name: "Manifest Wall", type: "Spell", cost: "2 Hope", description: "Create magical wall that blocks creatures and objects.", imageUrl: "https://i.imgur.com/wGpSIQw.jpeg" },
    { domain: "Codex", level: 5, name: "Teleport", type: "Spell", cost: "2 Hope", description: "Teleport yourself and willing targets to place you've been before.", imageUrl: "https://i.imgur.com/NmV1qxs.jpeg" },
    { domain: "Codex", level: 6, name: "Banish", type: "Spell", cost: "0", description: "Banish target from realm on failure of reaction roll.", imageUrl: "https://i.imgur.com/Jk2zJjF.jpeg" },
    { domain: "Codex", level: 6, name: "Sigil of Retribution", type: "Spell", cost: "2 Hope", description: "Mark adversary with sigil; accumulate dice to add to damage.", imageUrl: "https://i.imgur.com/FVS1Ygj.jpeg" },
    { domain: "Codex", level: 7, name: "Book of Homet", type: "Grimoire", cost: "0", description: "Contains Pass Through and Plane Gate spells.", imageUrl: "https://i.imgur.com/gMybzQA.jpeg" },
    { domain: "Codex", level: 7, name: "Codex-Touched", type: "Ability", cost: "2 Hope", description: "When 4+ Codex cards, mark Stress to add Proficiency to Spellcast Roll.", imageUrl: "https://i.imgur.com/NqyX4PN.jpeg" },
    { domain: "Codex", level: 8, name: "Book of Vyola", type: "Grimoire", cost: "2 Hope", description: "Contains Memory Delve and Shared Clarity spells.", imageUrl: "https://i.imgur.com/AvB1pzE.jpeg" },
    { domain: "Codex", level: 8, name: "Safe Haven", type: "Spell", cost: "3 Hope", description: "Summon interdimensional home with magical door.", imageUrl: "https://i.imgur.com/XEuA7nb.jpeg" },
    { domain: "Codex", level: 9, name: "Book of Ronin", type: "Grimoire", cost: "4 Hope", description: "Contains Transform and Eternal Enervation spells.", imageUrl: "https://i.imgur.com/ZdMitod.jpeg" },
    { domain: "Codex", level: 9, name: "Disintegration Wave", type: "Spell", cost: "4 Hope", description: "Kill adversaries within Far range with Difficulty 18 or lower.", imageUrl: "https://i.imgur.com/9ozkCK1.jpeg" },
    { domain: "Codex", level: 10, name: "Book of Yarrow", type: "Grimoire", cost: "2 Hope", description: "Contains Timejammer and Magic Immunity spells.", imageUrl: "https://i.imgur.com/2JTKLAI.jpeg" },
    { domain: "Codex", level: 10, name: "Transcendent Union", type: "Spell", cost: "1 Hope", description: "Link willing creatures so they can choose who marks Stress or HP.", imageUrl: "https://i.imgur.com/yeNRUCW.jpeg" },

    // Grace
    { domain: "Grace", level: 1, name: "Deft Deceiver", type: "Ability", cost: "0", description: "Spend Hope to gain advantage on roll to deceive or trick someone.", imageUrl: "https://i.imgur.com/fDrJvhi.jpeg" },
    { domain: "Grace", level: 1, name: "Enrapture", type: "Spell", cost: "0", description: "Enrapture target, fixing their attention on you.", imageUrl: "https://i.imgur.com/y4wVyhs.jpeg" },
    { domain: "Grace", level: 1, name: "Inspirational Words", type: "Ability", cost: "1 Hope", description: "After rest, place tokens equal to Presence to clear Stress/HP or give Hope.", imageUrl: "https://i.imgur.com/BDJiv4z.jpeg" },
    { domain: "Grace", level: 2, name: "Tell No Lies", type: "Spell", cost: "1 Hope", description: "Prevent target from lying while within Close range.", imageUrl: "https://i.imgur.com/R3JiO0w.jpeg" },
    { domain: "Grace", level: 2, name: "Troublemaker", type: "Ability", cost: "2 Hope", description: "When taunting target, roll d4s equal to Proficiency; target marks Stress.", imageUrl: "https://i.imgur.com/5ZMPKwW.jpeg" },
    { domain: "Grace", level: 3, name: "Hypnotic Shimmer", type: "Spell", cost: "1 Hope", description: "Stun all adversaries within Close range and force them to mark Stress.", imageUrl: "https://i.imgur.com/VygaPHN.jpeg" },
    { domain: "Grace", level: 3, name: "Invisibility", type: "Spell", cost: "1 Hope", description: "Make self or ally Invisible with tokens equal to Spellcast trait.", imageUrl: "https://i.imgur.com/F0jLAD0.jpeg" },
    { domain: "Grace", level: 4, name: "Soothing Speech", type: "Ability", cost: "1 Hope", description: "During rest, when comforting another, clear additional Hit Points.", imageUrl: "https://i.imgur.com/11sus6M.jpeg" },
    { domain: "Grace", level: 4, name: "Through Your Eyes", type: "Spell", cost: "1 Hope", description: "See and hear through target's senses until next rest.", imageUrl: "https://i.imgur.com/RmeHWZp.jpeg" },
    { domain: "Grace", level: 5, name: "Thought Delver", type: "Spell", cost: "2 Hope", description: "Read surface thoughts of target or delve deeper with Spellcast Roll.", imageUrl: "https://i.imgur.com/srN5wtT.jpeg" },
    { domain: "Grace", level: 5, name: "Words of Discord", type: "Spell", cost: "1 Hope", description: "Force target to attack another adversary.", imageUrl: "https://i.imgur.com/ZTIjmu4.jpeg" },
    { domain: "Grace", level: 6, name: "Never Upstaged", type: "Ability", cost: "2 Hope", description: "When marking HP from attack, place tokens to boost next damage.", imageUrl: "https://i.imgur.com/OpTKbNZ.jpeg" },
    { domain: "Grace", level: 6, name: "Share the Burden", type: "Spell", cost: "0", description: "Take on Stress from willing creature, gaining Hope for each.", imageUrl: "https://i.imgur.com/c3d8q9j.jpeg" },
    { domain: "Grace", level: 7, name: "Endless Charisma", type: "Ability", cost: "1 Hope", description: "After action roll to persuade/lie/garner favor, spend Hope to reroll die.", imageUrl: "https://i.imgur.com/hX0I20k.jpeg" },
    { domain: "Grace", level: 7, name: "Grace-Touched", type: "Ability", cost: "2 Hope", description: "When 4+ Grace cards, mark Armor Slot instead of Stress.", imageUrl: "https://i.imgur.com/UFKAtJ7.jpeg" },
    { domain: "Grace", level: 8, name: "Astral Projection", type: "Spell", cost: "0", description: "Create projected copy of yourself that can appear anywhere you've been.", imageUrl: "https://i.imgur.com/1fazSs6.jpeg" },
    { domain: "Grace", level: 8, name: "Mass Enrapture", type: "Spell", cost: "3 Hope", description: "Enrapture all targets within Far range.", imageUrl: "https://i.imgur.com/cP21Ubd.jpeg" },
    { domain: "Grace", level: 9, name: "Copycat", type: "Spell", cost: "3 Hope", description: "Mimic features of another domain card level 8 or lower in another player's loadout.", imageUrl: "https://i.imgur.com/grGP93k.jpeg" },
    { domain: "Grace", level: 9, name: "Master of the Craft", type: "Ability", cost: "0", description: "Gain permanent +2 bonus to two Experiences or +3 to one.", imageUrl: "https://i.imgur.com/KAPSUC9.jpeg" },
    { domain: "Grace", level: 10, name: "Encore", type: "Spell", cost: "1 Hope", description: "When ally deals damage, make Spellcast Roll to deal same damage.", imageUrl: "https://i.imgur.com/TEm6osJ.jpeg" },
    { domain: "Grace", level: 10, name: "Notorious", type: "Ability", cost: "0", description: "Mark Stress before roll to gain +10 when leveraging notoriety.", imageUrl: "https://i.imgur.com/ntrYuqN.jpeg" },

    // Midnight
    { domain: "Midnight", level: 1, name: "Pick and Pull", type: "Ability", cost: "0", description: "Advantage on rolls to pick locks, disarm traps, or steal items.", imageUrl: "https://i.imgur.com/GkXnO0B.jpeg" },
    { domain: "Midnight", level: 1, name: "Rain of Blades", type: "Spell", cost: "1 Hope", description: "Conjure throwing blades striking all targets within Very Close for d8+2 damage.", imageUrl: "https://i.imgur.com/tQSXrew.jpeg" },
    { domain: "Midnight", level: 1, name: "Uncanny Disguise", type: "Spell", cost: "0", description: "Don facade of any humanoid with advantage on Presence Rolls.", imageUrl: "https://i.imgur.com/6nvksVr.jpeg" },
    { domain: "Midnight", level: 2, name: "Midnight Spirit", type: "Spell", cost: "1 Hope", description: "Summon spirit to move or carry things until next rest.", imageUrl: "https://i.imgur.com/VrWc7YO.jpeg" },
    { domain: "Midnight", level: 2, name: "Shadowbind", type: "Spell", cost: "0", description: "Temporarily Restrain all adversaries within Very Close range.", imageUrl: "https://i.imgur.com/NFPE4PI.jpeg" },
    { domain: "Midnight", level: 3, name: "Chokehold", type: "Ability", cost: "1 Hope", description: "Pull target behind you into chokehold, making them Vulnerable.", imageUrl: "https://i.imgur.com/VpFTg0J.jpeg" },
    { domain: "Midnight", level: 3, name: "Veil of Night", type: "Spell", cost: "1 Hope", description: "Create curtain of darkness. You are Hidden with advantage on attacks.", imageUrl: "https://i.imgur.com/pIOV0bI.jpeg" },
    { domain: "Midnight", level: 4, name: "Stealth Expertise", type: "Ability", cost: "0", description: "When rolling with Fear to move unnoticed, mark Stress to roll with Hope.", imageUrl: "https://i.imgur.com/lRNqFTl.jpeg" },
    { domain: "Midnight", level: 4, name: "Glyph of Nightfall", type: "Spell", cost: "1 Hope", description: "Conjure glyph reducing target's Difficulty by Knowledge.", imageUrl: "https://i.imgur.com/wlapaQE.jpeg" },
    { domain: "Midnight", level: 5, name: "Hush", type: "Spell", cost: "1 Hope", description: "Silence target and area within Very Close range.", imageUrl: "https://i.imgur.com/Rf7LTIH.jpeg" },
    { domain: "Midnight", level: 5, name: "Phantom Retreat", type: "Spell", cost: "2 Hope", description: "Activate at location to teleport back later.", imageUrl: "https://i.imgur.com/Ua4Vuk3.jpeg" },
    { domain: "Midnight", level: 6, name: "Dark Whispers", type: "Spell", cost: "0", description: "Speak into mind of person you touched. Ask GM questions about them.", imageUrl: "https://i.imgur.com/kr1oONI.jpeg" },
    { domain: "Midnight", level: 6, name: "Mass Disguise", type: "Spell", cost: "0", description: "Change appearance of all willing creatures within Close range.", imageUrl: "https://i.imgur.com/m0O0ykH.jpeg" },
    { domain: "Midnight", level: 7, name: "Midnight-Touched", type: "Ability", cost: "2 Hope", description: "When 4+ Midnight cards, gain Hope instead of GM Fear once per rest.", imageUrl: "https://i.imgur.com/UX8WXiv.jpeg" },
    { domain: "Midnight", level: 7, name: "Vanishing Dodge", type: "Spell", cost: "1 Hope", description: "When physical attack fails, become Hidden and teleport within Close range.", imageUrl: "https://i.imgur.com/6tpzYDp.jpeg" },
    { domain: "Midnight", level: 8, name: "Shadowhunter", type: "Ability", cost: "2 Hope", description: "In low light/darkness, gain +1 Evasion and advantage on attack rolls.", imageUrl: "https://i.imgur.com/eB3L4vA.jpeg" },
    { domain: "Midnight", level: 8, name: "Spellcharge", type: "Spell", cost: "1 Hope", description: "When taking magic damage, place tokens to add d6s to next damage roll.", imageUrl: "https://i.imgur.com/I2X6P2u.jpeg" },
    { domain: "Midnight", level: 9, name: "Night Terror", type: "Spell", cost: "2 Hope", description: "Targets perceive you as nightmarish horror, become Horrified and Vulnerable.", imageUrl: "https://i.imgur.com/YVjV9i0.jpeg" },
    { domain: "Midnight", level: 9, name: "Twilight Toll", type: "Ability", cost: "1 Hope", description: "Choose target. On successful rolls, place tokens to add d12s to damage.", imageUrl: "https://i.imgur.com/eYn04Fz.jpeg" },
    { domain: "Midnight", level: 10, name: "Eclipse", type: "Spell", cost: "2 Hope", description: "Plunge area into darkness only you and allies can see through.", imageUrl: "https://i.imgur.com/x49LwGZ.jpeg" },
    { domain: "Midnight", level: 10, name: "Specter of the Dark", type: "Spell", cost: "1 Hope", description: "Become Spectral: immune to physical damage, pass through objects.", imageUrl: "https://i.imgur.com/yJIR57N.jpeg" },

    // Sage
    { domain: "Sage", level: 1, name: "Gifted Tracker", type: "Ability", cost: "0", description: "When tracking creatures, spend Hope to ask GM questions. Gain +1 Evasion vs tracked.", imageUrl: "https://i.imgur.com/mUf8kLh.jpeg" },
    { domain: "Sage", level: 1, name: "Nature's Tongue", type: "Ability", cost: "0", description: "Speak language of natural world. Get info from plants and animals.", imageUrl: "https://i.imgur.com/g6Pr6Ng.jpeg" },
    { domain: "Sage", level: 1, name: "Vicious Entangle", type: "Spell", cost: "1 Hope", description: "Deal 1d8+1 physical damage and temporarily Restrain target.", imageUrl: "https://i.imgur.com/jM39SAs.jpeg" },
    { domain: "Sage", level: 2, name: "Conjure Swarm", type: "Spell", cost: "1 Hope", description: "Conjure armored beetles to reduce damage or fireflies to deal 2d8+3 damage.", imageUrl: "https://i.imgur.com/8N62VjF.jpeg" },
    { domain: "Sage", level: 2, name: "Natural Familiar", type: "Spell", cost: "1 Hope", description: "Summon small nature spirit or forest critter until next rest.", imageUrl: "https://i.imgur.com/G35I8H0.jpeg" },
    { domain: "Sage", level: 3, name: "Corrosive Projectile", type: "Spell", cost: "1 Hope", description: "Deal d6+4 magic damage and mark target Corroded, reducing Difficulty.", imageUrl: "https://i.imgur.com/h5O0Lbe.jpeg" },
    { domain: "Sage", level: 3, name: "Towering Stalk", type: "Spell", cost: "1 Hope", description: "Conjure climbable stalk up to Far range. Attack to drop targets.", imageUrl: "https://i.imgur.com/YgLid3g.jpeg" },
    { domain: "Sage", level: 4, name: "Death Grip", type: "Spell", cost: "1 Hope", description: "Pull target or self into Melee range, constrict for 2 Stress.", imageUrl: "https://i.imgur.com/mOaKRE3.jpeg" },
    { domain: "Sage", level: 4, name: "Healing Field", type: "Spell", cost: "2 Hope", description: "Conjure healing plants in Close range to clear Hit Points.", imageUrl: "https://i.imgur.com/pA8u87J.jpeg" },
    { domain: "Sage", level: 5, name: "Thorn Skin", type: "Spell", cost: "1 Hope", description: "Sprout thorns. Spend tokens to reduce damage and deal damage back.", imageUrl: "https://i.imgur.com/B70qC1e.jpeg" },
    { domain: "Sage", level: 5, name: "Wild Fortress", type: "Spell", cost: "1 Hope", description: "Grow natural dome for cover with thresholds 15/30.", imageUrl: "https://i.imgur.com/W29F1Yd.jpeg" },
    { domain: "Sage", level: 6, name: "Conjured Steeds", type: "Spell", cost: "0", description: "Conjure magical steeds that double land speed.", imageUrl: "https://i.imgur.com/Bf0NExD.jpeg" },
    { domain: "Sage", level: 6, name: "Forager", type: "Ability", cost: "1 Hope", description: "Additional downtime move to forage random consumable.", imageUrl: "https://i.imgur.com/0vKAnXN.jpeg" },
    { domain: "Sage", level: 7, name: "Sage-Touched", type: "Ability", cost: "2 Hope", description: "When 4+ Sage cards, gain +2 Spellcast in natural environment.", imageUrl: "https://i.imgur.com/oXfP04G.jpeg" },
    { domain: "Sage", level: 7, name: "Wild Surge", type: "Spell", cost: "2 Hope", description: "Mark Stress to channel nature, gain d6 bonus increasing until rest.", imageUrl: "https://i.imgur.com/fO2F19E.jpeg" },
    { domain: "Sage", level: 8, name: "Forest Sprites", type: "Spell", cost: "2 Hope", description: "Create sprites that grant bonuses to allies' attacks and armor.", imageUrl: "https://i.imgur.com/S8WfU8n.jpeg" },
    { domain: "Sage", level: 8, name: "Rejuvenation Barrier", type: "Spell", cost: "1 Hope", description: "Create barrier that clears Hit Points and grants resistance.", imageUrl: "https://i.imgur.com/p51lO0Y.jpeg" },
    { domain: "Sage", level: 9, name: "Fane of the Wilds", type: "Ability", cost: "2 Hope", description: "After rest, place tokens equal to Sage cards to boost Spellcast Rolls.", imageUrl: "https://i.imgur.com/X4yD14A.jpeg" },
    { domain: "Sage", level: 9, name: "Plant Dominion", type: "Spell", cost: "1 Hope", description: "Reshape plant life within Far range.", imageUrl: "https://i.imgur.com/00lO0T8.jpeg" },
    { domain: "Sage", level: 10, name: "Force of Nature", type: "Spell", cost: "2 Hope", description: "Transform into nature spirit with bonuses to damage and armor.", imageUrl: "https://i.imgur.com/1sdlin9.jpeg" },
    { domain: "Sage", level: 10, name: "Tempest", type: "Spell", cost: "2 Hope", description: "Unleash Blizzard, Hurricane, or Sandstorm on all targets within Far range.", imageUrl: "https://i.imgur.com/8Qj8v5Q.jpeg" },

    // Splendor
    { domain: "Splendor", level: 1, name: "Bolt Beacon", type: "Spell", cost: "1 Hope", description: "Send bolt dealing d8+2 magic damage and making target Vulnerable.", imageUrl: "https://i.imgur.com/sYVAnuQ.jpeg" },
    { domain: "Splendor", level: 1, name: "Mending Touch", type: "Spell", cost: "1 Hope", description: "Spend 2 Hope to clear Hit Point or Stress on a creature.", imageUrl: "https://i.imgur.com/s6WpW8A.jpeg" },
    { domain: "Splendor", level: 1, name: "Reassurance", type: "Ability", cost: "0", description: "After ally attempts roll but before consequences, let them reroll.", imageUrl: "https://i.imgur.com/0y3m8B1.jpeg" },
    { domain: "Splendor", level: 2, name: "Final Words", type: "Spell", cost: "1 Hope", description: "Infuse corpse with moment of life to answer questions truthfully.", imageUrl: "https://i.imgur.com/Wf1H1XU.jpeg" },
    { domain: "Splendor", level: 2, name: "Healing Hands", type: "Spell", cost: "1 Hope", description: "Clear 2 Hit Points or Stress on target within Melee range.", imageUrl: "https://i.imgur.com/M6LgV0Q.jpeg" },
    { domain: "Splendor", level: 3, name: "Second Wind", type: "Ability", cost: "2 Hope", description: "On successful attack, clear 3 Stress or Hit Point on self and allies.", imageUrl: "https://i.imgur.com/tHqgU81.jpeg" },
    { domain: "Splendor", level: 3, name: "Voice of Reason", type: "Ability", cost: "1 Hope", description: "Advantage on rolls to de-escalate. Gain +1 Proficiency when all Stress marked.", imageUrl: "https://i.imgur.com/R38w6C3.jpeg" },
    { domain: "Splendor", level: 4, name: "Divination", type: "Spell", cost: "1 Hope", description: "Spend 3 Hope to ask yes/no question about near future.", imageUrl: "https://i.imgur.com/rN5nO8z.jpeg" },
    { domain: "Splendor", level: 4, name: "Life Ward", type: "Spell", cost: "1 Hope", description: "Spend 3 Hope to mark ally with protection that saves from death move.", imageUrl: "https://i.imgur.com/O6SREn8.jpeg" },
    { domain: "Splendor", level: 5, name: "Shape Material", type: "Spell", cost: "1 Hope", description: "Spend Hope to shape natural material within Close range.", imageUrl: "https://i.imgur.com/lHnF80R.jpeg" },
    { domain: "Splendor", level: 5, name: "Smite", type: "Spell", cost: "2 Hope", description: "Spend 3 Hope to double damage on next weapon attack as magic damage.", imageUrl: "https://i.imgur.com/7vY5r0h.jpeg" },
    { domain: "Splendor", level: 6, name: "Restoration", type: "Spell", cost: "2 Hope", description: "After rest, place tokens to clear Hit Points/Stress or heal ailments.", imageUrl: "https://i.imgur.com/yFqC2T7.jpeg" },
    { domain: "Splendor", level: 6, name: "Zone of Protection", type: "Spell", cost: "2 Hope", description: "Create zone that reduces damage by d6 value, increasing until effect ends.", imageUrl: "https://i.imgur.com/02fTf4N.jpeg" },
    { domain: "Splendor", level: 7, name: "Healing Strike", type: "Spell", cost: "1 Hope", description: "When dealing damage, spend 2 Hope to clear Hit Point on ally.", imageUrl: "https://i.imgur.com/PAnS5fB.jpeg" },
    { domain: "Splendor", level: 7, name: "Splendor-Touched", type: "Ability", cost: "2 Hope", description: "When 4+ Splendor cards, gain +3 Severe threshold.", imageUrl: "https://i.imgur.com/tP08w8Y.jpeg" },
    { domain: "Splendor", level: 8, name: "Shield Aura", type: "Spell", cost: "2 Hope", description: "Cast protective aura on target, reducing attack severity by additional threshold.", imageUrl: "https://i.imgur.com/839YQnF.jpeg" },
    { domain: "Splendor", level: 8, name: "Stunning Sunlight", type: "Spell", cost: "2 Hope", description: "Unleash rays dealing 3d20+3 or 4d20+5 magic damage and Stun targets.", imageUrl: "https://i.imgur.com/eEBe6oQ.jpeg" },
    { domain: "Splendor", level: 9, name: "Overwhelming Aura", type: "Spell", cost: "2 Hope", description: "Empower aura, make Presence equal Spellcast, force adversaries to mark Stress.", imageUrl: "https://i.imgur.com/WOnR12K.jpeg" },
    { domain: "Splendor", level: 9, name: "Salvation Beam", type: "Spell", cost: "2 Hope", description: "Target line of allies, clearing Hit Points equal to Stress marked.", imageUrl: "https://i.imgur.com/Pclk0BC.jpeg" },
    { domain: "Splendor", level: 10, name: "Invigoration", type: "Spell", cost: "3 Hope", description: "Spend Hope and roll d6s to refresh features with exhaustion limits.", imageUrl: "https://i.imgur.com/2YjV7mJ.jpeg" },
    { domain: "Splendor", level: 10, name: "Resurrection", type: "Spell", cost: "2 Hope", description: "Restore creature dead no longer than 100 years to full strength.", imageUrl: "https://i.imgur.com/5u9yIge.jpeg" },

    // Valor
    { domain: "Valor", level: 1, name: "Bare Bones", type: "Ability", cost: "0", description: "When not equipping armor, base Armor Score is 3 + Strength.", imageUrl: "https://i.imgur.com/vtU4MW0.jpeg" },
    { domain: "Valor", level: 1, name: "Forceful Push", type: "Ability", cost: "0", description: "Attack with primary weapon to knock target back to Close range.", imageUrl: "https://i.imgur.com/K389vYI.jpeg" },
    { domain: "Valor", level: 1, name: "I Am Your Shield", type: "Ability", cost: "1 Hope", description: "When ally within Very Close would take damage, mark Stress to take instead.", imageUrl: "https://i.imgur.com/9Vcv9BX.jpeg" },
    { domain: "Valor", level: 2, name: "Body Basher", type: "Ability", cost: "1 Hope", description: "On successful Melee attack, gain bonus to damage equal to Strength.", imageUrl: "https://i.imgur.com/lm1zuLj.jpeg" },
    { domain: "Valor", level: 2, name: "Bold Presence", type: "Ability", cost: "0", description: "Spend Hope to add Strength to Presence Roll. Avoid condition once per rest.", imageUrl: "https://i.imgur.com/cTs77ix.jpeg" },
    { domain: "Valor", level: 3, name: "Critical Inspiration", type: "Ability", cost: "1 Hope", description: "On critical success, all allies within Very Close clear Stress or gain Hope.", imageUrl: "https://i.imgur.com/UXqU1SE.jpeg" },
    { domain: "Valor", level: 3, name: "Lean On Me", type: "Ability", cost: "1 Hope", description: "When consoling ally who failed roll, both clear 2 Stress.", imageUrl: "https://i.imgur.com/H6ZOCQ3.jpeg" },
    { domain: "Valor", level: 4, name: "Goad Them On", type: "Ability", cost: "1 Hope", description: "Taunt target. On success, target marks Stress and must target you.", imageUrl: "https://i.imgur.com/RrGDqsg.jpeg" },
    { domain: "Valor", level: 4, name: "Support Tank", type: "Ability", cost: "2 Hope", description: "When ally fails roll, spend 2 Hope to let them reroll Hope or Fear Die.", imageUrl: "https://i.imgur.com/aC5fAGr.jpeg" },
    { domain: "Valor", level: 5, name: "Armorer", type: "Ability", cost: "1 Hope", description: "While wearing armor, gain +1 Armor Score. Allies clear Armor Slot on rest.", imageUrl: "https://i.imgur.com/VZHVQul.jpeg" },
    { domain: "Valor", level: 5, name: "Rousing Strike", type: "Ability", cost: "1 Hope", description: "On critical success, you and allies clear Hit Point or 1d4 Stress.", imageUrl: "https://i.imgur.com/NnfYmok.jpeg" },
    { domain: "Valor", level: 6, name: "Inevitable", type: "Ability", cost: "1 Hope", description: "When you fail action roll, your next action roll has advantage.", imageUrl: "https://i.imgur.com/WOu4BYw.jpeg" },
    { domain: "Valor", level: 6, name: "Rise Up", type: "Ability", cost: "2 Hope", description: "Gain bonus to Severe threshold equal to Proficiency. Clear Stress when marking HP. ", imageUrl: "https://i.imgur.com/f04Tj97.jpeg" },
    { domain: "Valor", level: 7, name: "Shrug It Off", type: "Ability", cost: "1 Hope", description: "Mark Stress to reduce damage severity by one threshold.", imageUrl: "https://i.imgur.com/jG9fSAt.jpeg" },
    { domain: "Valor", level: 7, name: "Valor-Touched", type: "Ability", cost: "1 Hope", description: "When 4+ Valor cards, gain +1 Armor Score.", imageUrl: "https://i.imgur.com/Y36Wz65.jpeg" },
    { domain: "Valor", level: 8, name: "Full Surge", type: "Ability", cost: "1 Hope", description: "Mark 3 Stress to gain +2 bonus to all traits until next rest.", imageUrl: "https://i.imgur.com/0uBv6nE.jpeg" },
    { domain: "Valor", level: 8, name: "Ground Pound", type: "Ability", cost: "2 Hope", description: "Spend 2 Hope to throw targets back dealing 4d10+8 damage.", imageUrl: "https://i.imgur.com/7w377vQ.jpeg" },
    { domain: "Valor", level: 9, name: "Hold The Line", type: "Ability", cost: "1 Hope", description: "Take defensive stance. Adversaries moving within Very Close are pulled and Restrained.", imageUrl: "https://i.imgur.com/Tst66U3.jpeg" },
    { domain: "Valor", level: 9, name: "Lead By Example", type: "Ability", cost: "3 Hope", description: "When dealing damage, mark Stress to let next PC clear Stress or gain Hope.", imageUrl: "https://i.imgur.com/lO3u24o.jpeg" },
    { domain: "Valor", level: 10, name: "Unbreakable", type: "Ability", cost: "4 Hope", description: "When marking last Hit Point, roll d6 and clear that many HP instead of death move.", imageUrl: "https://i.imgur.com/T3uMoyk.jpeg" },
    { domain: "Valor", level: 10, name: "Unyielding Armor", type: "Ability", cost: "1 Hope", description: "When marking Armor Slot, roll d6s to potentially reduce severity without marking.", imageUrl: "https://i.imgur.com/FwW7DqI.jpeg" }
];

export const WEAPON_RANGES = ["Melee", "Very Close", "Close", "Far", "Very Far"];

export const DAGGERHEART_RULES = {
  classes: [
    { name: "Bard", subclasses: ["Wordsmith", "Troubadour"] },
    { name: "Druid", subclasses: ["Warden of the Elements", "Warden of the Wilds"] },
    { name: "Guardian", subclasses: ["Stalwart", "Vengeance"] },
    { name: "Ranger", subclasses: ["Wayfinder", "Beastbound"] },
    { name: "Rogue", subclasses: ["Syndicate", "Nightwalker"] },
    { name: "Seraph", subclasses: ["Divine Wielder", "Winged Sentinel"] },
    { name: "Sorcerer", subclasses: ["Elemental Origin", "Primal Origin"] },
    { name: "Warrior", subclasses: ["Slayer", "Knight"] },
    { name: "Wizard", subclasses: ["School of War", "School of Knowledge"] }
  ],
  ancestries: [
    "Clank", "Dwarf", "Elf", "Faerie", "Fungril", "Galapa", "Giant", 
    "Goblin", "Halfling", "Human", "Katari", "Orc", "Ribbet", "Simiah"
  ],
  communities: [
    "Highborne", "Loreborne", "Orderborne", "Ridgeborne", "Seaborne", 
    "Slyborne", "Underborne", "Wanderborne", "Wildborne"
  ],
  domains: [
    "Arcana", "Blade", "Bone", "Codex", "Grace", "Midnight", "Sage", "Splendor", "Valor"
  ],
  standardWeapons: [
    { name: "Greatsword", damage: "d10+2", trait: "Strength", type: "Physical", range: "Melee", desc: "Heavy two-handed blade." },
    { name: "Battleaxe", damage: "d10+2", trait: "Strength", type: "Physical", range: "Melee", desc: "Devastating swings." },
    { name: "Longsword", damage: "d8", trait: "Strength", type: "Physical", range: "Melee", desc: "Versatile and reliable." },
    { name: "Shortsword", damage: "d8", trait: "Agility", type: "Physical", range: "Melee", desc: "Quick strikes." },
    { name: "Dagger", damage: "d6", trait: "Finesse", type: "Physical", range: "Close", desc: "Precision work." },
    { name: "Rapier", damage: "d8", trait: "Finesse", type: "Physical", range: "Melee", desc: "Elegant thrusts." },
    { name: "Longbow", damage: "d8", trait: "Agility", type: "Physical", range: "Far", desc: "Ranged dominance." },
    { name: "Crossbow", damage: "d10", trait: "Agility", type: "Physical", range: "Far", desc: "Heavy projectile." },
    { name: "Staff", damage: "d6", trait: "Knowledge", type: "Magic", range: "Melee", desc: "Arcane focus." },
    { name: "Wand", damage: "d8", trait: "Presence", type: "Magic", range: "Far", desc: "Blast of magic." },
    { name: "Scepter", damage: "d8", trait: "Instinct", type: "Magic", range: "Melee", desc: "Channeling power." }
  ]
};

export const INITIAL_CHARACTER: CharacterProfile = {
  name: "Kaelen Thorne",
  class: "Warrior",
  subclass: "Slayer",
  level: 2,
  ancestry: "Human",
  community: "Highborne",
  traits: [
    { name: TraitType.Agility, value: 1, description: "Sprint, Leap, Maneuver" },
    { name: TraitType.Strength, value: 2, description: "Lift, Smash, Grapple" },
    { name: TraitType.Finesse, value: 0, description: "Notice, Aim, Hide" },
    { name: TraitType.Instinct, value: 0, description: "Sense, React, Navigate" },
    { name: TraitType.Presence, value: -1, description: "Charm, Perform, Command" },
    { name: TraitType.Knowledge, value: 1, description: "Recall, Analyze, Heal" },
  ],
  evasion: 8,
  armor: 1,
  maxArmor: 3,
  hp: 0, // 0 damage taken
  maxHp: 6,
  minorThreshold: 5,
  majorThreshold: 10,
  severeThreshold: 15,
  stress: 2,
  maxStress: 6,
  hope: 2,
  maxHope: 5,
  gold: 15,
  weapons: [
    {
      id: "w1",
      name: "Greatsword",
      type: "Physical",
      damage: "d10+2",
      range: "Melee",
      trait: TraitType.Strength,
      description: "A massive blade of folded steel. Deals heavy damage but requires two hands."
    },
    {
      id: "w2",
      name: "Throwing Daggers",
      type: "Physical",
      damage: "d6",
      range: "Far",
      trait: TraitType.Agility,
      description: "Balanced blades hidden in a belt sash."
    }
  ],

abilities: [
    {
      id: "a1",
      name: "Reckless", // Changed from "Battlefield Commander" to a real Blade card
      domain: "Blade",
      level: 1, // Matches the level in ALL_DOMAIN_CARDS
      cost: "1 Hope",
      description: "Mark Stress to gain advantage on attack.",
      active: true,
      isPreset: true,
      imageUrl: "https://i.imgur.com/FfMALaw.jpeg" // Added specific Image URL
    },
    {
      id: "a2",
      name: "Whirlwind",
      domain: "Blade", // Changed from "Bone" to "Blade" (where it actually belongs)
      level: 1,        // Changed from 2 to 1 (to match the real card)
      cost: "0",       // Updated cost
      description: "On successful attack, spend Hope to attack all targets within Very Close range for half damage.",
      active: true,
      isPreset: true,
      imageUrl: "https://i.imgur.com/es3zmgT.jpeg" // Added specific Image URL
    }
  ],

  experiences: [
    {
      id: "e1",
      name: "Veteran of the Ashen War",
      value: 2,
      description: "You served on the front lines against the shadow beasts."
    },
    {
      id: "e2",
      name: "Noble Etiquette",
      value: 1,
      description: "You know how to speak to those in power."
    }
  ],
  inventory: [
    "Healing Potion (Minor)",
    "Rope (50ft)",
    "Torch x3",
    "Travel Rations"
  ]
};

export const BLANK_CHARACTER: CharacterProfile = {
  name: "New Hero",
  class: "Warrior",
  subclass: "Slayer",
  level: 1,
  ancestry: "Human",
  community: "Wildborne",
  traits: [
    { name: TraitType.Agility, value: 0, description: "Sprint, Leap, Maneuver" },
    { name: TraitType.Strength, value: 0, description: "Lift, Smash, Grapple" },
    { name: TraitType.Finesse, value: 0, description: "Notice, Aim, Hide" },
    { name: TraitType.Instinct, value: 0, description: "Sense, React, Navigate" },
    { name: TraitType.Presence, value: 0, description: "Charm, Perform, Command" },
    { name: TraitType.Knowledge, value: 0, description: "Recall, Analyze, Heal" },
  ],
  evasion: 10,
  armor: 0,
  maxArmor: 3,
  hp: 0,
  maxHp: 6,
  minorThreshold: 5,
  majorThreshold: 10,
  severeThreshold: 15,
  stress: 0,
  maxStress: 5,
  hope: 0,
  maxHope: 2,
  gold: 0,
  weapons: [],
  abilities: [],
  experiences: [],
  inventory: []
};