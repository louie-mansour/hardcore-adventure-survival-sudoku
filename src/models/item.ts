import { CellType, Sudoku } from "./sudoku"

export class Item {
  type: 'Item'
  name: ItemName
  emoji: ItemEmoji
  description: string
  numberOfUses: number | 'Infinite'
  isDisplayed: boolean

  static factory(itemName: ItemName): Item {
    switch (itemName) {
      case ItemName.CrystalBall:
        return new Item(ItemName.CrystalBall, ItemEmoji.CrystalBall, 'Get hints for the next few moves', 5)
      case ItemName.FireExtinguisher:
        return new Item(ItemName.FireExtinguisher, ItemEmoji.FireExtinguisher, 'Put ouf fires', 'Infinite')
      case ItemName.GameDie:
        return new Item(ItemName.GameDie, ItemEmoji.GameDie, 'Reveal the value of between 1-6 random squares', 1)
      case ItemName.MagicWand:
        return new Item(ItemName.MagicWand, ItemEmoji.MagicWand, 'Fill any square with the correct value', 3)
      case ItemName.Placeholder:
        return new Item(ItemName.Placeholder, ItemEmoji.Placeholder, 'Not a real item. This is a placeholder', 1, false)
      case ItemName.Plant:
        return new Item(ItemName.Plant, ItemEmoji.Plant, 'Plant it in a square and it will grow into the correct value', 3)
      case ItemName.Shield:
        return new Item(ItemName.Shield, ItemEmoji.Shield, 'Protect against mistakes', 1)
      // case ItemName.Flashlight:
      //   return new Item(ItemName.Flashlight, ItemEmoji.Flashlight, 'Brightens up darkness', 'Infinite')
      // case ItemName.Sun:
      //   return new Item(ItemName.Sun, ItemEmoji.Sun, 'Temporarily remove all negative effects', 1)
      // case ItemName.Snowflake:
      //   return new Item(ItemName.Snowflake, ItemEmoji.Snowflake, 'Reduces frequency of fires', 1)
      // case ItemName.FireEngine:
      //   return new Item(ItemName.FireEngine, ItemEmoji.FireEngine, 'Fires are automatically put out', 1)
      // case ItemName.Cheese:
      //   return new Item(ItemName.Cheese, ItemEmoji.Cheese, 'Stop rats from blocking your view', 'Infinite')
      // case ItemName.Hand:
      //   return new Item(ItemName.Hand, ItemEmoji.Hand, 'Rotate the board back in place', 'Infinite')
      // case ItemName.MagnifyingGlass:
      //   return new Item(ItemName.MagnifyingGlass, ItemEmoji.MagnifyingGlass, 'Get a hint. Or reveal the value of a hint', 'Infinite')
      // case ItemName.BabyBottle:
      //   return new Item(ItemName.BabyBottle, ItemEmoji.BabyBottle, 'Get a hint. Or reveal the value of a hint', 'Infinite')
      // case ItemName.Surrender:
      //   return new Item(ItemName.Surrender, ItemEmoji.Surrender, 'Give up. Reveal the solution', 1)
    }
  }

  use(): boolean {
    if (this.numberOfUses == 'Infinite') {
      return true
    }
    if (this.numberOfUses > 0) {
      this.numberOfUses--
      return true
    }
    return false
  }

  addUses(n: number | 'Infinite'): boolean {
    if (this.numberOfUses === 'Infinite') {
      return true
    }
    if (n === 'Infinite') {
      this.numberOfUses = 'Infinite'
      return true
    }

    // TODO: Hack until I get state working correctly, this limits the emojis' occurrences to two
    if (this.numberOfUses > n) {
      return true
    }
    this.numberOfUses += n
    return true
  }

  private constructor(
    name: ItemName,
    emoji: ItemEmoji,
    description: string,
    numberOfUses: number | 'Infinite',
    isDisplaed: boolean = true
  ) {
    this.type = 'Item'
    this.name = name
    this.emoji = emoji
    this.description = description
    this.numberOfUses = numberOfUses
    this.isDisplayed = isDisplaed
  }
}

export enum ItemName {
  CrystalBall = 'CrystalBall',
  FireExtinguisher = 'FireExtinguisher',
  GameDie = 'GameDie',
  MagicWand = 'MagicWand',
  Placeholder = 'Placeholder',
  Plant = 'Plant',
  Shield = 'Shield',
  // MagnifyingGlass = 'MagnifyingGlass',
  // Hand = 'Hand',
  // FireEngine = 'FireEngine',
  // Cheese = 'Cheese',
  // Flashlight = 'Flashlight',
  // Snowflake = 'Snowflake',
  // Sun = 'Sun',
}

export enum ItemEmoji {
  CrystalBall = '🔮',
  FireExtinguisher = '🧯',
  GameDie = '🎲',
  MagicWand = '🪄',
  Placeholder = '⬜',
  Plant = '🌱',
  Shield = '🛡️',
  PlantMedium = '🪴',
  PlantLarge = '🌴',
  // FireEngine = '🚒',
  // Flashlight = '🔦',
  // Sun = '☀️',
  // Snowflake = '❄️',
  // Cheese = '🧀',
  // Hand = '🖐️',
}

export function determineItemLocations(sudoku: Sudoku): [Item, number, number, boolean][] {
  if (!sudoku) return []
  const availableLocations: [number, number][] = []
  const cells = sudoku.getCells()
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (cells[r][c].cellType === CellType.Variable) {
        availableLocations.push([r, c])
      }
    }
  }

  const itemsToDistribute = [
    Item.factory(ItemName.Shield),
    Item.factory(ItemName.Shield),
    Item.factory(ItemName.MagicWand),
    Item.factory(ItemName.MagicWand),
    Item.factory(ItemName.CrystalBall),
    Item.factory(ItemName.CrystalBall),
    Item.factory(ItemName.Plant),
    Item.factory(ItemName.Plant),
    Item.factory(ItemName.GameDie),
    Item.factory(ItemName.GameDie),
  ]

  const itemLocations: [Item, number, number, boolean][] = [] // Not sure what the boolean at the end is for
  for (let i = 0; i < itemsToDistribute.length; i++) {
    const locationIndex = Math.floor(Math.random() * availableLocations.length)
    const location = availableLocations[locationIndex]
    itemLocations.push([itemsToDistribute[i], location[0], location[1], true])
    availableLocations.splice(locationIndex, 1)
  }
  return itemLocations
}