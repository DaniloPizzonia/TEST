#pragma strict

var inUse : boolean = false;				// Is the currently selected weapon type melee?
private var loopStrike : boolean = false;	// Add a consecutive strike to the current one?

var weapon : WeaponMelee;
var weaponPos : Transform;
var sheathPos : Transform;

@System.NonSerialized
var lastStrike = 0.0;
var strikeForce = 20.0;

var combatCtrl : CombatControl;

var combatLayers : LayerMask;

function Start () {
	if (inUse == false) {
		SheathWeapon();
	}
	else {
		DrawWeapon();
	}
}

function ToggleWeaponType (on : boolean) {
	inUse = on;
	if (combatCtrl.arms != null) {
		combatCtrl.arms.SetBool("Melee", on);
	}
}

function Strike () {
	if (weapon != null) {
		if (Time.time > lastStrike + weapon.strikeRate) {
			combatCtrl.arms.SetBool("Attack", true);
			StopAttackAnimation(Time.time, weapon.strikeRate);
			lastStrike = Time.time;
		}
		else {
			// If the previous strike is already halfway through, invoke a second one:
			// (consecutive (looping) hits will be controlled by 'combat control' system!)
			if (Time.time > lastStrike + weapon.strikeRate * 0.755) {
				loopStrike = true;
			}
		}
	}
}

function ImpactDamage (damageMod : Vector4) {
	var damage0 = Vector4(weapon.baseDamage, weapon.armorPierce, weapon.bluntDamage, weapon.heatDamage);
	var damage = Vector4.Scale(damage0, damageMod);
	var pos = weapon.damageCorePos.position;
	var dir = weapon.damageCorePos.forward;

	// Find any colliders intersecting the damage radius:
	var overlap = Physics.OverlapSphere(pos, weapon.damageRadius, combatLayers);
	// If there are any intersections:
	if (overlap && overlap.length > 0) {
		var hitConfirmed : boolean = false;
		// Apply a force and send a damage message to all colliders "hit" by the weapon:
		for (var coll : Collider in overlap) {
			if (coll.transform.root != combatCtrl.entity) {	// Do not harm ourselves!
				// Confirm that we actually hit something relevant:
				// (Used to determine wether or not impact FX should spawn.)
				hitConfirmed = true;

				// Get a rigidbody to push around:
				var rig : Rigidbody;
				if (coll.gameObject.GetComponent.<Rigidbody>()) {
					rig = coll.gameObject.GetComponent.<Rigidbody>();
				}
				else if (coll.transform.parent != null && coll.transform.parent.GetComponent.<Rigidbody>()) {
					rig = coll.transform.parent.GetComponent.<Rigidbody>();
				}
				if (rig != null) {
					var force = dir * Mathf.Max(0.5, weapon.bluntDamage) * strikeForce;
					rig.AddForceAtPosition(force, pos);
				}

				// Apply damage to the object we hit. Create a new damage class object:
				var dmg = new DamageStats();
				dmg.baseDamage = damage.x;
				dmg.armorPierce = damage.y;
				dmg.bluntDamage = damage.z;
				dmg.heatDamage = damage.w;
				// Then send this to the target:
				coll.gameObject.SendMessage("ApplyDamage", dmg, SendMessageOptions.DontRequireReceiver);
			}
		}

		// Also, spawn some amazing sparkly particle effects :D
		if (hitConfirmed == true && weapon.impactFx != null) {
			Instantiate(weapon.impactFx, pos, Quaternion.LookRotation(-dir, weapon.damageCorePos.up));
		}
	}
}

function StopAttackAnimation (t : float, r : float) {
	yield WaitForSeconds(r);
	if (t + r > lastStrike) {
		combatCtrl.arms.SetBool("Attack", false);
	}
}

function SheathWeapon () {
	weapon.transform.position = sheathPos.position;
	weapon.transform.rotation = sheathPos.rotation;
	weapon.transform.parent = sheathPos;
}
function DrawWeapon () {
	weapon.transform.position = weaponPos.position;
	weapon.transform.rotation = weaponPos.rotation;
	weapon.transform.parent = weaponPos;
}

function SwitchWeapon (newWep : WeaponMelee) {
	var oldWep : WeaponMelee;
	var nt = newWep.transform;
	// Dispose of our previous weapon:
	if (weapon != null) {
		// Place it where the new weapon was: (avoids glitching & physics bugs)
		oldWep = weapon;
		oldWep.transform.position = nt.position;
		oldWep.transform.rotation = nt.rotation;
		// Reassign parenting of the previous weapon:
		if (nt.parent != null) {
			oldWep.transform.parent = nt.parent;
		}
		else {
			oldWep.transform.parent = null;
		}
		// Unequip previous weapon:
		oldWep.GetComponent(Item).Equipped(false);
	}
	weapon = null;
	// Assign the new weapon to the character:
	var pos = weaponPos;
	if (inUse == false) {
		pos = sheathPos;
	}
	nt.position = pos.position;
	nt.rotation = pos.rotation;
	nt.parent = pos;
	// Define the new weapon as our active weapon of this type:
	weapon = newWep;
}






















