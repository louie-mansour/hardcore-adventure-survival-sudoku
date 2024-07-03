class Effect {
  type: 'Effect'
  name: EffectName
  emoji: EffectEmoji
  description: string

  static factory(effectName: EffectName) {
    switch (effectName) {
      case EffectName.Fire:
        return new Effect(EffectName.Fire, EffectEmoji.Fire, 'Burns your numbers to ashes')
      case EffectName.Turtle:
        return new Effect(EffectName.Turtle, EffectEmoji.Turtle, 'Can only move one square at a time')
      case EffectName.Volcano:
        return new Effect(EffectName.Volcano, EffectEmoji.Volcano, 'Shakes the board')
      case EffectName.Darkness:
        return new Effect(EffectName.Darkness, EffectEmoji.Darkness, 'Makes it hard to see')
      case EffectName.Mirror:
        return new Effect(EffectName.Mirror, EffectEmoji.Mirror, 'Flips the numbers')
      case EffectName.Rat:
        return new Effect(EffectName.Rat, EffectEmoji.Rat, 'Get in the way of the numbers')
      case EffectName.Dizzy:
        return new Effect(EffectName.Dizzy, EffectEmoji.Dizzy, 'Slowly rotates the board')
      case EffectName.Dagger:
        return new Effect(EffectName.Dagger, EffectEmoji.Dagger, 'Fill any square with the correct value')
    }
  }

  private constructor(
    name: EffectName,
    emoji: EffectEmoji,
    description: string,
  ) {
    this.type = 'Effect'
    this.name = name
    this.emoji = emoji
    this.description = description
  }
}

export enum EffectName {
  Fire = 'Fire',
  Turtle = 'Turtle',
  Volcano = 'Volcano',
  Darkness = 'Darkness',
  Mirror = 'Mirror',
  Rat = 'Rat',
  Dizzy = 'Dizzy',
  Dagger = 'Dagger',
}


export enum EffectEmoji {
  Fire = '🔥',
  Turtle = '🐢',
  Volcano = '🌋',
  Darkness = '🔦',
  Mirror = '🪞',
  Rat = '🐀',
  Dizzy = '😵‍💫',
  Dagger = '🗡️',
}