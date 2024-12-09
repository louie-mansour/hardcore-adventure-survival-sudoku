export class NegativeEffect {
  type: 'Effect'
  name: NegativeEffectName
  emoji: NegativeEffectEmoji
  description: string
  isActive: boolean

  static factory(effectName: NegativeEffectName): NegativeEffect {
    switch (effectName) {
      case NegativeEffectName.Fire:
        return new NegativeEffect(NegativeEffectName.Fire, NegativeEffectEmoji.Fire, 'Burns your numbers to ashes')
      case NegativeEffectName.Turtle:
        return new NegativeEffect(NegativeEffectName.Turtle, NegativeEffectEmoji.Turtle, 'Can only move one square at a time')
      case NegativeEffectName.Volcano:
        return new NegativeEffect(NegativeEffectName.Volcano, NegativeEffectEmoji.Volcano, 'Shakes the board')
      case NegativeEffectName.Darkness:
        return new NegativeEffect(NegativeEffectName.Darkness, NegativeEffectEmoji.Darkness, 'Makes it hard to see')
      case NegativeEffectName.Mirror:
        return new NegativeEffect(NegativeEffectName.Mirror, NegativeEffectEmoji.Mirror, 'Flips the numbers')
      case NegativeEffectName.Rat:
        return new NegativeEffect(NegativeEffectName.Rat, NegativeEffectEmoji.Rat, 'Get in the way of the numbers')
      case NegativeEffectName.Dizzy:
        return new NegativeEffect(NegativeEffectName.Dizzy, NegativeEffectEmoji.Dizzy, 'Slowly rotates the board')
      case NegativeEffectName.Dagger:
        return new NegativeEffect(NegativeEffectName.Dagger, NegativeEffectEmoji.Dagger, 'Takes away a heart')
      case NegativeEffectName.PlaceHolder:
        return new NegativeEffect(NegativeEffectName.PlaceHolder, NegativeEffectEmoji.Placeholder, 'Not a real effect, this is a placeholder')
    }
  }

  activate() {
    this.isActive = true
  }

  deactiveate() {
    this.isActive = false
  }

  private constructor(
    name: NegativeEffectName,
    emoji: NegativeEffectEmoji,
    description: string,
  ) {
    this.type = 'Effect'
    this.name = name
    this.emoji = emoji
    this.description = description
    this.isActive = false
  }
}

export enum NegativeEffectName {
  Fire = 'Fire',
  // ExtinguishingSpraySmall = 'ExtinguishingSpraySmall',
  // ExtinguishingSprayMedium = 'ExtinguishingSprayMedium',
  // ExtinguishingSprayLarge = 'ExtinguishingSprayLarge',
  // ExtinguishingSpray = 'ExtinguishingSpray',
  // Coal = 'Coal',
  Turtle = 'Turtle',
  Volcano = 'Volcano',
  Darkness = 'Darkness',
  Mirror = 'Mirror',
  Rat = 'Rat',
  Dizzy = 'Dizzy',
  Dagger = 'Dagger',
  PlaceHolder = 'PlaceHolder',
}


export enum NegativeEffectEmoji {
  Fire = '🔥',
  ExtinguishingSpraySmall = '▫️',
  ExtinguishingSprayMedium = '◻️',
  ExtinguishingSprayLarge = '⬜',
  ExtinguishingSpray = '💨',
  Coal = '🪨',
  Turtle = '🐢',
  Volcano = '🌋',
  Darkness = '🌑',
  Mirror = '🪞',
  Rat = '🐀',
  Dizzy = '😵‍💫',
  Dagger = '🗡️',
  Placeholder = '⬜',
}