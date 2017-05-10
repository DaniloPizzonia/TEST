#pragma strict

public class Item extends Entity {

	var canEquip : boolean = true;			// Can this item be picked up or interacted with by a character?
	var isEquipped : boolean = false;		// Is this item already equipped or in a character's inventory?
	var itemMass = 1.0;						// Physical mass of this item.
	var itemValue = 20.0;					// Monetairy value of this item.
	var itemType = ItemTypes.Collectable;	// What type of item is this?
	var itemIcon : Sprite;

	public enum ItemTypes {
		// Weapon item types will be assigned automatically!
		Collectable,
		Objective,
		WeaponMelee,
		WeaponRanged,
		Armor
	}

	function Start () {
		if (GetComponent(Rigidbody)) {
			itemMass = GetComponent.<Rigidbody>().mass;
		}
		if (isEquipped == true) {
			DisablePhysics();
		}
		else {
			EnablePhysics();
		}

		// Do some additional formatting for the description:
		entityDescript = "<i>" + entityDescript + "</i>";
	}
	
	function OnDrawGizmos () {
		Gizmos.color = Color(1.0, 0.0, 0.0, 0.5);
		Gizmos.DrawWireSphere(transform.position, 0.15);
	}


	function Equipped (equip : boolean) {
		if (equip == true) {
			if (canEquip == true) {
				isEquipped = true;
				DisablePhysics();
			}
		}
		else {
			isEquipped = false;
			EnablePhysics();
		}
	}
	function EnablePhysics () {
		GetComponent(Collider).enabled = true;
		if (!GetComponent(Rigidbody)) {
			gameObject.AddComponent(Rigidbody);
		}
		GetComponent.<Rigidbody>().mass = itemMass;
	}
	function DisablePhysics () {
		Destroy(GetComponent(Rigidbody));
		GetComponent(Collider).enabled = false;		
	}


	function UseItem (user : CharacterStats) {
		// X X X		[insert player interaction with an item here!]
		// X X X
		// X X X
	}
}































