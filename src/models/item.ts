class Item {
  type: 'Item'
  name: ItemName
  emoji: ItemEmoji
  description: string
  numberOfUses: number | null

  static factory(itemName: ItemName) {
    switch (itemName) {
      case ItemName.Delete:
        return new Item(ItemName.Delete, ItemEmoji.Delete, 'Remove a number from a square', null)
      case ItemName.Note:
        return new Item(ItemName.Note, ItemEmoji.Note, 'Jot down possible values in a square', null)
      case ItemName.MagnifyingGlass:
        return new Item(ItemName.MagnifyingGlass, ItemEmoji.MagnifyingGlass, 'Get a hint. Or reveal the value of a hint', null)
      case ItemName.BabyBottle:
        return new Item(ItemName.BabyBottle, ItemEmoji.BabyBottle, 'Get a hint. Or reveal the value of a hint', null)
      case ItemName.Surrender:
        return new Item(ItemName.Surrender, ItemEmoji.Surrender, 'Give up. Reveal the solution', null)
      case ItemName.FireExtinguisher:
        return new Item(ItemName.FireExtinguisher, ItemEmoji.FireExtinguisher, 'Put ouf fires', null)
      case ItemName.Shield:
        return new Item(ItemName.Shield, ItemEmoji.Shield, 'Protect against mistakes', 1)
      case ItemName.MagicWand:
        return new Item(ItemName.MagicWand, ItemEmoji.MagicWand, 'Fill any square with the correct value', 1)
      case ItemName.CrystalBall:
        return new Item(ItemName.CrystalBall, ItemEmoji.CrystalBall, 'Get hints for the next few moves', 5)
      case ItemName.Flashlight:
        return new Item(ItemName.Flashlight, ItemEmoji.Flashlight, 'Brightens up darkness', null)
      case ItemName.Sun:
        return new Item(ItemName.Sun, ItemEmoji.Sun, 'Temporarily remove all negative effects', 1)
      case ItemName.Plant:
        return new Item(ItemName.Plant, ItemEmoji.Plant, 'Plant it in a square and it will grow into the correct value', 1)
      case ItemName.Snowflake:
        return new Item(ItemName.Snowflake, ItemEmoji.Snowflake, 'Reduces frequency of fires', null)
      case ItemName.FireEngine:
        return new Item(ItemName.FireEngine, ItemEmoji.FireEngine, 'Fires are automatically put out', null)
      case ItemName.Cheese:
        return new Item(ItemName.Cheese, ItemEmoji.Cheese, 'Distract rats from blocking your view', null)
      case ItemName.Hand:
        return new Item(ItemName.Hand, ItemEmoji.Hand, 'Rotate the board back in place', null)
    }
  }

  private constructor(
    name: ItemName,
    emoji: ItemEmoji,
    description: string,
    numberOfUses: number | null,
  ) {
    this.type = 'Item'
    this.name = name
    this.emoji = emoji
    this.description = description
    this.numberOfUses = numberOfUses
  }
}

export enum ItemName {
  Delete = 'Delete',
  Note = 'Note',
  MagnifyingGlass = 'MagnifyingGlass',
  BabyBottle = 'Bottle',
  Surrender = 'Surrender',
  FireExtinguisher = 'FireExtinguisher',
  Shield = 'Shield',
  MagicWand = 'MagicWand',
  CrystalBall = 'CrystalBall',
  Flashlight = 'Flashlight',
  Sun = 'Sun',
  Plant = 'Plant',
  Snowflake = 'Snowflake',
  FireEngine = 'FireEngine',
  Cheese = 'Cheese',
  Hand = 'Hand',
}

export enum ItemEmoji {
  Delete = '🗑️',
  Note = '✏️',
  MagnifyingGlass = '🔍',
  BabyBottle = '🍼',
  Surrender = '🏳️',
  FireExtinguisher = '🧯',
  Shield = '🛡️',
  MagicWand = '🪄',
  CrystalBall = '🔮',
  Flashlight = '🔦',
  Sun = '☀️',
  Plant = '🌱',
  PlantMedium = '🪴',
  PlantLarge = '🌴',
  Snowflake = '❄️',
  FireEngine = '🚒',
  Cheese = '🧀',
  Hand = '🖐️',
}