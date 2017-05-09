#pragma strict

// Weapon items:	(max. 2)
var curWep : int = -1;
var weapon : Item;
var weaponType : Item.ItemTypes = Item.ItemTypes.WeaponMelee;
var weapons : Item[] = new Item[2];
var holsters : Transform[] = new Transform[2];

// Defensive items:
var shield : ShieldItem;
var armor : ClothingItem;

// Character buff items:
var buffItems : Item[] = new Item[2];

// Buffer effects acting on the player:
var activeBuffs : StatusEffect[] = new StatusEffect[6];

function Start () {

}

function AddBuffToCharacter (newBuff : StatusEffect) {
	// X X X
	// X X X
	// X X X
}

// Make sure all buffs acting on the player are dealt with correctly:	[command relay only!!!]
// (Basically just requests a recalculation of all player buffs...)
function UpdateCharacterBuffs () {
	// X X X		[tell responsible script to reassign all buffs and debuffs]
	// X X X
	// X X X
}