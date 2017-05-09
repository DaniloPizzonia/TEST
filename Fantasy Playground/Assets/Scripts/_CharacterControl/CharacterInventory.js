#pragma strict

var slotCount : int = 10;
@System.NonSerialized
var usedSlotCount : int = 0;
var slots : Item[] = new Item[2];
var money = 0.0;

var charStats : CharacterStats;

function Start () {
	if (slots && slots.length != slotCount) {
		slots = new Item[slotCount];
	}
	usedSlotCount = 0;
	for (var s : int; s<slotCount; s++) {
		if (slots[s] != null) {
			usedSlotCount++;
		}
	}
}

function RequestAddItem (newItem : Item) {
	// Add a new item to the inventory if there are any free slots:
	var added : boolean = false;
	var i : int = 0;
	while (added == false && i < slotCount) {
		if (slots[i] == null) {
			AddItem(newItem, i);
			added = true;
		}
		i++;
	}
	// Rearrange item list:
//	SortItemList();		(May not be needed here)
}
function RequestDropItem (oldItem : Item) {
	// Add a new item to the inventory if there are any free slots:
	var dropped : boolean = false;
	var i : int = 0;
	while (dropped == false && i < slotCount) {
		if (slots[i] != null && slots[i] == oldItem) {
			DropItem(oldItem, i);
			dropped = true;
		}
		i++;
	} 
	// Rearrange item list, fill the gaps:
	SortItemList();
}
function RequestDeleteItem (delItem : Item) {
	// Initiate drop of item:
	RequestDropItem(delItem);
	// Then remove it from scene:
	Destroy(delItem.gameObject);
}
function RequestUseItem(useItem : Item) {
	// Start an interaction with this item:
	useItem.UseItem(charStats);
}

function AddItem (newItem : Item, index : int) {
	newItem.Equipped(true);
	var trans = newItem.transform;
	trans.position = transform.position - Vector3(0.0, 5000.0, 0.0);
	slots[index] = newItem;
	usedSlotCount++;
	usedSlotCount = Mathf.Min(usedSlotCount, slotCount);
}
function DropItem (oldItem : Item, index : int) {
	slots[index] = null;
	var trans = oldItem.transform;
	trans.position = transform.position + transform.forward * 0.5;
	oldItem.Equipped(false);
	usedSlotCount--;
	usedSlotCount = Mathf.Max(usedSlotCount, 0);
}


function SortItemList () {
	// Reset item list and store previously owned stuff:
	var oldSlots = slots;
	slots = new Item[slotCount];

	// Fill the gaps within our inventory:
	// [Maybe add some further sorting later on...]
	var a : int = 0;
	for (var i : int; i<slotCount; i++) {
		if (oldSlots[i] != null) {
			slots[a] = oldSlots[i];
			a ++;
		}
	}
}
























